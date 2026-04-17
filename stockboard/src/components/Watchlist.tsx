'use client';

import React, { useEffect, useState } from 'react';
import { Star, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WatchlistItem {
  symbol: string;
  name?: string;
  price?: number;
  changePercent?: number;
}

interface WatchlistProps {
  onSelect: (symbol: string) => void;
  currentSymbol: string;
}

export function Watchlist({ onSelect, currentSymbol }: WatchlistProps) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  const loadWatchlist = () => {
    const saved = localStorage.getItem('stock_watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    } else {
      const defaults = [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'TSLA', name: 'Tesla, Inc.' },
        { symbol: '005930.KS', name: 'Samsung Electronics' }
      ];
      setWatchlist(defaults);
      localStorage.setItem('stock_watchlist', JSON.stringify(defaults));
    }
  };

  useEffect(() => {
    loadWatchlist();
    window.addEventListener('watchlistUpdated', loadWatchlist);
    return () => window.removeEventListener('watchlistUpdated', loadWatchlist);
  }, []);

  const removeItem = (symbol: string) => {
    const saved = localStorage.getItem('stock_watchlist');
    const list = saved ? JSON.parse(saved) : [];
    const updated = list.filter((item: any) => item.symbol !== symbol);
    localStorage.setItem('stock_watchlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('watchlistUpdated'));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Star size={16} className="text-yellow-400 fill-yellow-400" />
        <h3 className="text-sm font-black">내 관심종목</h3>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {watchlist.map((item) => (
          <div 
            key={item.symbol}
            onClick={() => onSelect(item.symbol)}
            className={cn(
              "p-4 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between",
              currentSymbol === item.symbol 
                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" 
                : "bg-white dark:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            )}
          >
            <div>
              <div className="text-xs font-black tracking-tight">{item.symbol}</div>
              <div className="text-[10px] text-gray-500 truncate max-w-[100px]">{item.name}</div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.symbol);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {watchlist.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-[10px] font-bold">
            관심 종목이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export function useWatchlist() {
  const addToWatchlist = (symbol: string, name: string) => {
    const saved = localStorage.getItem('stock_watchlist');
    const list = saved ? JSON.parse(saved) : [];
    if (!list.find((item: any) => item.symbol === symbol)) {
      const updated = [...list, { symbol, name }];
      localStorage.setItem('stock_watchlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('watchlistUpdated'));
      return true;
    }
    return false;
  };

  const isInWatchlist = (symbol: string) => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('stock_watchlist');
    const list = saved ? JSON.parse(saved) : [];
    return !!list.find((item: any) => item.symbol === symbol);
  };

  const removeFromWatchlist = (symbol: string) => {
    const saved = localStorage.getItem('stock_watchlist');
    const list = saved ? JSON.parse(saved) : [];
    const updated = list.filter((item: any) => item.symbol !== symbol);
    localStorage.setItem('stock_watchlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('watchlistUpdated'));
  };

  return { addToWatchlist, isInWatchlist, removeFromWatchlist };
}
