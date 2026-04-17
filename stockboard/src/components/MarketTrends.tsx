'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export function MarketTrends({ onSelect }: { onSelect: (symbol: string) => void }) {
  const [trends, setTrends] = useState<{ active: TrendItem[], gainers: TrendItem[], losers: TrendItem[] }>({
    active: [],
    gainers: [],
    losers: []
  });
  const [activeTab, setActiveTab] = useState<'active' | 'gainers' | 'losers'>('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      try {
        // 실제 운영 환경에서는 별도의 Trends API를 호출해야 하지만, 
        // 여기서는 예시 종목들을 기반으로 실시간 데이터를 가져옵니다.
        const symbols = {
          active: ['TSLA', 'NVDA', 'AAPL', 'AMD', 'AMZN'],
          gainers: ['SMCI', 'COIN', 'MSTR', 'ARM', 'PLTR'],
          losers: ['INTC', 'BA', 'LULU', 'NKE', 'PYPL']
        };

        const fetchGroup = async (group: string[]) => {
          const results = await Promise.all(
            group.map(async (s) => {
              const res = await fetch(`/api/stock/${s}`);
              const data = await res.json();
              return {
                symbol: data.quote.symbol,
                name: data.quote.name,
                price: data.quote.price,
                change: data.quote.change,
                changePercent: data.quote.changePercent
              };
            })
          );
          return results;
        };

        const [active, gainers, losers] = await Promise.all([
          fetchGroup(symbols.active),
          fetchGroup(symbols.gainers),
          fetchGroup(symbols.losers)
        ]);

        setTrends({ active, gainers, losers });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
    const interval = setInterval(fetchTrends, 30000); // 30초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const currentList = trends[activeTab];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        <h3 className="text-sm font-black flex items-center gap-2 mb-4">
          <Activity size={16} className="text-blue-500" />
          시장 트렌드
        </h3>
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
          {[
            { id: 'active', label: '거래 상위' },
            { id: 'gainers', label: '최대 상승' },
            { id: 'losers', label: '최대 하락' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 py-2 text-[10px] font-black rounded-lg transition-all",
                activeTab === tab.id 
                  ? "bg-white dark:bg-gray-800 shadow-sm text-blue-600" 
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y dark:divide-gray-700">
        {loading ? (
          Array.from({length: 5}).map((_, i) => (
            <div key={i} className="p-4 animate-pulse flex justify-between">
              <div className="h-4 w-24 bg-gray-100 dark:bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-100 dark:bg-gray-700 rounded" />
            </div>
          ))
        ) : (
          currentList.map((item) => (
            <button
              key={item.symbol}
              onClick={() => onSelect(item.symbol)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group text-left"
            >
              <div className="flex flex-col">
                <span className="text-xs font-black">{item.symbol}</span>
                <span className="text-[10px] text-gray-500 truncate max-w-[120px]">{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs font-black">{item.price?.toLocaleString()}</div>
                  <div className={cn(
                    "text-[10px] font-bold flex items-center justify-end gap-0.5",
                    item.change >= 0 ? "text-red-500" : "text-blue-500"
                  )}>
                    {item.change >= 0 ? '+' : ''}{item.changePercent?.toFixed(2)}%
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))
        )}
      </div>
      <button className="w-full p-4 text-[10px] font-black text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border-t dark:border-gray-700">
        더보기
      </button>
    </div>
  );
}
