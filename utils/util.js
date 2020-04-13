
//获取用户openid
module.exports.getOpenid = function getOpenid() {
    var app = getApp();
}

//获取用户信息授权
module.exports.authorize = function authorize() {
    wx.authorize({
        scope: 'scope.userInfo',
        success() {
            console.log('authorize success(scope.userInfo)');
        },
        fail() {
            console.log('authorize fail(scope.userInfo)');
        }
    })
}

//判断用户是否已有个人信息
module.exports.isHaveResume = function isHaveResume(){
    var app = getApp();
    if (app.globalData.isHaveResume == null){
        app.apiPost(app.apiList.isHaveResume, {
            openid: app.globalData.openid
        }, function (data) {
            if (data.code == 1) {    // 有个人信息
                var x,z,
                    work_history =[],
                    edu_history=[],
                    expected_pos=[];
                for (x in data.ret.work_history) {
                    work_history.push(JSON.parse(data.ret.work_history[x]));
                }
                
                for (z in data.ret.edu_history) {
                    edu_history.push(JSON.parse(data.ret.edu_history[z]));
                }
                data.ret.base_info = JSON.parse(data.ret.base_info);
                data.ret.expected_pos = JSON.parse(data.ret.expected_pos);

                data.ret.work_history = work_history;
                data.ret.edu_history = edu_history;
                
                app.globalData.isHaveResume = data.ret;

            } else if (data.code == 0) {   // 没有个人信息
                app.globalData.isHaveResume = null;
            } else {
                app.alert(data.alertMsg)
            }
        })
    }
    
}

//收集、判断系统信息
module.exports.checkSystemInfo = function checkSystemInfo() {
    var app = getApp();
    var info = wx.getSystemInfoSync();
    console.log("当前系统信息",info);
    //检查微信兼容API
    if (wx.showLoading && wx.hideLoading && wx.reLaunch) {
    } else {
        app.alert('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。');
    }
    app.globalData.systemInfo = info;
}

//检查页面层级
module.exports.checkPage = function checkPage() {
    var e = getCurrentPages();
    var l = e.length;
    console.log('当前页面层级' + l);
    console.log(e);
}

