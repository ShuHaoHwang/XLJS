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
    mapPlace:""
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

    that.getMesgFun();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      app.loading();
      this.getMesgFun();
  },

  getMesgFun: function () {
    var that = this;
    app.apiPost(app.apiList.deliveryStatus, {
      openid: app.globalData.openid
    }, function (data) {
      console.log(data);
      //暂时不区分新消息
      if (wx.getStorageSync("online")){
        var readList = data;
        console.log('readList:  ', readList);
        var checking = [],
            checked = [],
            reject = []

        for (var i in readList) {
          console.log('开始了遍历！！readList[i]:   ', readList[i], i )
          if (readList[i].status == '1') {    // 被查看
            checking.push(readList[i]);
          } else if (readList[i].status == '2') { 
            checked.push(readList[i]);
          } else if (readList[i].status == '3') {// 已审核
            reject.push(readList[i]);
          } 
        }
       
        that.setData({
          checking: checking,
          checked: checked,
          reject: reject
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
  projectDetailTap: function (event) {
      var that = this;
      var id = event.currentTarget.dataset.id; // 当前id
      console.log('event.currentTarget.dataset.id:   ',id);
      // 找出当时点击的那一项的详细信息
      // for (var d of this.data.list) {
      //     if (d.id == id) {
      //         d.p_type == 0 ? d.p_type_name = "全职" : d.p_type_name = "志愿"
      //         project = d;
      //         break;
      //     }
      // }

      app.apiPost('/public/getprojectbyid', {id},function(data){
        console.log('project: ', data);
        data
        if (!data) {
          console.log('系统出错');
          return;
        }
        // 设置到全局变量中去，让下个页面可以访问
        app.globalData.projectDetail = data;
        // 切换页面
        wx.navigateTo({
          url: '../project-detail/project-detail'
        });
          
        })

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
  },

})