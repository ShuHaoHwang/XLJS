/**
 * author: ShuHaoHwang
 * github：https://github.com/ShuHaoHwang/JSXL
 * dec：首页
 */

//index.js
//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js');

var app = getApp();
Page({
    data: {
        page: 1,//页码
        limit: 6,//条数
        // searchPage: 1, //搜索页码
        // searchLimit: 10,//搜索条数
        // searchValue:'',//搜索条件
        searchBtnText:'搜索',

        viewHeight: 600,
        loadingText: '加载中...',//
        loadingHidden: true,//默认隐藏更多
        list: [],
        wxSearchData:"" 
    },
    onLoad: function () {
        var that = this;
        //收集、判断系统信息
         app.util.checkSystemInfo();
        //获取活动项目列表数据
        that.getprojectsFun(that.data.page, that.data.limit);
        WxSearch.init(that, 48, ['志愿者','实习生']);
    },
    onShow: function () {

    },

    //判断用户是否已有个人信息
    getResume: function (that){
        if (app.globalData.openid == null) {
            setTimeout(function(){
                that.getResume(that);
            },1000);
        }else{
            app.util.isHaveResume();
        }
        
    },
    
    //获取首页项目信息
    getprojectsFun: function (page, limit){
        var that = this;
        app.apiGet(app.apiList.projects, {
            page: page,
            limit: limit,
        }, function (data) {
          console.log("项目获取完成： ",data)
                if (data!=null){
                    var newOrders = that.data.list.concat(data);
                    that.setData({
                        list: newOrders,
                        loadingHidden: true
                    })
                }else{
                    that.setData({
                      loadingText: "更多志愿任务正在收录"
                    })
                }
            app.hideloading();
        })
    },
    
    //项目详情
    projectDetailTap: function (event) {
        var id = event.currentTarget.dataset.id; // 当前id
        var project = null;
        // 找出当时点击的那一项的详细信息
        for (var d of this.data.list) {
            if (d.id == id) {
                if(d.pType == 0) {
                  d.p_type_name = "全职" }
                if (d.pType == 1) {
                  d.p_type_name = "兼职" }
                if (d.pType == 2) {
                  d.p_type_name = "实习"
                }
                if (d.pType == 3) {
                  d.p_type_name = "志愿者"
                }
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

    //加载更多
    lower: function (event) {
        var that = this;
        if (that.data.loadingHidden) {
            that.data.loadingHidden = false;
            that.data.page++;
          app.apiGet(app.apiList.projects, {
            page: that.data.page,
            limit: that.data.limit
          }, function (data) {
            console.log(data);
            if (data.length > 0) {
              var newData = that.data.list.concat(data);
              that.setData({
                list: newData,
                loadingHidden: true
              })
            } else {
              that.setData({
                loadingText: "更多志愿任务正在收录",
                loadingHidden: false
              })
            }
            app.hideloading();
          })
            that.setData({
                loadingHidden: false,
            })

        }

    },
    //搜索结果
    searchRetFun: function (address, key, searchPage, searchLimit){
        var that = this;
        app.apiPost(app.apiList.wxappSearchList,{
            full_time: 1,
            address: address,
            key: key,
            searchPage: searchPage, //搜索页码
            searchLimit: searchLimit,//搜索条数
        },function(data){
          console.log(data);
            if (data.length > 0) {
                var newData = that.data.list.concat(data);
                that.setData({
                    list: newData,
                    loadingHidden: true
                })
            } else {
                that.setData({
                    loadingText: "更多项目活动正在收录",
                    loadingHidden: false
                })
            }
            
            app.hideloading();
        })
    },

    //点击搜索按钮
    wxSearchFn: function (e) {
        // var that = this;
        // WxSearch.wxSearchAddHisKey(that);
        // if (!this.data.searchValue){
        //     wx.showToast({
        //       title:"请输入关键字"
        //     });
        // }else{
        //   if (that.data.searchBtnText == '搜索') {
        //     app.loading();
        //     //初始化
        //     this.setData({
        //       loadingHidden: true,
        //       loadingText: '加载中...',
        //       list: [],
        //       searchPage: 1,
        //       searchBtnText: '返回'
        //     })
        //     //判断是否有wxSearchData.value
        //     if (that.data.wxSearchData.value) {
        //       that.searchRetFun(that.data.cityId, that.data.wxSearchData.value, that.data.searchPage, that.data.searchLimit);
        //       that.setData({
        //         searchValue: that.data.wxSearchData.value
        //       })
        //     } else {
        //       that.searchRetFun(that.data.cityId, that.data.searchValue, that.data.searchPage, that.data.searchLimit);
        //     }
        //   } else {
        //     app.loading();
        //     that.setData({
        //       loadingHidden: true,
        //       loadingText: '加载中...',
        //       list: [],
        //       searchPage: 1,
        //       searchBtnText: '搜索',
        //       searchValue: ''
        //     })
        //     that.data.wxSearchData.value = '';
        //     that.data.searchValue = '';
        //     that.searchRetFun(that.data.cityId, that.data.searchValue, that.data.searchPage, that.data.searchLimit);

        //   }
        // }
    },
    //搜索条件改变
    wxSearchInput: function (e) {
     
        var that = this
        WxSearch.wxSearchInput(e, that);
        if (e.detail.value == '' || e.detail.value == undefined) {
            that.setData({
                searchValue: ''
            })
        } else {
            that.setData({
                searchValue: e.detail.value
            })
        }
        
    },
    searchConfirm: function(){
        this.wxSearchFn();
    },
    //获取搜索输入框焦点
    wxSearchFocus: function (e) {
        var that = this;
        console.log(this.data.wxSearchData);
        this.data.wxSearchData.view.isShow = true;
        WxSearch.wxSearchFocus(e, that);
        that.setData({
          wxSearchData: this.data.wxSearchData
        });
        console.log(this.data);
    },
    wxSearchKeyTap: function (e) {
        var that = this;
        WxSearch.wxSearchKeyTap(e, that);
        //  点击热门搜索标签的函数
        app.loading();
        //初始化
        this.setData({
          loadingHidden: true,
          loadingText: '加载中...',
          list: [],
          searchPage: 1,
          searchBtnText: '返回'
        })
        //判断是否有wxSearchData.value
        if (that.data.wxSearchData.value) {
          that.searchRetFun(that.data.cityId, that.data.wxSearchData.value, that.data.searchPage, that.data.searchLimit);
          that.setData({
            searchValue: that.data.wxSearchData.value
          })
        } else {
          that.searchRetFun(that.data.cityId, that.data.searchValue, that.data.searchPage, that.data.searchLimit);
        }
        // this.wxSearchFn();
    },
    wxSearchDeleteKey: function (e) {
        var that = this
        WxSearch.wxSearchDeleteKey(e, that);
    },
    wxSearchDeleteAll: function (e) {
        var that = this;
        WxSearch.wxSearchDeleteAll(that);
    },
    wxSearchTap: function (e) {
        var that = this
        WxSearch.wxSearchHiddenPancel(that);
    }
})