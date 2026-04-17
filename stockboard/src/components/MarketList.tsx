'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: string;
}

interface MarketListProps {
  type: 'domestic' | 'overseas';
  onSelect: (symbol: string) => void;
}

export function MarketList({ type, onSelect }: MarketListProps) {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const domesticSymbols = ['005930.KS', '000660.KS', '035420.KS', '005380.KS', '035720.KS', '051910.KS', '006400.KS', '068270.KS', '105560.KS', '000270.KS'];
  const overseasSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK-B', 'LLY', 'AVGO'];

  useEffect(() => {
    async function fetchStocks() {
      setLoading(true);
      const symbols = type === 'domestic' ? domesticSymbols : overseasSymbols;
      
      try {
        const results = await Promise.all(
          symbols.map(async (symbol) => {
            const res = await fetch(`/api/stock/${symbol}`);
            const data = await res.json();
            if (data.quote) {
              return {
                symbol: data.quote.symbol,
                name: data.quote.name,
                price: data.quote.price,
                change: data.quote.change,
                changePercent: data.quote.changePercent,
                marketCap: data.quote.summary?.marketCap?.toLocaleString(),
              };
            }
            return null;
          })
        );
        setStocks(results.filter(Boolean) as StockItem[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchStocks();
  }, [type]);

  const filteredStocks = stocks.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-4">
      {Array.from({length: 8}).map((_, i) => (
        <div key={i} className="h-16 bg-white dark:bg-gray-800 rounded-2xl animate-pulse border dark:border-gray-700" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="종목명 또는 심볼 검색..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">종목</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">현재가</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">등락</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">등락률</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest"></th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr 
                  key={stock.symbol} 
                  onClick={() => onSelect(stock.symbol)}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black">{stock.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{stock.symbol}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black tracking-tight">{stock.price?.toLocaleString()}</span>
                  </td>
                  <td className={cn(
                    "px-6 py-4 text-right text-sm font-bold",
                    stock.change >= 0 ? "text-red-500" : "text-blue-500"
                  )}>
                    {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black",
                      stock.change >= 0 ? "bg-red-50 text-red-500 dark:bg-red-900/20" : "bg-blue-50 text-blue-500 dark:bg-blue-900/20"
                    )}>
                      {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {stock.changePercent?.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
