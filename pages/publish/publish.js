// pages/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    missionImg:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1582786519565&di=fa06e5f12d6c511c94a4314549e36454&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fbaike%2Fpic%2Fitem%2F14ce36d3d539b6007634344be850352ac75cb757.jpg',
    missionType: ['全职', '兼职', '实习','志愿者'],
    missionTypeIndex:0,

   
    principalName:'',
    pPhonenumber:'',
    pAddress: '',
    pAvailabletime: '2020-01-01',
    pName: '',
    pWages: '',
    p_phonenumber: '',
    pDesc:'',
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

  },
  uploadPictures:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log('图片大小：', res.tempFiles[0].size)
        if (res.tempFiles[0].size <= 1024000){
          that.setData({
            missionImg: res.tempFilePaths
          })
        }else{
          wx.showToast({
            title: '上传的图片太大了哦QAQ(不能超过1mb)',  //标题
            icon: 'none'       //图标 none不使用图标，详情看官方文档
          })
        }

      }
    })
  },
  bindPickerChange: function (e) {
    console.log('[类型已选择]', this.data.missionType[e.detail.value], e.detail.value)
    this.setData({
      missionTypeIndex: e.detail.value
    })
  },

  bindDateChange: function (e) {
    console.log('[日期已选择]', e.detail.value)
    this.setData({
      pAvailabletime: e.detail.value
    })
  },

  bindprincipalNameBlur: function (e) {
    
    this.setData({
      principalName : e.detail.value
    })
  },

  bindpPhonenumberBlur: function (e) {
    this.setData({
      pPhonenumber : e.detail.value
    })
    
  },

  bindpAddressBlur: function (e) {
    this.setData({
      pAddress : e.detail.value
    })
   
  },

  bindpNameBlur: function (e) {
    this.setData({
      pName : e.detail.value
    })
    
  },

  bindpWagesBlur: function (e) {
    this.setData({
      pWages : e.detail.value
    })
    
  },

  bindTextAreaBlur: function (e) {
    this.setData({
      pDesc : e.detail.value
    })
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

  saveProjectInfo:function(){
    let info = {
      principalName: this.data.principalName,
      pPhonenumber: this.data.pPhonenumber,

      missionTypeIndex: this.data.missionTypeIndex,
      pAddress: this.data.pAddress,
      pAvailabletime: this.data.pAvailabletime,
      pName: this.data.pName,
      pType: this.data.missionTypeIndex,
      pWages: this.data.pWages,
      pDesc: this.data.pDesc,
      missionImg: this.data.missionImg
    };
    console.log('[待提交数据信息]', info)

    wx.setStorageSync('ProjectInfo', info);
    wx.navigateTo({
      url: "confirm/confirm"
    })
  },

  //返回首页
  backIndewx: function () {
    wx.switchTab({    // 跳转到**页面并且关闭其他页面
      url: '/pages/index/index',
    })
  }


})