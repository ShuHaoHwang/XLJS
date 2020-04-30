// pages/submit/submit.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    missionImgs:[],
    remarks:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    //获取任务详情
    that.setData({
      project_content: app.globalData.projectDetail,
      userifo:app.globalData.profile
    });
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

  },bindTextAreaBlur: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  phonecall:function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.projectDetail.pPhonenumber,
    })
  },
  chooseImage: function () {
    let that = this;
    let missionItems = that.data.missionImgs;
    let len = that.data.missionImgs.length;
    wx.chooseImage({
      count: 9 - len, //最多选择9张图片
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        missionItems.push(res.tempFilePaths);
        that.setData({
          missionImgs: missionItems
        })
      }
    })
  },
  deleteImg: function (e) {
    var that = this;
    wx.showModal({
      title: '删除图片',
      content: '是否删除该图片？',
      success(res){
        if (res.confirm){
          var tempImgs = that.data.missionImgs;
          var itemIndex = e.currentTarget.dataset.index;
          tempImgs.splice(itemIndex, 1);
          that.setData({
            missionImgs: tempImgs
          })
        }
      }
    })
  },
  uploadImgs:function(){
    var that =this;
    var tempImgs = [];
    console.log('[上传前]',that.data.missionImgs[0])
    for (let i = 0; i < that.data.missionImgs.length; i++) {
      wx.uploadFile({
        url: app.config.host + app.apiList.uploadImg, //此处换上你的接口地址 
        filePath: that.data.missionImgs[i][0],
        name: 'img',
        header: {
          "Content-Type": "multipart/form-data",
          'accept': 'application/json',
        },
        success: function (url) {
          console.log(url.data);
          tempImgs.push(app.config.host+url.data);
          that.data.missionimgs= tempImgs
        },fail:function(res){
          console.log('出错了！' ,res);
        }
      })
    }
  },
  submit:function(){
    var that = this;
    wx.showLoading({
      title: '信息提交中请稍后',
    })
    that.uploadImgs();
    setTimeout(function(){
      let infomsg = {
        openid: app.globalData.openid,
        pId: app.globalData.projectDetail.id,
        missionimgs: that.data.missionimgs,
        remarks: that.data.remarks
      }
      app.apiPost(app.apiList.submit, infomsg, function (e) {

        console.log('发送完成', e)
        wx.hideLoading();

        wx.switchTab({
          url: '../messages/messages',
        })
      })
    },2000)
  }
})