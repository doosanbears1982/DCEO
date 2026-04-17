import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '1mo'; // 1d, 1mo, 1y, max
  
  let interval: '1m' | '1h' | '1d' | '1wk' | '1mo' = '1d';
  
  if (period === '1d') {
    interval = '1m';
  } else if (period === '1mo') {
    interval = '1d';
  } else if (period === '1y') {
    interval = '1wk';
  } else if (period === 'max') {
    interval = '1mo';
  }

  try {
    // Quote data
    const quote: any = await yahooFinance.quote(symbol);
    
    // Historical data for chart
    const historical: any = await yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - (period === '1d' ? 86400000 : period === '1mo' ? 2592000000 : period === '1y' ? 31536000000 : 315360000000)),
      interval: interval,
    });

    // Financials
    const summary: any = await yahooFinance.quoteSummary(symbol, { 
      modules: [ "summaryDetail", "financialData", "incomeStatementHistory", "balanceSheetHistory" ] 
    });

    return NextResponse.json({
      quote: {
        symbol,
        name: quote.longName || quote.shortName,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        currency: quote.currency,
        summary: summary.summaryDetail,
        financialData: summary.financialData,
      },
      chart: historical.map((d: any) => ({
        date: d.date.toISOString().split('T')[0],
        close: d.close,
        volume: d.volume,
      })),
      financials: summary.incomeStatementHistory?.incomeStatementHistory.map((i: any) => ({
        endDate: i.endDate,
        totalRevenue: i.totalRevenue,
        operatingIncome: i.operatingIncome,
        netIncome: i.netIncome,
      }))
    });
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
