/**
 * author: ShuHaoHwang
 * github：https://github.com/ShuHaoHwang/JSXL_back-end
 * dec：校内吉拾行乐APP
 * vision：0.1.0
 */

var util = require('/utils/util.js')
//app.js
App({
    onLaunch: function () {
        console.log('小程序开始运行');
        this.init();                        //进行初始化数据
                        //进行获取用户个人信息  
    },
    onShow: function () {
        console.log('在此小程序中');
    },
    onHide: function () {
        console.log('不在此小程序中');
    },
    onError: function (msg) {
        console.log('有错误:' + msg);
    },
    config: {
        //接口host
       //host: 'http://106.52.251.195:8080/XSJL',
       host:'http://localhost:8080',
        //版本
      version: "0.1.0",
        //app名称
      channel: '吉珠公益小程序【吉拾行乐】'
    },
    init: function () {
      var that = this;
      wx.checkSession({
        success() {
          //session_key 未过期，并且在本生命周期一直有效
          if (that.globalData.openid == null){
            wx.login({
              success(data) {
                if (data.code) {
                  console.log("[登录过期]开始获取用户Key");
                  that.apiPost(that.apiList.getOpenid, data, function (r_data) {
                    console.log('userKey', r_data)
                    wx.setStorageSync('userKey', r_data);
                    that.globalData.openid = r_data.openid;
                    console.log("用户唯一指标id：", that.globalData.openid)
                    that.getprofile();
                  })
                }

              }
            })
          }
          console.log("[登录未过期]用户唯一指标id：",that.globalData.openid)
          that.getprofile();
        },
        fail() {
          wx.login({
            success(data) {
              if (data.code) {
                console.log("[登录过期]开始获取用户Key");
                that.apiPost(that.apiList.getOpenid, data, function (r_data) {
                  console.log('userKey', r_data)
                  wx.setStorageSync('userKey', r_data);
                  that.globalData.openid = r_data.openid;
                  console.log("用户唯一指标id：", that.globalData.openid)
                  that.getprofile();
                })
              }
              
            }
          })
        }
      })

      that.apiPost(that.apiList.getinstitute,{},function(i_data){
        console.log("开始获取学院列表");
        that.globalData.institute = i_data;
        console.log("学院列表获取成功:", i_data);
      })
     },
  globalData: {
      //设备信息
      systemInfo: null,
      //微信用户唯一id
      openid: wx.getStorageSync('userKey').openid || null,
      //微信用户信息
      userbaseInfo: wx.getStorageSync('userbaseInfo') || null,
      //个人信息
      profile: wx.getStorageSync('profile') || null,
      //判断用户是否已有个人信息
      isHaveProfile: wx.getStorageSync('isHaveProfile') || null,
      //用于项目详情绑定数据
      projectDetail: null,
      //用户状态
      token:false,
      //登录状态
      online:false,
      //学院列表
      institute:[]
    },
    apiList: {
        //接口
        getOpenid: '/user/getuserkey',                //获取微信openid
        getProfile: '/user/getprofile',               //获取个人信息
        getcontact: "/user/getcontact",               //获取手机号接口
        do_login: '/user/login',                      // 登录
        // isHaveProfile: '',                            //个人信息
        saveProfile: '/user/saveprofile',             // 保存个人信息
        deliveryProject:'/project/deliveryProject',         //提交 待发布任务的信息
        deliveryProfile:'/user/deliveryProfile',    //信息投递的接口
        deliveryStatus:'/user/deliveryStatus',
        projects:'/public/listProject',               //项目任务获取接口
        getinstitute:'/public/listInstitute',         //获取学院
        loadmessage:'/public/loadmessage',
        uploadImg:'/project/uploadImg',             //图片上传接口
        retroaction: '/public/retroaction',         //意见反馈接口
        submit:'/user/submit'
    },
    apiGet: function (url, data, callback) {
        wx.request({
            url: this.config.host + url,
            data: data,
            method: 'GET',
            dataType: 'json',
            header: { 'content-type': 'application/json;charset=UTF-8' },
            success: function (res) {
                callback(res.data)
            },
            fail: function (res) {
              console.log(url + '请求失败')
            },
            complete: function (res) {
              console.log(url + '完成请求')
            }
        })
    },
    apiPost: function (url, data, callback) {
        wx.request({
            url: this.config.host + url,
            data: data,
            method: 'POST',
            dataType: 'json',
            header: { "content-type": "application/x-www-form-urlencoded" },
            success: function (res) {
                callback(res.data)
            },
            fail: function (res) {
              console.log(url + '请求失败')
            },
            complete: function (res) {
              console.log(url + '完成请求')
            }
        })
    },
    //获取用户信息
    getprofile:function(data){
      var that = this;
      if (that.globalData.openid != null || wx.getStorageSync('userKey') !== null){
        //检测用户的授权情况
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              console.log("用户授权获取基本信息");
              wx.getUserInfo({//获取微信的基础个人信息
                success(user_info) {
                  if (wx.getStorageSync('userbaseInfo') ==""){
                    wx.setStorageSync('userbaseInfo', user_info.userInfo)
                  }
                  that.globalData.userbaseInfo = user_info.userInfo;
                  
                }
              })
            } else {
              //用户没有授权
              console.log("用户没有授权获取基本信息");
              wx.setStorageSync('token_uifo', false);
            }
          }
        });

        //开始发出请求获取用户个人信息
        that.apiPost(that.apiList.getProfile,that.globalData.openid, function (profile_data){
          if (profile_data.openid == that.globalData.openid && that.globalData.openid!=null){//如果获取到了对象，说明已经注册了的用户
              console.log("[用户已注册]用户信息：", profile_data)
              that.globalData.profile = profile_data;
              that.loadMessage();
              wx.setStorageSync('profile', profile_data);
              that.globalData.token = true;
            }else{//没有说明未注册的新用户
              console.log("[用户未注册]")
              that.globalData.token = false;
            }
        })
      }else{  }
    },
    loadMessage:function(){
      this.apiPost(this.apiList.loadmessage, {openid:this.globalData.openid},function(data){
        console.log(data)
        wx.setStorageSync('sendPosiArray', data)
      })
    },
    alert: function (msg) {
        wx.showModal({
            content: msg,
            showCancel: false,
        });
    },
    loading: function () {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
    },
    hideloading: function () {
        wx.hideLoading(); 
    },
    util
})