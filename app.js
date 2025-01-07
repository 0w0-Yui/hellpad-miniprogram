// app.js
App({
    globalData: {},

    onLaunch() {
        wx.setKeepScreenOn({
            keepScreenOn: true
        });
        wx.redirectTo("/pages/boot/index");
    }
})