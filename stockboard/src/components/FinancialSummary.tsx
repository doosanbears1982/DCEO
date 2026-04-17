'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatNumber } from '@/lib/utils';

interface FinancialData {
  endDate: Date;
  totalRevenue: number;
  operatingIncome: number;
  netIncome: number;
}

interface FinancialSummaryProps {
  data: FinancialData[];
}

export function FinancialSummary({ data }: FinancialSummaryProps) {
  if (!data || data.length === 0) return <div className="p-10 text-center text-gray-400">재무 데이터가 없습니다.</div>;

  const formattedData = data.map(item => ({
    year: new Date(item.endDate).getFullYear(),
    매출: item.totalRevenue,
    영업이익: item.operatingIncome,
    순이익: item.netIncome,
  })).reverse();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
        기업 실적 추이 <span className="text-[10px] text-gray-400">(연간)</span>
      </h3>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip 
              formatter={(value: any) => formatNumber(Number(value))}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Bar dataKey="매출" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="영업이익" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="순이익" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
