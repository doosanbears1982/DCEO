'use client';

import React, { useEffect, useState } from 'react';
import { Star, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { StockChart } from './StockChart';
import { FinancialSummary } from './FinancialSummary';
import { cn, formatCurrency } from '@/lib/utils';
import { useWatchlist } from './Watchlist';

interface StockDetailProps {
  symbol: string;
}

export function StockDetail({ symbol }: StockDetailProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1mo');
  const { addToWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlist();
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/stock/${symbol}?period=${period}`);
        const result = await res.json();
        setData(result);
        setIsStarred(isInWatchlist(symbol));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [symbol, period]);

  const toggleStar = () => {
    if (isStarred) {
      removeFromWatchlist(symbol);
      setIsStarred(false);
    } else {
      addToWatchlist(symbol, data?.quote?.name || symbol);
      setIsStarred(true);
    }
  };

  if (loading) return <div className="p-10 flex flex-col items-center justify-center gap-4 h-full"><RefreshCcw className="animate-spin text-blue-500" size={32} /> 데이터 로딩 중...</div>;
  if (!data || data.error) return <div className="p-10 text-center text-gray-400 h-full">종목을 찾을 수 없거나 데이터 오류가 발생했습니다.</div>;

  const { quote, chart, financials } = data;
  const isPositive = quote.change >= 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight">{quote.name}</h2>
            <button onClick={toggleStar} className="p-1">
              <Star size={20} className={cn("transition-colors", isStarred ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
            </button>
          </div>
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{quote.symbol} · {quote.currency}</div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-black tracking-tighter">{quote.price?.toLocaleString()}</div>
          <div className={cn(
            "text-sm font-bold flex items-center justify-end gap-1",
            isPositive ? "text-red-500" : "text-blue-500"
          )}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {quote.change?.toFixed(2)} ({quote.changePercent?.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
        <div className="flex gap-2 mb-6">
          {['1d', '1mo', '1y', 'max'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                period === p 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <StockChart data={chart} symbol={symbol} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-bold mb-4">투자 지표</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div className="space-y-1">
              <div className="text-[10px] text-gray-400 font-bold uppercase">PER (Forward)</div>
              <div className="text-sm font-black">{quote.summary?.forwardPE?.toFixed(2) || '-'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-gray-400 font-bold uppercase">PBR (Trailing)</div>
              <div className="text-sm font-black">{quote.summary?.priceToBook?.toFixed(2) || '-'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-gray-400 font-bold uppercase">ROE</div>
              <div className="text-sm font-black">{(quote.financialData?.returnOnEquity * 100)?.toFixed(2)}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-gray-400 font-bold uppercase">배당 수익률</div>
              <div className="text-sm font-black">{(quote.summary?.dividendYield * 100)?.toFixed(2)}%</div>
            </div>
          </div>
        </div>
        
        <FinancialSummary data={financials} />
      </div>
    </div>
  );
}
