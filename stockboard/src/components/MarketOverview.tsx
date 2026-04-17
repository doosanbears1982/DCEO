'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export function MarketOverview() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('US');

  const categories = [
    { id: 'US', label: '미국', symbols: ['^GSPC', '^IXIC', '^DJI', 'CL=F', 'GC=F'] },
    { id: 'Asia', label: '아시아', symbols: ['^KS11', '^KQ11', '^N225', '^HSI', '000001.SS'] },
    { id: 'Crypto', label: '암호화폐', symbols: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD'] },
  ];

  useEffect(() => {
    async function fetchMarket() {
      try {
        const symbols = categories.find(c => c.id === activeTab)?.symbols || [];
        const res = await fetch(`/api/market?symbols=${symbols.join(',')}`);
        const data = await res.json();
        setMarketData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000); // 30초마다 갱신 (실시간성 강화)
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b dark:border-gray-800 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveTab(cat.id); setLoading(true); }}
            className={cn(
              "pb-3 text-xs font-black transition-all whitespace-nowrap px-1",
              activeTab === cat.id 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 overflow-x-auto pb-2">
        {loading ? (
          Array.from({length: 5}).map((_, i) => (
            <div key={i} className="animate-pulse h-24 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700" />
          ))
        ) : (
          marketData.map((item) => (
            <div key={item.symbol} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border dark:border-gray-700 min-w-[140px] hover:shadow-md transition-shadow cursor-default">
              <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider truncate">{item.name}</div>
              <div className="text-lg font-black tracking-tight">{item.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className={cn(
                "text-xs font-bold flex items-center gap-1",
                item.change >= 0 ? "text-red-500" : "text-blue-500"
              )}>
                {item.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.change?.toFixed(2)} ({item.changePercent?.toFixed(2)}%)
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
