// 获取应用实例
const app = getApp()

Page({
  data: {
    messages: [
      {
        type: 'bot',
        content: '您好！我是AI助手，有什么可以帮助您的？'
      }
    ],
    inputValue: '',
    sending: false,
    scrollToMessage: 'scroll-bottom',
    sessionId: null,
    networkStatus: '点击按钮测试网络连接',
    apiBaseUrl: ''
  },

  onLoad() {
    // 页面加载时获取全局配置的API地址
    this.setData({
      apiBaseUrl: app.globalData.apiBaseUrl,
      networkStatus: `当前配置的服务器: ${app.globalData.apiBaseUrl} (${app.globalData.currentEnv === 'local' ? '本地环境' : '远程环境'})`
    });
    console.log('聊天页面已加载，当前API地址:', this.data.apiBaseUrl);
  },

  // 测试网络连接
  testConnection() {
    this.setData({
      networkStatus: '正在测试连接...'
    });

    console.log('测试连接到:', this.data.apiBaseUrl);

    // 测试基本连接
    wx.request({
      url: `${this.data.apiBaseUrl}/health`,
      method: 'GET',
      success: (res) => {
        console.log('连接测试成功:', res);
        this.setData({
          networkStatus: `连接成功！服务器状态: ${res.data.status}, IP: ${this.data.apiBaseUrl}`
        });
      },
      fail: (err) => {
        console.error('连接测试失败:', err);
        
        // 显示详细错误信息
        let errorMsg = '';
        if (err.errMsg) {
          errorMsg = err.errMsg;
        } else {
          errorMsg = JSON.stringify(err);
        }
        
        this.setData({
          networkStatus: `连接失败: ${errorMsg}`
        });
        
        // 显示额外提示
        wx.showModal({
          title: '连接失败',
          content: `无法连接到服务器 ${this.data.apiBaseUrl}，请检查:\n1. 后端服务是否运行\n2. IP地址是否正确\n3. 手机和电脑是否在同一网络`,
          showCancel: false
        });
      }
    });
  },

  // 切换环境（本地/远程）
  switchEnvironment() {
    // 切换环境
    const newEnv = app.globalData.currentEnv === 'local' ? 'remote' : 'local';
    
    // 更新全局环境配置
    app.globalData.currentEnv = newEnv;
    
    // 根据新环境更新API地址
    if (newEnv === 'local') {
      app.globalData.apiBaseUrl = 'http://192.168.1.102:8000'; // 本地环境
    } else {
      app.globalData.apiBaseUrl = 'http://43.133.33.215:8000'; // 远程环境
    }
    
    // 更新页面数据
    this.setData({
      apiBaseUrl: app.globalData.apiBaseUrl,
      networkStatus: `已切换到${newEnv === 'local' ? '本地' : '远程'}环境: ${app.globalData.apiBaseUrl}`
    });
    
    console.log('环境已切换:', newEnv, this.data.apiBaseUrl);
    
    // 提示用户环境已切换
    wx.showToast({
      title: `已切换到${newEnv === 'local' ? '本地' : '远程'}环境`,
      icon: 'none',
      duration: 2000
    });
  },

  // 输入框内容变化处理
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 发送消息
  sendMessage() {
    const content = this.data.inputValue.trim()
    if (!content || this.data.sending) return
    
    // 添加用户消息到列表
    const messages = [...this.data.messages, {
      type: 'user',
      content
    }]
    
    this.setData({
      messages,
      inputValue: '',
      sending: true,
      scrollToMessage: `msg-${messages.length - 1}`
    })
    
    // 调用后端API
    wx.request({
      url: `${this.data.apiBaseUrl}/chat`,
      method: 'POST',
      data: {
        message: content,
        session_id: this.data.sessionId
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 添加机器人回复
          const updatedMessages = [...this.data.messages, {
            type: 'bot',
            content: res.data.text
          }]
          
          this.setData({
            messages: updatedMessages,
            sessionId: res.data.session_id,
            scrollToMessage: `msg-${updatedMessages.length - 1}`
          })
        } else {
          // 错误处理
          const updatedMessages = [...this.data.messages, {
            type: 'bot',
            content: `抱歉，我遇到了问题：${res.data.detail || '未知错误'}`
          }]
          
          this.setData({
            messages: updatedMessages,
            scrollToMessage: `msg-${updatedMessages.length - 1}`
          })
        }
      },
      fail: (err) => {
        // 网络错误处理
        const updatedMessages = [...this.data.messages, {
          type: 'bot',
          content: '网络连接失败，请检查您的网络设置或稍后再试。'
        }]
        
        this.setData({
          messages: updatedMessages,
          scrollToMessage: `msg-${updatedMessages.length - 1}`
        })
        
        console.error('请求失败:', err)
      },
      complete: () => {
        this.setData({
          sending: false
        })
      }
    })
  }
})