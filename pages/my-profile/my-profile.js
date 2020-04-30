// pages/my-profile/my-profile.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profileBaseInfo: null,
    avatarUrl: '/images/small_avatar.png',
    genderlist: ['男', '女'],//性别
    grade: ['大一', '大二', '大三', '大四'],//年级
    institute: [],//所处学院
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //检查页面层级
      app.util.checkPage();

      
      this.setData({
        profileBaseInfo: app.globalData.profile,
        institute: app.globalData.institute,
        avatarUrl: app.globalData.userbaseInfo.avatarUrl
      });

  },
  onShow: function(){
  },
  
  //更换头像
  changeBgImgTap: function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths

        app.globalData.userInfo.avatarUrl = tempFilePaths;
        wx.setStorageSync('userInfo', app.globalData.userInfo);
        that.setData({
            avatarUrl: tempFilePaths
        })

        //更新上一级页面
        var pages = getCurrentPages();
        var curPage = pages[pages.length - 2];
        curPage.setData({
            userInfo: app.globalData.userInfo
        });
      }
    })
  },
  //编辑基本信息
  editBaseInfoTap: function(){
    if(app.globalData.profile==null||app.globalData.token){
      wx.reLaunch({
        url: '/pages/edit-profile/edit-profile?type=0',
      });
    }
    wx.navigateTo({
      url: '/pages/edit-profile/edit-profile',
    })
  }
})