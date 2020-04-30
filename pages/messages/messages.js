// pages/messages/messages.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, // tab切换 
    isHiddenMes: true,
    mapPlace:"",
    readList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.loading();
    //获取设备宽高
    that.setData({
        winWidth: app.globalData.systemInfo.windowWidth,
        winHeight: app.globalData.systemInfo.windowHeight
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      app.loading();
      if (wx.getStorageSync("online")){
        this.getMesgFun();
      }else{
        // this.data.readList = [];
        this.setData({
          accept: [],
          checking: [],
          finish: []
        })
        app.hideloading();
      }
      

  },
  getMesgFun: function () {
    var that = this;
    app.apiPost(app.apiList.deliveryStatus, {
      openid: app.globalData.openid
    }, function (data) {
      //暂时不区分新消息
      if (wx.getStorageSync("online")){
        that.data.readList= data;
        console.log('readList:  ', that.data.readList);
        var accept = [],
            checking = [],
            finish = []

        for (var i in data) {
          if (data[i].status == '1') {    // 被查看
            accept.push(data[i].project);
          } else if (data[i].status == '2') { 
            checking.push(data[i].project);
          } else if (data[i].status == '3') {// 已审核
            finish.push(data[i].project);
          } 
        }
        that.setData({
          accept: accept,
          checking: checking,
          finish: finish
        })
      } else {
        that.setData({
          isHiddenMes: false
        })
      }
      app.hideloading();
    })
  },
  //项目活动详情
  submitTap: function (event) {
      var that = this;
      var id = event.currentTarget.dataset.id; // 当前id
      console.log('event.currentTarget.dataset.id:   ',id);
      var project = null;
      // 找出当时点击的那一项的详细信息
      for (var d of this.data.readList) {
          if (d.project.id == id) {
            d.project.p_type == 0 ? d.project.p_type_name = "全职" : d.project.p_type_name = "志愿"
            project = d.project;
              break;
          }
      }
      console.log('project: ', project);
      if (!project) {
        console.log('系统出错');
        return;
      }
      // 设置到全局变量中去，让下个页面可以访问
      app.globalData.projectDetail = project;
      // 切换页面
      wx.navigateTo({
        url: '../submit/submit'
      });
  },
  projectDetailTap: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id; // 当前id
    console.log('event.currentTarget.dataset.id:   ', id);
    var project = null;
    // 找出当时点击的那一项的详细信息
    for (var d of this.data.readList) {
      if (d.project.id == id) {
        d.project.p_type == 0 ? d.project.p_type_name = "全职" : d.project.p_type_name = "志愿"
        project = d.project;
        break;
      }
    }
    console.log('project: ', project);
    if (!project) {
      console.log('系统出错');
      return;
    }
    // 设置到全局变量中去，让下个页面可以访问
    app.globalData.projectDetail = project;
    // 切换页面
    wx.navigateTo({
      url: '../project-detail/project-detail'
    });
  },
  //滑动切换tab
  bindChangeTab: function (e) {
    this.setData({ currentTab: e.detail.current });
  },
  //点击tab切换
  swichNav: function (e) {
    var that = this ;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})