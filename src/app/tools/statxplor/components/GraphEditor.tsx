"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, addEdge, Connection, Edge, useEdgesState, useNodesState, Node } from 'reactflow';
import 'reactflow/dist/style.css';

import { Handle, Position } from 'reactflow';

export interface StatNodeData {
  label: string;
  // allow multiple mutually-exclusive outcomes; each outcome has a label and probability expression
  outcomes: { label: string; expr: string; isOutput?: boolean }[];
}

export type StatEdge = Edge;
export type StatNode = Node<StatNodeData>;

export interface DAGStateExport {
  nodes: StatNode[];
  edges: StatEdge[];
}

interface Props {
  onRun: (graph: DAGStateExport) => void;
  onChange?: (graph: DAGStateExport) => void;
  autoRun?: boolean;
}

const initialNodes: StatNode[] = [
  { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', outcomes: [{ label: 'yes', expr: '0.5', isOutput: true }] }, type: 'statNode' },
  { id: 'B', position: { x: 250, y: 0 }, data: { label: 'B', outcomes: [{ label: 'yes', expr: '0.4', isOutput: true }] }, type: 'statNode' },
];
const initialEdges: StatEdge[] = [] as Edge[];
// Module-level custom node to keep nodeTypes stable
export const CustomStatNode: React.FC<{ id: string; data: StatNodeData }> = ({ id, data }) => {
  const n = data.outcomes.length || 1;
  return (
    <div className="bg-white dark:bg-neutral-800 border rounded py-2 px-8 text-xs relative" style={{
      minWidth: 140,
      minHeight: 30 + (n - 1) * 18,
    }}>
      {/* single input on the left (centered) */}
      <Handle type="target" position={Position.Left} id={`${id}-in`} style={{ top: '50%', transform: 'translateY(-50%)' }} />

      <div className="font-medium text-center">{data.label}</div>

      {/* multiple outputs on the right; place handle at the inner edge and label to its left */}
      {data.outcomes.map((o, i) => {
        const top = 15 + i * 18;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', right: 4, top: `${top}px`, transform: 'translateY(-50%)' }} className="text-[10px] select-none">{o.label}</div>
            <Handle type="source" position={Position.Right} id={`${id}-out-${i}`} style={{ right: -3, top }} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

const NODE_TYPES = { statNode: CustomStatNode };

const GraphEditorImpl: React.FC<Props> = ({ onRun, onChange, autoRun }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<StatNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // compute selected node for inspector
  const sel = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) || null : null;

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: false }, eds));
  }, [setEdges]);

  // Custom node renderer to expose one labeled source per outcome
  // nodeTypes are module-level `NODE_TYPES`

  const addNode = () => {
    const id = 'N' + Math.random().toString(36).slice(2, 7);
    setNodes(ns => [...ns, { id, position: { x: 100, y: 100 }, data: { label: id, outcomes: [{ label: 'yes', expr: '0.5', isOutput: true }] }, type: 'statNode' } as StatNode]);
  };

  const removeSelected = () => {
    if (!selectedNodeId) return;
    setNodes(ns => ns.filter(n => n.id !== selectedNodeId));
    setEdges(es => es.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  };

  useEffect(() => {
    const exportState = { nodes, edges };
    onChange?.(exportState);
    if (autoRun) onRun(exportState);
  }, [nodes, edges, autoRun, onRun, onChange]);

  const updateNodeOutcomes = (id: string, outcomes: { label: string; expr: string; isOutput?: boolean }[]) => {
    setNodes(ns => ns.map(n => n.id === id ? { ...n, data: { ...n.data, outcomes } } : n));
  };

  const updateNodeLabel = (id: string, label: string) => {
    setNodes(ns => ns.map(n => n.id === id ? { ...n, data: { ...n.data, label } } : n));
  };

  const exportJson = () => {
    const payload: DAGStateExport = { nodes, edges };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    file.text().then(txt => {
      try {
        const parsed = JSON.parse(txt);
        if (!parsed || typeof parsed !== 'object') throw new Error('Root not object');
        const maybeNodes = (parsed as Partial<DAGStateExport>).nodes;
        const maybeEdges = (parsed as Partial<DAGStateExport>).edges;
        const validNodes: StatNode[] | null = Array.isArray(maybeNodes) ? maybeNodes.filter(n => n && typeof n.id === 'string' && n.data && Array.isArray((n as any).data.outcomes)) as StatNode[] : null;
        const validEdges: StatEdge[] | null = Array.isArray(maybeEdges) ? maybeEdges.filter(e => e && typeof e.source === 'string' && typeof e.target === 'string') as StatEdge[] : null;
        if (!validNodes || !validEdges) throw new Error('Invalid structure');
        setNodes(validNodes);
        setEdges(validEdges);
      } catch (e) {
        console.error('Invalid JSON', e);
      }
    });
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex gap-2 items-center flex-wrap">
        <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={addNode}>Add Node</button>
        <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => onRun({ nodes, edges })}>Run Simulation</button>
        <button className="px-2 py-1 bg-gray-600 text-white rounded" onClick={exportJson}>Export</button>
        <button className="px-2 py-1 bg-gray-600 text-white rounded" onClick={() => fileInputRef.current?.click()}>Import</button>
        <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={removeSelected} disabled={!selectedNodeId}>Delete Selected</button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) importJson(f); }} />
        {sel && (
          <div className="flex gap-2 items-center">
            <input className="border px-1 py-0.5 text-sm" value={sel.data.label} onChange={e => updateNodeLabel(sel.id, e.target.value)} />
            <div className="flex flex-col gap-1">
              {sel.data.outcomes.map((outcome, idx) => (
                <div key={idx} className="flex gap-1 items-center">
                  <input className="border px-1 py-0.5 text-sm w-20" value={outcome.label} onChange={e => {
                    const next = sel.data.outcomes.map((o, i) => i === idx ? { ...o, label: e.target.value } : o);
                    updateNodeOutcomes(sel.id, next);
                  }} />
                  <input className="border px-1 py-0.5 text-sm w-40" value={outcome.expr} onChange={e => {
                    const next = sel.data.outcomes.map((o, i) => i === idx ? { ...o, expr: e.target.value } : o);
                    updateNodeOutcomes(sel.id, next);
                  }} />
                  <label className="text-xs flex items-center gap-1">
                    <input type="checkbox" checked={!!outcome.isOutput} onChange={e => {
                      const next = sel.data.outcomes.map((o, i) => i === idx ? { ...o, isOutput: e.target.checked } : o);
                      updateNodeOutcomes(sel.id, next);
                    }} />
                    <span className="text-xs">Output</span>
                  </label>
                  <button className="px-1 bg-red-500 text-white rounded text-xs" onClick={() => {
                    const next = sel.data.outcomes.filter((_, i) => i !== idx);
                    updateNodeOutcomes(sel.id, next.length ? next : [{ label: 'none', expr: '0' }]);
                  }}>Del</button>
                </div>
              ))}
              <button className="px-1 bg-blue-500 text-white rounded text-xs" onClick={() => {
                const next = [...sel.data.outcomes, { label: 'o' + (sel.data.outcomes.length + 1), expr: '0.1', isOutput: false }];
                updateNodeOutcomes(sel.id, next);
              }}>+ Outcome</button>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 border rounded overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, n) => setSelectedNodeId((n as Node<StatNodeData>).id)}
          fitView
          nodeTypes={NODE_TYPES}
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export const GraphEditor = GraphEditorImpl;
export default GraphEditorImpl;
