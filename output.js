//Tue Jul 23 2024 14:11:27 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
const $ = new Env("当日收支查询");
const jdCookie = require("./jdCookie"),
  notify = require("./utils/Rebels_sendJDNotify"),
  common = require("./utils/Rebels_jdCommon"),
  isNotify = process.env.jd_querryBeans_notify === "true",
  todayString = $.time("yyyy-MM-dd", Date.now());
let cookie = "";
const cookiesArr = Object.keys(jdCookie).map(_0x313ad7 => jdCookie[_0x313ad7]).filter(_0x13c269 => _0x13c269);
!cookiesArr[0] && ($.msg($.name, "【提示】请先获取Cookie"), process.exit(1));
!(async () => {
  $.ieList = [];
  notify.config({
    title: $.name
  });
  for (let _0x502147 = 0; _0x502147 < cookiesArr.length; _0x502147++) {
    $.index = _0x502147 + 1;
    cookie = cookiesArr[_0x502147];
    common.setCookie(cookie);
    $.UserName = decodeURIComponent(common.getCookieValue(cookie, "pt_pin"));
    $.UA = common.genUA($.UserName);
    $.message = notify.create($.index, $.UserName);
    $.nickName = "";
    console.log("\n******开始【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "******\n");
    $.JEC = common.getJEC($.UserName);
    $.JEH = common.getJEH();
    await Main();
    common.unsetCookie();
    if ($.runEnd) {
      break;
    }
    await $.wait(1000);
  }
  const _0xb0cc4a = notify.getMessage();
  _0xb0cc4a && (console.log("\n📣 运行结果\n" + _0xb0cc4a.replace(/：/, " ➜ ")), isNotify && (await notify.push()));
})().catch(_0x481b69 => $.logErr(_0x481b69)).finally(() => $.done());
async function Main() {
  try {
    $.querryError = false;
    const _0x4c333b = await common.getLoginStatus(cookie);
    if (!_0x4c333b && typeof _0x4c333b === "boolean") {
      console.log("账号无效");
      return;
    }
    let _0x9bafe7 = new Map();
    _0x450df7: for (let _0x1fe8b8 = 1; _0x1fe8b8 <= 20; _0x1fe8b8++) {
      $.pageNum = "" + _0x1fe8b8;
      $.detailList = [];
      await sendRequest("beanDetail");
      const _0x419a85 = $.detailList;
      if (_0x419a85.length === 0) {
        break;
      }
      for (let _0x484f67 of _0x419a85) {
        let _0x205724 = _0x484f67.date.split(" ")[0];
        if (_0x205724 === todayString) {
          _0x484f67.amount = parseInt(_0x484f67.amount);
          _0x9bafe7[_0x484f67.eventMassage] ? (_0x9bafe7[_0x484f67.eventMassage].amount += _0x484f67.amount, new Date(_0x9bafe7[_0x484f67.eventMassage].date) < new Date(_0x484f67.date) && (_0x9bafe7[_0x484f67.eventMassage].date = _0x484f67.date)) : _0x9bafe7[_0x484f67.eventMassage] = {
            ..._0x484f67
          };
        } else {
          break _0x450df7;
        }
      }
      $.wait(1000);
    }
    const _0x40fe95 = Object.values(_0x9bafe7);
    if (_0x40fe95.length > 0) {
      let _0x27970c = [],
        _0x181e92 = 0,
        _0x2e178f = 0;
      for (const _0x343b08 of _0x40fe95) {
        let {
          date: _0x104ce0,
          amount: _0x5c4ae7,
          eventMassage: _0x12c165
        } = _0x343b08;
        _0x5c4ae7 > 0 ? _0x181e92 += _0x5c4ae7 : _0x2e178f += _0x5c4ae7;
        _0x12c165 = _0x12c165.replace(/（商品:.*）/g, "").replace(/订单.*使用京豆.*个/g, "订单使用京豆");
        /参加\[.*\].*-奖励/.test(_0x12c165) && (_0x12c165 = _0x12c165.replace(/参加\[/g, "").replace(/\].*/g, ""));
        _0x104ce0 = _0x104ce0.split(" ")[1];
        _0x27970c.push({
          "时间": _0x104ce0,
          "渠道": _0x12c165,
          "明细": _0x5c4ae7
        });
      }
      _0x27970c.sort((_0x536307, _0x232f57) => _0x232f57["明细"] - _0x536307["明细"]);
      _0x27970c.forEach(_0x41f3ed => {
        console.log(_0x41f3ed["渠道"] + "[" + _0x41f3ed["明细"] + "京豆](" + _0x41f3ed["时间"] + ")");
      });
      console.log("\n今日总收入：" + _0x181e92 + " 京豆 🐶 今日总支出：" + _0x2e178f + "京豆 🐶");
      $.message.insert("今日总收入 " + _0x181e92 + "京豆 🐶");
      $.message.insert("今日总支出 " + _0x2e178f + "京豆 🐶");
    } else {
      !$.querryError && console.log("未查询到今日京豆变动明细数据，快去参与活动获取吧~");
    }
  } catch (_0x207b3f) {
    console.log("❌ 脚本运行遇到了错误\n" + _0x207b3f);
  }
}
async function handleResponse(_0x1cece6, _0x560fa0) {
  try {
    switch (_0x1cece6) {
      case "beanDetail":
        if (_0x560fa0.code === "0") {
          $.detailList = _0x560fa0.jingDetailList;
        } else {
          _0x560fa0.code === "1" ? console.log("查询异常") : console.log("❓" + _0x1cece6 + " " + JSON.stringify(_0x560fa0));
        }
        break;
    }
  } catch (_0x1d09c5) {
    console.log("❌ 未能正确处理 " + _0x1cece6 + " 请求响应 " + (_0x1d09c5.message || _0x1d09c5));
  }
}
async function sendRequest(_0x559504) {
  if ($.runEnd || $.outFlag) {
    return;
  }
  let _0x1772b3 = "",
    _0x5cf1be = null,
    _0x31937e = null,
    _0x253e3c = "GET";
  switch (_0x559504) {
    case "beanDetail":
      _0x1772b3 = "https://bean.m.jd.com/beanDetail/detail.json";
      _0x31937e = {
        page: $.pageNum
      };
      break;
    default:
      console.log("❌ 未知请求 " + _0x559504);
      return;
  }
  const _0x58b5bd = {
    url: _0x1772b3,
    method: _0x253e3c,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-Hans-CN;q=1, zh-Hant-CN;q=0.9, en-CN;q=0.8",
      Connection: "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "J-E-H": $.JEH,
      "J-E-C": $.JEC,
      Cookie: cookie,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent": $.UA
    },
    params: _0x31937e,
    data: _0x5cf1be,
    timeout: 30000
  };
  _0x253e3c === "GET" && (delete _0x58b5bd.data, delete _0x58b5bd.headers["Content-Type"]);
  const _0x233f9f = 1;
  let _0x55946 = 0,
    _0x4b8f2f = null,
    _0x1ab035 = false;
  while (_0x55946 < _0x233f9f) {
    _0x55946 > 0 && (await $.wait(1000));
    const _0x5c9e65 = await common.request(_0x58b5bd);
    if (!_0x5c9e65.success) {
      _0x4b8f2f = "🚫 " + _0x559504 + " 请求失败 ➜ " + _0x5c9e65.error;
      _0x55946++;
      _0x5c9e65.status && _0x5c9e65.status === 403 && ($.querryError = true);
      continue;
    }
    if (!_0x5c9e65.data) {
      _0x4b8f2f = "🚫 " + _0x559504 + " 请求失败 ➜ 无响应数据";
      _0x55946++;
      continue;
    }
    await handleResponse(_0x559504, _0x5c9e65.data);
    _0x1ab035 = false;
    break;
  }
  _0x55946 >= _0x233f9f && (console.log(_0x4b8f2f), _0x1ab035 && ($.outFlag = true, $.message && $.message.fix(_0x4b8f2f)));
}
function Env(t, e) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class s {
    constructor(t) {
      this.env = t;
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? {
        url: t
      } : t;
      let s = this.get;
      "POST" === e && (s = this.post);
      return new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s);
        });
      });
    }
    get(t) {
      return this.send.call(this.env, t);
    }
    post(t) {
      return this.send.call(this.env, t, "POST");
    }
  }
  return new class {
    constructor(t, e) {
      this.name = t;
      this.http = new s(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, e);
      this.log("", `🔔${this.name}, 开始!`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    toObj(t, e = null) {
      try {
        return JSON.parse(t);
      } catch {
        return e;
      }
    }
    toStr(t, e = null) {
      try {
        return JSON.stringify(t);
      } catch {
        return e;
      }
    }
    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i) {
        try {
          s = JSON.parse(this.getdata(t));
        } catch {}
      }
      return s;
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e);
      } catch {
        return !1;
      }
    }
    getScript(t) {
      return new Promise(e => {
        this.get({
          url: t
        }, (t, s, i) => e(i));
      });
    }
    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = r ? 1 * r : 20;
        r = e && e.timeout ? e.timeout : r;
        const [o, h] = i.split("@"),
          n = {
            url: `http://${h}/v1/scripting/evaluate`,
            body: {
              script_text: t,
              mock_type: "cron",
              timeout: r
            },
            headers: {
              "X-Key": o,
              Accept: "*/*"
            }
          };
        this.post(n, (t, e, i) => s(i));
      }).catch(t => this.logErr(t));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e);
        if (!s && !i) {
          return {};
        }
        {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (t) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e),
          r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r);
      }
    }
    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i) if (r = Object(r)[t], void 0 === r) {
        return s;
      }
      return r;
    }
    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t);
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
          r = s ? this.getval(s) : "";
        if (r) {
          try {
            const t = JSON.parse(r);
            e = t ? this.lodash_get(t, i, "") : e;
          } catch (t) {
            e = "";
          }
        }
      }
      return e;
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
          o = this.getval(i),
          h = i ? "null" === o ? null : o || "{}" : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t);
          s = this.setval(JSON.stringify(e), i);
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t);
          s = this.setval(JSON.stringify(o), i);
        }
      } else {
        s = this.setval(t, e);
      }
      return s;
    }
    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null;
    }
    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null;
    }
    initGotEnv(t) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar));
    }
    get(t, e = () => {}) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status);
        e(t, s, i);
      })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o);
      }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            s && this.ckjar.setCookieSync(s, null);
            e.cookieJar = this.ckjar;
          }
        } catch (t) {
          this.logErr(t);
        }
      }).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o);
      }, t => {
        const {
          message: s,
          response: i
        } = t;
        e(s, i, i && i.body);
      }));
    }
    post(t, e = () => {}) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(t, (t, s, i) => {
          !t && s && (s.body = i, s.statusCode = s.status);
          e(t, s, i);
        });
      } else {
        if (this.isQuanX()) {
          t.method = "POST";
          this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
            hints: !1
          }));
          $task.fetch(t).then(t => {
            const {
              statusCode: s,
              statusCode: i,
              headers: r,
              body: o
            } = t;
            e(null, {
              status: s,
              statusCode: i,
              headers: r,
              body: o
            }, o);
          }, t => e(t));
        } else {
          if (this.isNode()) {
            this.initGotEnv(t);
            const {
              url: s,
              ...i
            } = t;
            this.got.post(s, i).then(t => {
              const {
                statusCode: s,
                statusCode: i,
                headers: r,
                body: o
              } = t;
              e(null, {
                status: s,
                statusCode: i,
                headers: r,
                body: o
              }, o);
            }, t => {
              const {
                message: s,
                response: i
              } = t;
              e(s, i, i && i.body);
            });
          }
        }
      }
    }
    time(t, e = null) {
      const s = e ? new Date(e) : new Date();
      let i = {
        "M+": s.getMonth() + 1,
        "d+": s.getDate(),
        "H+": s.getHours(),
        "m+": s.getMinutes(),
        "s+": s.getSeconds(),
        "q+": Math.floor((s.getMonth() + 3) / 3),
        S: s.getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
      return t;
    }
    msg(e = t, s = "", i = "", r) {
      const o = t => {
        if (!t) {
          return t;
        }
        if ("string" == typeof t) {
          return this.isLoon() ? t : this.isQuanX() ? {
            "open-url": t
          } : this.isSurge() ? {
            url: t
          } : void 0;
        }
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return {
              openUrl: e,
              mediaUrl: s
            };
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return {
              "open-url": e,
              "media-url": s
            };
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {
              url: e
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
        let t = ["", "==============📣系统通知📣=============="];
        t.push(e);
        s && t.push(s);
        i && t.push(i);
        console.log(t.join("\n"));
        this.logs = this.logs.concat(t);
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]);
      console.log(t.join(this.logSeparator));
    }
    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t);
    }
    wait(t) {
      return new Promise(e => setTimeout(e, t));
    }
    done(t = {}) {
      const e = new Date().getTime(),
        s = (e - this.startTime) / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`);
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
    }
  }(t, e);
}