import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || '';
  
  // Generic market news or stock-specific news
  const url = symbol 
    ? `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${symbol}&region=US&lang=en-US`
    : `https://finance.yahoo.com/news/rssindex`;

  try {
    const feed = await parser.parseURL(url);
    
    return NextResponse.json({
      title: feed.title,
      items: feed.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet,
        source: item.creator || 'Yahoo Finance',
      })).slice(0, 10),
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    // Fallback news
    return NextResponse.json({ 
      title: '금융 뉴스',
      items: [
        { title: '글로벌 증시 혼조세... 기술주 강세 지속', link: '#', pubDate: new Date().toISOString(), contentSnippet: '...', source: '연합뉴스' },
        { title: '연준, 금리 동결 시사... 인플레이션 둔화 조짐', link: '#', pubDate: new Date().toISOString(), contentSnippet: '...', source: '한국경제' },
      ]
    });
  }
}
