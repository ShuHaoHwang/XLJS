// pages/edit-profile/edit-profile.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // profile: ,//第一次新建
    userName:'',//姓名
    genderlist: ['男', '女'],//性别
    genderindex: 0,//性别index
    grade: ['大一', '大二', '大三', '大四'],//年级
    gradeindex: 0,//默认年级
    institute: [],//所处学院
    instituteindex: 0,//默认计算机学院
    birthday: '1995-01-01',//出生日期
    contact:'',//联系电话
    studentid:'',//学生id

    user:"输入您的姓名",    
    userphone:"输入您的电话",
    userstudentid:"输入您的学号"
  },

  /*
   生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //检查页面层级
      app.util.checkPage();    
      if (options.type == 0){
        this.setData({
            profile:false
        })
      }
      if (app.globalData.institute !== null) {
        this.setData({
          institute: app.globalData.institute
        })
      } 
      if (app.globalData.profile !== null) {
        
        var profileBaseTap = app.globalData.profile;
        console.log(profileBaseTap)
            this.setData({
                userName: profileBaseTap.username,
                genderindex: profileBaseTap.gender,
                gradeindex: profileBaseTap.grade,
                instituteindex: profileBaseTap.instituteId,
                birthday: profileBaseTap.birthday,
                contact: profileBaseTap.contact,
                studentid: profileBaseTap.studentid,
            })
      }
  },
  namefocus:function(e){
    this.setData({
      user:""
    })
  },
  //姓名失去焦点
  blurfocus:function(e){
    this.setData({
      user: "输入您的姓名",
      userName: e.detail.value
    })
  },
  //性别
  bindPickerChangeSex: function (e) {
      this.setData({
          genderindex: e.detail.value
      })
  },
  //年级
  bindPickerChangeGrade: function (e) {
    this.setData({
      gradeindex: e.detail.value
    })
  },
  //所处学院
  bindPickerChangeinstitute: function (e) {
    this.setData({
      instituteindex: e.detail.value
    })
  },
  //出生日期
  bindDateChangeBirthday: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  //联系电话
  contactTap: function(e){
   
  },
  // 电话获取焦点
  phonefocus: function (e) {
    this.setData({
      userphone: ""
    })
  },
  //电话失去焦点
  phoneblur: function (e) {
    this.setData({
      userphone: "输入您的电话",
      contact: e.detail.value
    });
  },
  // 学号获取焦点
  emailfocus: function (e) {
    this.setData({
      userstudentid: ""
    })
  },
  //学号失去焦点
  emailblur: function (e) {
    this.setData({
      userstudentid: "输入您的学号",
      studentid: e.detail.value
    })
  },
  
  //保存
  submitProfileBaseTap: function(){
    if ((this.data.userName == "") || (this.data.contact == "") || (this.data.studentid == "")) {
      wx.showModal({
        title: "出错了！",
        content: "请填写完整信息"
      });
    } else if (this.data.userName || this.data.contact || this.data.studentid) {
      if (new Date().getFullYear() < this.data.birthday.substring(0, 4)){
          wx.showModal({
            title: "出错了！",
            content: "请填写真实出生时间"
          });
          if (new Date().getMonth() < this.data.birthday.substring(5, 7)){
            wx.showModal({
              title: "出错了！",
              content: "请填写真实出生时间"
            });
          }
      }else if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.contact))) {
        wx.showModal({
          title: "出错了！",
          content: "手机号码格式不对！"
        });
      } else if (!(/\d*$/.test(this.data.studentid))) {
        wx.showModal({
          title: "出错了！",
          content: "学号格式不对！"
        });
      }else{
        wx.showToast({
          title: '保存成功！',
          icon: 'success',
          duration: 500
        })
        that.setProfileBaseInfoFun();
        //更新上一级页面
        var pages = getCurrentPages();
        var curPage = pages[pages.length - 2];
        curPage.setData({
          profileBaseInfo: this.data
        });

        //返回上一个页面
        setTimeout(function () {
          wx.navigateBack({
          })
        }, 800);
      }
    }
  },
  //保存基本信息
  setProfileBaseInfoFun: function(){
      if (this.data.userName == '' || this.data.userName == undefined) {
          app.alert('姓名不能为空！')
          return false;
      }

      if (this.data.contact == '' || this.data.contact == undefined) {
          app.alert('联系手机不能为空！')
          return false;
      }
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.contact))) {
          app.alert('手机号码格式不对！')
          return false;
      }
      if (this.data.studentid == '' || this.data.studentid == undefined) {
          app.alert('学号不能为空！');
          return false;
      }
    var myreg = /\d*$/;
      if (!myreg.test(this.data.studentid)) {
          app.alert('学号格式不对！');
          return false;
      }

      let content = {
          userName: this.data.userName,
          genderindex: this.data.genderindex,
          gradeindex: this.data.gradeindex,
          instituteindex: this.data.instituteindex,
          birthday: this.data.birthday,
          contact: this.data.contact,
          studentid: this.data.studentid,
          // token：true;
      };
      let profile = {
        openid:app.globalData.openid,
        username: this.data.userName,
        gender: this.data.genderindex,
        grade: this.data.gradeindex,
        instituteId: this.data.instituteindex,
        birthday: this.data.birthday,
        contact: this.data.contact,
        studentid: this.data.studentid,
      };

      // let isHaveProfile = {
      //  base_info: content
      // }
      // console.log(isHaveProfile)
      console.log('glotoken:' + app.globalData.token);
      // app.globalData.isHaveProfile.base_info = isHaveProfile;
      app.globalData.profile = profile;
      this.saveProfile(profile);

      wx.switchTab({    // 跳转到**页面并且关闭其他页面
      url: '/pages/index/index',
      })
  },
  saveProfile: function(profile_data){
    console.log('[用户修改后的信息]', profile_data)
    var that = this;
    if (1){
      app.apiGet(app.apiList.saveProfile, profile_data,function(res){
        console.log("个人信息发送成功！！")
        console.log(res)
        app.globalData.token = true;
      })
    }
  },
  //返回首页
  backIndewx: function(){
    wx.switchTab({    // 跳转到**页面并且关闭其他页面
        url: '/pages/index/index',
    })
  }
})