'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, Clock } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

interface NewsFeedProps {
  symbol?: string;
}

export function NewsFeed({ symbol }: NewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const res = await fetch(`/api/news?symbol=${symbol || ''}`);
        const data = await res.json();
        setNews(data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [symbol]);

  if (loading) return <div className="space-y-4">{Array.from({length: 3}).map((_, i) => <div key={i} className="animate-pulse h-24 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black flex items-center gap-2 px-1">
        주요 뉴스 {symbol && <span className="text-blue-500">{symbol}</span>}
      </h3>
      <div className="space-y-3">
        {news.map((item, idx) => (
          <a 
            key={idx} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-4 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 hover:border-blue-500 transition-all group"
          >
            <div className="flex justify-between items-start gap-3">
              <h4 className="text-sm font-bold group-hover:text-blue-500 leading-snug line-clamp-2">{item.title}</h4>
              <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-500 shrink-0" />
            </div>
            <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400 font-medium">
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">{item.source}</span>
              <div className="flex items-center gap-1">
                <Clock size={10} />
                {new Date(item.pubDate).toLocaleDateString()}
              </div>
            </div>
          </a>
        ))}
        {news.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">관련 뉴스가 없습니다.</div>}
      </div>
    </div>
  );
}
