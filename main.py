from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 解决跨域问题，允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 健康检查接口
@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Trading Analyzer API is running"}

# 示例：USDJPY分析接口（后续可扩展完整逻辑）
@app.get("/api/usdjpy")
def get_usdjpy_analysis():
    return {
        "symbol": "USDJPY",
        "price": "151.20",
        "change": "+0.16%",
        "direction": "Bullish",
        "confidence": "75%",
        "analysis": "Fed minutes keeping US yields firm, widening spread vs Yen. Fundamental bias remains upward.",
        "drivers": ["Fed cautious on rate cuts", "US-JP yield differential widening"]
    }
