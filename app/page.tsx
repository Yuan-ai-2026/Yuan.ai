'use client';
import { useEffect, useState } from 'react';

type AnalysisData = {
  symbol: string;
  price: string;
  change: string;
  direction: 'Bullish' | 'Bearish' | 'Neutral';
  confidence: string;
  analysis: string;
  drivers: string[];
};

// 兜底静态数据，避免API失败时页面空白
const fallbackData: AnalysisData = {
  symbol: "USDJPY",
  price: "151.20",
  change: "+0.16%",
  direction: "Bullish",
  confidence: "75%",
  analysis: "Fed minutes urging patience on cuts keeps US yields firm, widening the spread against the Yen. Despite interim volatility, the fundamental bias remains strictly upward.",
  drivers: ["Fed cautious on rate cuts", "US-JP yield differential widening"]
};

export default function Home() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 从环境变量读取后端地址，兜底填你的Render地址
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://yuan-ai-1.onrender.com";
        const res = await fetch(`${apiUrl}/api/usdjpy`, {
          next: { revalidate: 300 } // 5分钟缓存，避免频繁请求
        });
        
        if (!res.ok) throw new Error("API请求失败");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("API调用失败，使用兜底数据:", err);
        // 调用失败时显示兜底数据，页面不会空白
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDirectionColor = (dir: string) => {
    if (dir === 'Bullish') return 'text-green-500';
    if (dir === 'Bearish') return 'text-red-500';
    return 'text-gray-400';
  };

  if (loading) return (
    <main className="min-h-screen bg-gray-900 p-8 text-white flex items-center justify-center">
      <h1 className="text-2xl font-bold">加载中...</h1>
    </main>
  );

  if (!data) return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">AI 交易分析仪表盘</h1>
      <p>数据加载失败，请检查API配置</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">AI 交易分析仪表盘</h1>
      
      {/* 分析卡片，完全复刻HybridTrader风格 */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{data.symbol}</h2>
          <span className={`text-lg font-semibold ${getDirectionColor(data.direction)}`}>
            {data.direction}
          </span>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-xl text-white">价格: {data.price}</span>
          <span className="text-lg text-gray-300">{data.change}</span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
          <div 
            className="bg-green-500 h-2.5 rounded-full" 
            style={{ width: data.confidence.replace('%', '') + '%' }}
          ></div>
          <span className="text-sm text-gray-400 mt-1 block">置信度: {data.confidence}</span>
        </div>

        <p className="text-gray-300 mb-6 leading-relaxed">{data.analysis}</p>

        <div>
          <h3 className="text-white font-semibold mb-2">关键驱动:</h3>
          <ul className="list-disc pl-5 text-gray-300 space-y-1">
            {data.drivers.map((driver, idx) => (
              <li key={idx}>{driver}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
