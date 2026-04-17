'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface StockSearchProps {
  onSearch: (symbol: string) => void;
}

export function StockSearch({ onSearch }: StockSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim().toUpperCase());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="종목 심볼 검색 (예: AAPL, 005930.KS)"
        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-full focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
