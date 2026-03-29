'use client';
import { useEffect, useState } from 'react';

// 1. 扩展数据类型（无需修改，兼容多品种）
type AnalysisData = {
  symbol: string;        // 品种名称（如XAUUSD、XAGUSD、OIL、SSEC）
  price: string;         // 价格
  change: string;        // 涨跌幅
  direction: 'Bullish' | 'Bearish' | 'Neutral'; // 趋势
  confidence: string;    // 置信度
  analysis: string;      // AI分析文本
  drivers: string[];     // 关键驱动因素
};

// 2. 修改兜底数据：新增黄金、白银、原油、上证指数
const fallbackData: AnalysisData[] = [
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
    symbol: "XAUUSD", // 黄金（现货黄金/美元）
    price: "2150.50",
    change: "+0.82%",
    direction: "Bullish",
    confidence: "80%",
    analysis: "Geopolitical tensions and weak USD boost safe-haven demand for gold. Central bank buying remains a key support factor.",
    drivers: ["Geopolitical risks", "Weak US dollar", "Central bank gold purchases"]
  },
  {
    symbol: "XAGUSD", // 白银（现货白银/美元）
    price: "24.85",
    change: "+1.25%",
    direction: "Bullish",
    confidence: "78%",
    analysis: "Industrial demand from green energy sector and silver's role as a precious metal lift prices. Supply constraints add upside pressure.",
    drivers: ["Green energy demand", "Supply tightness", "USD weakness"]
  },
  {
    symbol: "OIL", // 原油（WTI原油）
    price: "82.30",
    change: "-0.45%",
    direction: "Bearish",
    confidence: "72%",
    analysis: "Increased US crude production and concerns over global demand growth weigh on oil prices. OPEC+ production cuts partially offset losses.",
    drivers: ["US production rise", "Global demand worries", "OPEC+ cuts"]
  },
  {
    symbol: "SSEC", // 上证指数
    price: "3280.15",
    change: "+0.35%",
    direction: "Neutral",
    confidence: "70%",
    analysis: "Stabilization in property sector and policy support offset weak export data. Market remains range-bound in short term.",
    drivers: ["Property policy easing", "Weak exports", "Domestic consumption recovery"]
  }
];

export default function Home() {
  // 3. 修改状态：从单条数据改为数组
  const [data, setData] = useState<AnalysisData[] | null>(null);
  const [loading, setLoading] = useState(true);

 // 4. 异步获取数据（已修改：接入真实API + 调试日志）
const fetchData = async () => {
  try {
    // 👇 替换成你的 Render 后端 API 真实地址！！！
    const apiUrl = 'https://你的后端API地址.onrender.com/api/analysis';
    console.log("开始请求API:", apiUrl);

    // 发起API请求（添加跨域/超时配置）
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 超时时间10秒
    });

    // 检查API响应是否成功
    if (!res.ok) {
      throw new Error(`API响应失败：状态码 ${res.status} ${res.statusText}`);
    }

    // 解析API返回的JSON数据
    const result = await res.json();
    console.log("API返回数据:", result); // 打印真实数据，方便调试

    // 验证数据格式是否正确（避免后端返回格式错误）
    if (Array.isArray(result) && result.length > 0) {
      setData(result); // 使用真实API数据
    } else {
      throw new Error("API返回数据格式错误（不是数组/为空）");
    }

  } catch (err) {
    // 打印错误日志，方便定位问题
    console.error("API调用失败，使用兜底数据：", err);
    setData(fallbackData); // 失败时用兜底数据
  } finally {
    setLoading(false);
  }
};
  // 页面加载时执行数据请求
  useEffect(() => {
    fetchData();
  }, []);

  // 5. 辅助函数：根据趋势返回颜色（无需修改）
  const getDirectionColor = (dir: string) => {
    if (dir === 'Bullish') return 'text-green-500';
    if (dir === 'Bearish') return 'text-red-500';
    return 'text-gray-400';
  };

  // 加载中状态
  if (loading) return (
    <main className="min-h-screen bg-gray-900 p-8 text-white flex items-center justify-center">
      <h1 className="text-2xl font-bold">加载中...</h1>
    </main>
  );

  // 数据加载失败状态
  if (!data) return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">AI 交易分析仪表盘</h1>
      <p>数据加载失败，请检查API配置</p>
    </main>
  );

  // 6. 核心修改：循环渲染所有品种的分析卡片
  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      {/* 页面标题（可自定义样式） */}
      <h1 className="text-3xl font-bold mb-8 italic">AI 交易分析仪表盘</h1>
      
      {/* 多品种卡片容器：自动适配布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
          >
            {/* 品种名称 + 趋势 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{item.symbol}</h2>
              <span className={`font-bold ${getDirectionColor(item.direction)}`}>
                {item.direction}
              </span>
            </div>

            {/* 价格 */}
            <p className="text-xl mb-2">价格: {item.price}</p>
            
            {/* 涨跌幅进度条 */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>涨跌幅</span>
                <span>{item.change}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    item.direction === 'Bullish' ? 'bg-green-500' : 
                    item.direction === 'Bearish' ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                  style={{ width: item.confidence }}
                ></div>
              </div>
            </div>

            {/* 置信度 */}
            <p className="text-sm text-gray-300 mb-4">置信度: {item.confidence}</p>

            {/* AI分析文本 */}
            <p className="mb-4 text-gray-200">{item.analysis}</p>

            {/* 关键驱动因素 */}
            <div>
              <h3 className="font-semibold mb-2">关键驱动:</h3>
              <ul className="list-disc pl-5 text-gray-300">
                {item.drivers.map((driver, idx) => (
                  <li key={idx}>{driver}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
