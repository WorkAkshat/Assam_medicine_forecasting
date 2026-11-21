import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { STATE_WISE_DEMAND_DISTRIBUTION } from '../../data/mockForecasts';

const COLORS = [
  '#1A3C66', // Assam (Refined Brand Navy Blue)
  '#C85A2E', // Meghalaya (Terracotta)
  '#2563EB', // Tripura (Vibrant Blue)
  '#0D9488', // Nagaland (Teal)
  '#D97706', // Manipur (Amber)
  '#7C3AED', // Mizoram (Purple)
  '#E11D48', // Arunachal Pradesh (Rose/Red)
  '#64748B'  // Sikkim (Slate)
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-navy-900 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1 border border-navy-700/60 z-50">
        <p className="font-bold text-slate-100 flex items-center justify-between gap-3">
          <span>{data.state}</span>
          <span className="text-emerald-400 font-semibold">{data.growthRate}</span>
        </p>
        <p className="text-slate-300">
          Demand Share: <span className="font-bold text-white">{data.demandSharePct}%</span>
        </p>
        <p className="text-slate-300">
          Monthly Volume: <span className="font-sans font-semibold text-terracotta-300">{data.monthlyVolume.toLocaleString()} units</span>
        </p>
        <p className="text-[11px] text-slate-400">
          Stock Risk: <span className="text-amber-300">{data.stockRisk}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function StateDistributionChart({ height = 260 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const activeItem = hoveredIndex !== null ? STATE_WISE_DEMAND_DISTRIBUTION[hoveredIndex] : null;

  return (
    <div className="w-full flex flex-col justify-between" style={{ minHeight: height }}>
      {/* Donut Chart with Interactive Center Value */}
      <div className="relative w-full h-[165px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={STATE_WISE_DEMAND_DISTRIBUTION}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2.5}
              dataKey="demandSharePct"
              nameKey="state"
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {STATE_WISE_DEMAND_DISTRIBUTION.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
                  stroke={hoveredIndex === index ? '#ffffff' : 'none'}
                  strokeWidth={hoveredIndex === index ? 2 : 0}
                  className="transition-opacity duration-150 cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Donut Hole Focal Metric */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          {activeItem ? (
            <>
              <span className="text-xl font-black font-sans text-navy-950 leading-tight">
                {activeItem.demandSharePct}%
              </span>
              <span className="text-[10px] text-slate-600 font-semibold truncate max-w-[85px] text-center">
                {activeItem.state}
              </span>
            </>
          ) : (
            <>
              <span className="text-xl font-black font-sans text-navy-950 leading-tight">
                54%
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Assam Hub
              </span>
            </>
          )}
        </div>
      </div>

      {/* Perfectly Balanced 4-Column (Desktop) / 2-Column (Mobile) Grid Legend with Percentages */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2.5 gap-y-1.5 pt-2 border-t border-slate-100">
        {STATE_WISE_DEMAND_DISTRIBUTION.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          const displayName = item.state === 'Arunachal Pradesh' ? 'Arunachal' : item.state;
          return (
            <div
              key={item.state}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between px-1.5 py-1 rounded-lg transition-all cursor-pointer ${
                isHovered ? 'bg-slate-100 ring-1 ring-slate-200' : 'hover:bg-slate-50'
              }`}
              title={`${item.state}: ${item.demandSharePct}% demand share (${item.monthlyVolume.toLocaleString()} units/mo)`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0 shadow-2xs"
                  style={{ backgroundColor: COLORS[idx] }}
                />
                <span className="text-[11px] font-medium text-slate-700 truncate">
                  {displayName}
                </span>
              </div>
              <span className="text-[11px] font-bold font-sans text-slate-900 ml-1">
                {item.demandSharePct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
