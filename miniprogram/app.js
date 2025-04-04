// app.js
App({
  onLaunch() {
    // 初始化小程序
    console.log('小程序启动');
  },
  globalData: {
    // 使用局域网IP地址
    apiBaseUrl: 'http://192.168.1.102:8000'
  }
})