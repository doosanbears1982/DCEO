'use client';

import React, { useState, useEffect } from 'react';
import { MarketOverview } from '@/components/MarketOverview';
import { StockSearch } from '@/components/StockSearch';
import { Watchlist } from '@/components/Watchlist';
import { NewsFeed } from '@/components/NewsFeed';
import { StockDetail } from '@/components/StockDetail';
import { SectorOverview } from '@/components/SectorOverview';
import { MarketHeatmap } from '@/components/MarketHeatmap';
import { GlobalTicker } from '@/components/GlobalTicker';
import { MarketList } from '@/components/MarketList';
import { MarketTrends } from '@/components/MarketTrends';
import { 
  LayoutDashboard, Globe, PieChart, Star, Menu, X, 
  Bell, User, LogIn, Moon, Sun, Search, LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewType = 'dashboard' | 'domestic' | 'overseas' | 'sector' | 'watchlist';

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '대시보드 홈' },
    { id: 'domestic', icon: LayoutGrid, label: '국내주식' },
    { id: 'overseas', icon: Globe, label: '해외주식' },
    { id: 'sector', icon: PieChart, label: '섹터분류' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* 6.1 Left Sidebar (메뉴) */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 transition-transform lg:static lg:block",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">S</div>
          <h1 className="text-xl font-black tracking-tighter text-blue-600 dark:text-blue-400">StockBoard</h1>
        </div>
        
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => { setActiveView(item.id as ViewType); setIsSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all",
                activeView === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-10 px-6 border-t dark:border-slate-800 pt-6">
          <Watchlist 
            onSelect={(s) => { setSelectedSymbol(s); setActiveView('dashboard'); setIsSidebarOpen(false); }} 
            currentSymbol={selectedSymbol} 
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 6.2 Top Navigation Bar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2"><Menu /></button>
            <GlobalTicker />
          </div>

          <div className="flex items-center gap-4 flex-1 justify-center">
            <StockSearch onSearch={(s) => { setSelectedSymbol(s); setActiveView('dashboard'); }} />
          </div>
          
          <div className="flex items-center gap-3 flex-1 justify-end">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-black bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full hover:opacity-90 transition-all">
              <LogIn size={16} /> 로그인
            </button>
          </div>
        </header>

        {/* 6.3 Main Content Area (Grid Layout) */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950">
          
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* 상단: 지수 요약 */}
              <MarketOverview />

              {/* 그리드: 상단 좌측(히트맵) & 상단 우측(헤드라인 뉴스) */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-2">
                  <MarketHeatmap onSelect={setSelectedSymbol} />
                </div>
                <div className="h-full">
                  <MarketTrends onSelect={setSelectedSymbol} />
                </div>
                <div className="h-full">
                  <NewsFeed />
                </div>
              </div>

              {/* 그리드: 하단 (종목 상세 - 차트, 재무, 뉴스) */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <StockDetail symbol={selectedSymbol} />
                </div>
                <div className="space-y-6">
                  <NewsFeed symbol={selectedSymbol} />
                </div>
              </div>
            </div>
          )}

          {activeView === 'sector' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-black">섹터 및 테마 현황</h2>
              <SectorOverview />
            </div>
          )}

          {(activeView === 'domestic' || activeView === 'overseas') && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">{activeView === 'domestic' ? '국내 증시 상위 종목' : '해외 증시 주요 종목'}</h2>
                <button onClick={() => setActiveView('dashboard')} className="text-blue-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  <LayoutDashboard size={14} /> 대시보드로 돌아가기
                </button>
              </div>
              <MarketList 
                type={activeView as 'domestic' | 'overseas'} 
                onSelect={(s) => { setSelectedSymbol(s); setActiveView('dashboard'); }} 
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
