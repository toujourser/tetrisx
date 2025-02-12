// 用户信息管理工具类
class UserManager {
  constructor() {
    this.userInfo = null
  }

  // 获取用户信息
  async getUserInfo() {
    try {
      const { userInfo } = await wx.getUserProfile({
        desc: '用于完善会员资料'
      })
      this.userInfo = userInfo
      this.saveUserInfo(userInfo)
      return userInfo
    } catch (error) {
      console.error('获取用户信息失败：', error)
      throw error
    }
  }

  // 保存用户信息到本地存储
  saveUserInfo(userInfo) {
    wx.setStorageSync('userInfo', userInfo)
  }

  // 从本地存储获取用户信息
  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.userInfo = userInfo
        return userInfo
      }
      return null
    } catch (error) {
      console.error('加载用户信息失败：', error)
      return null
    }
  }

  // 保存游戏进度
  saveGameProgress(level, score) {
    try {
      const progress = {
        level,
        score,
        timestamp: Date.now()
      }
      wx.setStorageSync('gameProgress', progress)
    } catch (error) {
      console.error('保存游戏进度失败：', error)
    }
  }

  // 获取游戏进度
  getGameProgress() {
    try {
      return wx.getStorageSync('gameProgress') || null
    } catch (error) {
      console.error('获取游戏进度失败：', error)
      return null
    }
  }

  // 清除用户数据
  clearUserData() {
    try {
      wx.clearStorageSync()
      this.userInfo = null
    } catch (error) {
      console.error('清除用户数据失败：', error)
    }
  }
}

// 导出单例实例
export const userManager = new UserManager()