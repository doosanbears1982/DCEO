import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols');
  const symbols = symbolsParam ? symbolsParam.split(',') : ['^GSPC', '^IXIC', '^DJI', '^KS11', '^KQ11'];
  
  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const quote: any = await yahooFinance.quote(symbol);
          return {
            symbol,
            name: quote.shortName || quote.longName || symbol,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
          };
        } catch (e) {
          console.error(`Error fetching ${symbol}:`, e);
          return null;
        }
      })
    );

    return NextResponse.json(results.filter(Boolean));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
