'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TickerData {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

export function GlobalTicker() {
  const [data, setData] = useState<TickerData[]>([]);

  useEffect(() => {
    async function fetchTicker() {
      try {
        const res = await fetch('/api/market');
        const marketData = await res.json();
        setData(marketData);
      } catch (e) {
        console.error(e);
      }
    }
    fetchTicker();
    const interval = setInterval(fetchTicker, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 overflow-hidden whitespace-nowrap px-4 border-l border-r dark:border-gray-800 mx-4 hidden md:block">
      <div className="inline-block animate-marquee hover:pause cursor-default">
        {data.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 mx-6 text-[11px] font-bold">
            <span className="text-gray-400">{item.name}</span>
            <span className="dark:text-white">{item.price?.toLocaleString()}</span>
            <span className={item.changePercent >= 0 ? "text-red-500" : "text-blue-500"}>
              {item.changePercent >= 0 ? '▲' : '▼'} {Math.abs(item.changePercent)?.toFixed(2)}%
            </span>
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {data.map((item, i) => (
          <span key={`dup-${i}`} className="inline-flex items-center gap-2 mx-6 text-[11px] font-bold">
            <span className="text-gray-400">{item.name}</span>
            <span className="dark:text-white">{item.price?.toLocaleString()}</span>
            <span className={item.changePercent >= 0 ? "text-red-500" : "text-blue-500"}>
              {item.changePercent >= 0 ? '▲' : '▼'} {Math.abs(item.changePercent)?.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
