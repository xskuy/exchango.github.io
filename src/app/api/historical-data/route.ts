import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date'); // Esperamos una fecha en formato YYYY-MM-DD
  const API_KEY = process.env.API_KEY;

  if (!from || !to || !date) {
    return NextResponse.json({ result: "error", "error-type": "Missing parameters" }, { status: 400 });
  }

  if (!API_KEY) {
    console.error('API_KEY is not set');
    return NextResponse.json({ result: "error", "error-type": "API_KEY is not set" }, { status: 500 });
  }

  // Parseamos la fecha
  const [year, month, day] = date.split('-');
  
  const apiUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/history/${from}/${year}/${month}/${day}`;
  console.log('Fetching from URL:', apiUrl);

  try {
    const response = await fetch(apiUrl);
    const responseText = await response.text();

    console.log('Response status:', response.status);
    console.log('Response text:', responseText.substring(0, 200)); // Log first 200 characters

    if (!response.ok) {
      return NextResponse.json({ result: "error", "error-type": `API responded with status ${response.status}` }, { status: response.status });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json({ result: "error", "error-type": "Invalid JSON response from API" }, { status: 500 });
    }

    if (data.result === "success") {
      const rate = data.conversion_rates[to];
      if (rate === undefined) {
        return NextResponse.json({ result: "error", "error-type": "Target currency not found in response" }, { status: 400 });
      }
      
      return NextResponse.json({
        result: "success",
        date: `${year}-${month}-${day}`,
        rate: rate
      });
    } else {
      return NextResponse.json({ result: "error", "error-type": data["error-type"] }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return NextResponse.json({ result: "error", "error-type": 'Error fetching historical data' }, { status: 500 });
  }
}
