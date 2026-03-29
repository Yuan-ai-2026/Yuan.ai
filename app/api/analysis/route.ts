// app/api/analysis/route.ts
import { NextResponse } from 'next/server';

// 👇 替换成你的第三方API配置（关键！）
const THIRD_PARTY_API_KEY = '你的第三方API密钥'; // 比如 'abc123xyz'
const THIRD_PARTY_API_URL = '你的第三方API地址'; // 比如 'https://api.xxx.com/v1/market-data'
const API_TIMEOUT = 10000; // 第三方API超时时间（10秒）

// 处理第三方API返回的数据，转换成前端需要的AnalysisData格式
const formatData = (rawData: any): any[] => {
  // 👇 这里根据你的第三方API返回格式修改！！！
  // 示例：假设第三方API返回 { "XAUUSD": { "price": "4490.12", "change": "+0.5%" }, ... }
  // 你需要把它转换成前端需要的数组格式
  return [
    {
      symbol: "USDJPY",
      price: rawData.USDJPY?.price || "151.20", // 实时价格，兜底旧值
      change: rawData.USDJPY?.change || "+0.16%",
      direction: rawData.USDJPY?.price > 151.0 ? "Bullish" : "Bearish", // 简单判断趋势
      confidence: "75%",
      analysis: "Fed minutes urging patience on cuts keeps US yields firm, widening the spread against Yen. Fundamental bias remains upward.",
      drivers: ["Fed cautious on rate cuts", "US-JP yield differential widening"]
    },
    {
      symbol: "XAUUSD",
      price: rawData.XAUUSD?.price || "4490.50", // 黄金实时价格
      change: rawData.XAUUSD?.change || "+0.82%",
      direction: rawData.XAUUSD?.change.includes("+") ? "Bullish" : "Bearish",
      confidence: "80%",
      analysis: "Geopolitical tensions and weak USD boost safe-haven demand for gold. Central bank buying remains a key support factor.",
      drivers: ["Geopolitical risks", "Weak US dollar", "Central bank gold purchases"]
    },
    {
      symbol: "XAGUSD",
      price: rawData.XAGUSD?.price || "24.85", // 白银实时价格
      change: rawData.XAGUSD?.change || "+1.25%",
      direction: rawData.XAGUSD?.change.includes("+") ? "Bullish" : "Bearish",
      confidence: "78%",
      analysis: "Industrial demand from green energy sector and silver's role as a precious metal lift prices. Supply constraints add upside pressure.",
      drivers: ["Green energy demand", "Supply tightness", "USD weakness"]
    },
    {
      symbol: "OIL",
      price: rawData.OIL?.price || "82.30", // 原油实时价格
      change: rawData.OIL?.change || "-0.45%",
      direction: rawData.OIL?.change.includes("-") ? "Bearish" : "Bullish",
      confidence: "72%",
      analysis: "Increased US crude production and concerns over global demand growth weigh on oil prices. OPEC+ production cuts partially offset losses.",
      drivers: ["US production rise", "Global demand worries", "OPEC+ cuts"]
    },
    {
      symbol: "SSEC",
      price: rawData.SSEC?.price || "3280.15", // 上证指数实时价格
      change: rawData.SSEC?.change || "+0.35%",
      direction: "Neutral",
      confidence: "70%",
      analysis: "Stabilization in property sector and policy support offset weak export data. Market remains range-bound in short term.",
      drivers: ["Property policy easing", "Weak exports", "Domestic consumption recovery"]
    }
  ];
};

// GET请求：代理请求第三方API，返回格式化后的数据
export async function GET() {
  try {
    // 1. 配置第三方API请求（添加密钥、超时等）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const res = await fetch(THIRD_PARTY_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${THIRD_PARTY_API_KEY}`, // 按需修改认证方式（比如apikey、token）
        // 其他第三方API要求的头信息，按需添加
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 2. 检查第三方API响应
    if (!res.ok) {
      throw new Error(`第三方API失败：状态码 ${res.status} ${res.statusText}`);
    }

    // 3. 解析并格式化数据
    const rawData = await res.json();
    const formattedData = formatData(rawData); // 转换成前端需要的格式

    // 4. 返回给前端（带跨域头）
    return NextResponse.json(formattedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });

  } catch (err) {
    console.error("第三方API请求失败:", err);
    // 失败时返回兜底数据，避免前端白屏
    const fallbackData = formatData({});
    return NextResponse.json(fallbackData);
  }
}
