/**
 * author: ShuHaoHwang
 * github：https://github.com/ShuHaoHwang/JSXL_back-end
 * dec：个人页面
 */

// pages/my/my.js
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isShow: false,     //是否拿到用户信息，否则显示默认头像
        //myself: ''
        faceImg:"",      // 头像
        user: false,   // 是否显示注册/登录或者用户名
        username:"",    // 判断是否是登录状态，
        usersetting:true,     //    退出当前账户
        avatarUrl:"/images/face.png"
    },

    onLoad: function () {
      var that = this;
        //获取我的信息
      console.log("开始加载页面");
      console.log("OPenid: ", app.globalData.openid);
      console.log("getStorageSync token_uifo: " + wx.getStorageSync("token_uifo") + ";  globalData token: " + app.globalData.token + "; online: " + wx.getStorageSync("online"));
      if (wx.getStorageSync("token_uifo") && wx.getStorageSync("online")) {   // 判断用户是否登录
        that.setData({
          user: true,
          usersetting: false
        });
        console.log("登录状态");
      } else {
        that.setData({
          user: false,                    //是否显示登录字眼
          usersetting: true                
        });
      };
      if (app.globalData.userInfo !== null && wx.getStorageSync("online")) {
        that.setData({
          username: app.globalData.userInfo.nickName,   //设置显示用户名
          avatarUrl: app.globalData.userInfo.avatarUrl
        })
      }
    },
    onShow: function(){
      
        //获取我的个人信息
        if (app.globalData.profile !== null) {
          
          console.log("我有个人信息:",app.globalData.profile)
        }
    },
    login: function (data) {
      var that = this;
      //查看是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            console.log("用户点击了授权按钮");              //用户按了允许授权按钮
            // 获取到用户的信息了
            console.log("用户的信息如下：");
            console.log(data.detail.userInfo);
            if (app.globalData.userInfo == null) {
              console.log("微信基础信息为空"); 
              wx.getUserInfo({
                success: function (res) {
                  app.globalData.userInfo = res.userInfo;
                  wx.setStorageSync('userInfo', res.userInfo);
                  wx.setStorageSync('token_uifo',true)
                  wx.setStorageSync('online', true)
                  app.globalData.token = true;
                  that.setData({
                    userInfo: res.userInfo,
                    isShow: true
                  });
                  that.onLoad();
                }
              })
            } else {
              console.log("微信基础信息不为空"); 
              that.setData({ userInfo: app.globalData.userInfo, isShow: true });
              wx.setStorageSync('token_uifo', true)
              wx.setStorageSync('online', true)
              that.onLoad();
            }

          } else {
            //用户没有授权
            wx.showModal({
              title: '警告',
              content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
              showCancel: false,
              confirmText: '返回授权',
              success: function (data) {
                // 用户没有授权成功
                if (data.confirm) {
                  console.log('用户点击了“返回授权”');
                }
              }
            });
          }
        }
      });
    },
    // 退出账户登录
    signOut: function () {
      console.log("用户点击了退出账号")
      var that = this;
      try {//   恢复到没登录的样式
        wx.setStorageSync('online', false)
        wx.setStorageSync('token_uifo', false)
      } catch (e) {
      }
      try {
        wx.removeStorageSync('openid')
        console.log("用户此时的openid: ", app.globalData.openid)
      } catch (e) {
        // Do something when catch error
      }
      if (!wx.getStorageSync('token_uifo') && wx.getStorageSync('openid') == ""){
        wx.showModal({
          title: '提示',
          content: '您确定要退出登录？',
          success: function (res) {
            if (res.confirm) {
              wx.removeStorage
              that.setData({
                user: false,
                usersetting: true,
                username: "",
                avatarUrl: "/images/face.png"
              });
              that.onLoad();
            }else if (res.cancel) {}
          }
        })
      }
    },
    //编辑资料
    editInfoTap: function () {
        wx.navigateTo({
            url: '/pages/edit-my/edit-my',
        })
    },
    //个人信息
    profileTap: function () {
      if ( wx.getStorageSync("online")) { 
         //判断是否有个人信息
        if (app.globalData.profile===null){
              wx.reLaunch({
                  url: '/pages/edit-profile/edit-profile?type=0',
              });
          }else{
              wx.navigateTo({
                  url: '/pages/my-profile/my-profile'
              });
        }
      }else{
        app.alert("请先登录!");
      }
       
    },
    //我的投递
    myDeliveryTap: function () {
      if (wx.getStorageSync("token") == "true" || app.globalData.token == "true") { 
          wx.switchTab({
            url: '/pages/messages/messages'
        });
      }else{
        app.alert("请先登录!");
      }
      
    },
    //编辑头像
    imgTap: function(){
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
                    userInfo: app.globalData.userInfo
                })

            }
        })
    },
    deliveryComments:function(){
      wx.navigateTo({
        url: '../opinion/opinion',
      })
    }
})