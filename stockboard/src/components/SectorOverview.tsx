'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Sector {
  name: string;
  change: number;
  leadStock: string;
}

export function SectorOverview() {
  const sectors: Sector[] = [
    { name: '반도체', change: 2.45, leadStock: 'NVDA' },
    { name: '인공지능(AI)', change: 1.82, leadStock: 'MSFT' },
    { name: '2차전지', change: -0.92, leadStock: 'TSLA' },
    { name: '바이오', change: 0.45, leadStock: 'LLY' },
    { name: '에너지', change: -1.24, leadStock: 'XOM' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-black mb-4 flex justify-between items-center">
        섹터별 테마 현황
        <span className="text-[10px] text-gray-400 font-medium tracking-normal">24시간 기준</span>
      </h3>
      <div className="space-y-4">
        {sectors.map((sector) => (
          <div key={sector.name} className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{sector.name}</span>
              <span className="text-[10px] text-gray-400">주도주: {sector.leadStock}</span>
            </div>
            <div className="flex items-center gap-3 flex-1 px-4">
              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    sector.change >= 0 ? "bg-red-500" : "bg-blue-500"
                  )}
                  style={{ 
                    width: `${Math.min(Math.abs(sector.change) * 20, 100)}%`,
                    marginLeft: sector.change >= 0 ? '0' : 'auto'
                  }}
                />
              </div>
            </div>
            <span className={cn(
              "text-xs font-black min-w-[50px] text-right",
              sector.change >= 0 ? "text-red-500" : "text-blue-500"
            )}>
              {sector.change >= 0 ? '+' : ''}{sector.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
