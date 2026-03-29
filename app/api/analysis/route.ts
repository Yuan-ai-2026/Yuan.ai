// app/api/analysis/route.ts
import { NextResponse } from 'next/server';

// 这里可以替换成你从第三方行情API获取的真实数据
export async function GET() {
  // 示例：返回最新的多品种数据（你可以把价格改成真实值）
  const realTimeData = [
    {
      symbol: "USDJPY",
      price: "151.20",
      change: "+0.16%",
      direction: "Bullish",
      confidence: "75%",
      analysis: "Fed minutes urging patience on cuts keeps US yields firm, widening the spread against Yen. Fundamental bias remains upward.",
      drivers: ["Fed cautious on rate cuts", "US-JP yield differential widening"]
    },
    {
      symbol: "XAUUSD",
      price: "4490.50", // 改成真实黄金价格
      change: "+0.82%",
      direction: "Bullish",
      confidence: "80%",
      analysis: "Geopolitical tensions and weak USD boost safe-haven demand for gold. Central bank buying remains a key support factor.",
      drivers: ["Geopolitical risks", "Weak US dollar", "Central bank gold purchases"]
    },
    {
      symbol: "XAGUSD",
      price: "24.85",
      change: "+1.25%",
      direction: "Bullish",
      confidence: "78%",
      analysis: "Industrial demand from green energy sector and silver's role as a precious metal lift prices. Supply constraints add upside pressure.",
      drivers: ["Green energy demand", "Supply tightness", "USD weakness"]
    },
    {
      symbol: "OIL",
      price: "82.30",
      change: "-0.45%",
      direction: "Bearish",
      confidence: "72%",
      analysis: "Increased US crude production and concerns over global demand growth weigh on oil prices. OPEC+ production cuts partially offset losses.",
      drivers: ["US production rise", "Global demand worries", "OPEC+ cuts"]
    },
    {
      symbol: "SSEC",
      price: "3280.15",
      change: "+0.35%",
      direction: "Neutral",
      confidence: "70%",
      analysis: "Stabilization in property sector and policy support offset weak export data. Market remains range-bound in short term.",
      drivers: ["Property policy easing", "Weak exports", "Domestic consumption recovery"]
    }
  ];

  // 返回JSON数据，设置跨域头
  return NextResponse.json(realTimeData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
  });
}
