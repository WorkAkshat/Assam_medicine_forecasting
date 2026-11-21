import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { FORECAST_CHART_TIMELINE } from '../../data/mockForecasts';
import { formatNumber } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isForecast = label.includes('FC') || label.includes('Curr');
    return (
      <div className="bg-navy-950 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-navy-800">
        <p className="font-bold border-b border-navy-800 pb-1 text-slate-200">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}:</span>
            </span>
            <span className="font-sans font-semibold">{formatNumber(entry.value)} units</span>
          </div>
        ))}
        {isForecast && (
          <p className="text-[10px] text-terracotta-300 pt-1 border-t border-navy-800 italic">
            PharmaPredict Horizon (90% Confidence Band)
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function DemandTrendChart({ height = 300 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart data={FORECAST_CHART_TIMELINE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="aiForecastArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C85A2E" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#C85A2E" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="actualSalesArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1B365D" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#1B365D" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#64748B', fontSize: 11 }} 
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#64748B', fontSize: 11 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            align="right"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
          />

          {/* Actual Sales */}
          <Area 
            type="monotone" 
            dataKey="actualSales" 
            name="Actual Sales (Past)" 
            stroke="#1B365D" 
            strokeWidth={2.5}
            fill="url(#actualSalesArea)" 
            connectNulls={false}
          />

          {/* Statistical Baseline */}
          <Line 
            type="monotone" 
            dataKey="baselineForecast" 
            name="Legacy Baseline" 
            stroke="#94A3B8" 
            strokeWidth={1.8}
            strokeDasharray="4 4"
            dot={false}
          />

          {/* AI Predictive Horizon */}
          <Line 
            type="monotone" 
            dataKey="aiForecast" 
            name="PharmaPredict AI Forecast" 
            stroke="#C85A2E" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#C85A2E', strokeWidth: 2, stroke: '#fff' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
