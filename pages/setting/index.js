// pages/setting/index.js

const keys = ['\t', '\n', '\r', ' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', 'accept', 'add', 'alt', 'altleft', 'altright', 'apps', 'backspace', 'browserback', 'browserfavorites', 'browserforward', 'browserhome', 'browserrefresh', 'browsersearch', 'browserstop', 'capslock', 'clear', 'convert', 'ctrl', 'ctrlleft', 'ctrlright', 'decimal', 'del', 'delete', 'divide', 'down', 'end', 'enter', 'esc', 'escape', 'execute', 'f1', 'f10', 'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17', 'f18', 'f19', 'f2', 'f20', 'f21', 'f22', 'f23', 'f24', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'final', 'fn', 'hanguel', 'hangul', 'hanja', 'help', 'home', 'insert', 'junja', 'kana', 'kanji', 'launchapp1', 'launchapp2', 'launchmail', 'launchmediaselect', 'left', 'modechange', 'multiply', 'nexttrack', 'nonconvert', 'num0', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8', 'num9', 'numlock', 'pagedown', 'pageup', 'pause', 'pgdn', 'pgup', 'playpause', 'prevtrack', 'print', 'printscreen', 'prntscrn', 'prtsc', 'prtscr', 'return', 'right', 'scrolllock', 'select', 'separator', 'shift', 'shiftleft', 'shiftright', 'sleep', 'space', 'stop', 'subtract', 'tab', 'up', 'volumedown', 'volumemute', 'volumeup', 'win', 'winleft', 'winright', 'yen', 'command', 'option', 'optionleft', 'optionright']

Page({

    /**
     * 页面的初始数据
     */
    data: {
        current_ip: "",
        interval: 200,
        orientation: "lat",
        lat_checked: true,
        ver_checked: false,
        strat_key: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var ip = wx.getStorageSync("ip");
        var interval = wx.getStorageSync("interval");
        var orientation = wx.getStorageSync("orientation");
        var strat_key = wx.getStorageSync("strat_key");
        this.setData({
            current_ip: ip,
            interval: interval,
            orientation: orientation,
            lat_checked: orientation == "lat",
            ver_checked: orientation == "ver",
            strat_key: strat_key
        });
    },
    save_click() {
        if (keys.indexOf(this.data.strat_key) == -1) {
            wx.showModal({
                title: "警告",
                content: `非法战备按键，请选择以下按键输入：\n${keys}`,
                showCancel: false
            })
            return;
        }
        wx.setStorageSync("ip", this.data.current_ip);
        wx.setStorageSync("interval", this.data.interval);
        wx.setStorageSync("orientation", this.data.orientation);
        wx.setStorageSync("strat_key", this.data.strat_key);
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit("callback");
        wx.navigateBack();
    },
    clear_click() {
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit("clear");
        wx.navigateBack();
    },
    ip_change(e) {
        this.setData({
            current_ip: e.detail.value
        });
    },
    strat_change(e) {
        this.setData({
            strat_key: e.detail.value
        });
    },
    interval_change(e) {
        this.setData({
            interval: parseInt(e.detail.value)
        });
    },
    screen_change(e) {
        this.setData({
            orientation: e.detail.value
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})