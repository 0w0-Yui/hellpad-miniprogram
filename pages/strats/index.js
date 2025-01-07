// pages/strats/index.js
var app = getApp();
const strat_data = require("../../data/data");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        strat_data: {},
        cmd: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var list = [];
        for (var strat in strat_data.data) {
            var dict = {
                id: strat,
                src: strat_data.data[strat].icon,
                cmd: strat_data.data[strat].cmd
            };
            list.push(dict);
        }
        this.setData({
            strat_data: list
        });
    },
    strat_selected(event) {
        // console.log(this.data.strat_data[parseInt(event.currentTarget.id)])
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit("callback", {data: this.data.strat_data[parseInt(event.currentTarget.id)]});
        wx.navigateBack();
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