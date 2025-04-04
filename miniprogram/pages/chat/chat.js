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
    networkStatus: '点击按钮测试网络连接'
  },

  onLoad() {
    // 页面加载时的处理
  },

  // 测试网络连接
  testConnection() {
    this.setData({
      networkStatus: '正在测试连接...'
    });

    console.log('测试连接到:', app.globalData.apiBaseUrl);

    // 测试基本连接
    wx.request({
      url: `${app.globalData.apiBaseUrl}/health`,
      method: 'GET',
      success: (res) => {
        console.log('连接测试成功:', res);
        this.setData({
          networkStatus: `连接成功！服务器状态: ${res.data.status}, IP: ${app.globalData.apiBaseUrl}`
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
          content: `无法连接到服务器 ${app.globalData.apiBaseUrl}，请检查:\n1. 后端服务是否运行\n2. IP地址是否正确\n3. 手机和电脑是否在同一网络`,
          showCancel: false
        });
      }
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
      url: `${app.globalData.apiBaseUrl}/chat`,
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