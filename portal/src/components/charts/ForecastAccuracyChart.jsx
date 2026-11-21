import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { FORECAST_ACCURACY_BY_CATEGORY } from '../../data/mockForecasts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = FORECAST_ACCURACY_BY_CATEGORY.find(c => c.category === label);
    return (
      <div className="bg-navy-950 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-navy-800">
        <p className="font-bold border-b border-navy-800 pb-1 text-slate-200">{label}</p>
        <div className="flex justify-between gap-4 text-slate-400">
          <span>Legacy Baseline:</span>
          <span className="font-sans font-medium text-slate-200">{payload[0].value}%</span>
        </div>
        <div className="flex justify-between gap-4 text-emerald-400">
          <span>PharmaPredict AI:</span>
          <span className="font-sans font-bold text-white">{payload[1].value}%</span>
        </div>
        {item && (
          <div className="pt-1 mt-1 border-t border-navy-800 flex justify-between gap-4 text-terracotta-400 font-semibold">
            <span>Accuracy Improvement:</span>
            <span>{item.improvement}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function ForecastAccuracyChart({ height = 260 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={FORECAST_ACCURACY_BY_CATEGORY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis 
            dataKey="category" 
            tick={{ fill: '#64748B', fontSize: 11 }} 
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
          />
          <YAxis 
            domain={[40, 100]} 
            tick={{ fill: '#64748B', fontSize: 11 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            align="right"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
          />

          <Bar 
            dataKey="baselineAccuracy" 
            name="Legacy Baseline" 
            fill="#94A3B8" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={32}
          />
          <Bar 
            dataKey="currentModelAccuracy" 
            name="PharmaPredict AI (NESFIC Target: +20%)" 
            fill="#1B365D" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
