import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from http import HTTPStatus
from dashscope import Application
from typing import Optional, Dict
import uvicorn
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = FastAPI(title="聊天API", description="基于百炼的聊天API")

# 配置CORS - 扩展允许的域名列表，添加对微信小程序的支持
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有域名访问，生产环境应该限制为特定域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]  # 暴露所有响应头给客户端
)

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory="static"), name="static")

# 定义请求模型
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

# 定义响应模型
class ChatResponse(BaseModel):
    text: str
    session_id: str

# 百炼API配置
APP_ID = '30447f00c7e742d8af5d389797972c5a'  # 使用与test.py相同的APP_ID

# 验证API密钥
def verify_api_key():
    api_key = os.getenv("DASHSCOPE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="缺少API密钥配置")
    return api_key

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, api_key: str = Depends(verify_api_key)):
    try:
        # 调用百炼API
        response = Application.call(
            api_key=api_key,
            app_id=APP_ID,
            prompt=request.message,
            session_id=request.session_id
        )
        
        # 检查响应状态
        if response.status_code != HTTPStatus.OK:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"API调用失败: {response.message}, 请求ID: {response.request_id}"
            )
            
        # 返回响应
        return ChatResponse(
            text=response.output.text,
            session_id=response.output.session_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"聊天服务错误: {str(e)}")

@app.get("/")
async def root():
    return FileResponse("static/index.html")

# 添加健康检查接口，微信小程序可以用来测试连接
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "服务正常运行"}

if __name__ == "__main__":
    # 默认不使用HTTPS，适合本地调试
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)