"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, BarElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement } from 'chart.js';

try {
  Chart.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);
} catch (e) {}

interface Props {
  // results[nodeId][outcomeLabel] => arrays per step
  results: Record<string, Record<string, { mean: number[]; samples: number[] }>> | null;
  steps?: number[] | null;
  progress: { completed: number; total: number } | null;
}

export const SimulationPanel: React.FC<Props> = ({ results, steps = null, progress }) => {
  const [selectedStep, setSelectedStep] = useState(0);
  const nodes = results ? Object.keys(results) : [];

  // clamp selected step when results change
  useEffect(() => {
    if (!results) { setSelectedStep(0); return; }
    let maxLen = 0;
    Object.values(results).forEach(m => Object.values(m).forEach(s => { if (s.mean.length > maxLen) maxLen = s.mean.length; }));
    if (maxLen === 0) { setSelectedStep(0); return; }
    setSelectedStep(prev => (prev >= maxLen ? Math.max(0, maxLen - 1) : prev));
  }, [results]);

  const barData = useMemo(() => {
    if (!results) return null;
    const outcomeSet = new Set<string>();
    Object.values(results).forEach(m => Object.keys(m).forEach(k => outcomeSet.add(k)));
    const outcomes = Array.from(outcomeSet);
    const labels = nodes;
    const datasets = outcomes.map((out, i) => ({
      label: out,
      data: labels.map(n => results?.[n]?.[out]?.mean?.[selectedStep] ?? 0),
      backgroundColor: `hsl(${(i * 60) % 360} 80% 55% / 0.7)`,
    }));
    return { labels, datasets };
  }, [results, selectedStep, nodes]);

  const lineDataForNode = (nodeId: string) => {
    if (!results) return null;
  const outcomeSet = new Set<string>(Object.keys(results[nodeId] || {}));
    const outcomes = Array.from(outcomeSet);
  if (outcomes.length === 0) return null;
    const labels = steps ?? results[nodeId][outcomes[0]].mean.map((_, i) => i);
    const datasets = outcomes.map((out, i) => ({
      label: out,
      data: results[nodeId][out].mean,
      borderColor: `hsl(${(i * 60) % 360} 80% 55%)`,
      backgroundColor: `hsl(${(i * 60) % 360} 80% 55% / 0.5)`,
      tension: 0.2,
    }));
    return { labels, datasets };
  };

  return (
    <div className="border rounded p-2 h-full overflow-auto text-sm space-y-2 bg-neutral-50 dark:bg-neutral-900">
      <h3 className="font-semibold">Simulation</h3>
      {progress && !results && <div>Running {progress.completed}/{progress.total}</div>}

      {barData && (
        <div className="bg-white dark:bg-neutral-800 p-2 rounded">
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { min: 0, max: 1 } } }} />
        </div>
      )}

      {results && (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <label className="text-xs">Step</label>
            <input type="number" className="border px-1 py-0.5 text-xs w-20" value={selectedStep} onChange={e => setSelectedStep(Number(e.target.value))} />
          </div>

          <table className="w-full text-xs border">
            <thead>
              <tr className="bg-neutral-200 dark:bg-neutral-800">
                <th className="text-left p-1">Node</th>
                <th className="text-left p-1">Outcome</th>
                <th className="text-left p-1">Mean</th>
                <th className="text-left p-1">Samples</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results).flatMap(([id, m]) => (
                Object.entries(m).map(([out, stats]) => (
                  <tr key={id + '|' + out} className="odd:bg-neutral-100 even:bg-neutral-50 dark:odd:bg-neutral-700 dark:even:bg-neutral-800">
                    <td className="p-1 font-mono">{id}</td>
                    <td className="p-1">{out}</td>
                    <td className="p-1">{(stats.mean[selectedStep] ?? 0).toFixed(4)}</td>
                    <td className="p-1">{stats.samples[selectedStep] ?? 0}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>

          <div className="space-y-2">
            {nodes.map(nodeId => (
              <div key={nodeId}>
                <h4 className="font-medium">{nodeId}</h4>
                <div className="bg-white dark:bg-neutral-800 p-2 rounded">
                  <Line data={lineDataForNode(nodeId) as any} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { min: 0, max: 1 } } }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!progress && !results && <div>No run yet.</div>}
    </div>
  );
};

export default SimulationPanel;
