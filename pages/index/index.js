// index.js
var app = getApp();
const strat_data = require("../../data/data");
const imgs = ["/icons/up_arrow.png", "/icons/up_arrow_pressed.png"];
const styles = [
    "transform: rotate(0deg);",
    "transform: rotate(-90deg);",
    "transform: rotate(90deg);",
    "transform: rotate(180deg);"
];
var _cmd = "";
var is_timeout = false;
var ip = "";
var interval = 0;
var orientation = "lat";
var strat_key = "";

Page({
    data: {
        // arrow imgs
        arrow_img: [
            "/icons/up_arrow.png",
            "/icons/up_arrow.png",
            "/icons/up_arrow.png",
            "/icons/up_arrow.png"
        ],
        // strat imgs
        strats: [{}, {}, {}, {}, {}, {}, {}, {}],
        current_cmd: [],
        current_style: "",
        info_style: "",
        info_arrow_style: "width: 22pt; height: 22pt;",
        setting_style: "",
        setting_text_style: "",
        current_master_style: "",
        remoter_style: "",
        strat_style: "",
        info_master_style: ""
    },
    onLoad() {
        wx.setKeepScreenOn({
            keepScreenOn: true
        });

        ip = wx.getStorageSync("ip");

        var strats = wx.getStorageSync("strats");
        if (strats == "") {
            console.log("no strats");
            wx.setStorageSync("strats", this.data.strats);
        } else {
            this.setData({
                strats: strats
            });
        }

        interval = wx.getStorageSync("interval");
        if (interval == "") {
            console.log("default interval 200");
            interval = 200;
            wx.setStorageSync("interval", interval);
        }

        orientation = wx.getStorageSync("orientation");
        if (orientation == "") {
            console.log("default orientation lateral");
            orientation = "lat";
            wx.setStorageSync("orientation", orientation);
        }
        this.rotate_screen();

        strat_key = wx.getStorageSync("strat_key");
        if (strat_key == "") {
            console.log("default stratagem key ctrl");
            strat_key = "ctrlleft";
            wx.setStorageSync("strat_key", strat_key);
        }
    },
    arrow_click(event) {
        if (is_timeout) {
            return;
        }
        if (_cmd.length == 0) {
            this.send_first();
        }
        var btn_id = event.currentTarget.id;
        var num_id = this.dir_to_id(btn_id);
        this.set_img_with_dir(num_id, true);
    },
    arrow_click_up(event) {
        var btn_id = event.currentTarget.id;
        var num_id = this.dir_to_id(btn_id);
        this.check_cmd(this.id_to_cmd(num_id));
        this.set_img_with_dir(num_id, false);
        if (is_timeout) {
            return;
        }
    },
    strat_click(event) {
        if (is_timeout) {
            console.log("busy");
            return;
        }
        var strat = this.data.strats[parseInt(event.currentTarget.id)];
        if (strat.cmd == undefined) {
            console.log("empty slot");
            return;
        }

        this.send_first();

        console.log(`sending strat with interval ${interval}`);
        is_timeout = true;
        console.log(strat)

        for (var i = 0; i < strat.cmd.length; i++) {
            console.log(`timeout set ${(i + 1) * interval}`)
            setTimeout(this.check_cmd, (i + 1) * interval, strat.cmd[i]);
        }
    },
    strat_hold(event) {
        if (is_timeout) {
            return;
        }
        wx.navigateTo({
            url: "/pages/strats/index",
            events: {
                callback: res => {
                    console.log(res.data);
                    var strats = this.data.strats;
                    strats[parseInt(event.currentTarget.id)] = res.data;
                    this.setData({
                        strats: strats
                    });
                    wx.setStorageSync("strats", this.data.strats)
                }
            }
        });
    },
    set_img_with_dir(id, is_pressed) {
        var list = this.data.arrow_img;
        if (is_pressed) {
            list[id] = imgs[1];
        } else {
            list[id] = imgs[0];
        }
        this.setData({
            arrow_img: list
        });
    },
    dir_to_id(dir) {
        switch (dir) {
            case "up":
                return 0;
            case "left":
                return 1;
            case "right":
                return 2;
            case "down":
                return 3;
        }
    },
    id_to_cmd(id) {
        switch (id) {
            case 0:
                return "8";
            case 1:
                return "4";
            case 2:
                return "6";
            case 3:
                return "2";
        }
    },
    cmd_to_id(cmd) {
        switch (cmd) {
            case "8":
                return 0;
            case "4":
                return 1;
            case "6":
                return 2;
            case "2":
                return 3;
        }
    },
    display_current(id, src = null) {
        var cmd = this.data.current_cmd;
        var input = {
            src: "",
            style: ""
        };
        if (src == null) {
            input.src = imgs[0];
            input.style = styles[id];
        } else {
            input.src = src;
            input.style = styles[0];
        }
        cmd.push(input);
        this.setData({
            current_cmd: cmd
        });
    },
    check_cmd(input) {
        _cmd = _cmd + input;
        // console.log(_cmd);
        this.display_current(this.cmd_to_id(input));
        this.send_key(input);
        var is_bad = true;
        for (var i in strat_data.data) {
            if (_cmd == strat_data.data[i].cmd) {
                this.display_current(0, strat_data.data[i].icon);
                console.log(`sending finish ${i}, timeout ${interval}`);
                setTimeout(this.send_finish, interval, i, false);
                setTimeout(this.clear_cmd, 500);
                is_timeout = true;
                this.setData({
                    current_style: "border: 3px solid #17cf6b;"
                })
                is_bad = false;
            } else if (strat_data.data[i].cmd.startsWith(_cmd)) {
                is_bad = false;
            }
        }
        if (is_bad) {
            this.setData({
                current_style: "border: 3px solid #ff0000;"
            });
            setTimeout(this.send_finish, interval, "", false);
            setTimeout(this.clear_cmd, 500)
            is_timeout = true;
        }
    },
    clear_cmd() {
        _cmd = "";
        is_timeout = false;
        this.setData({
            current_cmd: [],
            current_style: "border: 3px solid #eeee33;"
        })
    },
    send_key(input) {
        console.log(`sending key ${input} to ${ip}`)
        wx.request({
            url: `http://${ip}:2828`,
            method: "POST",
            data: JSON.stringify({
                key: `num${input}`,
                is_key: true,
                is_first: false,
                text: ""
            }),
            timeout: 1000,
            fail: this.post_fail
        });
    },
    send_first() {
        console.log(`sending key ${strat_key} to ${ip}`)
        wx.request({
            url: `http://${ip}:2828`,
            method: "POST",
            data: JSON.stringify({
                key: `${interval}`,
                is_key: false,
                is_first: true,
                text: ""
            }),
            timeout: 1000,
            fail: this.post_fail
        });
    },
    setting_click(event) {
        wx.navigateTo({
            url: "/pages/setting/index",
            events: {
                callback: () => {
                    console.log("setting updated")
                    ip = wx.getStorageSync("ip");
                    interval = parseInt(wx.getStorageSync("interval"));
                    if (orientation != wx.getStorageSync("orientation")) {
                        console.log("screen orientation changed");
                    }
                    orientation = wx.getStorageSync("orientation");
                    this.rotate_screen();
                    strat_key = wx.getStorageSync("strat_key");
                },
                clear: () => {
                    this.setData({
                        strats: [{}, {}, {}, {}, {}, {}, {}, {}]
                    });
                    wx.setStorageSync("strats", this.data.strats);
                }
            }
        });
    },
    rotate_screen() {
        switch (orientation) {
            case "lat":
                console.log("lat screen");
                this.setData({
                    info_style: "",
                    info_arrow_style: "width: 22pt; height: 22pt;",
                    setting_style: "",
                    setting_text_style: "",
                    current_master_style: "",
                    remoter_style: "",
                    strat_style: ""
                });
                break;
            case "ver":
                console.log("ver screen");
                this.setData({
                    info_style: "transform: rotate(90deg); left: 57.5vw; top: 64vw; width: 80vw; font-size: 7pt;",
                    info_arrow_style: "width: 10pt; height: 10pt;",
                    setting_style: "transform: rotate(90deg); height: 18vw; right: 5.9vw; top: 1vw;",
                    setting_text_style: "top: 5vw;",
                    current_master_style: "transform: rotate(90deg); bottom: 85.5vw; left: 58vw; height: 18vw; width: 87vw;",
                    remoter_style: "transform: rotate(90deg); width: 110vw; left: -23vw; bottom: 47vw;",
                    strat_style: "transform: rotate(90deg);"
                });
                break;
        }
    },
    post_fail() {
        wx.showModal({
            title: "警告",
            content: "连接主机IP超时，请确认主机IP设置正确并且主机服务端已启动",
            showCancel: false,
            success: res => {
                if (res.confirm) {
                    wx.redirectTo({
                        url: "/pages/index/index"
                    });
                }
            }
        })
    },
    send_finish(strat, is_bad) {
        console.log(`sending text ${strat} to ${ip}`)
        if (is_bad) {
            wx.request({
                url: `http://${ip}:2828`,
                method: "POST",
                data: JSON.stringify({
                    key: "",
                    is_key: false,
                    is_first: false,
                    text: "invalid stratagem"
                }),
                timeout: 2000,
                fail: this.post_fail
            });
        } else {
            wx.request({
                url: `http://${ip}:2828`,
                method: "POST",
                data: JSON.stringify({
                    key: "",
                    is_key: false,
                    is_first: false,
                    text: `calling ${strat}`
                }),
                timeout: 2000,
                fail: this.post_fail
            });
        }
    }
})