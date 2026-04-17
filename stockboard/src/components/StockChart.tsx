'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface ChartData {
  date: string;
  close: number;
  volume: number;
}

interface StockChartProps {
  data: ChartData[];
  symbol: string;
}

export function StockChart({ data, symbol }: StockChartProps) {
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">데이터가 없습니다.</div>;

  const isPositive = data[data.length - 1].close >= data[0].close;

  return (
    <div className="space-y-4">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#ef4444" : "#3b82f6"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? "#ef4444" : "#3b82f6"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              hide={true}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              orientation="right" 
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke={isPositive ? "#ef4444" : "#3b82f6"} 
              fillOpacity={1} 
              fill="url(#colorClose)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="h-[80px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Bar dataKey="volume" fill="#cbd5e1" />
            <Tooltip cursor={{fill: 'transparent'}} content={() => null} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
