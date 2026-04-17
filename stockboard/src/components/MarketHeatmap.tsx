'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StockNode {
  symbol: string;
  change: number;
  size: 'lg' | 'md' | 'sm';
}

export function MarketHeatmap({ onSelect }: { onSelect: (symbol: string) => void }) {
  const stocks: StockNode[] = [
    { symbol: 'AAPL', change: 1.25, size: 'lg' },
    { symbol: 'MSFT', change: 0.85, size: 'lg' },
    { symbol: 'NVDA', change: 4.12, size: 'lg' },
    { symbol: 'AMZN', change: -0.45, size: 'md' },
    { symbol: 'GOOGL', change: 0.23, size: 'md' },
    { symbol: 'META', change: 2.15, size: 'md' },
    { symbol: 'TSLA', change: -3.42, size: 'md' },
    { symbol: 'BRK-B', change: 0.12, size: 'sm' },
    { symbol: 'LLY', change: 1.54, size: 'sm' },
    { symbol: 'AVGO', change: 2.87, size: 'sm' },
    { symbol: 'V', change: -0.76, size: 'sm' },
    { symbol: 'JPM', change: -0.21, size: 'sm' },
  ];

  const getColor = (change: number) => {
    if (change > 3) return 'bg-red-600';
    if (change > 1) return 'bg-red-500';
    if (change > 0) return 'bg-red-400';
    if (change < -3) return 'bg-blue-600';
    if (change < -1) return 'bg-blue-500';
    return 'bg-blue-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-black mb-4">시장 히트맵 <span className="text-[10px] text-gray-400">(상위 종목)</span></h3>
      <div className="grid grid-cols-4 gap-2 h-[200px]">
        {stocks.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => onSelect(stock.symbol)}
            className={cn(
              "rounded-lg p-2 flex flex-col items-center justify-center text-white transition-transform hover:scale-95",
              getColor(stock.change),
              stock.size === 'lg' ? 'col-span-2 row-span-2' : 
              stock.size === 'md' ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1'
            )}
          >
            <span className={cn("font-black tracking-tighter", stock.size === 'lg' ? "text-lg" : "text-xs")}>
              {stock.symbol}
            </span>
            <span className={cn("font-bold opacity-80", stock.size === 'lg' ? "text-sm" : "text-[8px]")}>
              {stock.change > 0 ? '+' : ''}{stock.change}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
