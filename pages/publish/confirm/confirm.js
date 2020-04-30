// pages/publish/confirm.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    this.setData({
      projectInfo:wx.getStorageSync('ProjectInfo')
    })
    console.log('ONshow IS OK', this.data.projectInfo)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  back:function(){
    wx.navigateBack({})
  },
  uploadImg: function () {
    var that = this
  },

  submitProjectInfo:function(){
    var that = this;
    wx.showLoading({
      title: '申请提交中',
    })
    
    
    console.log('[图片上传中]')
    wx.uploadFile({
      url: app.config.host + app.apiList.uploadImg, //仅为示例，非真实的接口地址
      filePath: that.data.projectInfo.missionImg[0],
      name: 'img',
      success: function (res) {
        var data = res.data
        that.data.projectInfo.missionImg = app.config.host + data;

        let project = {
          principalName: that.data.projectInfo.principalName,
          pPhonenumber: that.data.projectInfo.pPhonenumber,
          pAddress: that.data.projectInfo.pAddress,
          pAvailabletime: that.data.projectInfo.pAvailabletime,
          pName: that.data.projectInfo.pName,
          pType: that.data.projectInfo.pType,
          pWages: that.data.projectInfo.pWages,
          missionImg: that.data.projectInfo.missionImg,
          pDesc: that.data.projectInfo.pDesc,
          principalImg: app.globalData.userbaseInfo.avatarUrl
        }
        console.log('[项目申请信息]', project)
        wx.hideLoading();
        app.apiGet(app.apiList.deliveryProject, project, function (res) {
          console.log(res);
        })
      },
      fail: function (res) {
        console.log('[上传失败]', res);
        wx.hideLoading();
      }
    })
  }
})