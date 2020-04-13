var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isHaveProfile: true,
        submitText: '',
        submitdisabled: false,
        mode: true,
        animationData: {},
        height:"100%"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var that = this;

        //获取任务详情
        that.setData({
            project_content: app.globalData.projectDetail
        });
        console.log(app.globalData.projectDetail);
        WxParse.wxParse('article', 'html', app.globalData.projectDetail.pDesc, that, 5);
        //判断是否有个人信息
        if (app.globalData.profile === null) {
            that.setData({
                submitText: "请先完善您的个人信息",
                isHaveProfile: false
            });
        } else if (wx.getStorageSync('online')){
            that.setData({
                submitText: "我要参加",
                isHaveProfile: true
            });
        }else{
          that.setData({
            submitText: "请先登录",
          });

        }
       //判断是否已投递过
        try {
            var sendPosiArray = wx.getStorageSync('sendPosiArray')
            if (sendPosiArray) {
                // Do something with return value
                for (var i = 0; i < sendPosiArray.length;i++){
                    if (sendPosiArray[i] == app.globalData.projectDetail.id){
                        that.setData({
                            submitText: "已投递信息",
                            submitdisabled: true
                        });
                    }
                }
                
            }
        } catch (e) {
        }
    },
    //发送个人信息
    isSendTap: function () {
      
        var that = this;
     
      if (!wx.getStorageSync('online')){
          wx.switchTab({
            url: '/pages/my/my',
          })
        } else if (that.data.isHaveProfile){
            wx.showModal({
              title: '发送确认',
              content: '发送后不可撤回，确认发送？',
              cancelText: '取消',
              cancelColor: '#999',
              confirmText: '确认',
              confirmColor: '#4990E2',
              success: function (res) {
                console.log(res);
                that.sendResumeFun();
              }
            })
        }else{
            wx.reLaunch({
              url: '/pages/edit-resume-base/edit-resume-base?type=0',
            })
        }    
    },
    //投递接口
    sendResumeFun: function(){
        var that = this;
        app.apiGet(app.apiList.deliveryProfile,{
            openid: app.globalData.openid,
            projectid: that.data.project_content.id
        },function(data){
            console.log("投递结果：",data)
            if(data.code ==1){
              that.setData({
                height: ""
              });
              //定义动画
                var animation = wx.createAnimation({
                    duration: 1000,
                    timingFunction: 'ease',
                })
                that.setData({
                    mode: false,
                    animationData: animation.export(),
                    similarPosi: data.ret,
                    submitText: "已投递",
                    submitdisabled: true,
                })
                //缓存投递过的任务id
                try {
                    var sendPosiArray = wx.getStorageSync('sendPosiArray')
                    if (sendPosiArray) {
                        // Do something with return value
                        sendPosiArray.push(that.data.project_content.id);
                        wx.setStorageSync('sendPosiArray', sendPosiArray);
                    }else{
                        var sendPosiArray=[];
                        sendPosiArray.push(that.data.project_content.id);
                        wx.setStorageSync('sendPosiArray', sendPosiArray);
                    }
                } catch (e) {
                    // Do something when catch error
                }
            }else{
                app.alert(data.alertMsg);
            }
        })
    },

    //任务详情
    projectDetailTap: function (event) {
        var id = event.currentTarget.dataset.id; // 当前id
        var project = null;
        // 找出当时点击的那一项的详细信息
        for (var d of this.data.similarPosi) {
            if (d.id == id) {
                d.p_type == 0 ? d.p_type_name = "志愿" : d.p_type_name = "实习"
                project = d;
                break;
            }
        }
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
    //关闭成功提示
    closeTap: function () {
        this.setData({
            mode: true,
            height:"100%"
        })
    },
    //分享
    onShareAppMessage: function (res) {
    }
})