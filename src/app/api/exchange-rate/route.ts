import { NextResponse } from 'next/server';

async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const API_KEY = process.env.API_KEY;

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`);
    const data = await response.json();
    
    if (data.result === "success") {
      return NextResponse.json({
        result: "success",
        conversion_rates: {
          [to as string]: data.conversion_rates[to as string]
        }
      });
    }
    return NextResponse.json({ result: "error", "error-type": data["error-type"] }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ result: "error", "error-type": 'Error fetching exchange rate' }, { status: 500 });
  }
}

export { GET };
