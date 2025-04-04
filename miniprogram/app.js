// app.js
App({
  onLaunch() {
    // 初始化小程序
    console.log('小程序启动');
    
    // 判断是测试环境还是生产环境
    const ENV = {
      LOCAL: 'local',      // 本地局域网环境
      REMOTE: 'remote'     // 远程服务器环境
    };
    
    // 当前使用的环境，可以通过修改这个值切换环境
    // this.globalData.currentEnv = ENV.LOCAL; // 局域网测试环境
    this.globalData.currentEnv = ENV.REMOTE; // 远程服务器环境
    
    // 根据环境选择正确的API基础URL
    if (this.globalData.currentEnv === ENV.LOCAL) {
      this.globalData.apiBaseUrl = 'http://192.168.1.102:8000'; // 局域网IP地址
      console.log('已切换到本地测试环境', this.globalData.apiBaseUrl);
    } else {
      this.globalData.apiBaseUrl = 'http://43.133.33.215:8000'; // 远程服务器IP地址
      console.log('已切换到远程服务器环境', this.globalData.apiBaseUrl);
    }
  },
  
  globalData: {
    apiBaseUrl: '', // 将在onLaunch中设置
    currentEnv: '' // 当前环境，将在onLaunch中设置
  }
})