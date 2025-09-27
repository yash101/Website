/**
 * Statistics Explorer (StatXplor) MVP
 * ----------------------------------
 * Features implemented in this initial scaffold:
 *  - React Flow based DAG editor (dynamic import) with add/delete nodes and connect edges
 *  - Each node stores a probability expression (simple numeric literal or expression referencing variables)
 *  - Export / Import graph as JSON
 *  - WebWorker Monte Carlo simulation (simple conditional probability model) with progress streaming
 *  - Displays mean occurrence probability per node
 *
 * Intentional design constraints:
 *  - Keep all code isolated to tools/statxplor
 *  - Minimize dependencies (ReactFlow only; custom small expression evaluator in worker)
 *  - Support static export: avoid Node-only APIs at runtime; dynamic imports used where heavy
 *  - Swappable expression engine (could later dynamic-import mathjs)
 */
"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SimulationPanel } from './components/SimulationPanel';

// Dynamic import GraphEditor to ensure reactflow only loads client-side
const GraphEditor = dynamic(() => import('./components/GraphEditor').then(m => m.GraphEditor), { ssr: false });

interface WorkerLike {
  postMessage: (msg: SimulationWorkerRequest) => void;
  terminate: () => void;
  onmessage: ((ev: MessageEvent<SimulationWorkerResponse>) => unknown) | null;
}

interface GraphNodeData { label: string; outcomes: { label: string; expr: string }[] }
interface GraphNode { id: string; data: GraphNodeData }
interface GraphEdge { id?: string; source: string; target: string }
interface GraphExport { nodes: GraphNode[]; edges: GraphEdge[] }

interface SimulationWorkerRequest {
  nodes: { id: string; outcomes: { label: string; expr: string }[]; parents: string[] }[];
  iterations: number;
  variables: Record<string, number>;
  sweep?: { varName: string; start: number; end: number; steps: number } | null;
  sinks?: { nodeId: string; outcome: string }[] | null;
}
type SimulationWorkerProgress = { type: 'progress'; completed: number; total: number };
type SimulationWorkerResult = { type: 'result'; estimates: SimEstimates };
type SimulationWorkerResponse = SimulationWorkerProgress | SimulationWorkerResult;

// Estimates now per-outcome label
type SimEstimates = Record<string, Record<string, { mean: number[]; samples: number[] }>>;

export default function StatXplorPage() {
  const workerRef = useRef<WorkerLike | null>(null);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [results, setResults] = useState<SimEstimates | null>(null);
  const [graph, setGraph] = useState<GraphExport | null>(null);
  const [iterations, setIterations] = useState(5000);
  const [variablesJson, setVariablesJson] = useState('{}');
  const [varsError, setVarsError] = useState<string | null>(null);
  const parsedVariablesRef = useRef<Record<string, number>>({});
  const [sweepVar, setSweepVar] = useState('t');
  const [sweepStart, setSweepStart] = useState(0);
  const [sweepEnd, setSweepEnd] = useState(10);
  const [sweepSteps, setSweepSteps] = useState(11);

  const parseVariables = useCallback((txt: string) => {
    try {
      const obj = JSON.parse(txt);
      if (obj && typeof obj === 'object') {
        parsedVariablesRef.current = Object.fromEntries(Object.entries(obj).filter(([_, v]) => typeof v === 'number')) as Record<string, number>;
        setVarsError(null);
      } else setVarsError('Must be an object');
    } catch (e) {
      setVarsError(e instanceof Error ? e.message : 'Parse error');
    }
  }, []);

  // Lazy init worker
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!workerRef.current) {
      const w = new Worker(new URL('./workers/simWorker.ts', import.meta.url));
      w.onmessage = (e: MessageEvent) => {
        const data = e.data as any;
        if (data.type === 'progress') setProgress({ completed: data.completed, total: data.total });
        else if (data.type === 'result') {
          // data.steps + data.estimates + optional data.sinks
          if (data.sinks && Array.isArray(data.sinks)) {
            const filtered: SimEstimates = {};
            data.sinks.forEach((s: any) => {
              if (!filtered[s.nodeId]) filtered[s.nodeId] = {};
              if (data.estimates?.[s.nodeId]?.[s.outcome]) filtered[s.nodeId][s.outcome] = data.estimates[s.nodeId][s.outcome];
            });
            setResults(filtered);
          } else {
            setResults(data.estimates);
          }
          setProgress(null);
        }
      };
      workerRef.current = w as any;
    }
    return () => { workerRef.current?.terminate(); workerRef.current = null; };
  }, []);

  const runSimulation = useCallback((g: any) => {
    if (!workerRef.current || !g) return;
    setResults(null);
    setProgress({ completed: 0, total: iterations });
    const nodes = g.nodes.map((n) => ({ id: n.id, outcomes: n.data.outcomes, parents: g.edges.filter((e) => e.target === n.id).map((e) => e.source) }));
    const sweep = sweepVar ? { varName: sweepVar, start: sweepStart, end: sweepEnd, steps: sweepSteps } : null;
    const sinks = g.nodes.flatMap((n: any) => (n.data.outcomes || []).filter((o: any) => o.isOutput).map((o: any) => ({ nodeId: n.id, outcome: o.label })));
    workerRef.current.postMessage({ nodes, iterations, variables: parsedVariablesRef.current, sweep, sinks });
  }, [iterations]);

  return (
    <div className="p-4 flex flex-col gap-4 h-[calc(100vh-4rem)]">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">StatXplor - Midlife Crisis Analyzer</h1>
        <p>Build a DAG of dependent events and run Monte Carlo simulations.</p>
        <p className='italic'>It won&apos;t fix my existential dread, but hey, at least it deploys automagically!</p>
      </header>
      <div className="flex flex-row gap-4 flex-1 min-h-0">
        <div className="">
          <GraphEditor onRun={runSimulation} onChange={setGraph} autoRun={false} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="border rounded p-2 space-y-2">
            <label className="flex flex-col gap-1 text-sm">
              <span>Iterations</span>
              <input type="number" className="border px-1 py-0.5" value={iterations} min={100} step={500} onChange={e => setIterations(Number(e.target.value))} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Variables (JSON)</span>
              <textarea className="border px-1 py-0.5 font-mono text-xs h-24" value={variablesJson} onChange={e => { setVariablesJson(e.target.value); parseVariables(e.target.value); }} />
              {varsError && <span className="text-xs text-red-600">{varsError}</span>}
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Sweep variable</span>
              <input className="border px-1 py-0.5 text-sm" value={sweepVar} onChange={e => setSweepVar(e.target.value)} />
              <div className="flex gap-1">
                <input type="number" className="border px-1 py-0.5 text-sm w-20" value={sweepStart} onChange={e => setSweepStart(Number(e.target.value))} />
                <input type="number" className="border px-1 py-0.5 text-sm w-20" value={sweepEnd} onChange={e => setSweepEnd(Number(e.target.value))} />
                <input type="number" className="border px-1 py-0.5 text-sm w-20" value={sweepSteps} onChange={e => setSweepSteps(Number(e.target.value))} />
              </div>
            </label>
            <button className="w-full bg-green-600 text-white rounded px-2 py-1 text-sm" onClick={() => runSimulation(graph)}>Run</button>
            <p className="text-xs text-neutral-500">Expressions can use your variables and t (iteration index).</p>
          </div>
          <SimulationPanel results={results} progress={progress} />
        </div>
      </div>
    </div>
  );
}

// needs refactor to work :(
// export const metadata = {
//   title: "StatXplor - Midlife Crisis Analyzer",
//   description: "Build a DAG of dependent events and run Monte Carlo simulations. Analyze conditional probabilities with a visual editor.",
// };
