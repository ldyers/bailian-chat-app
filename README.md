# 百炼API聊天应用

这是一个基于FastAPI和百炼API的简单聊天应用。

## 功能特点

- 基于百炼API的聊天功能
- 支持多轮会话（通过session_id保持上下文）
- 简洁的Web界面
- RESTful API设计

## 安装

1. 克隆或下载本项目
2. 安装依赖项：

```bash
pip install -r requirements.txt
```

3. 配置环境变量：
   - 在项目根目录创建`.env`文件
   - 在`.env`文件中设置您的百炼API密钥：`DASHSCOPE_API_KEY=your_api_key_here`

## 运行

```bash
python app.py
```

服务器将在`http://localhost:8000`启动。

## API接口

### 聊天接口

**POST** `/chat`

请求体：
```json
{
  "message": "你好",
  "session_id": null  // 首次对话为null，后续对话使用返回的session_id
}
```

响应：
```json
{
  "text": "你好！有什么可以帮助你的吗？",
  "session_id": "sess_123456789"
}
```

## Web界面

访问`http://localhost:8000`即可使用Web聊天界面。

## 注意事项

- 请确保您的百炼API密钥有效
- 此应用使用APP_ID为'30447f00c7e742d8af5d389797972c5a'的百炼应用