// Web Worker for Monte Carlo simulation of dependent events DAG
// This worker expects a message containing the DAG structure and simulation parameters
// and replies with aggregated probability estimates for each node.

export interface SimNodeOutcome { label: string; expr: string | number }

export interface SimNode {
  id: string;
  outcomes: SimNodeOutcome[]; // mutually exclusive outcomes
  parents: string[]; // parent node ids
}

export interface SimRequest {
  nodes: SimNode[];
  iterations: number;
  variables: Record<string, number>;
  sweep?: { varName: string; start: number; end: number; steps: number } | null;
  // optional sink list: pairs of nodeId and outcome label to mark which outcomes should be treated as outputs
  sinks?: { nodeId: string; outcome: string }[] | null;
}

export interface SimProgress {
  type: 'progress';
  completed: number;
  total: number;
}

export interface SimResult {
  type: 'result';
  steps: number[];
  // estimates[nodeId][outcomeLabel] => arrays per step
  estimates: Record<string, Record<string, { mean: number[]; samples: number[] }>>;
  sinks?: { nodeId: string; outcome: string }[] | null;
}

// Basic safe expression evaluator (very limited) to avoid pulling large dependency.
// Supports numbers, + - * / parentheses, identifiers referencing variables.
// NOTE: This is deliberately minimal; can be swapped for mathjs via dynamic import on main thread later.
function evalExpr(expr: string, vars: Record<string, number>): number {
  // Reject any suspicious characters
  if (!/^[-+*/() 0-9_a-zA-Z.]*$/.test(expr)) throw new Error('Invalid characters in expression');
  // Replace identifiers with lookup into vars object
  const replaced = expr.replace(/[A-Za-z_][A-Za-z0-9_]*/g, (id) => {
    if (Object.prototype.hasOwnProperty.call(vars, id)) return String(vars[id]);
    throw new Error('Unknown variable: ' + id);
  });
  const fn = new Function(`return (${replaced});`);
  const v = fn();
  if (typeof v !== 'number' || Number.isNaN(v)) throw new Error('Expression did not evaluate to number');
  return v;
}

function topoSort(nodes: SimNode[]): SimNode[] {
  const map = new Map(nodes.map(n => [n.id, n]));
  const indeg = new Map<string, number>();
  nodes.forEach(n => indeg.set(n.id, 0));
  nodes.forEach(n => n.parents.forEach(p => indeg.set(n.id, (indeg.get(n.id) || 0) + 1)));
  const q: SimNode[] = [];
  indeg.forEach((d, id) => { if (d === 0) q.push(map.get(id)!); });
  const out: SimNode[] = [];
  while (q.length) {
    const n = q.shift()!;
    out.push(n);
    nodes.forEach(ch => {
      if (ch.parents.includes(n.id)) {
        const d = (indeg.get(ch.id) || 0) - 1;
        indeg.set(ch.id, d);
        if (d === 0) q.push(ch);
      }
    });
  }
  if (out.length !== nodes.length) throw new Error('Cycle detected');
  return out;
}

// Provide a minimal type for postMessage on the worker global scope
interface WorkerScope {
  postMessage: (msg: SimProgress | SimResult) => void;
  onmessage: ((ev: MessageEvent<SimRequest>) => void) | null;
}
const scope: WorkerScope = self as unknown as WorkerScope;

scope.onmessage = (e: MessageEvent<SimRequest>) => {
  const { nodes, iterations, variables, sweep } = e.data;
  const order = topoSort(nodes);

  // build steps
  const steps: number[] = [];
  if (sweep && sweep.steps > 0) {
    for (let s = 0; s < sweep.steps; s++) {
      const v = sweep.start + (s / Math.max(1, sweep.steps - 1)) * (sweep.end - sweep.start);
      steps.push(v);
    }
  } else {
    steps.push(0);
  }

  // estimates[node][outcome] -> arrays per step
  const estimates: Record<string, Record<string, { mean: number[]; samples: number[] }>> = {};
  order.forEach(n => { estimates[n.id] = Object.fromEntries(n.outcomes.map(o => [o.label, { mean: new Array(steps.length).fill(0), samples: new Array(steps.length).fill(0) }])) as Record<string, { mean: number[]; samples: number[] }>; });

  for (let si = 0; si < steps.length; si++) {
    const stepVal = steps[si];
    const varsForStep = { ...variables } as Record<string, number>;
    if (sweep) varsForStep[sweep.varName] = stepVal;

    // run iterations per step
    for (let i = 0; i < iterations; i++) {
      const outcomesOccurred: Record<string, string | null> = {};
      for (const node of order) {
        const weights: number[] = node.outcomes.map(o => {
          const val = typeof o.expr === 'number' ? o.expr : evalExpr(String(o.expr), { ...varsForStep, t: stepVal, iteration: i });
          return Number.isFinite(val) ? Math.max(0, val) : 0;
        });
        const total = weights.reduce((s, v) => s + v, 0);
        let parentFactor = 1;
        for (const pid of node.parents) {
          const pOut = outcomesOccurred[pid];
          if (!pOut) parentFactor *= 0;
        }
        if (parentFactor === 0 || total === 0) {
          outcomesOccurred[node.id] = null;
          Object.keys(estimates[node.id]).forEach(k => {
            const stat = estimates[node.id][k];
            stat.samples[si] += 1;
            // mean unchanged
          });
          continue;
        }
        const probs = weights.map(w => w / total);
        const r = Math.random();
        let acc = 0;
        let chosenIdx = 0;
        for (let j = 0; j < probs.length; j++) { acc += probs[j]; if (r <= acc) { chosenIdx = j; break; } }
        const chosenLabel = node.outcomes[chosenIdx].label;
        outcomesOccurred[node.id] = chosenLabel;
        Object.entries(estimates[node.id]).forEach(([lbl, stat]) => {
          stat.samples[si] += 1;
          const sample = lbl === chosenLabel ? 1 : 0;
          // incremental mean for this step
          const prevMean = stat.mean[si];
          const prevCount = stat.samples[si] - 1;
          stat.mean[si] = prevCount <= 0 ? sample : prevMean + (sample - prevMean) / (prevCount + 1);
        });
      }
      if (i % 200 === 0) {
        const msg: SimProgress = { type: 'progress', completed: si * iterations + i, total: steps.length * iterations };
        scope.postMessage(msg);
      }
    }
  }

  const result: SimResult = { type: 'result', steps, estimates };
  // echo sinks back if provided
  if ((e.data as SimRequest).sinks) result.sinks = (e.data as SimRequest).sinks;
  scope.postMessage(result);
};
