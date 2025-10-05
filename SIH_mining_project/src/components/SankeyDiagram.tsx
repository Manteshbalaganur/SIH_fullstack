import React from 'react';
import { MaterialFlow } from '../types';

interface SankeyDiagramProps {
  flows: MaterialFlow[];
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ flows }) => {
  const nodes = Array.from(new Set(flows.flatMap(f => [f.source, f.target])));

  const nodeColors: Record<string, string> = {
    'Virgin Material': '#DC2626',
    'Recycled Material': '#059669',
    'Production': '#F59E0B',
    'Product': '#0F766E',
    'Process Scrap': '#FB923C',
    'End of Life': '#64748B',
    'Recycling': '#10B981',
    'Waste': '#DC2626',
  };

  return (
    <div className="bg-slate-50 rounded-lg p-8">
      <div className="space-y-6">
        {flows.map((flow, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1 text-right">
              <span className="text-sm font-medium text-slate-700">{flow.source}</span>
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <div className="flex-1 h-8 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                style={{
                  background: `linear-gradient(to right, ${nodeColors[flow.source] || '#64748B'}, ${nodeColors[flow.target] || '#64748B'})`,
                  width: `${Math.max(20, Math.min(100, flow.value / 10))}%`
                }}
              >
                {flow.value.toFixed(0)} t
              </div>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-slate-700">{flow.target}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-300">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(nodeColors).map(([name, color]) => (
            <div key={name} className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
              <span className="text-xs text-slate-600">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SankeyDiagram;
