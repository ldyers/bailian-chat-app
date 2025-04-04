# 百炼API聊天小程序

这是一个基于微信小程序开发的聊天应用，使用百炼AI提供对话能力。

## 特点

- 简洁的聊天界面
- 多轮对话支持
- 网络连接测试功能
- 详细的错误提示和处理
- 适配不同屏幕尺寸
- 支持HTTP本地调试

## 目录结构

```
miniprogram/
├── app.js                # 小程序入口文件
├── app.json              # 小程序全局配置
├── sitemap.json          # 小程序索引配置
├── project.config.json   # 项目配置文件
├── README.md             # 项目说明（本文件）
├── README_SETUP.md       # 设置和问题排查指南
└── pages/                # 页面目录
    └── chat/             # 聊天页面
        ├── chat.js       # 聊天页面逻辑
        ├── chat.json     # 聊天页面配置
        ├── chat.wxml     # 聊天页面结构
        └── chat.wxss     # 聊天页面样式
```

## 如何使用

1. 在微信开发者工具中导入本项目
2. 在app.js中配置正确的API服务器地址
3. 确保后端服务器正在运行
4. 点击页面顶部的"测试网络连接"按钮验证连接
5. 开始聊天！

## 配置说明

API服务器地址配置在app.js中：

```javascript
globalData: {
  apiBaseUrl: 'http://192.168.1.102:8000'  // 修改为您的API服务器地址
}
```

## 网络连接问题

如果遇到网络连接问题，请查看 [README_SETUP.md](./README_SETUP.md) 获取详细的问题排查步骤。

## 开发者设置

有关开发环境的详细设置，如HTTP请求开启、域名校验关闭等设置，请参考 [README_SETUP.md](./README_SETUP.md)。