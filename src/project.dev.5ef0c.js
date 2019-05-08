window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  CCLoaderHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "466ffBi5YpBIrr7cmYM6ixL", "CCLoaderHelper");
    "use strict";
    module.exports.getRes = function(path, type, cb) {
      var res = cc.loader.getRes(path);
      if (null == res) {
        cc.loader.loadRes(path, type, cb);
        return;
      }
      cb && cb();
    };
    cc._RF.pop();
  }, {} ],
  ChooseGame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a111cd8s6BPcL0u99YBbU7O", "ChooseGame");
    "use strict";
    cc.Class({
      extends: require("CustomScene"),
      properties: {},
      start: function start() {},
      onDestroy: function onDestroy() {
        this._super();
      },
      onLoad: function onLoad() {
        this._super();
      },
      onSetting: function onSetting() {
        PBHelper.addNode("DlgSetting");
      }
    });
    cc._RF.pop();
  }, {
    CustomScene: "CustomScene"
  } ],
  ComChooseGameState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0b13b828+ZLurZpWRfKp/jc", "ComChooseGameState");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.ndStateDown = cc.find("ndStateDown", this.node);
        this.ndDownload = cc.find("ndDownload", this.node);
        this.pbBar = cc.find("ndBar", this.ndDownload).getComponent(cc.ProgressBar);
      },
      initState: function initState(state) {},
      showCouldDownload: function showCouldDownload(show) {
        this.ndStateDown.active = show;
      },
      showDownloading: function showDownloading(show, num) {
        this.ndDownload.active = show;
        show && (this.pbBar.progress = num);
      }
    });
    cc._RF.pop();
  }, {} ],
  ComHotUpdate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c8770pAkS5AMayNo6eBw6CD", "ComHotUpdate");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        lbTitle: cc.Label,
        lbInfo: cc.Label,
        ndCheckingError: cc.Node,
        ndBtnSure: cc.Node,
        ndBtnRetry: cc.Node,
        ndBar: cc.Node,
        pBar: cc.ProgressBar,
        lbPer: cc.Label,
        manifest: {
          type: cc.Asset,
          default: null
        },
        _updating: false,
        _canRetry: false,
        _storagePath: "",
        _retryTime: 10,
        _needUpdate: false,
        _faildRes: ""
      },
      onLoad: function onLoad() {
        this.loadingScene = this.node.getComponent("LoadingScene");
        this.manifestUrl = this.manifest.nativeUrl;
        this.ndBar.active = false;
      },
      onDestroy: function onDestroy() {
        if (this._updateListener) {
          this._assetsMgr.setEventCallback(null);
          this._updateListener = null;
        }
        this._assetsMgr && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS;
      },
      check: function check() {
        console.log("\u5f00\u59cb\u68c0\u67e5\u66f4\u65b0");
        if (!cc.sys.isNative) {
          this.next();
          console.log("\u975e\u79fb\u52a8\u8bbe\u5907\uff0c\u505c\u6b62\u68c0\u67e5\u66f4\u65b0");
          return;
        }
        this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "update/hall";
        cc.log("@Storage path for remote asset : " + this._storagePath);
        cc.log("@Project url:" + this.manifestUrl);
        this._assetsMgr = new jsb.AssetsManager(this.manifestUrl, this._storagePath, this._versionCompare.bind(this));
        !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS;
        this._assetsMgr.setVerifyCallback(this._cbVerify);
        cc.sys.os === cc.sys.OS_ANDROID && this._assetsMgr.setMaxConcurrentTask(5);
        this._showRetry(false);
        this.checkUpdate();
      },
      next: function next() {
        this.loadingScene.loadGame();
      },
      checkUpdate: function checkUpdate() {
        if (this._updating) {
          this.lbInfo.string = "\u68c0\u67e5\u66f4\u65b0\u4e2d...";
          console.log("\u68c0\u67e5\u66f4\u65b0\u4e2d");
          return;
        }
        if (this._assetsMgr.getState() === jsb.AssetsManager.State.UNINITED) {
          cc.loader.md5Pipe && (this.manifestUrl = cc.loader.md5Pipe.transformURL(this.manifestUrl));
          this._assetsMgr.loadLocalManifest(this.manifestUrl);
        }
        if (!this._assetsMgr.getLocalManifest() || !this._assetsMgr.getLocalManifest().isLoaded()) {
          this.lbInfo.string = "\u5bfc\u5165\u6587\u4ef6\u5931\u8d25\uff0c\u5efa\u8bae\u91cd\u542f\u6e38\u620f\u6216\u91cd\u65b0\u4e0b\u8f7d\u6700\u65b0\u7248\u672c";
          return;
        }
        this._assetsMgr.setEventCallback(this._cbCheckUpdate.bind(this));
        this._assetsMgr.checkUpdate();
        this._updating = true;
      },
      hotUpdate: function hotUpdate() {
        if (this._assetsMgr && !this._updating) {
          this.ndBar.active = true;
          console.log("\u5f00\u59cb\u66f4\u65b0");
          this._assetsMgr.setEventCallback(this._cbUpdate.bind(this));
          if (this._assetsMgr.getState() === jsb.AssetsManager.State.UNINITED) {
            cc.loader.md5Pipe && (this.manifestUrl = cc.loader.md5Pipe.transformURL(this.manifestUrl));
            this._assetsMgr.loadLocalManifest(this.manifestUrl);
          }
          this._failCount = 0;
          this._assetsMgr.update();
          this._updating = true;
        }
      },
      retry: function retry() {
        if (gLocalData.userInfo.hotFailRes == this._faildRes && gLocalData.userInfo.hotFaildNum >= 2) {
          gLocalData.userInfo.hotFailRes = "";
          gLocalData.userInfo.hotFaildNum = 0;
          DataHelper.saveAllData();
          jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath());
        } else {
          gLocalData.userInfo.hotFailRes = this._faildRes;
          gLocalData.userInfo.hotFaildNum++;
          DataHelper.saveAllData();
        }
        cc.game.restart();
      },
      _showRetry: function _showRetry() {
        var show = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
      },
      _showRetryPanel: function _showRetryPanel() {
        var show = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
      },
      _cbCheckUpdate: function _cbCheckUpdate(event) {
        cc.log("Code: " + event.getEventCode());
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          this.lbInfo.string = "\u5df2\u7ecf\u662f\u6700\u65b0\u7248";
          this.next();
          console.log("ios10\u4e2d\uff0c\u5728\u5f39\u51fa\u662f\u5426\u5141\u8bb8\u8054\u7f51\u4e4b\u524d\uff0c\u4f1a\u62a5 \u5df2\u7ecf\u662f\u6700\u65b0\u7248");
          break;

         case jsb.EventAssetsManager.NEW_VERSION_FOUND:
          this._showRetry(false);
          this.pBar.progress = 0;
          this._needUpdate = true;
          break;

         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
          this.lbInfo.string = "ios10\u4e2d\u4e0b\u8f7d\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc";
          console.log("ios10\u4e2d\uff0c\u5728\u5f39\u51fa\u662f\u5426\u5141\u8bb8\u8054\u7f51\u4e4b\u524d\uff0c\u4f1a\u62a5 \u4e0b\u8f7d\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc");
          this._showRetryPanel(true);
          break;

         default:
          return;
        }
        this._assetsMgr.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
        this.hotUpdate();
      },
      _cbUpdate: function _cbUpdate(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.UPDATE_PROGRESSION:
          this.pBar.progress = event.getPercent();
          this.loadingScene.lbPer.string = "\u8d44\u6e90\u52a0\u8f7d\u4e2d,\u7cbe\u5f69\u5373\u5c06\u5f00\u542f\xb7\xb7\xb7";
          console.log("\u66f4\u65b0\u7684\u56de\u8c03 \u8d44\u6e90\u52a0\u8f7d\u4e2d,\u7cbe\u5f69\u5373\u5c06\u5f00\u542f\xb7\xb7\xb7");
          break;

         case jsb.EventAssetsManager.UPDATE_FINISHED:
          this.lbInfo.string = "\u66f4\u65b0\u5b8c\u6210\uff1a" + event.getMessage();
          needRestart = true;
          console.log("\u66f4\u65b0\u7684\u56de\u8c03 \u66f4\u65b0\u5b8c\u6210 " + event.getMessage());
          break;

         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          this.lbInfo.string = "\u5df2\u7ecf\u662f\u6700\u65b0\u7248";
          failed = true;
          console.log("\u66f4\u65b0\u7684\u56de\u8c03 \u5df2\u7ecf\u662f\u6700\u65b0\u7248 ");
          break;

         case jsb.EventAssetsManager.UPDATE_FAILED:
          this.lbInfo.string = "\u66f4\u65b0\u5931\u8d25\uff1a " + event.getMessage();
          this._updating = false;
          this._canRetry = true;
          failed = true;
          console.log("\u66f4\u65b0\u7684\u56de\u8c03 \u66f4\u65b0\u5931\u8d25\uff1a " + event.getMessage());
          break;

         case jsb.EventAssetsManager.ERROR_UPDATING:
          this._faildRes = event.getAssetId();
          this.lbInfo.string = "Asset update error: " + event.getAssetId() + ", " + event.getMessage();
          console.log("11111 Asset update error: " + event.getAssetId() + ", " + event.getMessage());
          failed = true;
          break;

         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
         case jsb.EventAssetsManager.ERROR_DECOMPRESS:
          this.lbInfo.string = "\u66f4\u65b0\u7684\u56de\u8c03 \u4e0b\u8f7d\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc";
          failed = true;
          console.log("\u66f4\u65b0\u7684\u56de\u8c03 \u4e0b\u8f7d\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc");
        }
        if (failed) {
          this._assetsMgr.setEventCallback(null);
          this._updateListener = null;
          this._updating = false;
          this.retry();
        }
        if (needRestart) {
          this._assetsMgr.setEventCallback(null);
          this._updateListener = null;
          gLocalData.userInfo.hotFailRes = "";
          gLocalData.userInfo.hotFaildNum = 0;
          DataHelper.saveAllData();
          var searchPaths = jsb.fileUtils.getSearchPaths();
          var newPaths = this._assetsMgr.getLocalManifest().getSearchPaths();
          cc.log(JSON.stringify(newPaths));
          Array.prototype.unshift(searchPaths, newPaths);
          cc.sys.localStorage.setItem("downloadedhall", "hall");
          cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(searchPaths));
          jsb.fileUtils.setSearchPaths(searchPaths);
          cc.audioEngine.stopAll();
          cc.game.restart();
          console.log("\u91cd\u542f\u6e38\u620f");
        }
      },
      _cbVerify: function _cbVerify(path, asset) {
        var compressed = asset.compressed;
        var expectedMD5 = asset.md5;
        var relativePath = asset.path;
        var size = asset.size;
        if (compressed) {
          cc.log("Verification passed : " + relativePath);
          return true;
        }
        cc.log("Verification passed : " + relativePath + " (" + expectedMD5 + ")");
        return true;
      },
      _versionCompare: function _versionCompare(versionA, versionB) {
        cc.log("JS Custom Version Compare: version A is " + versionA + ", version B is " + versionB);
        var vA = versionA.split(".");
        var vB = versionB.split(".");
        this._currentVersion = versionA;
        this._newestVersion = versionB;
        for (var i = 0; i < vA.length; ++i) {
          var a = parseInt(vA[i]);
          var b = parseInt(vB[i] || 0);
          if (a === b) continue;
          return a - b;
        }
        if (vB.length > vA.length) {
          console.log("\u7248\u672c\u53f7\u4e0d\u76f8\u7b49\uff0c\u5f00\u59cb\u66f4\u65b0");
          return -1;
        }
        console.log("\u7248\u672c\u53f7\u76f8\u7b49\uff0c\u672a\u66f4\u65b0");
        return 0;
      }
    });
    cc._RF.pop();
  }, {} ],
  CryptUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1188d/aFtCh6/9G4u0P2dp", "CryptUtil");
    "use strict";
    var pidCryptUtil = {};
    pidCryptUtil.encodeBase64 = function(str, utf8encode) {
      str || (str = "");
      var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      utf8encode = "undefined" != typeof utf8encode && utf8encode;
      var o1, o2, o3, bits, h1, h2, h3, h4, e = [], pad = "", c, plain, coded;
      plain = utf8encode ? pidCryptUtil.encodeUTF8(str) : str;
      c = plain.length % 3;
      if (c > 0) while (c++ < 3) {
        pad += "=";
        plain += "\0";
      }
      for (c = 0; c < plain.length; c += 3) {
        o1 = plain.charCodeAt(c);
        o2 = plain.charCodeAt(c + 1);
        o3 = plain.charCodeAt(c + 2);
        bits = o1 << 16 | o2 << 8 | o3;
        h1 = bits >> 18 & 63;
        h2 = bits >> 12 & 63;
        h3 = bits >> 6 & 63;
        h4 = 63 & bits;
        e[c / 3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
      }
      coded = e.join("");
      coded = coded.slice(0, coded.length - pad.length) + pad;
      return coded;
    };
    pidCryptUtil.decodeBase64 = function(str, utf8decode) {
      str || (str = "");
      var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      utf8decode = "undefined" != typeof utf8decode && utf8decode;
      var o1, o2, o3, h1, h2, h3, h4, bits, d = [], plain, coded;
      coded = utf8decode ? pidCryptUtil.decodeUTF8(str) : str;
      for (var c = 0; c < coded.length; c += 4) {
        h1 = b64.indexOf(coded.charAt(c));
        h2 = b64.indexOf(coded.charAt(c + 1));
        h3 = b64.indexOf(coded.charAt(c + 2));
        h4 = b64.indexOf(coded.charAt(c + 3));
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
        o1 = bits >>> 16 & 255;
        o2 = bits >>> 8 & 255;
        o3 = 255 & bits;
        d[c / 4] = String.fromCharCode(o1, o2, o3);
        64 == h4 && (d[c / 4] = String.fromCharCode(o1, o2));
        64 == h3 && (d[c / 4] = String.fromCharCode(o1));
      }
      plain = d.join("");
      plain = utf8decode ? pidCryptUtil.decodeUTF8(plain) : plain;
      return plain;
    };
    pidCryptUtil.encodeUTF8 = function(str) {
      str || (str = "");
      str = str.replace(/[\u0080-\u07ff]/g, function(c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(192 | cc >> 6, 128 | 63 & cc);
      });
      str = str.replace(/[\u0800-\uffff]/g, function(c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(224 | cc >> 12, 128 | cc >> 6 & 63, 128 | 63 & cc);
      });
      return str;
    };
    pidCryptUtil.decodeUTF8 = function(str) {
      str || (str = "");
      str = str.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function(c) {
        var cc = (31 & c.charCodeAt(0)) << 6 | 63 & c.charCodeAt(1);
        return String.fromCharCode(cc);
      });
      str = str.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function(c) {
        var cc = (15 & c.charCodeAt(0)) << 12 | (63 & c.charCodeAt(1)) << 6 | 63 & c.charCodeAt(2);
        return String.fromCharCode(cc);
      });
      return str;
    };
    pidCryptUtil.convertToHex = function(str) {
      str || (str = "");
      var hs = "";
      var hv = "";
      for (var i = 0; i < str.length; i++) {
        hv = str.charCodeAt(i).toString(16);
        hs += 1 == hv.length ? "0" + hv : hv;
      }
      return hs;
    };
    pidCryptUtil.convertFromHex = function(str) {
      str || (str = "");
      var s = "";
      for (var i = 0; i < str.length; i += 2) s += String.fromCharCode(parseInt(str.substring(i, i + 2), 16));
      return s;
    };
    pidCryptUtil.stripLineFeeds = function(str) {
      str || (str = "");
      var s = "";
      s = str.replace(/\n/g, "");
      s = s.replace(/\r/g, "");
      return s;
    };
    pidCryptUtil.toByteArray = function(str) {
      str || (str = "");
      var ba = [];
      for (var i = 0; i < str.length; i++) ba[i] = str.charCodeAt(i);
      return ba;
    };
    pidCryptUtil.fragment = function(str, length, lf) {
      str || (str = "");
      if (!length || length >= str.length) return str;
      lf || (lf = "\n");
      var tmp = "";
      for (var i = 0; i < str.length; i += length) tmp += str.substr(i, length) + lf;
      return tmp;
    };
    pidCryptUtil.formatHex = function(str, length) {
      str || (str = "");
      length || (length = 45);
      var str_new = "";
      var j = 0;
      var hex = str.toLowerCase();
      for (var i = 0; i < hex.length; i += 2) str_new += hex.substr(i, 2) + ":";
      hex = this.fragment(str_new, length);
      return hex;
    };
    pidCryptUtil.byteArray2String = function(b) {
      var s = "";
      for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
      return s;
    };
    module.exports = {
      pidCryptUtil: pidCryptUtil
    };
    cc._RF.pop();
  }, {} ],
  CustomScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "215e4UYxN1BrY1WeTgEAJHu", "CustomScene");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      onDisable: function onDisable() {},
      onDestroy: function onDestroy() {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  1: [ function(require, module, exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = "undefined" !== typeof Uint8Array ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len = b64.length;
      if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var validLen = b64.indexOf("=");
      -1 === validLen && (validLen = len);
      var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
      return [ validLen, placeHoldersLen ];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
      for (var i = 0; i < len; i += 4) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      if (2 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = 255 & tmp;
      }
      if (1 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[63 & num];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (255 & uint8[i + 2]);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
      if (1 === extraBytes) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
      } else if (2 === extraBytes) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
      }
      return parts.join("");
    }
  }, {} ],
  2: [ function(require, module, exports) {
    (function(global) {
      "use strict";
      var base64 = require("base64-js");
      var ieee754 = require("ieee754");
      var isArray = require("isarray");
      exports.Buffer = Buffer;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      Buffer.TYPED_ARRAY_SUPPORT = void 0 !== global.TYPED_ARRAY_SUPPORT ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
      exports.kMaxLength = kMaxLength();
      function typedArraySupport() {
        try {
          var arr = new Uint8Array(1);
          arr.__proto__ = {
            __proto__: Uint8Array.prototype,
            foo: function() {
              return 42;
            }
          };
          return 42 === arr.foo() && "function" === typeof arr.subarray && 0 === arr.subarray(1, 1).byteLength;
        } catch (e) {
          return false;
        }
      }
      function kMaxLength() {
        return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
      }
      function createBuffer(that, length) {
        if (kMaxLength() < length) throw new RangeError("Invalid typed array length");
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = new Uint8Array(length);
          that.__proto__ = Buffer.prototype;
        } else {
          null === that && (that = new Buffer(length));
          that.length = length;
        }
        return that;
      }
      function Buffer(arg, encodingOrOffset, length) {
        if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) return new Buffer(arg, encodingOrOffset, length);
        if ("number" === typeof arg) {
          if ("string" === typeof encodingOrOffset) throw new Error("If encoding is specified then the first argument must be a string");
          return allocUnsafe(this, arg);
        }
        return from(this, arg, encodingOrOffset, length);
      }
      Buffer.poolSize = 8192;
      Buffer._augment = function(arr) {
        arr.__proto__ = Buffer.prototype;
        return arr;
      };
      function from(that, value, encodingOrOffset, length) {
        if ("number" === typeof value) throw new TypeError('"value" argument must not be a number');
        if ("undefined" !== typeof ArrayBuffer && value instanceof ArrayBuffer) return fromArrayBuffer(that, value, encodingOrOffset, length);
        if ("string" === typeof value) return fromString(that, value, encodingOrOffset);
        return fromObject(that, value);
      }
      Buffer.from = function(value, encodingOrOffset, length) {
        return from(null, value, encodingOrOffset, length);
      };
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        Buffer.prototype.__proto__ = Uint8Array.prototype;
        Buffer.__proto__ = Uint8Array;
        "undefined" !== typeof Symbol && Symbol.species && Buffer[Symbol.species] === Buffer && Object.defineProperty(Buffer, Symbol.species, {
          value: null,
          configurable: true
        });
      }
      function assertSize(size) {
        if ("number" !== typeof size) throw new TypeError('"size" argument must be a number');
        if (size < 0) throw new RangeError('"size" argument must not be negative');
      }
      function alloc(that, size, fill, encoding) {
        assertSize(size);
        if (size <= 0) return createBuffer(that, size);
        if (void 0 !== fill) return "string" === typeof encoding ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
        return createBuffer(that, size);
      }
      Buffer.alloc = function(size, fill, encoding) {
        return alloc(null, size, fill, encoding);
      };
      function allocUnsafe(that, size) {
        assertSize(size);
        that = createBuffer(that, size < 0 ? 0 : 0 | checked(size));
        if (!Buffer.TYPED_ARRAY_SUPPORT) for (var i = 0; i < size; ++i) that[i] = 0;
        return that;
      }
      Buffer.allocUnsafe = function(size) {
        return allocUnsafe(null, size);
      };
      Buffer.allocUnsafeSlow = function(size) {
        return allocUnsafe(null, size);
      };
      function fromString(that, string, encoding) {
        "string" === typeof encoding && "" !== encoding || (encoding = "utf8");
        if (!Buffer.isEncoding(encoding)) throw new TypeError('"encoding" must be a valid string encoding');
        var length = 0 | byteLength(string, encoding);
        that = createBuffer(that, length);
        var actual = that.write(string, encoding);
        actual !== length && (that = that.slice(0, actual));
        return that;
      }
      function fromArrayLike(that, array) {
        var length = array.length < 0 ? 0 : 0 | checked(array.length);
        that = createBuffer(that, length);
        for (var i = 0; i < length; i += 1) that[i] = 255 & array[i];
        return that;
      }
      function fromArrayBuffer(that, array, byteOffset, length) {
        array.byteLength;
        if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError("'offset' is out of bounds");
        if (array.byteLength < byteOffset + (length || 0)) throw new RangeError("'length' is out of bounds");
        array = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = array;
          that.__proto__ = Buffer.prototype;
        } else that = fromArrayLike(that, array);
        return that;
      }
      function fromObject(that, obj) {
        if (Buffer.isBuffer(obj)) {
          var len = 0 | checked(obj.length);
          that = createBuffer(that, len);
          if (0 === that.length) return that;
          obj.copy(that, 0, 0, len);
          return that;
        }
        if (obj) {
          if ("undefined" !== typeof ArrayBuffer && obj.buffer instanceof ArrayBuffer || "length" in obj) {
            if ("number" !== typeof obj.length || isnan(obj.length)) return createBuffer(that, 0);
            return fromArrayLike(that, obj);
          }
          if ("Buffer" === obj.type && isArray(obj.data)) return fromArrayLike(that, obj.data);
        }
        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }
      function checked(length) {
        if (length >= kMaxLength()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
        return 0 | length;
      }
      function SlowBuffer(length) {
        +length != length && (length = 0);
        return Buffer.alloc(+length);
      }
      Buffer.isBuffer = function isBuffer(b) {
        return !!(null != b && b._isBuffer);
      };
      Buffer.compare = function compare(a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError("Arguments must be Buffers");
        if (a === b) return 0;
        var x = a.length;
        var y = b.length;
        for (var i = 0, len = Math.min(x, y); i < len; ++i) if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
         case "hex":
         case "utf8":
         case "utf-8":
         case "ascii":
         case "latin1":
         case "binary":
         case "base64":
         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return true;

         default:
          return false;
        }
      };
      Buffer.concat = function concat(list, length) {
        if (!isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (0 === list.length) return Buffer.alloc(0);
        var i;
        if (void 0 === length) {
          length = 0;
          for (i = 0; i < list.length; ++i) length += list[i].length;
        }
        var buffer = Buffer.allocUnsafe(length);
        var pos = 0;
        for (i = 0; i < list.length; ++i) {
          var buf = list[i];
          if (!Buffer.isBuffer(buf)) throw new TypeError('"list" argument must be an Array of Buffers');
          buf.copy(buffer, pos);
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer.isBuffer(string)) return string.length;
        if ("undefined" !== typeof ArrayBuffer && "function" === typeof ArrayBuffer.isView && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) return string.byteLength;
        "string" !== typeof string && (string = "" + string);
        var len = string.length;
        if (0 === len) return 0;
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "ascii":
         case "latin1":
         case "binary":
          return len;

         case "utf8":
         case "utf-8":
         case void 0:
          return utf8ToBytes(string).length;

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return 2 * len;

         case "hex":
          return len >>> 1;

         case "base64":
          return base64ToBytes(string).length;

         default:
          if (loweredCase) return utf8ToBytes(string).length;
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        var loweredCase = false;
        (void 0 === start || start < 0) && (start = 0);
        if (start > this.length) return "";
        (void 0 === end || end > this.length) && (end = this.length);
        if (end <= 0) return "";
        end >>>= 0;
        start >>>= 0;
        if (end <= start) return "";
        encoding || (encoding = "utf8");
        while (true) switch (encoding) {
         case "hex":
          return hexSlice(this, start, end);

         case "utf8":
         case "utf-8":
          return utf8Slice(this, start, end);

         case "ascii":
          return asciiSlice(this, start, end);

         case "latin1":
         case "binary":
          return latin1Slice(this, start, end);

         case "base64":
          return base64Slice(this, start, end);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return utf16leSlice(this, start, end);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.prototype._isBuffer = true;
      function swap(b, n, m) {
        var i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer.prototype.swap16 = function swap16() {
        var len = this.length;
        if (len % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (var i = 0; i < len; i += 2) swap(this, i, i + 1);
        return this;
      };
      Buffer.prototype.swap32 = function swap32() {
        var len = this.length;
        if (len % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (var i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer.prototype.swap64 = function swap64() {
        var len = this.length;
        if (len % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (var i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer.prototype.toString = function toString() {
        var length = 0 | this.length;
        if (0 === length) return "";
        if (0 === arguments.length) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer.prototype.equals = function equals(b) {
        if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return 0 === Buffer.compare(this, b);
      };
      Buffer.prototype.inspect = function inspect() {
        var str = "";
        var max = exports.INSPECT_MAX_BYTES;
        if (this.length > 0) {
          str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
          this.length > max && (str += " ... ");
        }
        return "<Buffer " + str + ">";
      };
      Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (!Buffer.isBuffer(target)) throw new TypeError("Argument must be a Buffer");
        void 0 === start && (start = 0);
        void 0 === end && (end = target ? target.length : 0);
        void 0 === thisStart && (thisStart = 0);
        void 0 === thisEnd && (thisEnd = this.length);
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError("out of range index");
        if (thisStart >= thisEnd && start >= end) return 0;
        if (thisStart >= thisEnd) return -1;
        if (start >= end) return 1;
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        var x = thisEnd - thisStart;
        var y = end - start;
        var len = Math.min(x, y);
        var thisCopy = this.slice(thisStart, thisEnd);
        var targetCopy = target.slice(start, end);
        for (var i = 0; i < len; ++i) if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (0 === buffer.length) return -1;
        if ("string" === typeof byteOffset) {
          encoding = byteOffset;
          byteOffset = 0;
        } else byteOffset > 2147483647 ? byteOffset = 2147483647 : byteOffset < -2147483648 && (byteOffset = -2147483648);
        byteOffset = +byteOffset;
        isNaN(byteOffset) && (byteOffset = dir ? 0 : buffer.length - 1);
        byteOffset < 0 && (byteOffset = buffer.length + byteOffset);
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (!dir) return -1;
          byteOffset = 0;
        }
        "string" === typeof val && (val = Buffer.from(val, encoding));
        if (Buffer.isBuffer(val)) {
          if (0 === val.length) return -1;
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        }
        if ("number" === typeof val) {
          val &= 255;
          if (Buffer.TYPED_ARRAY_SUPPORT && "function" === typeof Uint8Array.prototype.indexOf) return dir ? Uint8Array.prototype.indexOf.call(buffer, val, byteOffset) : Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1;
        var arrLength = arr.length;
        var valLength = val.length;
        if (void 0 !== encoding) {
          encoding = String(encoding).toLowerCase();
          if ("ucs2" === encoding || "ucs-2" === encoding || "utf16le" === encoding || "utf-16le" === encoding) {
            if (arr.length < 2 || val.length < 2) return -1;
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i) {
          return 1 === indexSize ? buf[i] : buf.readUInt16BE(i * indexSize);
        }
        var i;
        if (dir) {
          var foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) if (read(arr, i) === read(val, -1 === foundIndex ? 0 : i - foundIndex)) {
            -1 === foundIndex && (foundIndex = i);
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            -1 !== foundIndex && (i -= i - foundIndex);
            foundIndex = -1;
          }
        } else {
          byteOffset + valLength > arrLength && (byteOffset = arrLength - valLength);
          for (i = byteOffset; i >= 0; i--) {
            var found = true;
            for (var j = 0; j < valLength; j++) if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
        return -1 !== this.indexOf(val, byteOffset, encoding);
      };
      Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;
        if (length) {
          length = Number(length);
          length > remaining && (length = remaining);
        } else length = remaining;
        var strLen = string.length;
        if (strLen % 2 !== 0) throw new TypeError("Invalid hex string");
        length > strLen / 2 && (length = strLen / 2);
        for (var i = 0; i < length; ++i) {
          var parsed = parseInt(string.substr(2 * i, 2), 16);
          if (isNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function latin1Write(buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer.prototype.write = function write(string, offset, length, encoding) {
        if (void 0 === offset) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (void 0 === length && "string" === typeof offset) {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else {
          if (!isFinite(offset)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
          offset |= 0;
          if (isFinite(length)) {
            length |= 0;
            void 0 === encoding && (encoding = "utf8");
          } else {
            encoding = length;
            length = void 0;
          }
        }
        var remaining = this.length - offset;
        (void 0 === length || length > remaining) && (length = remaining);
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        encoding || (encoding = "utf8");
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "hex":
          return hexWrite(this, string, offset, length);

         case "utf8":
         case "utf-8":
          return utf8Write(this, string, offset, length);

         case "ascii":
          return asciiWrite(this, string, offset, length);

         case "latin1":
         case "binary":
          return latin1Write(this, string, offset, length);

         case "base64":
          return base64Write(this, string, offset, length);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return ucs2Write(this, string, offset, length);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      };
      Buffer.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        return 0 === start && end === buf.length ? base64.fromByteArray(buf) : base64.fromByteArray(buf.slice(start, end));
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        var res = [];
        var i = start;
        while (i < end) {
          var firstByte = buf[i];
          var codePoint = null;
          var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
             case 1:
              firstByte < 128 && (codePoint = firstByte);
              break;

             case 2:
              secondByte = buf[i + 1];
              if (128 === (192 & secondByte)) {
                tempCodePoint = (31 & firstByte) << 6 | 63 & secondByte;
                tempCodePoint > 127 && (codePoint = tempCodePoint);
              }
              break;

             case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte)) {
                tempCodePoint = (15 & firstByte) << 12 | (63 & secondByte) << 6 | 63 & thirdByte;
                tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343) && (codePoint = tempCodePoint);
              }
              break;

             case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte) && 128 === (192 & fourthByte)) {
                tempCodePoint = (15 & firstByte) << 18 | (63 & secondByte) << 12 | (63 & thirdByte) << 6 | 63 & fourthByte;
                tempCodePoint > 65535 && tempCodePoint < 1114112 && (codePoint = tempCodePoint);
              }
            }
          }
          if (null === codePoint) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | 1023 & codePoint;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        var len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints);
        var res = "";
        var i = 0;
        while (i < len) res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
        return res;
      }
      function asciiSlice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(127 & buf[i]);
        return ret;
      }
      function latin1Slice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(buf[i]);
        return ret;
      }
      function hexSlice(buf, start, end) {
        var len = buf.length;
        (!start || start < 0) && (start = 0);
        (!end || end < 0 || end > len) && (end = len);
        var out = "";
        for (var i = start; i < end; ++i) out += toHex(buf[i]);
        return out;
      }
      function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = "";
        for (var i = 0; i < bytes.length; i += 2) res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
        return res;
      }
      Buffer.prototype.slice = function slice(start, end) {
        var len = this.length;
        start = ~~start;
        end = void 0 === end ? len : ~~end;
        if (start < 0) {
          start += len;
          start < 0 && (start = 0);
        } else start > len && (start = len);
        if (end < 0) {
          end += len;
          end < 0 && (end = 0);
        } else end > len && (end = len);
        end < start && (end = start);
        var newBuf;
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          newBuf = this.subarray(start, end);
          newBuf.__proto__ = Buffer.prototype;
        } else {
          var sliceLen = end - start;
          newBuf = new Buffer(sliceLen, void 0);
          for (var i = 0; i < sliceLen; ++i) newBuf[i] = this[i + start];
        }
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        return val;
      };
      Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset + --byteLength];
        var mul = 1;
        while (byteLength > 0 && (mul *= 256)) val += this[offset + --byteLength] * mul;
        return val;
      };
      Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 16777216 * this[offset + 3];
      };
      Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return 16777216 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var i = byteLength;
        var mul = 1;
        var val = this[offset + --i];
        while (i > 0 && (mul *= 256)) val += this[offset + --i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        if (!(128 & this[offset])) return this[offset];
        return -1 * (255 - this[offset] + 1);
      };
      Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset] | this[offset + 1] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset + 1] | this[offset] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var mul = 1;
        var i = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var i = byteLength - 1;
        var mul = 1;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 255, 0);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        this[offset] = 255 & value;
        return offset + 1;
      };
      function objectWriteUInt16(buf, value, offset, littleEndian) {
        value < 0 && (value = 65535 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> 8 * (littleEndian ? i : 1 - i);
      }
      Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      function objectWriteUInt32(buf, value, offset, littleEndian) {
        value < 0 && (value = 4294967295 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) buf[offset + i] = value >>> 8 * (littleEndian ? i : 3 - i) & 255;
      }
      Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset + 3] = value >>> 24;
          this[offset + 2] = value >>> 16;
          this[offset + 1] = value >>> 8;
          this[offset] = 255 & value;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = 0;
        var mul = 1;
        var sub = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i - 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = byteLength - 1;
        var mul = 1;
        var sub = 0;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i + 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 127, -128);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        value < 0 && (value = 255 + value + 1);
        this[offset] = 255 & value;
        return offset + 1;
      };
      Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
          this[offset + 2] = value >>> 16;
          this[offset + 3] = value >>> 24;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        value < 0 && (value = 4294967295 + value + 1);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 4, 3.4028234663852886e38, -3.4028234663852886e38);
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 8, 1.7976931348623157e308, -1.7976931348623157e308);
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer.prototype.copy = function copy(target, targetStart, start, end) {
        start || (start = 0);
        end || 0 === end || (end = this.length);
        targetStart >= target.length && (targetStart = target.length);
        targetStart || (targetStart = 0);
        end > 0 && end < start && (end = start);
        if (end === start) return 0;
        if (0 === target.length || 0 === this.length) return 0;
        if (targetStart < 0) throw new RangeError("targetStart out of bounds");
        if (start < 0 || start >= this.length) throw new RangeError("sourceStart out of bounds");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        end > this.length && (end = this.length);
        target.length - targetStart < end - start && (end = target.length - targetStart + start);
        var len = end - start;
        var i;
        if (this === target && start < targetStart && targetStart < end) for (i = len - 1; i >= 0; --i) target[i + targetStart] = this[i + start]; else if (len < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) for (i = 0; i < len; ++i) target[i + targetStart] = this[i + start]; else Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
        return len;
      };
      Buffer.prototype.fill = function fill(val, start, end, encoding) {
        if ("string" === typeof val) {
          if ("string" === typeof start) {
            encoding = start;
            start = 0;
            end = this.length;
          } else if ("string" === typeof end) {
            encoding = end;
            end = this.length;
          }
          if (1 === val.length) {
            var code = val.charCodeAt(0);
            code < 256 && (val = code);
          }
          if (void 0 !== encoding && "string" !== typeof encoding) throw new TypeError("encoding must be a string");
          if ("string" === typeof encoding && !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
        } else "number" === typeof val && (val &= 255);
        if (start < 0 || this.length < start || this.length < end) throw new RangeError("Out of range index");
        if (end <= start) return this;
        start >>>= 0;
        end = void 0 === end ? this.length : end >>> 0;
        val || (val = 0);
        var i;
        if ("number" === typeof val) for (i = start; i < end; ++i) this[i] = val; else {
          var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
          var len = bytes.length;
          for (i = 0; i < end - start; ++i) this[i + start] = bytes[i % len];
        }
        return this;
      };
      var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = stringtrim(str).replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) str += "=";
        return str;
      }
      function stringtrim(str) {
        if (str.trim) return str.trim();
        return str.replace(/^\s+|\s+$/g, "");
      }
      function toHex(n) {
        if (n < 16) return "0" + n.toString(16);
        return n.toString(16);
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];
        for (var i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              if (i + 1 === length) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              (units -= 3) > -1 && bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = 65536 + (leadSurrogate - 55296 << 10 | codePoint - 56320);
          } else leadSurrogate && (units -= 3) > -1 && bytes.push(239, 191, 189);
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 6 | 192, 63 & codePoint | 128);
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          } else {
            if (!(codePoint < 1114112)) throw new Error("Invalid code point");
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) byteArray.push(255 & str.charCodeAt(i));
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        var c, hi, lo;
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isnan(val) {
        return val !== val;
      }
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "base64-js": 1,
    ieee754: 4,
    isarray: 3
  } ],
  3: [ function(require, module, exports) {
    var toString = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return "[object Array]" == toString.call(arr);
    };
  }, {} ],
  4: [ function(require, module, exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (;nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8) ;
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (;nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8) ;
      if (0 === e) e = 1 - eBias; else {
        if (e === eMax) return m ? NaN : Infinity * (s ? -1 : 1);
        m += Math.pow(2, mLen);
        e -= eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || Infinity === value) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias);
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e += eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (;mLen >= 8; buffer[offset + i] = 255 & m, i += d, m /= 256, mLen -= 8) ;
      e = e << mLen | m;
      eLen += mLen;
      for (;eLen > 0; buffer[offset + i] = 255 & e, i += d, e /= 256, eLen -= 8) ;
      buffer[offset + i - d] |= 128 * s;
    };
  }, {} ],
  DataHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5f190GIpl9K55ew1q18ahuG", "DataHelper");
    "use strict";
    var Crypt = require("CryptUtil").pidCryptUtil;
    function initHelper() {
      _initGlobalData();
      _loadLocalData();
      return module.exports;
    }
    function saveAllData() {
      cc.log("saveAllData");
      var gameLocalData = JSON.stringify(gLocalData);
      gameLocalData = Crypt.encodeBase64(gameLocalData, true);
      cc.sys.localStorage.setItem("GameLocalData", gameLocalData);
    }
    function _initGlobalData() {
      window._ = require("underscore");
      require("GlobalGameData").init();
      window.GameHelper = require("GameHelper").initHelper();
      window.UpdateHelper = require("UpdateHelper");
      window.PBHelper = require("PBHelper");
      window.CCLoaderHelper = require("CCLoaderHelper");
    }
    function _loadLocalData() {
      cc.log("@@@@@@loadLocalData");
      var _isNull = function _isNull(newParam) {
        return void 0 == newParam || null == newParam;
      };
      var defaultData = {
        dataVersion: 2,
        userInfo: {
          platform: "",
          account: "",
          areaCode: "86",
          phone: "",
          password: "",
          tableBg: 0,
          type: "",
          bankID: 0,
          agent: "",
          module: 0,
          channelId: "",
          rechargeList: null,
          rechargeWXt: null,
          hotFaildNum: 0,
          hotFailRes: ""
        },
        sysInfo: {
          shouldMusic: true,
          shouldEffect: true,
          shouldShock: true,
          agreeAgreement: true,
          rememberPassWord: true
        },
        roomChoices: {
          nn: [ 0, 0 ],
          dz: [ 0, 0 ],
          bjl: [ 0, 0 ],
          zjh: [ 0, 0 ]
        }
      };
      var data = cc.sys.localStorage.getItem("GameLocalData");
      if (null != data) {
        data = Crypt.decodeBase64(data, true);
        data = JSON.parse(data);
      } else data = defaultData;
      _checkVersion(data, defaultData);
      cc.log(data);
      window.gLocalData = data;
    }
    function _checkVersion(last, current) {
      var lastVersion = last.dataVersion;
      var currVersion = current.dataVersion;
      currVersion > lastVersion && (last.dataVersion = currVersion);
    }
    module.exports = {
      initHelper: initHelper,
      saveAllData: saveAllData
    };
    cc._RF.pop();
  }, {
    CCLoaderHelper: "CCLoaderHelper",
    CryptUtil: "CryptUtil",
    GameHelper: "GameHelper",
    GlobalGameData: "GlobalGameData",
    PBHelper: "PBHelper",
    UpdateHelper: "UpdateHelper",
    underscore: "underscore"
  } ],
  DlgGameNeedDownload: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "89aadSywwRJu6Q5amht8nBK", "DlgGameNeedDownload");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      initCb: function initCb(cb) {
        this._cb = cb;
      },
      onButtonClicked: function onButtonClicked(event, name) {
        switch (name) {
         case "yes":
          this._cb && this._cb();
          this.node.removeFromParent();
          break;

         case "cancel":
          this.node.removeFromParent();
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  DlgSetting: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a11edlh/6lIn6P3jFVqURrF", "DlgSetting");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      onCloseDlg: function onCloseDlg() {
        this.node.removeFromParent();
      }
    });
    cc._RF.pop();
  }, {} ],
  GameDownComponent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a11e04Sc9ZJfK6JbhQ+KmdV", "GameDownComponent");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        gameType: "",
        _update: null,
        _updateState: 0,
        _checked: false,
        _clicked: false,
        _isDownloading: false
      },
      onLoad: function onLoad() {
        this._ui = this.node.addComponent("ComChooseGameState");
        cc.log("\u68c0\u67e5\u5168\u5c40\u72b6\u6001\uff1a", $G.gCData.gameChecked);
        this._ui.showCouldDownload(!this._checkDownloaded());
        this._ui.showDownloading(false);
      },
      onButtonClicked: function onButtonClicked(event, customEventData) {
        cc.log("GameDown clicked:" + customEventData);
        this._clicked = true;
        cc.currentGame = customEventData;
        if (cc.sys.isNative) {
          this._checkGameState(false, false);
          this._checked = true;
        } else this.enterGame();
      },
      enterGame: function enterGame() {
        this.reSetGameDownloading();
        GameHelper.loadGameScene();
      },
      reSetGameDownloading: function reSetGameDownloading() {
        for (var key in $G.gCData.gIsGameDownloading) $G.gCData.gIsGameDownloading[key] && ($G.gCData.gIsGameDownloading[key] = false);
      },
      _checkIsGameDown: function _checkIsGameDown() {
        var isDownload = false;
        for (var key in $G.gCData.gIsGameDownloading) $G.gCData.gIsGameDownloading[key] && (isDownload = true);
        return isDownload;
      },
      _checkDownloaded: function _checkDownloaded() {
        return !cc.sys.isNative || UpdateHelper.isDownloaded(this.gameType);
      },
      _checkGameState: function _checkGameState() {
        var showDlg = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        var onlyCheckDownload = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        if ($G.gCData.gameChecked[this.gameType]) {
          cc.log("\u6e38\u620f\u5df2\u7ecf\u66f4\u65b0\u8fc7");
          this.enterGame();
          return;
        }
        if (0 != this._updateState) {
          cc.log("\u6e38\u620f\u5df2\u7ecfcheck\u8fc7" + this._updateState);
          this.checkUpDateHandler(this._updateState, true);
          return;
        }
        if (cc.sys.isNative) {
          if (!$G.gCData.gameChecked[this.gameType]) {
            this._update = this.node.addComponent("UpdateComponent");
            this._update.initUI(this);
            this._update.initCheckUpDate(this.checkUpDateHandler.bind(this), this.gameType);
          }
          if (this._update) {
            cc.log("\u8fdb\u5165native\u5224\u65ad\u6d41\u7a0b");
            var isLoadedFlag = UpdateHelper.isDownloaded(this.gameType);
            if (isLoadedFlag) this.alreadyGameView(); else {
              cc.log("\u8fd8\u672a\u4e0b\u8fc7", this.gameType);
              this._checked && this.needDownLoadView(showDlg);
            }
          }
          if (!this._checked) {
            cc.log("\u5f00\u59cb\u7b2c\u4e00\u6b21check");
            this._update.checkVersionUpdate();
          }
        } else this.alreadyGameView();
      },
      alreadyGameView: function alreadyGameView(isHotBack) {
        cc.log("\u6e38\u620f\u5df2\u7ecf\u4e0b\u8f7d\u8fc7");
        this._ui.showCouldDownload(false);
        this._ui.showDownloading(false);
        $G.gCData.gIsGameDownloading[this.gameType] = false;
        $G.gCData.gameChecked[this.gameType] = true;
        isHotBack ? cc.log("\u70ed\u66f4\u65b0\u5b8c\u6210\u56de\u8c03,\u76ee\u524d\u4e0d\u8fdb\u5165hallscene") : this._checked && this._clicked && this.enterGame();
      },
      needDownLoadView: function needDownLoadView() {
        var showDlg = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        this._ui.showCouldDownload(true);
        this._ui.showDownloading(false);
        if (showDlg) {
          var self = this;
          PBHelper.addNode("DlgGameNeedDownload", null, function(node) {
            node.getComponent("DlgGameNeedDownload").initCb(function() {
              $G.gCData.gIsGameDownloading[self.gameType] = true;
              self._update.startVerionUpdate();
              self.downloadingView(2);
            });
          });
        }
      },
      downloadingView: function downloadingView() {
        var per = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
        cc.log("\u6e38\u620f\u4e0b\u8f7d\u4e2d");
        this._ui.showCouldDownload(false);
        this._ui.showDownloading(true, per);
      },
      checkUpDateHandler: function checkUpDateHandler(updateState, isHotBack) {
        this._updateState = updateState;
        if (1 == updateState) this.needDownLoadView(); else if (2 == updateState) this.downloadingView(); else if (3 == updateState) this.alreadyGameView(isHotBack); else if (4 == updateState) {
          var isLoadedFlag = UpdateHelper.isDownloaded(this.gameType);
          if (isLoadedFlag) {
            this.alreadyGameView();
            return;
          }
          cc.log("\u4e0b\u8f7d\u5931\u8d25", this.gameType);
          this.needDownLoadView();
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  GameHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dda7coMMMJF/reILAe43VpG", "GameHelper");
    "use strict";
    var helper = module.exports;
    helper.initHelper = function() {
      return helper;
    };
    helper.onLoadChooseScene = function(cb) {
      if (!cc.sys.isNative) {
        cc.director.loadScene("ChooseGame");
        return;
      }
      var gameName = UpdateHelper.gameType();
      var storagePath = UpdateHelper.genStoragePath(gameName);
      cc.log(storagePath);
      window.require(storagePath + "/src/dating.js");
      return;
    };
    helper.loadChooseScene = function(cb) {
      cc.director.loadScene("ChooseGame", function() {
        cb && cb();
      });
    };
    helper.loadGameScene = function(cb) {
      if (!cc.sys.isNative) {
        switch (cc.currentGame) {
         case "bjl":
          cc.director.loadScene("GameScene_BJL");
          break;

         case "lkpy":
          cc.director.loadScene("GameScene_LKPY");
          break;

         case "ddz":
          cc.director.loadScene("GameScene_DDZ");
        }
        return;
      }
      UpdateHelper.init(cc.currentGame);
      var searchPaths = jsb.fileUtils.getSearchPaths();
      var storagePath = UpdateHelper.storagePath();
      cc.log("storagePath = ", storagePath);
      searchPaths.unshift(storagePath);
      jsb.fileUtils.setSearchPaths(searchPaths);
      helper.resortSearchPaths(cc.currentGame);
      window.require(storagePath + "/src/main.js");
    };
    helper.resortSearchPaths = function(topGameName) {
      var searchPaths = jsb.fileUtils.getSearchPaths();
      cc.log("[SearchPaths] \u5904\u7406\u4e4b\u524d = ", searchPaths);
      var newSearchPaths = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = void 0;
      try {
        for (var _iterator = searchPaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var path = _step.value;
          if (path.indexOf(topGameName) > 0) {
            newSearchPaths.push(path);
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          !_iteratorNormalCompletion && _iterator.return && _iterator.return();
        } finally {
          if (_didIteratorError) throw _iteratorError;
        }
      }
      newSearchPaths.push(searchPaths[searchPaths.length - 3]);
      jsb.fileUtils.setSearchPaths(newSearchPaths);
      cc.log("[SearchPaths] \u5904\u7406\u4e4b\u540e = ", newSearchPaths);
    };
    cc._RF.pop();
  }, {} ],
  GlobalGameData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8ecfdDoUvFN3pS8uIYkJ2z0", "GlobalGameData");
    "use strict";
    var global = module.exports;
    global.init = function() {
      window.$G = {};
      global._initCData();
      global._initSData();
    };
    global._initSData = function() {
      window.$G.gSData = {};
      $G.gSData.gCData = null;
      $G.gSData.gRoom = null;
      $G.gSData.gRoomResult = null;
      $G.gSData.gWallet = {};
      $G.gSData.gShare = {};
      $G.gSData.gNotice = {};
      $G.gSData.gRankList = {};
      $G.gSData.gRankSelf = {};
      $G.gSData.gSids = [];
      $G.gSData.gCids = [];
      $G.gSData.gGroup = null;
      $G.gSData.Logout = null;
    };
    global._initCData = function() {
      $G.gCData = {};
      $G.gCData.gIsLogined = false;
      $G.gCData.gIsGameDownloading = {};
      $G.gCData.gameChecked = {};
      $G.gCData.gMagicWindow = null;
      $G.gCData.gCurrentMusic = null;
      $G.gCData.gNoticeAutoShowed = false;
      $G.gCData.gIsVoiceRecordOrPlay = false;
      $G.gCData.gRoomLeaved = false;
      $G.gCData.gIsLogined = false;
      $G.gCData.gMagicWindow = null;
      $G.gCData.gCurrentMusic = null;
      $G.gCData.gLastUpdateInvite = 0;
      $G.gCData.gAreaType = 0;
      $G.gCData.gRoomLeaved = false;
      $G.gCData.gComPlayers = [];
      $G.gCData.gSids = [];
      $G.gCData.gCids = [];
    };
    cc._RF.pop();
  }, {} ],
  LZString: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a11f19nUSVBqb46WAWofb13", "LZString");
    "use strict";
    var LZString = function() {
      var f = String.fromCharCode;
      var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
      var baseReverseDic = {};
      function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
          baseReverseDic[alphabet] = {};
          for (var i = 0; i < alphabet.length; i++) baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
        return baseReverseDic[alphabet][character];
      }
      var LZString = {
        compressToBase64: function compressToBase64(input) {
          if (null == input) return "";
          var res = LZString._compress(input, 6, function(a) {
            return keyStrBase64.charAt(a);
          });
          switch (res.length % 4) {
           default:
           case 0:
            return res;

           case 1:
            return res + "===";

           case 2:
            return res + "==";

           case 3:
            return res + "=";
          }
        },
        decompressFromBase64: function decompressFromBase64(input) {
          if (null == input) return "";
          if ("" == input) return null;
          return LZString._decompress(input.length, 32, function(index) {
            return getBaseValue(keyStrBase64, input.charAt(index));
          });
        },
        compressToUTF16: function compressToUTF16(input) {
          if (null == input) return "";
          return LZString._compress(input, 15, function(a) {
            return f(a + 32);
          }) + " ";
        },
        decompressFromUTF16: function decompressFromUTF16(compressed) {
          if (null == compressed) return "";
          if ("" == compressed) return null;
          return LZString._decompress(compressed.length, 16384, function(index) {
            return compressed.charCodeAt(index) - 32;
          });
        },
        compressToUint8Array: function compressToUint8Array(uncompressed) {
          var compressed = LZString.compress(uncompressed);
          var buf = new Uint8Array(2 * compressed.length);
          for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
            var current_value = compressed.charCodeAt(i);
            buf[2 * i] = current_value >>> 8;
            buf[2 * i + 1] = current_value % 256;
          }
          return buf;
        },
        decompressFromUint8Array: function decompressFromUint8Array(compressed) {
          if (null === compressed || void 0 === compressed) return LZString.decompress(compressed);
          var buf = new Array(compressed.length / 2);
          for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) buf[i] = 256 * compressed[2 * i] + compressed[2 * i + 1];
          var result = [];
          buf.forEach(function(c) {
            result.push(f(c));
          });
          return LZString.decompress(result.join(""));
        },
        compressToEncodedURIComponent: function compressToEncodedURIComponent(input) {
          if (null == input) return "";
          return LZString._compress(input, 6, function(a) {
            return keyStrUriSafe.charAt(a);
          });
        },
        decompressFromEncodedURIComponent: function decompressFromEncodedURIComponent(input) {
          if (null == input) return "";
          if ("" == input) return null;
          input = input.replace(/ /g, "+");
          return LZString._decompress(input.length, 32, function(index) {
            return getBaseValue(keyStrUriSafe, input.charAt(index));
          });
        },
        compress: function compress(uncompressed) {
          return LZString._compress(uncompressed, 16, function(a) {
            return f(a);
          });
        },
        _compress: function _compress(uncompressed, bitsPerChar, getCharFromInt) {
          if (null == uncompressed) return "";
          var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
          for (ii = 0; ii < uncompressed.length; ii += 1) {
            context_c = uncompressed.charAt(ii);
            if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
              context_dictionary[context_c] = context_dictSize++;
              context_dictionaryToCreate[context_c] = true;
            }
            context_wc = context_w + context_c;
            if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) context_w = context_wc; else {
              if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val <<= 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else context_data_position++;
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 8; i++) {
                    context_data_val = context_data_val << 1 | 1 & value;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else context_data_position++;
                    value >>= 1;
                  }
                } else {
                  value = 1;
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1 | value;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else context_data_position++;
                    value = 0;
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 16; i++) {
                    context_data_val = context_data_val << 1 | 1 & value;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else context_data_position++;
                    value >>= 1;
                  }
                }
                context_enlargeIn--;
                if (0 == context_enlargeIn) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
              } else {
                value = context_dictionary[context_w];
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | 1 & value;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else context_data_position++;
                  value >>= 1;
                }
              }
              context_enlargeIn--;
              if (0 == context_enlargeIn) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              context_dictionary[context_wc] = context_dictSize++;
              context_w = String(context_c);
            }
          }
          if ("" !== context_w) {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
              if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) {
                  context_data_val <<= 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else context_data_position++;
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 8; i++) {
                  context_data_val = context_data_val << 1 | 1 & value;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else context_data_position++;
                  value >>= 1;
                }
              } else {
                value = 1;
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else context_data_position++;
                  value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 16; i++) {
                  context_data_val = context_data_val << 1 | 1 & value;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else context_data_position++;
                  value >>= 1;
                }
              }
              context_enlargeIn--;
              if (0 == context_enlargeIn) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              delete context_dictionaryToCreate[context_w];
            } else {
              value = context_dictionary[context_w];
              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1 | 1 & value;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else context_data_position++;
                value >>= 1;
              }
            }
            context_enlargeIn--;
            if (0 == context_enlargeIn) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
          }
          value = 2;
          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1 | 1 & value;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else context_data_position++;
            value >>= 1;
          }
          while (true) {
            context_data_val <<= 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data.push(getCharFromInt(context_data_val));
              break;
            }
            context_data_position++;
          }
          return context_data.join("");
        },
        decompress: function decompress(compressed) {
          if (null == compressed) return "";
          if ("" == compressed) return null;
          return LZString._decompress(compressed.length, 32768, function(index) {
            return compressed.charCodeAt(index);
          });
        },
        _decompress: function _decompress(length, resetValue, getNextValue) {
          var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = {
            val: getNextValue(0),
            position: resetValue,
            index: 1
          };
          for (i = 0; i < 3; i += 1) dictionary[i] = i;
          bits = 0;
          maxpower = Math.pow(2, 2);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (0 == data.position) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          switch (next = bits) {
           case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (0 == data.position) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            c = f(bits);
            break;

           case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (0 == data.position) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            c = f(bits);
            break;

           case 2:
            return "";
          }
          dictionary[3] = c;
          w = c;
          result.push(c);
          while (true) {
            if (data.index > length) return "";
            bits = 0;
            maxpower = Math.pow(2, numBits);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (0 == data.position) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            switch (c = bits) {
             case 0:
              bits = 0;
              maxpower = Math.pow(2, 8);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (0 == data.position) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              dictionary[dictSize++] = f(bits);
              c = dictSize - 1;
              enlargeIn--;
              break;

             case 1:
              bits = 0;
              maxpower = Math.pow(2, 16);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (0 == data.position) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              dictionary[dictSize++] = f(bits);
              c = dictSize - 1;
              enlargeIn--;
              break;

             case 2:
              return result.join("");
            }
            if (0 == enlargeIn) {
              enlargeIn = Math.pow(2, numBits);
              numBits++;
            }
            if (dictionary[c]) entry = dictionary[c]; else {
              if (c !== dictSize) return null;
              entry = w + w.charAt(0);
            }
            result.push(entry);
            dictionary[dictSize++] = w + entry.charAt(0);
            enlargeIn--;
            w = entry;
            if (0 == enlargeIn) {
              enlargeIn = Math.pow(2, numBits);
              numBits++;
            }
          }
        }
      };
      return LZString;
    }();
    "function" === typeof define && define.amd ? define(function() {
      return LZString;
    }) : "undefined" !== typeof module && null != module ? module.exports = LZString : "undefined" !== typeof angular && null != angular && angular.module("LZString", []).factory("LZString", function() {
      return LZString;
    });
    cc._RF.pop();
  }, {} ],
  LoadingScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1149+Q0xBBqalzd6Qdy1IQ", "LoadingScene");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        ndLoading: cc.Node,
        ndUpdate: cc.Node,
        lbPer: cc.Label,
        lbUuid: cc.Label
      },
      onDestroy: function onDestroy() {},
      onLoad: function onLoad() {
        var _this = this;
        window.DataHelper = require("DataHelper").initHelper();
        this._loaded = 0;
        this._loadMax = 2;
        PBHelper.initHelper(function() {
          _this._onLoadDone();
        });
        console.log("\u9884\u52a0\u8f7d\u516c\u5171\u5f39\u51fa\u6846 ");
        this.checkHotUpdate();
      },
      checkHotUpdate: function checkHotUpdate() {
        cc.log("@checkhot");
        var com = this.getComponent("ComHotUpdate");
        com.check();
      },
      _onLoadDone: function _onLoadDone(id) {
        this._loaded++;
        cc.log(this._loaded);
        if (this._loaded >= this._loadMax) {
          this.onLoadAll();
          return;
        }
      },
      loadGame: function loadGame() {
        this._onLoadDone();
      },
      onLoadAll: function onLoadAll() {
        GameHelper.loadChooseScene();
      }
    });
    cc._RF.pop();
  }, {
    DataHelper: "DataHelper"
  } ],
  MD5: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1151EThsVG05pWbtX7J1jU", "MD5");
    "use strict";
    var hexcase = 0;
    var b64pad = "";
    var chrsz = 8;
    function hex_md5_32bit(s) {
      return binl2hex(core_md5(str2binl(s), s.length * chrsz));
    }
    function hex_md5_16bit(s) {
      return hex_md5_32bit(s).substr(8, 16);
    }
    function b64_md5(s) {
      return binl2b64(core_md5(str2binl(s), s.length * chrsz));
    }
    function hex_hmac_md5(key, data) {
      return binl2hex(core_hmac_md5(key, data));
    }
    function b64_hmac_md5(key, data) {
      return binl2b64(core_hmac_md5(key, data));
    }
    function calcMD5(s) {
      return binl2hex(core_md5(str2binl(s), s.length * chrsz));
    }
    function md5_vm_test() {
      return "900150983cd24fb0d6963f7d28e17f72" == hex_md5_32bit("abc");
    }
    function core_md5(x, len) {
      x[len >> 5] |= 128 << len % 32;
      x[14 + (len + 64 >>> 9 << 4)] = len;
      var a = 1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d = 271733878;
      for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
      }
      return Array(a, b, c, d);
    }
    function md5_cmn(q, a, b, x, s, t) {
      return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
      return md5_cmn(b & c | ~b & d, a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
      return md5_cmn(b & d | c & ~d, a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
      return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
      return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
    }
    function core_hmac_md5(key, data) {
      var bkey = str2binl(key);
      bkey.length > 16 && (bkey = core_md5(bkey, key.length * chrsz));
      var ipad = Array(16), opad = Array(16);
      for (var i = 0; i < 16; i++) {
        ipad[i] = 909522486 ^ bkey[i];
        opad[i] = 1549556828 ^ bkey[i];
      }
      var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
      return core_md5(opad.concat(hash), 640);
    }
    function safe_add(x, y) {
      var lsw = (65535 & x) + (65535 & y);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return msw << 16 | 65535 & lsw;
    }
    function bit_rol(num, cnt) {
      return num << cnt | num >>> 32 - cnt;
    }
    function str2binl(str) {
      var bin = Array();
      var mask = (1 << chrsz) - 1;
      for (var i = 0; i < str.length * chrsz; i += chrsz) bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << i % 32;
      return bin;
    }
    function binl2hex(binarray) {
      var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var str = "";
      for (var i = 0; i < 4 * binarray.length; i++) str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 15) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 15);
      return str;
    }
    function binl2b64(binarray) {
      var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var str = "";
      for (var i = 0; i < 4 * binarray.length; i += 3) {
        var triplet = (binarray[i >> 2] >> i % 4 * 8 & 255) << 16 | (binarray[i + 1 >> 2] >> (i + 1) % 4 * 8 & 255) << 8 | binarray[i + 2 >> 2] >> (i + 2) % 4 * 8 & 255;
        for (var j = 0; j < 4; j++) 8 * i + 6 * j > 32 * binarray.length ? str += b64pad : str += tab.charAt(triplet >> 6 * (3 - j) & 63);
      }
      return str;
    }
    module.exports = {
      hex_md5_32bit: hex_md5_32bit,
      hex_md5_16bit: hex_md5_16bit
    };
    cc._RF.pop();
  }, {} ],
  PBHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "53c56vhIXRC2aGiUmfBssEx", "PBHelper");
    "use strict";
    var prePath = "hall/prefabs/Dlgs/";
    var Paths = {
      DlgSetting: prePath + "DlgSetting",
      DlgGameNeedDownload: prePath + "DlgGameNeedDownload"
    };
    var ComPaths = {
      DlgSetting: prePath + "DlgSetting"
    };
    module.exports.initHelper = function(cb) {
      var loaded = 0;
      _.each(ComPaths, function(value, key) {
        CCLoaderHelper.getRes(value, cc.Prefab, function(err, prefab) {
          cc.log("@ PBHelper: <" + key + "> is loaded");
          loaded++;
          if (loaded >= _.size(ComPaths)) {
            cb && cb();
            return;
          }
        });
      });
    };
    var nodeName = "";
    var lock = true;
    module.exports.addNode = function(name) {
      var parent = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      var cb = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
      var zorder = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 9999;
      if (name == nodeName && lock) return;
      lock = true;
      nodeName = name;
      module.exports.getNode(name, function(node) {
        null === parent && (parent = cc.director.getScene().getChildByName("Canvas"));
        parent.getChildByName("popup9999") && parent.getChildByName("popup9999").destroy();
        parent.addChild(node, zorder, "popup9999");
        lock = false;
        cb && cb(node);
      });
    };
    module.exports.getNode = function(name) {
      var cb = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      var setShowLoading = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
      var cbDone = cb;
      CCLoaderHelper.getRes(Paths[name], cc.Prefab, function(err, res) {
        var node = cc.instantiate(cc.loader.getRes(Paths[name]));
        cbDone && cbDone(node);
        return node;
      });
    };
    module.exports.releaseNode = function() {
      var key = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
      var _release = function _release(key) {
        cc.log("@Release:" + key);
        var deps = cc.loader.getDependsRecursively(Paths[key]);
        cc.loader.release(deps);
      };
      if (null === key) for (var _key in Paths) _release(_key); else _release(key);
    };
    cc._RF.pop();
  }, {} ],
  ShaderUtils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ce1cdSbr5VBrr7rC1SnALUG", "ShaderUtils");
    "use strict";
    var ShaderUtils = {
      shaderPrograms: {},
      setShader: function setShader(sprite, shaderName) {
        var glProgram = this.shaderPrograms[shaderName];
        if (!glProgram) {
          glProgram = new cc.GLProgram();
          var vert = require(cc.js.formatStr("%s.vert", shaderName));
          var frag = require(cc.js.formatStr("%s.frag", shaderName));
          glProgram.initWithString(vert, frag);
          if (!cc.sys.isNative) {
            glProgram.initWithVertexShaderByteArray(vert, frag);
            glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
          }
          glProgram.link();
          glProgram.updateUniforms();
          this.shaderPrograms[shaderName] = glProgram;
        }
        sprite._sgNode.setShaderProgram(glProgram);
        return glProgram;
      }
    };
    module.exports = ShaderUtils;
    cc._RF.pop();
  }, {} ],
  UpdateComponent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a117fYQEhNOWJFTltFVUfJO", "UpdateComponent");
    "use strict";
    var RETRY_INTERVAL = 2;
    cc.GAME_TYPES = {};
    cc.GAME_TYPES.LAUNCHER = "hall";
    cc.GAME_TYPES.DZ = "dz";
    cc.GAME_TYPES.NN = "nn";
    cc.Class({
      extends: cc.Component,
      properties: {
        manifestUrl: {
          type: cc.Asset,
          default: null
        },
        _storageManifestUrl: "",
        _customManifestStr: "",
        _updating: false,
        _checkedUpd: false,
        _canRetry: false,
        _storagePath: "",
        _gameType: "",
        _retryTimer: null,
        _downOverFun: null,
        m_downLoadFlag: false,
        m_retryCount: 0,
        m_verUrlPath: ""
      },
      onDestroy: function onDestroy() {
        if (this._updateListener) {
          this._am.setEventCallback(null);
          this._updateListener = null;
        }
        this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS;
      },
      initUI: function initUI(ui) {
        this._comUI = ui;
      },
      initCheckUpDate: function initCheckUpDate(fun, gameType) {
        this._downOverFun = fun;
        this._gameType = gameType;
        this._initUpdData();
        this._newAssetMgr();
        this.m_downLoadFlag = true;
      },
      checkVersionUpdate: function checkVersionUpdate() {
        if (this._updating) {
          cc.log("Checking or updating ...");
          return;
        }
        cc.log("\u5730\u5740\uff1a", UpdateHelper.genUrl("", this._gameType));
        cc.log(this._customManifestStr);
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
          cc.log("AAAAAA Failed to load local manifest ...");
          var manifest = new jsb.Manifest(this._customManifestStr, this._storagePath);
          this._am.loadLocalManifest(manifest, this._storagePath);
        }
        this._am.setEventCallback(this._checkCb.bind(this));
        this._am.checkUpdate();
        this._updating = true;
      },
      startVerionUpdate: function startVerionUpdate() {
        cc.log("startVerionUpdate");
        if (this._am && !this._updating) {
          this._am.setEventCallback(this._updateCb.bind(this));
          this._am.getState() === jsb.AssetsManager.State.UNINITED && this._am.loadLocalManifest(this._storagePath);
          this._am.update();
          this._updating = true;
        }
      },
      _initUpdData: function _initUpdData() {
        var updUrl = UpdateHelper.genUrl("", this._gameType);
        var prjCfgFile = UpdateHelper.prjFileName();
        var verCfgFile = UpdateHelper.verFileName();
        this.m_verUrlPath = updUrl + "/" + verCfgFile;
        this._storagePath = UpdateHelper.genStoragePath(this._gameType);
        this._storageManifestUrl = this._storagePath + "/" + prjCfgFile;
        cc.log("storageManifestUrl XX ", this._storageManifestUrl);
        cc.log("\u4e0b\u8f7dURL", this.m_verUrlPath);
        this._customManifestStr = JSON.stringify({
          packageUrl: updUrl,
          remoteManifestUrl: updUrl + "/" + prjCfgFile,
          remoteVersionUrl: updUrl + "/" + verCfgFile,
          version: "0.0.1",
          assets: {},
          searchPaths: []
        });
      },
      _checkCb: function _checkCb(event) {
        var newVerThere = false;
        var alreadyUpFlag = false;
        var isDownloadFail = false;
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
          cc.log("No local manifest file found, hot update skipped.");
          break;

         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
          cc.log("Fail to download manifest file, hot update skipped.");
          alreadyUpFlag = true;
          isDownloadFail = true;
          break;

         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          alreadyUpFlag = true;
          cc.log("Already up to date with the latest remote version.");
          break;

         case jsb.EventAssetsManager.NEW_VERSION_FOUND:
          newVerThere = true;
          break;

         default:
          return;
        }
        this._am.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
        cc.log("check = ", this._gameType);
        if (alreadyUpFlag) {
          cc.log("\u66f4\u65b0\u4e0b\u8f7d\u8fc7");
          if (this._gameType == cc.GAME_TYPES.LAUNCHER) {
            cc.log("\u5207\u5927\u5385");
            this._downOverFun();
          } else {
            cc.log("\u5207\u5165\u6e38\u620f =", this._gameType);
            if (true == isDownloadFail) {
              this._downOverFun(4);
              return;
            }
            if (this.m_downLoadFlag) {
              this._downOverFun(3);
              return;
            }
          }
        }
        if (newVerThere) {
          if (this.m_downLoadFlag) {
            this._downOverFun(1);
            return;
          }
          if (this._gameType == cc.GAME_TYPES.LAUNCHER) {
            var remoteVersionUrl = UpdateHelper.genUrl("", this._gameType) + "/" + UpdateHelper.projFileName();
            var localVersionUrl = this._storageManifestUrl;
          } else this.startVerionUpdate();
        }
      },
      _updateCb: function _updateCb(event) {
        var needRestart = false;
        var failed = false;
        var updateMsg = "";
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
          updateMsg = "No local manifest file found, hot update skipped.";
          failed = true;
          break;

         case jsb.EventAssetsManager.UPDATE_PROGRESSION:
          if (this._comUI) {
            var per = event.getPercent();
            this._comUI.downloadingView(per);
          }
          break;

         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
          updateMsg = "Fail to download manifest file, hot update skipped.";
          failed = true;
          break;

         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          updateMsg = "Already up to date with the latest remote version.";
          failed = true;
          break;

         case jsb.EventAssetsManager.UPDATE_FINISHED:
          updateMsg = "Update finished. " + event.getMessage();
          cc.log(updateMsg);
          needRestart = true;
          break;

         case jsb.EventAssetsManager.UPDATE_FAILED:
          updateMsg = "Update failed. " + event.getMessage();
          cc.log(updateMsg);
          this._updating = false;
          this._canRetry = true;
          this._retry();
          break;

         case jsb.EventAssetsManager.ERROR_UPDATING:
          updateMsg = "Asset update error: " + event.getAssetId() + ", " + event.getMessage();
          cc.log(updateMsg);
          break;

         case jsb.EventAssetsManager.ERROR_DECOMPRESS:
          updateMsg = event.getMessage();
          cc.log(updateMsg);
        }
        if (failed) {
          this._am.setEventCallback(null);
          this._updateListener = null;
          this._updating = false;
          $G.gCData.gIsGameDownloading[this._gameType] = false;
        }
        if (needRestart) {
          UpdateHelper.downloaded(this._gameType);
          this._am.setEventCallback(null);
          this._updateListener = null;
          this.m_downLoadFlag && this._downOverFun(3, true);
        }
      },
      _retry: function _retry() {
        if (!this._updating && this._canRetry && this.m_retryCount < 3) {
          this._canRetry = false;
          this._am.downloadFailedAssets();
          this.m_retryCount = this.m_retryCount + 1;
          return;
        }
        this.m_retryCount >= 3 && MsgHelper.pushToast("\u60a8\u5f53\u524d\u7f51\u7edc\u4e0d\u7a33\u5b9a");
      },
      _newAssetMgr: function _newAssetMgr() {
        var versionCompareHandle = function versionCompareHandle(versionA, versionB) {
          cc.log("versionCompareHandle");
          cc.log("JS Custom Version Compare: version A is " + versionA + ", version B is " + versionB);
          var vA = versionA.split(".");
          var vB = versionB.split(".");
          var first = parseInt(vB[0]) - parseInt(vA[0]);
          first >= 1 && jsb.fileUtils.removeDirectory(this._storagePath);
          for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) continue;
            return a - b;
          }
          return vB.length > vA.length ? -1 : 0;
        };
        cc.log("Storage path for remote asset : " + this._storagePath);
        if (!cc.sys.isNative) return "";
        this._am = new jsb.AssetsManager("", this._storagePath, versionCompareHandle);
        !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS;
        this._am.setVerifyCallback(function(path, asset) {
          cc.log("setVerifyCallback");
          var compressed = asset.compressed;
          var expectedMD5 = asset.md5;
          var relativePath = asset.path;
          var size = asset.size;
          if (compressed) {
            cc.log("Verification passed : %s ", relativePath);
            return true;
          }
          cc.log("Verification passed : " + relativePath + " (" + expectedMD5 + ")");
          return true;
        });
        cc.sys.os === cc.sys.OS_ANDROID && this._am.setMaxConcurrentTask(2);
      },
      gotoGame: function gotoGame() {
        cc.log("gotoGame=");
        if (this._gameType == cc.GAME_TYPES.LAUNCHER) {
          cc.log("gotoGame= Loading");
          replaceScene("Loading", function() {});
        } else {
          cc.log("this._gameType");
          cc.log(this._gameType);
          this.m_downLoadFlag ? this._downOverFun(2) : require(this._storagePath + "/src/main.js");
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  UpdateHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "46523MaLSxEtqsOI4ql2+Ne", "UpdateHelper");
    "use strict";
    var STORAGE_SUB_PATH = "update";
    var PROJECT_CFG_FILE = "project.manifest";
    var VERSION_CFG_FILE = "version.manifest";
    var DOWNLOADED_MARK = "downloaded";
    module.exports = cc.Class({
      name: "UpdateHelper",
      statics: {
        _url: "",
        _gameType: "",
        _skin: "",
        _storage_path: "",
        _root_folder: STORAGE_SUB_PATH,
        _proj_cfg_file: PROJECT_CFG_FILE,
        _ver_cfg_file: VERSION_CFG_FILE,
        init: function init(gameType, skin) {
          var skilFolderName = skin;
          null == skilFolderName && (skilFolderName = "");
          cc.log("game XXXXX skilFolderName = ", skilFolderName);
          skilFolderName && this.skin(skilFolderName);
          this.gameType(gameType);
          var url = this.genUrl();
          var path = this.genStoragePath();
          this.url(this.genUrl());
          this.storagePath(this.genStoragePath());
        },
        gameType: function gameType(val) {
          val && (this._gameType = val);
          return this._gameType;
        },
        url: function url(val) {
          val && (this._url = val);
          return this._url;
        },
        skin: function skin(val) {
          val && (this._skin = val);
          return this._skin;
        },
        storagePath: function storagePath(val) {
          val && (this._storage_path = val);
          return this._storage_path;
        },
        rootFolder: function rootFolder(val) {
          val && (this._root_folder = val);
          return this._root_folder;
        },
        prjFileName: function prjFileName(val) {
          val && (this._proj_cfg_file = val);
          return this._proj_cfg_file;
        },
        verFileName: function verFileName(val) {
          val && (this._ver_cfg_file = val);
          return this._ver_cfg_file;
        },
        genStoragePath: function genStoragePath(gameType) {
          if (!cc.sys.isNative) return "";
          gameType = gameType || this.gameType();
          return (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + this.rootFolder() + "/" + gameType;
        },
        genUrl: function genUrl(skin, gameType) {
          gameType = gameType || this.gameType();
          var url = "http://localhost/games/";
          return url + gameType;
        },
        downloaded: function downloaded(gameType) {
          var value = _.isNull(gameType) ? this.gameType() : void 0;
          gameType = gameType || this.gameType();
          var store_key = DOWNLOADED_MARK + gameType;
          cc.sys.localStorage.setItem(store_key, gameType);
        },
        isDownloaded: function isDownloaded(gameType) {
          gameType = gameType || this.gameType();
          var store_key = DOWNLOADED_MARK + gameType;
          var store_value = cc.sys.localStorage.getItem(store_key);
          cc.log("store:" + store_value);
          return store_value === gameType;
        },
        showUI: function showUI() {
          var isHall = this.gameType() === cc.GAME_TYPES.HALL;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  XXTea: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1164uRvjlKi6kGERC9hEtF", "XXTea");
    "use strict";
    function long2str(v, w) {
      var vl = v.length;
      var n = vl - 1 << 2;
      if (w) {
        var m = v[vl - 1];
        if (m < n - 3 || m > n) return null;
        n = m;
      }
      for (var i = 0; i < vl; i++) v[i] = String.fromCharCode(255 & v[i], v[i] >>> 8 & 255, v[i] >>> 16 & 255, v[i] >>> 24 & 255);
      return w ? v.join("").substring(0, n) : v.join("");
    }
    function str2long(s, w) {
      var len = s.length;
      var v = [];
      for (var i = 0; i < len; i += 4) v[i >> 2] = s.charCodeAt(i) | s.charCodeAt(i + 1) << 8 | s.charCodeAt(i + 2) << 16 | s.charCodeAt(i + 3) << 24;
      w && (v[v.length] = len);
      return v;
    }
    function encrypt(str, key) {
      if ("" == str) return "";
      var v = str2long(str, true);
      var k = str2long(key, false);
      k.length < 4 && (k.length = 4);
      var n = v.length - 1;
      var z = v[n], y = v[0], delta = 2654435769;
      var mx, e, p, q = Math.floor(6 + 52 / (n + 1)), sum = 0;
      while (0 < q--) {
        sum = sum + delta & 4294967295;
        e = sum >>> 2 & 3;
        for (p = 0; p < n; p++) {
          y = v[p + 1];
          mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[3 & p ^ e] ^ z);
          z = v[p] = v[p] + mx & 4294967295;
        }
        y = v[0];
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[3 & p ^ e] ^ z);
        z = v[n] = v[n] + mx & 4294967295;
      }
      return long2str(v, false);
    }
    function decrypt(str, key) {
      if ("" == str) return "";
      var v = str2long(str, false);
      var k = str2long(key, false);
      k.length < 4 && (k.length = 4);
      var n = v.length - 1;
      var z = v[n - 1], y = v[0], delta = 2654435769;
      var mx, e, p, q = Math.floor(6 + 52 / (n + 1)), sum = q * delta & 4294967295;
      while (0 != sum) {
        e = sum >>> 2 & 3;
        for (p = n; p > 0; p--) {
          z = v[p - 1];
          mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[3 & p ^ e] ^ z);
          y = v[p] = v[p] - mx & 4294967295;
        }
        z = v[n];
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[3 & p ^ e] ^ z);
        y = v[0] = v[0] - mx & 4294967295;
        sum = sum - delta & 4294967295;
      }
      return long2str(v, true);
    }
    function encodeUTF8(str) {
      str || (str = "");
      str = str.replace(/[\u0080-\u07ff]/g, function(c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(192 | cc >> 6, 128 | 63 & cc);
      });
      str = str.replace(/[\u0800-\uffff]/g, function(c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(224 | cc >> 12, 128 | cc >> 6 & 63, 128 | 63 & cc);
      });
      return str;
    }
    function decodeUTF8(str) {
      str || (str = "");
      str = str.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function(c) {
        var cc = (31 & c.charCodeAt(0)) << 6 | 63 & c.charCodeAt(1);
        return String.fromCharCode(cc);
      });
      str = str.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function(c) {
        var cc = (15 & c.charCodeAt(0)) << 12 | (63 & c.charCodeAt(1)) << 6 | 63 & c.charCodeAt(2);
        return String.fromCharCode(cc);
      });
      return str;
    }
    function utf16to8(str) {
      var out, i, len, c;
      out = "";
      len = str.length;
      for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 1 && c <= 127) out += str.charAt(i); else if (c > 2047) {
          out += String.fromCharCode(224 | c >> 12 & 15);
          out += String.fromCharCode(128 | c >> 6 & 63);
          out += String.fromCharCode(128 | c >> 0 & 63);
        } else {
          out += String.fromCharCode(192 | c >> 6 & 31);
          out += String.fromCharCode(128 | c >> 0 & 63);
        }
      }
      return out;
    }
    function utf8to16(str) {
      var out, i, len, c;
      var char2, char3;
      out = "";
      len = str.length;
      i = 0;
      while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
         case 0:
         case 1:
         case 2:
         case 3:
         case 4:
         case 5:
         case 6:
         case 7:
          out += str.charAt(i - 1);
          break;

         case 12:
         case 13:
          char2 = str.charCodeAt(i++);
          out += String.fromCharCode((31 & c) << 6 | 63 & char2);
          break;

         case 14:
          char2 = str.charCodeAt(i++);
          char3 = str.charCodeAt(i++);
          out += String.fromCharCode((15 & c) << 12 | (63 & char2) << 6 | (63 & char3) << 0);
        }
      }
      return out;
    }
    module.exports = {
      encrypt: encrypt,
      decrypt: decrypt
    };
    cc._RF.pop();
  }, {} ],
  "big-number": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1183FP6tFANIl++WQRDjk+", "big-number");
    "use strict";
    var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    !function() {
      var testDigit = function testDigit(digit) {
        return /^\d$/.test(digit);
      };
      var abs = function abs(number) {
        var bigNumber;
        if ("undefined" === typeof number) return;
        bigNumber = BigNumber(number);
        bigNumber.sign = 1;
        return bigNumber;
      };
      var isArray = function isArray(arg) {
        return "[object Array]" === Object.prototype.toString.call(arg);
      };
      var errors = {
        invalid: "Invalid Number",
        "division by zero": "Invalid Number - Division By Zero"
      };
      function BigNumber(initialNumber) {
        var index;
        if (!(this instanceof BigNumber)) return new BigNumber(initialNumber);
        this.number = [];
        this.sign = 1;
        this.rest = 0;
        if (!initialNumber) {
          this.number = [ 0 ];
          return;
        }
        if (isArray(initialNumber)) {
          if (initialNumber.length && "-" === initialNumber[0] || "+" === initialNumber[0]) {
            this.sign = "+" === initialNumber[0] ? 1 : -1;
            initialNumber.shift(0);
          }
          for (index = initialNumber.length - 1; index >= 0; index--) if (!this.addDigit(initialNumber[index])) return;
        } else {
          initialNumber = initialNumber.toString();
          if ("-" === initialNumber.charAt(0) || "+" === initialNumber.charAt(0)) {
            this.sign = "+" === initialNumber.charAt(0) ? 1 : -1;
            initialNumber = initialNumber.substring(1);
          }
          for (index = initialNumber.length - 1; index >= 0; index--) if (!this.addDigit(parseInt(initialNumber.charAt(index), 10))) return;
        }
      }
      BigNumber.prototype.addDigit = function(digit) {
        if (!testDigit(digit)) {
          this.number = errors["invalid"];
          return false;
        }
        this.number.push(digit);
        return this;
      };
      BigNumber.prototype._compare = function(number) {
        var bigNumber;
        var index;
        if ("undefined" === typeof number) return 0;
        bigNumber = BigNumber(number);
        if (this.sign !== bigNumber.sign) return this.sign;
        if (this.number.length > bigNumber.number.length) return this.sign;
        if (this.number.length < bigNumber.number.length) return -1 * this.sign;
        for (index = this.number.length - 1; index >= 0; index--) {
          if (this.number[index] > bigNumber.number[index]) return this.sign;
          if (this.number[index] < bigNumber.number[index]) return -1 * this.sign;
        }
        return 0;
      };
      BigNumber.prototype.gt = function(number) {
        return this._compare(number) > 0;
      };
      BigNumber.prototype.gte = function(number) {
        return this._compare(number) >= 0;
      };
      BigNumber.prototype.equals = function(number) {
        return 0 === this._compare(number);
      };
      BigNumber.prototype.lte = function(number) {
        return this._compare(number) <= 0;
      };
      BigNumber.prototype.lt = function(number) {
        return this._compare(number) < 0;
      };
      BigNumber.prototype.add = function(number) {
        var bigNumber;
        if ("undefined" === typeof number) return this;
        bigNumber = BigNumber(number);
        if (this.sign !== bigNumber.sign) {
          if (this.sign > 0) {
            bigNumber.sign = 1;
            return this.minus(bigNumber);
          }
          this.sign = 1;
          return bigNumber.minus(this);
        }
        this.number = BigNumber._add(this, bigNumber);
        return this;
      };
      BigNumber.prototype.subtract = function(number) {
        var bigNumber;
        if ("undefined" === typeof number) return this;
        bigNumber = BigNumber(number);
        if (this.sign !== bigNumber.sign) {
          this.number = BigNumber._add(this, bigNumber);
          return this;
        }
        this.sign = this.lt(bigNumber) ? -1 : 1;
        this.number = abs(this).lt(abs(bigNumber)) ? BigNumber._subtract(bigNumber, this) : BigNumber._subtract(this, bigNumber);
        return this;
      };
      BigNumber._add = function(a, b) {
        var index;
        var remainder = 0;
        var length = Math.max(a.number.length, b.number.length);
        for (index = 0; index < length || remainder > 0; index++) {
          a.number[index] = (remainder += (a.number[index] || 0) + (b.number[index] || 0)) % 10;
          remainder = Math.floor(remainder / 10);
        }
        return a.number;
      };
      BigNumber._subtract = function(a, b) {
        var index;
        var remainder = 0;
        var length = a.number.length;
        for (index = 0; index < length; index++) {
          a.number[index] -= (b.number[index] || 0) + remainder;
          a.number[index] += 10 * (remainder = a.number[index] < 0 ? 1 : 0);
        }
        index = 0;
        length = a.number.length - 1;
        while (0 === a.number[length - index] && length - index > 0) index++;
        index > 0 && a.number.splice(-index);
        return a.number;
      };
      BigNumber.prototype.multiply = function(number) {
        if ("undefined" === typeof number) return this;
        var bigNumber = BigNumber(number);
        var index;
        var givenNumberIndex;
        var remainder = 0;
        var result = [];
        if (this.isZero() || bigNumber.isZero()) return BigNumber(0);
        this.sign *= bigNumber.sign;
        for (index = 0; index < this.number.length; index++) for (remainder = 0, givenNumberIndex = 0; givenNumberIndex < bigNumber.number.length || remainder > 0; givenNumberIndex++) {
          result[index + givenNumberIndex] = (remainder += (result[index + givenNumberIndex] || 0) + this.number[index] * (bigNumber.number[givenNumberIndex] || 0)) % 10;
          remainder = Math.floor(remainder / 10);
        }
        this.number = result;
        return this;
      };
      BigNumber.prototype.divide = function(number) {
        if ("undefined" === typeof number) return this;
        var bigNumber = BigNumber(number);
        var index;
        var length;
        var result = [];
        var rest = BigNumber();
        if (bigNumber.isZero()) {
          this.number = errors["division by zero"];
          return this;
        }
        if (this.isZero()) return BigNumber(0);
        this.sign *= bigNumber.sign;
        bigNumber.sign = 1;
        if (1 === bigNumber.number.length && 1 === bigNumber.number[0]) return this;
        for (index = this.number.length - 1; index >= 0; index--) {
          rest.multiply(10);
          rest.number[0] = this.number[index];
          result[index] = 0;
          while (bigNumber.lte(rest)) {
            result[index]++;
            rest.subtract(bigNumber);
          }
        }
        index = 0;
        length = result.length - 1;
        while (0 === result[length - index] && length - index > 0) index++;
        index > 0 && result.splice(-index);
        this.rest = rest;
        this.number = result;
        return this;
      };
      BigNumber.prototype.mod = function(number) {
        return this.divide(number).rest;
      };
      BigNumber.prototype.power = function(number) {
        if ("undefined" === typeof number) return;
        var bigNumber;
        number = +number;
        if (0 === number) return BigNumber(1);
        if (1 === number) return this;
        bigNumber = BigNumber(this);
        this.number = [ 1 ];
        while (number > 0) {
          if (number % 2 === 1) {
            this.multiply(bigNumber);
            number--;
            continue;
          }
          bigNumber.multiply(bigNumber);
          number = Math.floor(number / 2);
        }
        return this;
      };
      BigNumber.prototype.abs = function() {
        this.sign = 1;
        return this;
      };
      BigNumber.prototype.isZero = function() {
        var index;
        for (index = 0; index < this.number.length; index++) if (0 !== this.number[index]) return false;
        return true;
      };
      BigNumber.prototype.toString = function() {
        var index;
        var str = "";
        if ("string" === typeof this.number) return this.number;
        for (index = this.number.length - 1; index >= 0; index--) str += this.number[index];
        return this.sign > 0 ? str : "-" + str;
      };
      BigNumber.prototype.plus = BigNumber.prototype.add;
      BigNumber.prototype.minus = BigNumber.prototype.subtract;
      BigNumber.prototype.mult = BigNumber.prototype.multiply;
      BigNumber.prototype.times = BigNumber.prototype.multiply;
      BigNumber.prototype.div = BigNumber.prototype.divide;
      BigNumber.prototype.pow = BigNumber.prototype.power;
      BigNumber.prototype.val = BigNumber.prototype.toString;
      "object" === ("undefined" === typeof exports ? "undefined" : _typeof(exports)) && "undefined" !== typeof module ? module.exports = BigNumber : "function" === typeof define && define.amd ? define([ "BigNumber" ], BigNumber) : "undefined" !== typeof window && (window.BigNumber = BigNumber);
    }();
    cc._RF.pop();
  }, {} ],
  pomelo: [ function(require, module, exports) {
    (function(Buffer) {
      "use strict";
      cc._RF.push(module, "a1196wHayRDXIdIPbMHSGGT", "pomelo");
      "use strict";
      module.exports = Emitter;
      window.EventEmitter = Emitter;
      function Emitter(obj) {
        if (obj) return mixin(obj);
      }
      function mixin(obj) {
        for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
        return obj;
      }
      Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
        if (this.hasListeners(event)) return;
        this._callbacks = this._callbacks || {};
        (this._callbacks[event] = this._callbacks[event] || []).push(fn);
        return this;
      };
      Emitter.prototype.once = function(event, fn) {
        var self = this;
        this._callbacks = this._callbacks || {};
        function on() {
          self.off(event, on);
          fn.apply(this, arguments);
        }
        on.fn = fn;
        this.on(event, on);
        return this;
      };
      Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
        this._callbacks = this._callbacks || {};
        if (0 == arguments.length) {
          this._callbacks = {};
          return this;
        }
        var callbacks = this._callbacks[event];
        if (!callbacks) return this;
        if (1 == arguments.length) {
          delete this._callbacks[event];
          return this;
        }
        var cb;
        for (var i = 0; i < callbacks.length; i++) {
          cb = callbacks[i];
          if (cb === fn || cb.fn === fn) {
            callbacks.splice(i, 1);
            break;
          }
        }
        return this;
      };
      Emitter.prototype.emit = function(event) {
        this._callbacks = this._callbacks || {};
        var args = [].slice.call(arguments, 1), callbacks = this._callbacks[event];
        if (callbacks) {
          callbacks = callbacks.slice(0);
          for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args);
        }
        return this;
      };
      Emitter.prototype.listeners = function(event) {
        this._callbacks = this._callbacks || {};
        return this._callbacks[event] || [];
      };
      Emitter.prototype.hasListeners = function(event) {
        return !!this.listeners(event).length;
      };
      (function(exports, global) {
        var Protobuf = exports;
        Protobuf.init = function(opts) {
          Protobuf.encoder.init(opts.encoderProtos);
          Protobuf.decoder.init(opts.decoderProtos);
        };
        Protobuf.encode = function(key, msg) {
          return Protobuf.encoder.encode(key, msg);
        };
        Protobuf.decode = function(key, msg) {
          return Protobuf.decoder.decode(key, msg);
        };
        module.exports = Protobuf;
        "undefined" != typeof window && (window.protobuf = Protobuf);
      })(module.exports, void 0);
      (function(exports, global) {
        var constants = exports.constants = {};
        constants.TYPES = {
          uInt32: 0,
          sInt32: 0,
          int32: 0,
          double: 1,
          string: 2,
          message: 2,
          float: 5
        };
      })("undefined" !== typeof protobuf ? protobuf : module.exports, void 0);
      (function(exports, global) {
        var Util = exports.util = {};
        Util.isSimpleType = function(type) {
          return "uInt32" === type || "sInt32" === type || "int32" === type || "uInt64" === type || "sInt64" === type || "float" === type || "double" === type;
        };
      })("undefined" !== typeof protobuf ? protobuf : module.exports, void 0);
      (function(exports, global) {
        var Codec = exports.codec = {};
        var buffer = new ArrayBuffer(8);
        var float32Array = new Float32Array(buffer);
        var float64Array = new Float64Array(buffer);
        var uInt8Array = new Uint8Array(buffer);
        Codec.encodeUInt32 = function(n) {
          var n = parseInt(n);
          if (isNaN(n) || n < 0) return null;
          var result = [];
          do {
            var tmp = n % 128;
            var next = Math.floor(n / 128);
            0 !== next && (tmp += 128);
            result.push(tmp);
            n = next;
          } while (0 !== n);
          return result;
        };
        Codec.encodeSInt32 = function(n) {
          var n = parseInt(n);
          if (isNaN(n)) return null;
          n = n < 0 ? 2 * Math.abs(n) - 1 : 2 * n;
          return Codec.encodeUInt32(n);
        };
        Codec.decodeUInt32 = function(bytes) {
          var n = 0;
          for (var i = 0; i < bytes.length; i++) {
            var m = parseInt(bytes[i]);
            n += (127 & m) * Math.pow(2, 7 * i);
            if (m < 128) return n;
          }
          return n;
        };
        Codec.decodeSInt32 = function(bytes) {
          var n = this.decodeUInt32(bytes);
          var flag = n % 2 === 1 ? -1 : 1;
          n = (n % 2 + n) / 2 * flag;
          return n;
        };
        Codec.encodeFloat = function(float) {
          float32Array[0] = float;
          return uInt8Array;
        };
        Codec.decodeFloat = function(bytes, offset) {
          if (!bytes || bytes.length < offset + 4) return null;
          for (var i = 0; i < 4; i++) uInt8Array[i] = bytes[offset + i];
          return float32Array[0];
        };
        Codec.encodeDouble = function(double) {
          float64Array[0] = double;
          return uInt8Array.subarray(0, 8);
        };
        Codec.decodeDouble = function(bytes, offset) {
          if (!bytes || bytes.length < 8 + offset) return null;
          for (var i = 0; i < 8; i++) uInt8Array[i] = bytes[offset + i];
          return float64Array[0];
        };
        Codec.encodeStr = function(bytes, offset, str) {
          for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            var codes = encode2UTF8(code);
            for (var j = 0; j < codes.length; j++) {
              bytes[offset] = codes[j];
              offset++;
            }
          }
          return offset;
        };
        Codec.decodeStr = function(bytes, offset, length) {
          var array = [];
          var end = offset + length;
          while (offset < end) {
            var code = 0;
            if (bytes[offset] < 128) {
              code = bytes[offset];
              offset += 1;
            } else if (bytes[offset] < 224) {
              code = ((63 & bytes[offset]) << 6) + (63 & bytes[offset + 1]);
              offset += 2;
            } else {
              code = ((15 & bytes[offset]) << 12) + ((63 & bytes[offset + 1]) << 6) + (63 & bytes[offset + 2]);
              offset += 3;
            }
            array.push(code);
          }
          var str = "";
          for (var i = 0; i < array.length; ) {
            str += String.fromCharCode.apply(null, array.slice(i, i + 1e4));
            i += 1e4;
          }
          return str;
        };
        Codec.byteLength = function(str) {
          if ("string" !== typeof str) return -1;
          var length = 0;
          for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            length += codeLength(code);
          }
          return length;
        };
        function encode2UTF8(charCode) {
          return charCode <= 127 ? [ charCode ] : charCode <= 2047 ? [ 192 | charCode >> 6, 128 | 63 & charCode ] : [ 224 | charCode >> 12, 128 | (4032 & charCode) >> 6, 128 | 63 & charCode ];
        }
        function codeLength(code) {
          return code <= 127 ? 1 : code <= 2047 ? 2 : 3;
        }
      })("undefined" !== typeof protobuf ? protobuf : module.exports, void 0);
      (function(exports, global) {
        var protobuf = exports;
        var MsgEncoder = exports.encoder = {};
        var codec = protobuf.codec;
        var constant = protobuf.constants;
        var util = protobuf.util;
        MsgEncoder.init = function(protos) {
          this.protos = protos || {};
        };
        MsgEncoder.encode = function(route, msg) {
          var protos = this.protos[route];
          if (!checkMsg(msg, protos)) return null;
          var length = codec.byteLength(JSON.stringify(msg));
          var buffer = new ArrayBuffer(length);
          var uInt8Array = new Uint8Array(buffer);
          var offset = 0;
          if (!!protos) {
            offset = encodeMsg(uInt8Array, offset, protos, msg);
            if (offset > 0) return uInt8Array.subarray(0, offset);
          }
          return null;
        };
        function checkMsg(msg, protos) {
          if (!protos) return false;
          for (var name in protos) {
            var proto = protos[name];
            switch (proto.option) {
             case "required":
              if ("undefined" === typeof msg[name]) return false;

             case "optional":
              "undefined" !== typeof msg[name] && (!protos.__messages[proto.type] || checkMsg(msg[name], protos.__messages[proto.type]));
              break;

             case "repeated":
              if (!!msg[name] && !!protos.__messages[proto.type]) for (var i = 0; i < msg[name].length; i++) if (!checkMsg(msg[name][i], protos.__messages[proto.type])) return false;
            }
          }
          return true;
        }
        function encodeMsg(buffer, offset, protos, msg) {
          for (var name in msg) if (!!protos[name]) {
            var proto = protos[name];
            switch (proto.option) {
             case "required":
             case "optional":
              offset = writeBytes(buffer, offset, encodeTag(proto.type, proto.tag));
              offset = encodeProp(msg[name], proto.type, offset, buffer, protos);
              break;

             case "repeated":
              msg[name].length > 0 && (offset = encodeArray(msg[name], proto, offset, buffer, protos));
            }
          }
          return offset;
        }
        function encodeProp(value, type, offset, buffer, protos) {
          switch (type) {
           case "uInt32":
            offset = writeBytes(buffer, offset, codec.encodeUInt32(value));
            break;

           case "int32":
           case "sInt32":
            offset = writeBytes(buffer, offset, codec.encodeSInt32(value));
            break;

           case "float":
            writeBytes(buffer, offset, codec.encodeFloat(value));
            offset += 4;
            break;

           case "double":
            writeBytes(buffer, offset, codec.encodeDouble(value));
            offset += 8;
            break;

           case "string":
            var length = codec.byteLength(value);
            offset = writeBytes(buffer, offset, codec.encodeUInt32(length));
            codec.encodeStr(buffer, offset, value);
            offset += length;
            break;

           default:
            if (!!protos.__messages[type]) {
              var tmpBuffer = new ArrayBuffer(codec.byteLength(JSON.stringify(value)));
              var length = 0;
              length = encodeMsg(tmpBuffer, length, protos.__messages[type], value);
              offset = writeBytes(buffer, offset, codec.encodeUInt32(length));
              for (var i = 0; i < length; i++) {
                buffer[offset] = tmpBuffer[i];
                offset++;
              }
            }
          }
          return offset;
        }
        function encodeArray(array, proto, offset, buffer, protos) {
          var i = 0;
          if (util.isSimpleType(proto.type)) {
            offset = writeBytes(buffer, offset, encodeTag(proto.type, proto.tag));
            offset = writeBytes(buffer, offset, codec.encodeUInt32(array.length));
            for (i = 0; i < array.length; i++) offset = encodeProp(array[i], proto.type, offset, buffer);
          } else for (i = 0; i < array.length; i++) {
            offset = writeBytes(buffer, offset, encodeTag(proto.type, proto.tag));
            offset = encodeProp(array[i], proto.type, offset, buffer, protos);
          }
          return offset;
        }
        function writeBytes(buffer, offset, bytes) {
          for (var i = 0; i < bytes.length; i++, offset++) buffer[offset] = bytes[i];
          return offset;
        }
        function encodeTag(type, tag) {
          var value = constant.TYPES[type] || 2;
          return codec.encodeUInt32(tag << 3 | value);
        }
      })("undefined" !== typeof protobuf ? protobuf : module.exports, void 0);
      (function(exports, global) {
        var protobuf = exports;
        var MsgDecoder = exports.decoder = {};
        var codec = protobuf.codec;
        var util = protobuf.util;
        var buffer;
        var offset = 0;
        MsgDecoder.init = function(protos) {
          this.protos = protos || {};
        };
        MsgDecoder.setProtos = function(protos) {
          !protos || (this.protos = protos);
        };
        MsgDecoder.decode = function(route, buf) {
          var protos = this.protos[route];
          buffer = buf;
          offset = 0;
          if (!!protos) return decodeMsg({}, protos, buffer.length);
          return null;
        };
        function decodeMsg(msg, protos, length) {
          while (offset < length) {
            var head = getHead();
            var type = head.type;
            var tag = head.tag;
            var name = protos.__tags[tag];
            switch (protos[name].option) {
             case "optional":
             case "required":
              msg[name] = decodeProp(protos[name].type, protos);
              break;

             case "repeated":
              msg[name] || (msg[name] = []);
              decodeArray(msg[name], protos[name].type, protos);
            }
          }
          return msg;
        }
        function isFinish(msg, protos) {
          return !protos.__tags[peekHead().tag];
        }
        function getHead() {
          var tag = codec.decodeUInt32(getBytes());
          return {
            type: 7 & tag,
            tag: tag >> 3
          };
        }
        function peekHead() {
          var tag = codec.decodeUInt32(peekBytes());
          return {
            type: 7 & tag,
            tag: tag >> 3
          };
        }
        function decodeProp(type, protos) {
          switch (type) {
           case "uInt32":
            return codec.decodeUInt32(getBytes());

           case "int32":
           case "sInt32":
            return codec.decodeSInt32(getBytes());

           case "float":
            var float = codec.decodeFloat(buffer, offset);
            offset += 4;
            return float;

           case "double":
            var double = codec.decodeDouble(buffer, offset);
            offset += 8;
            return double;

           case "string":
            var length = codec.decodeUInt32(getBytes());
            var str = codec.decodeStr(buffer, offset, length);
            offset += length;
            return str;

           default:
            if (!!protos && !!protos.__messages[type]) {
              var length = codec.decodeUInt32(getBytes());
              var msg = {};
              decodeMsg(msg, protos.__messages[type], offset + length);
              return msg;
            }
          }
        }
        function decodeArray(array, type, protos) {
          if (util.isSimpleType(type)) {
            var length = codec.decodeUInt32(getBytes());
            for (var i = 0; i < length; i++) array.push(decodeProp(type));
          } else array.push(decodeProp(type, protos));
        }
        function getBytes(flag) {
          var bytes = [];
          var pos = offset;
          flag = flag || false;
          var b;
          do {
            b = buffer[pos];
            bytes.push(b);
            pos++;
          } while (b >= 128);
          flag || (offset = pos);
          return bytes;
        }
        function peekBytes() {
          return getBytes(true);
        }
      })("undefined" !== typeof protobuf ? protobuf : module.exports, void 0);
      (function(exports, ByteArray, global) {
        var Protocol = exports;
        var PKG_HEAD_BYTES = 4;
        var MSG_FLAG_BYTES = 1;
        var MSG_ROUTE_CODE_BYTES = 2;
        var MSG_ID_MAX_BYTES = 5;
        var MSG_ROUTE_LEN_BYTES = 1;
        var MSG_ROUTE_CODE_MAX = 65535;
        var MSG_COMPRESS_ROUTE_MASK = 1;
        var MSG_TYPE_MASK = 7;
        var Package = Protocol.Package = {};
        var Message = Protocol.Message = {};
        Package.TYPE_HANDSHAKE = 1;
        Package.TYPE_HANDSHAKE_ACK = 2;
        Package.TYPE_HEARTBEAT = 3;
        Package.TYPE_DATA = 4;
        Package.TYPE_KICK = 5;
        Message.TYPE_REQUEST = 0;
        Message.TYPE_NOTIFY = 1;
        Message.TYPE_RESPONSE = 2;
        Message.TYPE_PUSH = 3;
        Protocol.strencode = function(str) {
          var byteArray = new ByteArray(3 * str.length);
          var offset = 0;
          for (var i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            var codes = null;
            codes = charCode <= 127 ? [ charCode ] : charCode <= 2047 ? [ 192 | charCode >> 6, 128 | 63 & charCode ] : [ 224 | charCode >> 12, 128 | (4032 & charCode) >> 6, 128 | 63 & charCode ];
            for (var j = 0; j < codes.length; j++) {
              byteArray[offset] = codes[j];
              ++offset;
            }
          }
          var _buffer = new ByteArray(offset);
          copyArray(_buffer, 0, byteArray, 0, offset);
          return _buffer;
        };
        Protocol.strdecode = function(buffer) {
          var bytes = new ByteArray(buffer);
          var array = [];
          var offset = 0;
          var charCode = 0;
          var end = bytes.length;
          while (offset < end) {
            if (bytes[offset] < 128) {
              charCode = bytes[offset];
              offset += 1;
            } else if (bytes[offset] < 224) {
              charCode = ((63 & bytes[offset]) << 6) + (63 & bytes[offset + 1]);
              offset += 2;
            } else {
              charCode = ((15 & bytes[offset]) << 12) + ((63 & bytes[offset + 1]) << 6) + (63 & bytes[offset + 2]);
              offset += 3;
            }
            array.push(charCode);
          }
          return String.fromCharCode.apply(null, array);
        };
        Package.encode = function(type, body) {
          var length = body ? body.length : 0;
          var buffer = new ByteArray(PKG_HEAD_BYTES + length);
          var index = 0;
          buffer[index++] = 255 & type;
          buffer[index++] = length >> 16 & 255;
          buffer[index++] = length >> 8 & 255;
          buffer[index++] = 255 & length;
          body && copyArray(buffer, index, body, 0, length);
          return buffer;
        };
        Package.decode = function(buffer) {
          var offset = 0;
          var bytes = new ByteArray(buffer);
          var length = 0;
          var rs = [];
          while (offset < bytes.length) {
            var type = bytes[offset++];
            length = (bytes[offset++] << 16 | bytes[offset++] << 8 | bytes[offset++]) >>> 0;
            var body = length ? new ByteArray(length) : null;
            copyArray(body, 0, bytes, offset, length);
            offset += length;
            rs.push({
              type: type,
              body: body
            });
          }
          return 1 === rs.length ? rs[0] : rs;
        };
        Message.encode = function(id, type, compressRoute, route, msg) {
          var idBytes = msgHasId(type) ? caculateMsgIdBytes(id) : 0;
          var msgLen = MSG_FLAG_BYTES + idBytes;
          if (msgHasRoute(type)) if (compressRoute) {
            if ("number" !== typeof route) throw new Error("error flag for number route!");
            msgLen += MSG_ROUTE_CODE_BYTES;
          } else {
            msgLen += MSG_ROUTE_LEN_BYTES;
            if (route) {
              route = Protocol.strencode(route);
              if (route.length > 255) throw new Error("route maxlength is overflow");
              msgLen += route.length;
            }
          }
          msg && (msgLen += msg.length);
          var buffer = new ByteArray(msgLen);
          var offset = 0;
          offset = encodeMsgFlag(type, compressRoute, buffer, offset);
          msgHasId(type) && (offset = encodeMsgId(id, buffer, offset));
          msgHasRoute(type) && (offset = encodeMsgRoute(compressRoute, route, buffer, offset));
          msg && (offset = encodeMsgBody(msg, buffer, offset));
          return buffer;
        };
        Message.decode = function(buffer) {
          var bytes = new ByteArray(buffer);
          var bytesLen = bytes.length || bytes.byteLength;
          var offset = 0;
          var id = 0;
          var route = null;
          var flag = bytes[offset++];
          var compressRoute = flag & MSG_COMPRESS_ROUTE_MASK;
          var type = flag >> 1 & MSG_TYPE_MASK;
          if (msgHasId(type)) {
            var m = parseInt(bytes[offset]);
            var i = 0;
            do {
              var m = parseInt(bytes[offset]);
              id += (127 & m) * Math.pow(2, 7 * i);
              offset++;
              i++;
            } while (m >= 128);
          }
          if (msgHasRoute(type)) if (compressRoute) route = bytes[offset++] << 8 | bytes[offset++]; else {
            var routeLen = bytes[offset++];
            if (routeLen) {
              route = new ByteArray(routeLen);
              copyArray(route, 0, bytes, offset, routeLen);
              route = Protocol.strdecode(route);
            } else route = "";
            offset += routeLen;
          }
          var bodyLen = bytesLen - offset;
          var body = new ByteArray(bodyLen);
          copyArray(body, 0, bytes, offset, bodyLen);
          return {
            id: id,
            type: type,
            compressRoute: compressRoute,
            route: route,
            body: body
          };
        };
        var copyArray = function copyArray(dest, doffset, src, soffset, length) {
          if ("function" === typeof src.copy) src.copy(dest, doffset, soffset, soffset + length); else for (var index = 0; index < length; index++) dest[doffset++] = src[soffset++];
        };
        var msgHasId = function msgHasId(type) {
          return type === Message.TYPE_REQUEST || type === Message.TYPE_RESPONSE;
        };
        var msgHasRoute = function msgHasRoute(type) {
          return type === Message.TYPE_REQUEST || type === Message.TYPE_NOTIFY || type === Message.TYPE_PUSH;
        };
        var caculateMsgIdBytes = function caculateMsgIdBytes(id) {
          var len = 0;
          do {
            len += 1;
            id >>= 7;
          } while (id > 0);
          return len;
        };
        var encodeMsgFlag = function encodeMsgFlag(type, compressRoute, buffer, offset) {
          if (type !== Message.TYPE_REQUEST && type !== Message.TYPE_NOTIFY && type !== Message.TYPE_RESPONSE && type !== Message.TYPE_PUSH) throw new Error("unkonw message type: " + type);
          buffer[offset] = type << 1 | (compressRoute ? 1 : 0);
          return offset + MSG_FLAG_BYTES;
        };
        var encodeMsgId = function encodeMsgId(id, buffer, offset) {
          do {
            var tmp = id % 128;
            var next = Math.floor(id / 128);
            0 !== next && (tmp += 128);
            buffer[offset++] = tmp;
            id = next;
          } while (0 !== id);
          return offset;
        };
        var encodeMsgRoute = function encodeMsgRoute(compressRoute, route, buffer, offset) {
          if (compressRoute) {
            if (route > MSG_ROUTE_CODE_MAX) throw new Error("route number is overflow");
            buffer[offset++] = route >> 8 & 255;
            buffer[offset++] = 255 & route;
          } else if (route) {
            buffer[offset++] = 255 & route.length;
            copyArray(buffer, offset, route, 0, route.length);
            offset += route.length;
          } else buffer[offset++] = 0;
          return offset;
        };
        var encodeMsgBody = function encodeMsgBody(msg, buffer, offset) {
          copyArray(buffer, offset, msg, 0, msg.length);
          return offset + msg.length;
        };
        module.exports = Protocol;
        "undefined" != typeof window && (window.Protocol = Protocol);
      })(module.exports, "undefined" == typeof window ? Buffer : Uint8Array, void 0);
      (function() {
        var JS_WS_CLIENT_TYPE = "js-socketio";
        var JS_WS_CLIENT_VERSION = "0.0.1";
        var Protocol = window.Protocol;
        var Package = Protocol.Package;
        var Message = Protocol.Message;
        var EventEmitter = window.EventEmitter;
        "undefined" != typeof window && "undefined" != typeof sys && sys.localStorage && (window.localStorage = sys.localStorage);
        var RES_OK = 200;
        var RES_FAIL = 500;
        var RES_OLD_CLIENT = 501;
        "function" !== typeof Object.create && (Object.create = function(o) {
          function F() {}
          F.prototype = o;
          return new F();
        });
        var root = window;
        var pomelo = Object.create(EventEmitter.prototype);
        root.pomelo = pomelo;
        var socket = null;
        var reqId = 0;
        var callbacks = {};
        var handlers = {};
        var routeMap = {};
        var heartbeatInterval = 0;
        var heartbeatTimeout = 0;
        var nextHeartbeatTimeout = 0;
        var gapThreshold = 100;
        var heartbeatId = null;
        var heartbeatTimeoutId = null;
        var handshakeCallback = null;
        var decode = null;
        var encode = null;
        var useCrypto;
        var handshakeBuffer = {
          sys: {
            type: JS_WS_CLIENT_TYPE,
            version: JS_WS_CLIENT_VERSION
          },
          user: {}
        };
        var initCallback = null;
        pomelo.init = function(params, cb) {
          initCallback = cb;
          var host = params.host;
          var port = params.port;
          var url = "ws://" + host;
          port && (url += ":" + port);
          handshakeBuffer.user = params.user;
          handshakeCallback = params.handshakeCallback;
          initWebSocket(url, cb);
        };
        var initWebSocket = function initWebSocket(url, cb) {
          var onopen = function onopen(event) {
            var obj = Package.encode(Package.TYPE_HANDSHAKE, Protocol.strencode(JSON.stringify(handshakeBuffer)));
            send(obj);
          };
          var onmessage = function onmessage(event) {
            processPackage(Package.decode(event.data), cb);
            heartbeatTimeout && (nextHeartbeatTimeout = Date.now() + heartbeatTimeout);
          };
          var onerror = function onerror(event) {
            pomelo.emit("io-error", event);
            cc.error("socket error: ", event);
          };
          var onclose = function onclose(event) {
            pomelo.emit("close", event);
            pomelo.emit("disconnect", event);
            cc.error("socket close: ", event);
          };
          socket = new WebSocket(url);
          socket.binaryType = "arraybuffer";
          socket.onopen = onopen;
          socket.onmessage = onmessage;
          socket.onerror = onerror;
          socket.onclose = onclose;
        };
        pomelo.disconnect = function() {
          if (socket) {
            socket.disconnect && socket.disconnect();
            socket.close && socket.close();
            cc.log("disconnect");
            socket = null;
          }
          if (heartbeatId) {
            clearTimeout(heartbeatId);
            heartbeatId = null;
          }
          if (heartbeatTimeoutId) {
            clearTimeout(heartbeatTimeoutId);
            heartbeatTimeoutId = null;
          }
        };
        pomelo.request = function(route, msg, cb) {
          if (2 === arguments.length && "function" === typeof msg) {
            cb = msg;
            msg = {};
          } else msg = msg || {};
          route = route || msg.route;
          if (!route) return;
          reqId++;
          sendMessage(reqId, route, msg);
          callbacks[reqId] = cb;
          routeMap[reqId] = route;
        };
        pomelo.notify = function(route, msg) {
          msg = msg || {};
          sendMessage(0, route, msg);
        };
        var sendMessage = function sendMessage(reqId, route, msg) {
          var type = reqId ? Message.TYPE_REQUEST : Message.TYPE_NOTIFY;
          var protos = !pomelo.data.protos ? {} : pomelo.data.protos.client;
          msg = protos[route] ? protobuf.encode(route, msg) : Protocol.strencode(JSON.stringify(msg));
          var compressRoute = 0;
          if (pomelo.dict && pomelo.dict[route]) {
            route = pomelo.dict[route];
            compressRoute = 1;
          }
          msg = Message.encode(reqId, type, compressRoute, route, msg);
          var packet = Package.encode(Package.TYPE_DATA, msg);
          send(packet);
        };
        var send = function send(packet) {
          socket.send(packet.buffer);
        };
        var handler = {};
        var heartbeat = function heartbeat(data) {
          if (!heartbeatInterval) return;
          var obj = Package.encode(Package.TYPE_HEARTBEAT);
          if (heartbeatTimeoutId) {
            clearTimeout(heartbeatTimeoutId);
            heartbeatTimeoutId = null;
          }
          if (heartbeatId) return;
          heartbeatId = setTimeout(function() {
            heartbeatId = null;
            send(obj);
            nextHeartbeatTimeout = Date.now() + heartbeatTimeout;
            heartbeatTimeoutId = setTimeout(heartbeatTimeoutCb, heartbeatTimeout);
          }, heartbeatInterval);
        };
        var heartbeatTimeoutCb = function heartbeatTimeoutCb() {
          var gap = nextHeartbeatTimeout - Date.now();
          if (gap > gapThreshold) heartbeatTimeoutId = setTimeout(heartbeatTimeoutCb, gap); else {
            cc.error("server heartbeat timeout");
            pomelo.emit("heartbeat timeout");
            pomelo.disconnect();
          }
        };
        var handshake = function handshake(data) {
          data = JSON.parse(Protocol.strdecode(data));
          if (data.code === RES_OLD_CLIENT) {
            pomelo.emit("error", "client version not fullfill");
            return;
          }
          if (data.code !== RES_OK) {
            pomelo.emit("error", "handshake fail");
            return;
          }
          handshakeInit(data);
          var obj = Package.encode(Package.TYPE_HANDSHAKE_ACK);
          send(obj);
          if (initCallback) {
            initCallback(socket);
            initCallback = null;
          }
        };
        var onData = function onData(data) {
          var msg = Message.decode(data);
          if (msg.id > 0) {
            msg.route = routeMap[msg.id];
            delete routeMap[msg.id];
            if (!msg.route) return;
          }
          msg.body = deCompose(msg);
          processMessage(pomelo, msg);
        };
        var onKick = function onKick(data) {
          data = JSON.parse(Protocol.strdecode(data));
          pomelo.emit("onKick", data);
        };
        handlers[Package.TYPE_HANDSHAKE] = handshake;
        handlers[Package.TYPE_HEARTBEAT] = heartbeat;
        handlers[Package.TYPE_DATA] = onData;
        handlers[Package.TYPE_KICK] = onKick;
        var processPackage = function processPackage(msgs) {
          if (Array.isArray(msgs)) for (var i = 0; i < msgs.length; i++) {
            var msg = msgs[i];
            handlers[msg.type](msg.body);
          } else handlers[msgs.type](msgs.body);
        };
        var processMessage = function processMessage(pomelo, msg) {
          msg.id || pomelo.emit(msg.route, msg.body);
          var cb = callbacks[msg.id];
          delete callbacks[msg.id];
          if ("function" !== typeof cb) return;
          cb(msg.body);
          return;
        };
        var processMessageBatch = function processMessageBatch(pomelo, msgs) {
          for (var i = 0, l = msgs.length; i < l; i++) processMessage(pomelo, msgs[i]);
        };
        var deCompose = function deCompose(msg) {
          var protos = !pomelo.data.protos ? {} : pomelo.data.protos.server;
          var abbrs = pomelo.data.abbrs;
          var route = msg.route;
          if (msg.compressRoute) {
            if (!abbrs[route]) return {};
            route = msg.route = abbrs[route];
          }
          return protos[route] ? protobuf.decode(route, msg.body) : JSON.parse(Protocol.strdecode(msg.body));
        };
        var handshakeInit = function handshakeInit(data) {
          if (data.sys && data.sys.heartbeat) {
            heartbeatInterval = 1e3 * data.sys.heartbeat;
            heartbeatTimeout = 2 * heartbeatInterval;
          } else {
            heartbeatInterval = 0;
            heartbeatTimeout = 0;
          }
          initData(data);
          "function" === typeof handshakeCallback && handshakeCallback(data.user);
        };
        var initData = function initData(data) {
          if (!data || !data.sys) return;
          pomelo.data = pomelo.data || {};
          var dict = data.sys.dict;
          var protos = data.sys.protos;
          if (dict) {
            pomelo.data.dict = dict;
            pomelo.data.abbrs = {};
            for (var route in dict) pomelo.data.abbrs[dict[route]] = route;
          }
          if (protos) {
            pomelo.data.protos = {
              server: protos.server || {},
              client: protos.client || {}
            };
            !protobuf || protobuf.init({
              encoderProtos: protos.client,
              decoderProtos: protos.server
            });
          }
        };
        module.exports = pomelo;
      })();
      cc._RF.pop();
    }).call(this, require("buffer").Buffer);
  }, {
    buffer: 2
  } ],
  qrcode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a11bdRU43BKIoYBO9iSPPED", "qrcode");
    "use strict";
    function QR8bitByte(data) {
      this.mode = QRMode.MODE_8BIT_BYTE;
      this.data = data;
      this.parsedData = [];
      for (var i = 0, l = this.data.length; i < l; i++) {
        var byteArray = [];
        var code = this.data.charCodeAt(i);
        if (code > 65536) {
          byteArray[0] = 240 | (1835008 & code) >>> 18;
          byteArray[1] = 128 | (258048 & code) >>> 12;
          byteArray[2] = 128 | (4032 & code) >>> 6;
          byteArray[3] = 128 | 63 & code;
        } else if (code > 2048) {
          byteArray[0] = 224 | (61440 & code) >>> 12;
          byteArray[1] = 128 | (4032 & code) >>> 6;
          byteArray[2] = 128 | 63 & code;
        } else if (code > 128) {
          byteArray[0] = 192 | (1984 & code) >>> 6;
          byteArray[1] = 128 | 63 & code;
        } else byteArray[0] = code;
        this.parsedData.push(byteArray);
      }
      this.parsedData = Array.prototype.concat.apply([], this.parsedData);
      if (this.parsedData.length != this.data.length) {
        this.parsedData.unshift(191);
        this.parsedData.unshift(187);
        this.parsedData.unshift(239);
      }
    }
    QR8bitByte.prototype = {
      getLength: function getLength(buffer) {
        return this.parsedData.length;
      },
      write: function write(buffer) {
        for (var i = 0, l = this.parsedData.length; i < l; i++) buffer.put(this.parsedData[i], 8);
      }
    };
    function QRCode(typeNumber, errorCorrectLevel) {
      this.typeNumber = typeNumber;
      this.errorCorrectLevel = errorCorrectLevel;
      this.modules = null;
      this.moduleCount = 0;
      this.dataCache = null;
      this.dataList = new Array();
    }
    QRCode.prototype = {
      addData: function addData(data) {
        var newData = new QR8bitByte(data);
        this.dataList.push(newData);
        this.dataCache = null;
      },
      isDark: function isDark(row, col) {
        if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) throw new Error(row + "," + col);
        return this.modules[row][col];
      },
      getModuleCount: function getModuleCount() {
        return this.moduleCount;
      },
      make: function make() {
        if (this.typeNumber < 1) {
          var typeNumber = 1;
          for (typeNumber = 1; typeNumber < 40; typeNumber++) {
            var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);
            var buffer = new QRBitBuffer();
            var totalDataCount = 0;
            for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
            for (var i = 0; i < this.dataList.length; i++) {
              var data = this.dataList[i];
              buffer.put(data.mode, 4);
              buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
              data.write(buffer);
            }
            if (buffer.getLengthInBits() <= 8 * totalDataCount) break;
          }
          this.typeNumber = typeNumber;
        }
        this.makeImpl(false, this.getBestMaskPattern());
      },
      makeImpl: function makeImpl(test, maskPattern) {
        this.moduleCount = 4 * this.typeNumber + 17;
        this.modules = new Array(this.moduleCount);
        for (var row = 0; row < this.moduleCount; row++) {
          this.modules[row] = new Array(this.moduleCount);
          for (var col = 0; col < this.moduleCount; col++) this.modules[row][col] = null;
        }
        this.setupPositionProbePattern(0, 0);
        this.setupPositionProbePattern(this.moduleCount - 7, 0);
        this.setupPositionProbePattern(0, this.moduleCount - 7);
        this.setupPositionAdjustPattern();
        this.setupTimingPattern();
        this.setupTypeInfo(test, maskPattern);
        this.typeNumber >= 7 && this.setupTypeNumber(test);
        null == this.dataCache && (this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList));
        this.mapData(this.dataCache, maskPattern);
      },
      setupPositionProbePattern: function setupPositionProbePattern(row, col) {
        for (var r = -1; r <= 7; r++) {
          if (row + r <= -1 || this.moduleCount <= row + r) continue;
          for (var c = -1; c <= 7; c++) {
            if (col + c <= -1 || this.moduleCount <= col + c) continue;
            this.modules[row + r][col + c] = 0 <= r && r <= 6 && (0 == c || 6 == c) || 0 <= c && c <= 6 && (0 == r || 6 == r) || 2 <= r && r <= 4 && 2 <= c && c <= 4;
          }
        }
      },
      getBestMaskPattern: function getBestMaskPattern() {
        var minLostPoint = 0;
        var pattern = 0;
        for (var i = 0; i < 8; i++) {
          this.makeImpl(true, i);
          var lostPoint = QRUtil.getLostPoint(this);
          if (0 == i || minLostPoint > lostPoint) {
            minLostPoint = lostPoint;
            pattern = i;
          }
        }
        return pattern;
      },
      createMovieClip: function createMovieClip(target_mc, instance_name, depth) {
        var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
        var cs = 1;
        this.make();
        for (var row = 0; row < this.modules.length; row++) {
          var y = row * cs;
          for (var col = 0; col < this.modules[row].length; col++) {
            var x = col * cs;
            var dark = this.modules[row][col];
            if (dark) {
              qr_mc.beginFill(0, 100);
              qr_mc.moveTo(x, y);
              qr_mc.lineTo(x + cs, y);
              qr_mc.lineTo(x + cs, y + cs);
              qr_mc.lineTo(x, y + cs);
              qr_mc.endFill();
            }
          }
        }
        return qr_mc;
      },
      setupTimingPattern: function setupTimingPattern() {
        for (var r = 8; r < this.moduleCount - 8; r++) {
          if (null != this.modules[r][6]) continue;
          this.modules[r][6] = r % 2 == 0;
        }
        for (var c = 8; c < this.moduleCount - 8; c++) {
          if (null != this.modules[6][c]) continue;
          this.modules[6][c] = c % 2 == 0;
        }
      },
      setupPositionAdjustPattern: function setupPositionAdjustPattern() {
        var pos = QRUtil.getPatternPosition(this.typeNumber);
        for (var i = 0; i < pos.length; i++) for (var j = 0; j < pos.length; j++) {
          var row = pos[i];
          var col = pos[j];
          if (null != this.modules[row][col]) continue;
          for (var r = -2; r <= 2; r++) for (var c = -2; c <= 2; c++) this.modules[row + r][col + c] = -2 == r || 2 == r || -2 == c || 2 == c || 0 == r && 0 == c;
        }
      },
      setupTypeNumber: function setupTypeNumber(test) {
        var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        for (var i = 0; i < 18; i++) {
          var mod = !test && 1 == (bits >> i & 1);
          this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
        }
        for (var i = 0; i < 18; i++) {
          var mod = !test && 1 == (bits >> i & 1);
          this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
        }
      },
      setupTypeInfo: function setupTypeInfo(test, maskPattern) {
        var data = this.errorCorrectLevel << 3 | maskPattern;
        var bits = QRUtil.getBCHTypeInfo(data);
        for (var i = 0; i < 15; i++) {
          var mod = !test && 1 == (bits >> i & 1);
          i < 6 ? this.modules[i][8] = mod : i < 8 ? this.modules[i + 1][8] = mod : this.modules[this.moduleCount - 15 + i][8] = mod;
        }
        for (var i = 0; i < 15; i++) {
          var mod = !test && 1 == (bits >> i & 1);
          i < 8 ? this.modules[8][this.moduleCount - i - 1] = mod : i < 9 ? this.modules[8][15 - i - 1 + 1] = mod : this.modules[8][15 - i - 1] = mod;
        }
        this.modules[this.moduleCount - 8][8] = !test;
      },
      mapData: function mapData(data, maskPattern) {
        var inc = -1;
        var row = this.moduleCount - 1;
        var bitIndex = 7;
        var byteIndex = 0;
        for (var col = this.moduleCount - 1; col > 0; col -= 2) {
          6 == col && col--;
          while (true) {
            for (var c = 0; c < 2; c++) if (null == this.modules[row][col - c]) {
              var dark = false;
              byteIndex < data.length && (dark = 1 == (data[byteIndex] >>> bitIndex & 1));
              var mask = QRUtil.getMask(maskPattern, row, col - c);
              mask && (dark = !dark);
              this.modules[row][col - c] = dark;
              bitIndex--;
              if (-1 == bitIndex) {
                byteIndex++;
                bitIndex = 7;
              }
            }
            row += inc;
            if (row < 0 || this.moduleCount <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      }
    };
    QRCode.PAD0 = 236;
    QRCode.PAD1 = 17;
    QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
      var buffer = new QRBitBuffer();
      for (var i = 0; i < dataList.length; i++) {
        var data = dataList[i];
        buffer.put(data.mode, 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
        data.write(buffer);
      }
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
      if (buffer.getLengthInBits() > 8 * totalDataCount) throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + 8 * totalDataCount + ")");
      buffer.getLengthInBits() + 4 <= 8 * totalDataCount && buffer.put(0, 4);
      while (buffer.getLengthInBits() % 8 != 0) buffer.putBit(false);
      while (true) {
        if (buffer.getLengthInBits() >= 8 * totalDataCount) break;
        buffer.put(QRCode.PAD0, 8);
        if (buffer.getLengthInBits() >= 8 * totalDataCount) break;
        buffer.put(QRCode.PAD1, 8);
      }
      return QRCode.createBytes(buffer, rsBlocks);
    };
    QRCode.createBytes = function(buffer, rsBlocks) {
      var offset = 0;
      var maxDcCount = 0;
      var maxEcCount = 0;
      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);
      for (var r = 0; r < rsBlocks.length; r++) {
        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 255 & buffer.buffer[i + offset];
        offset += dcCount;
        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i++) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
        }
      }
      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
      var data = new Array(totalCodeCount);
      var index = 0;
      for (var i = 0; i < maxDcCount; i++) for (var r = 0; r < rsBlocks.length; r++) i < dcdata[r].length && (data[index++] = dcdata[r][i]);
      for (var i = 0; i < maxEcCount; i++) for (var r = 0; r < rsBlocks.length; r++) i < ecdata[r].length && (data[index++] = ecdata[r][i]);
      return data;
    };
    var QRMode = {
      MODE_NUMBER: 1,
      MODE_ALPHA_NUM: 2,
      MODE_8BIT_BYTE: 4,
      MODE_KANJI: 8
    };
    var QRErrorCorrectLevel = {
      L: 1,
      M: 0,
      Q: 3,
      H: 2
    };
    var QRMaskPattern = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var QRUtil = {
      PATTERN_POSITION_TABLE: [ [], [ 6, 18 ], [ 6, 22 ], [ 6, 26 ], [ 6, 30 ], [ 6, 34 ], [ 6, 22, 38 ], [ 6, 24, 42 ], [ 6, 26, 46 ], [ 6, 28, 50 ], [ 6, 30, 54 ], [ 6, 32, 58 ], [ 6, 34, 62 ], [ 6, 26, 46, 66 ], [ 6, 26, 48, 70 ], [ 6, 26, 50, 74 ], [ 6, 30, 54, 78 ], [ 6, 30, 56, 82 ], [ 6, 30, 58, 86 ], [ 6, 34, 62, 90 ], [ 6, 28, 50, 72, 94 ], [ 6, 26, 50, 74, 98 ], [ 6, 30, 54, 78, 102 ], [ 6, 28, 54, 80, 106 ], [ 6, 32, 58, 84, 110 ], [ 6, 30, 58, 86, 114 ], [ 6, 34, 62, 90, 118 ], [ 6, 26, 50, 74, 98, 122 ], [ 6, 30, 54, 78, 102, 126 ], [ 6, 26, 52, 78, 104, 130 ], [ 6, 30, 56, 82, 108, 134 ], [ 6, 34, 60, 86, 112, 138 ], [ 6, 30, 58, 86, 114, 142 ], [ 6, 34, 62, 90, 118, 146 ], [ 6, 30, 54, 78, 102, 126, 150 ], [ 6, 24, 50, 76, 102, 128, 154 ], [ 6, 28, 54, 80, 106, 132, 158 ], [ 6, 32, 58, 84, 110, 136, 162 ], [ 6, 26, 54, 82, 110, 138, 166 ], [ 6, 30, 58, 86, 114, 142, 170 ] ],
      G15: 1335,
      G18: 7973,
      G15_MASK: 21522,
      getBCHTypeInfo: function getBCHTypeInfo(data) {
        var d = data << 10;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
        return (data << 10 | d) ^ QRUtil.G15_MASK;
      },
      getBCHTypeNumber: function getBCHTypeNumber(data) {
        var d = data << 12;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
        return data << 12 | d;
      },
      getBCHDigit: function getBCHDigit(data) {
        var digit = 0;
        while (0 != data) {
          digit++;
          data >>>= 1;
        }
        return digit;
      },
      getPatternPosition: function getPatternPosition(typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
      },
      getMask: function getMask(maskPattern, i, j) {
        switch (maskPattern) {
         case QRMaskPattern.PATTERN000:
          return (i + j) % 2 == 0;

         case QRMaskPattern.PATTERN001:
          return i % 2 == 0;

         case QRMaskPattern.PATTERN010:
          return j % 3 == 0;

         case QRMaskPattern.PATTERN011:
          return (i + j) % 3 == 0;

         case QRMaskPattern.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;

         case QRMaskPattern.PATTERN101:
          return i * j % 2 + i * j % 3 == 0;

         case QRMaskPattern.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 == 0;

         case QRMaskPattern.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 == 0;

         default:
          throw new Error("bad maskPattern:" + maskPattern);
        }
      },
      getErrorCorrectPolynomial: function getErrorCorrectPolynomial(errorCorrectLength) {
        var a = new QRPolynomial([ 1 ], 0);
        for (var i = 0; i < errorCorrectLength; i++) a = a.multiply(new QRPolynomial([ 1, QRMath.gexp(i) ], 0));
        return a;
      },
      getLengthInBits: function getLengthInBits(mode, type) {
        if (1 <= type && type < 10) switch (mode) {
         case QRMode.MODE_NUMBER:
          return 10;

         case QRMode.MODE_ALPHA_NUM:
          return 9;

         case QRMode.MODE_8BIT_BYTE:
         case QRMode.MODE_KANJI:
          return 8;

         default:
          throw new Error("mode:" + mode);
        } else if (type < 27) switch (mode) {
         case QRMode.MODE_NUMBER:
          return 12;

         case QRMode.MODE_ALPHA_NUM:
          return 11;

         case QRMode.MODE_8BIT_BYTE:
          return 16;

         case QRMode.MODE_KANJI:
          return 10;

         default:
          throw new Error("mode:" + mode);
        } else {
          if (!(type < 41)) throw new Error("type:" + type);
          switch (mode) {
           case QRMode.MODE_NUMBER:
            return 14;

           case QRMode.MODE_ALPHA_NUM:
            return 13;

           case QRMode.MODE_8BIT_BYTE:
            return 16;

           case QRMode.MODE_KANJI:
            return 12;

           default:
            throw new Error("mode:" + mode);
          }
        }
      },
      getLostPoint: function getLostPoint(qrCode) {
        var moduleCount = qrCode.getModuleCount();
        var lostPoint = 0;
        for (var row = 0; row < moduleCount; row++) for (var col = 0; col < moduleCount; col++) {
          var sameCount = 0;
          var dark = qrCode.isDark(row, col);
          for (var r = -1; r <= 1; r++) {
            if (row + r < 0 || moduleCount <= row + r) continue;
            for (var c = -1; c <= 1; c++) {
              if (col + c < 0 || moduleCount <= col + c) continue;
              if (0 == r && 0 == c) continue;
              dark == qrCode.isDark(row + r, col + c) && sameCount++;
            }
          }
          sameCount > 5 && (lostPoint += 3 + sameCount - 5);
        }
        for (var row = 0; row < moduleCount - 1; row++) for (var col = 0; col < moduleCount - 1; col++) {
          var count = 0;
          qrCode.isDark(row, col) && count++;
          qrCode.isDark(row + 1, col) && count++;
          qrCode.isDark(row, col + 1) && count++;
          qrCode.isDark(row + 1, col + 1) && count++;
          0 != count && 4 != count || (lostPoint += 3);
        }
        for (var row = 0; row < moduleCount; row++) for (var col = 0; col < moduleCount - 6; col++) qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6) && (lostPoint += 40);
        for (var col = 0; col < moduleCount; col++) for (var row = 0; row < moduleCount - 6; row++) qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col) && (lostPoint += 40);
        var darkCount = 0;
        for (var col = 0; col < moduleCount; col++) for (var row = 0; row < moduleCount; row++) qrCode.isDark(row, col) && darkCount++;
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += 10 * ratio;
        return lostPoint;
      }
    };
    var QRMath = {
      glog: function glog(n) {
        if (n < 1) throw new Error("glog(" + n + ")");
        return QRMath.LOG_TABLE[n];
      },
      gexp: function gexp(n) {
        while (n < 0) n += 255;
        while (n >= 256) n -= 255;
        return QRMath.EXP_TABLE[n];
      },
      EXP_TABLE: new Array(256),
      LOG_TABLE: new Array(256)
    };
    for (var i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;
    for (var i = 8; i < 256; i++) QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
    for (var i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
    function QRPolynomial(num, shift) {
      if (void 0 == num.length) throw new Error(num.length + "/" + shift);
      var offset = 0;
      while (offset < num.length && 0 == num[offset]) offset++;
      this.num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
    }
    QRPolynomial.prototype = {
      get: function get(index) {
        return this.num[index];
      },
      getLength: function getLength() {
        return this.num.length;
      },
      multiply: function multiply(e) {
        var num = new Array(this.getLength() + e.getLength() - 1);
        for (var i = 0; i < this.getLength(); i++) for (var j = 0; j < e.getLength(); j++) num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
        return new QRPolynomial(num, 0);
      },
      mod: function mod(e) {
        if (this.getLength() - e.getLength() < 0) return this;
        var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
        var num = new Array(this.getLength());
        for (var i = 0; i < this.getLength(); i++) num[i] = this.get(i);
        for (var i = 0; i < e.getLength(); i++) num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
        return new QRPolynomial(num, 0).mod(e);
      }
    };
    function QRRSBlock(totalCount, dataCount) {
      this.totalCount = totalCount;
      this.dataCount = dataCount;
    }
    QRRSBlock.RS_BLOCK_TABLE = [ [ 1, 26, 19 ], [ 1, 26, 16 ], [ 1, 26, 13 ], [ 1, 26, 9 ], [ 1, 44, 34 ], [ 1, 44, 28 ], [ 1, 44, 22 ], [ 1, 44, 16 ], [ 1, 70, 55 ], [ 1, 70, 44 ], [ 2, 35, 17 ], [ 2, 35, 13 ], [ 1, 100, 80 ], [ 2, 50, 32 ], [ 2, 50, 24 ], [ 4, 25, 9 ], [ 1, 134, 108 ], [ 2, 67, 43 ], [ 2, 33, 15, 2, 34, 16 ], [ 2, 33, 11, 2, 34, 12 ], [ 2, 86, 68 ], [ 4, 43, 27 ], [ 4, 43, 19 ], [ 4, 43, 15 ], [ 2, 98, 78 ], [ 4, 49, 31 ], [ 2, 32, 14, 4, 33, 15 ], [ 4, 39, 13, 1, 40, 14 ], [ 2, 121, 97 ], [ 2, 60, 38, 2, 61, 39 ], [ 4, 40, 18, 2, 41, 19 ], [ 4, 40, 14, 2, 41, 15 ], [ 2, 146, 116 ], [ 3, 58, 36, 2, 59, 37 ], [ 4, 36, 16, 4, 37, 17 ], [ 4, 36, 12, 4, 37, 13 ], [ 2, 86, 68, 2, 87, 69 ], [ 4, 69, 43, 1, 70, 44 ], [ 6, 43, 19, 2, 44, 20 ], [ 6, 43, 15, 2, 44, 16 ], [ 4, 101, 81 ], [ 1, 80, 50, 4, 81, 51 ], [ 4, 50, 22, 4, 51, 23 ], [ 3, 36, 12, 8, 37, 13 ], [ 2, 116, 92, 2, 117, 93 ], [ 6, 58, 36, 2, 59, 37 ], [ 4, 46, 20, 6, 47, 21 ], [ 7, 42, 14, 4, 43, 15 ], [ 4, 133, 107 ], [ 8, 59, 37, 1, 60, 38 ], [ 8, 44, 20, 4, 45, 21 ], [ 12, 33, 11, 4, 34, 12 ], [ 3, 145, 115, 1, 146, 116 ], [ 4, 64, 40, 5, 65, 41 ], [ 11, 36, 16, 5, 37, 17 ], [ 11, 36, 12, 5, 37, 13 ], [ 5, 109, 87, 1, 110, 88 ], [ 5, 65, 41, 5, 66, 42 ], [ 5, 54, 24, 7, 55, 25 ], [ 11, 36, 12 ], [ 5, 122, 98, 1, 123, 99 ], [ 7, 73, 45, 3, 74, 46 ], [ 15, 43, 19, 2, 44, 20 ], [ 3, 45, 15, 13, 46, 16 ], [ 1, 135, 107, 5, 136, 108 ], [ 10, 74, 46, 1, 75, 47 ], [ 1, 50, 22, 15, 51, 23 ], [ 2, 42, 14, 17, 43, 15 ], [ 5, 150, 120, 1, 151, 121 ], [ 9, 69, 43, 4, 70, 44 ], [ 17, 50, 22, 1, 51, 23 ], [ 2, 42, 14, 19, 43, 15 ], [ 3, 141, 113, 4, 142, 114 ], [ 3, 70, 44, 11, 71, 45 ], [ 17, 47, 21, 4, 48, 22 ], [ 9, 39, 13, 16, 40, 14 ], [ 3, 135, 107, 5, 136, 108 ], [ 3, 67, 41, 13, 68, 42 ], [ 15, 54, 24, 5, 55, 25 ], [ 15, 43, 15, 10, 44, 16 ], [ 4, 144, 116, 4, 145, 117 ], [ 17, 68, 42 ], [ 17, 50, 22, 6, 51, 23 ], [ 19, 46, 16, 6, 47, 17 ], [ 2, 139, 111, 7, 140, 112 ], [ 17, 74, 46 ], [ 7, 54, 24, 16, 55, 25 ], [ 34, 37, 13 ], [ 4, 151, 121, 5, 152, 122 ], [ 4, 75, 47, 14, 76, 48 ], [ 11, 54, 24, 14, 55, 25 ], [ 16, 45, 15, 14, 46, 16 ], [ 6, 147, 117, 4, 148, 118 ], [ 6, 73, 45, 14, 74, 46 ], [ 11, 54, 24, 16, 55, 25 ], [ 30, 46, 16, 2, 47, 17 ], [ 8, 132, 106, 4, 133, 107 ], [ 8, 75, 47, 13, 76, 48 ], [ 7, 54, 24, 22, 55, 25 ], [ 22, 45, 15, 13, 46, 16 ], [ 10, 142, 114, 2, 143, 115 ], [ 19, 74, 46, 4, 75, 47 ], [ 28, 50, 22, 6, 51, 23 ], [ 33, 46, 16, 4, 47, 17 ], [ 8, 152, 122, 4, 153, 123 ], [ 22, 73, 45, 3, 74, 46 ], [ 8, 53, 23, 26, 54, 24 ], [ 12, 45, 15, 28, 46, 16 ], [ 3, 147, 117, 10, 148, 118 ], [ 3, 73, 45, 23, 74, 46 ], [ 4, 54, 24, 31, 55, 25 ], [ 11, 45, 15, 31, 46, 16 ], [ 7, 146, 116, 7, 147, 117 ], [ 21, 73, 45, 7, 74, 46 ], [ 1, 53, 23, 37, 54, 24 ], [ 19, 45, 15, 26, 46, 16 ], [ 5, 145, 115, 10, 146, 116 ], [ 19, 75, 47, 10, 76, 48 ], [ 15, 54, 24, 25, 55, 25 ], [ 23, 45, 15, 25, 46, 16 ], [ 13, 145, 115, 3, 146, 116 ], [ 2, 74, 46, 29, 75, 47 ], [ 42, 54, 24, 1, 55, 25 ], [ 23, 45, 15, 28, 46, 16 ], [ 17, 145, 115 ], [ 10, 74, 46, 23, 75, 47 ], [ 10, 54, 24, 35, 55, 25 ], [ 19, 45, 15, 35, 46, 16 ], [ 17, 145, 115, 1, 146, 116 ], [ 14, 74, 46, 21, 75, 47 ], [ 29, 54, 24, 19, 55, 25 ], [ 11, 45, 15, 46, 46, 16 ], [ 13, 145, 115, 6, 146, 116 ], [ 14, 74, 46, 23, 75, 47 ], [ 44, 54, 24, 7, 55, 25 ], [ 59, 46, 16, 1, 47, 17 ], [ 12, 151, 121, 7, 152, 122 ], [ 12, 75, 47, 26, 76, 48 ], [ 39, 54, 24, 14, 55, 25 ], [ 22, 45, 15, 41, 46, 16 ], [ 6, 151, 121, 14, 152, 122 ], [ 6, 75, 47, 34, 76, 48 ], [ 46, 54, 24, 10, 55, 25 ], [ 2, 45, 15, 64, 46, 16 ], [ 17, 152, 122, 4, 153, 123 ], [ 29, 74, 46, 14, 75, 47 ], [ 49, 54, 24, 10, 55, 25 ], [ 24, 45, 15, 46, 46, 16 ], [ 4, 152, 122, 18, 153, 123 ], [ 13, 74, 46, 32, 75, 47 ], [ 48, 54, 24, 14, 55, 25 ], [ 42, 45, 15, 32, 46, 16 ], [ 20, 147, 117, 4, 148, 118 ], [ 40, 75, 47, 7, 76, 48 ], [ 43, 54, 24, 22, 55, 25 ], [ 10, 45, 15, 67, 46, 16 ], [ 19, 148, 118, 6, 149, 119 ], [ 18, 75, 47, 31, 76, 48 ], [ 34, 54, 24, 34, 55, 25 ], [ 20, 45, 15, 61, 46, 16 ] ];
    QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
      var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
      if (void 0 == rsBlock) throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
      var length = rsBlock.length / 3;
      var list = new Array();
      for (var i = 0; i < length; i++) {
        var count = rsBlock[3 * i + 0];
        var totalCount = rsBlock[3 * i + 1];
        var dataCount = rsBlock[3 * i + 2];
        for (var j = 0; j < count; j++) list.push(new QRRSBlock(totalCount, dataCount));
      }
      return list;
    };
    QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
      switch (errorCorrectLevel) {
       case QRErrorCorrectLevel.L:
        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 0];

       case QRErrorCorrectLevel.M:
        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 1];

       case QRErrorCorrectLevel.Q:
        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 2];

       case QRErrorCorrectLevel.H:
        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 3];

       default:
        return;
      }
    };
    function QRBitBuffer() {
      this.buffer = new Array();
      this.length = 0;
    }
    QRBitBuffer.prototype = {
      get: function get(index) {
        var bufIndex = Math.floor(index / 8);
        return 1 == (this.buffer[bufIndex] >>> 7 - index % 8 & 1);
      },
      put: function put(num, length) {
        for (var i = 0; i < length; i++) this.putBit(1 == (num >>> length - i - 1 & 1));
      },
      getLengthInBits: function getLengthInBits() {
        return this.length;
      },
      putBit: function putBit(bit) {
        var bufIndex = Math.floor(this.length / 8);
        this.buffer.length <= bufIndex && this.buffer.push(0);
        bit && (this.buffer[bufIndex] |= 128 >>> this.length % 8);
        this.length++;
      }
    };
    module.exports = {};
    module.exports.QRCode = QRCode;
    module.exports.QRErrorCorrectLevel = QRErrorCorrectLevel;
    cc._RF.pop();
  }, {} ],
  underscore: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a11bb7DKxxFY62YbuvdDkVq", "underscore");
    "use strict";
    var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    (function() {
      var root = exports;
      var previousUnderscore = root._;
      var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
      var push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
      var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind, nativeCreate = Object.create;
      var Ctor = function Ctor() {};
      var _ = function _(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
      };
      module.exports = _;
      _.VERSION = "1.8.3";
      var optimizeCb = function optimizeCb(func, context, argCount) {
        if (void 0 === context) return func;
        switch (null == argCount ? 3 : argCount) {
         case 1:
          return function(value) {
            return func.call(context, value);
          };

         case 2:
          return function(value, other) {
            return func.call(context, value, other);
          };

         case 3:
          return function(value, index, collection) {
            return func.call(context, value, index, collection);
          };

         case 4:
          return function(accumulator, value, index, collection) {
            return func.call(context, accumulator, value, index, collection);
          };
        }
        return function() {
          return func.apply(context, arguments);
        };
      };
      var cb = function cb(value, context, argCount) {
        if (null == value) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
      };
      _.iteratee = function(value, context) {
        return cb(value, context, Infinity);
      };
      var createAssigner = function createAssigner(keysFunc, undefinedOnly) {
        return function(obj) {
          var length = arguments.length;
          if (length < 2 || null == obj) return obj;
          for (var index = 1; index < length; index++) {
            var source = arguments[index], keys = keysFunc(source), l = keys.length;
            for (var i = 0; i < l; i++) {
              var key = keys[i];
              undefinedOnly && void 0 !== obj[key] || (obj[key] = source[key]);
            }
          }
          return obj;
        };
      };
      var baseCreate = function baseCreate(prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor();
        Ctor.prototype = null;
        return result;
      };
      var property = function property(key) {
        return function(obj) {
          return null == obj ? void 0 : obj[key];
        };
      };
      var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
      var getLength = property("length");
      var isArrayLike = function isArrayLike(collection) {
        var length = getLength(collection);
        return "number" == typeof length && length >= 0 && length <= MAX_ARRAY_INDEX;
      };
      _.each = _.forEach = function(obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) for (i = 0, length = obj.length; i < length; i++) iteratee(obj[i], i, obj); else {
          var keys = _.keys(obj);
          for (i = 0, length = keys.length; i < length; i++) iteratee(obj[keys[i]], keys[i], obj);
        }
        return obj;
      };
      _.map = _.collect = function(obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, results = Array(length);
        for (var index = 0; index < length; index++) {
          var currentKey = keys ? keys[index] : index;
          results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
      };
      function createReduce(dir) {
        function iterator(obj, iteratee, memo, keys, index, length) {
          for (;index >= 0 && index < length; index += dir) {
            var currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
          }
          return memo;
        }
        return function(obj, iteratee, memo, context) {
          iteratee = optimizeCb(iteratee, context, 4);
          var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, index = dir > 0 ? 0 : length - 1;
          if (arguments.length < 3) {
            memo = obj[keys ? keys[index] : index];
            index += dir;
          }
          return iterator(obj, iteratee, memo, keys, index, length);
        };
      }
      _.reduce = _.foldl = _.inject = createReduce(1);
      _.reduceRight = _.foldr = createReduce(-1);
      _.find = _.detect = function(obj, predicate, context) {
        var key;
        key = isArrayLike(obj) ? _.findIndex(obj, predicate, context) : _.findKey(obj, predicate, context);
        if (void 0 !== key && -1 !== key) return obj[key];
      };
      _.filter = _.select = function(obj, predicate, context) {
        var results = [];
        predicate = cb(predicate, context);
        _.each(obj, function(value, index, list) {
          predicate(value, index, list) && results.push(value);
        });
        return results;
      };
      _.reject = function(obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
      };
      _.every = _.all = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
          var currentKey = keys ? keys[index] : index;
          if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
      };
      _.some = _.any = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
          var currentKey = keys ? keys[index] : index;
          if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
      };
      _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
        isArrayLike(obj) || (obj = _.values(obj));
        ("number" != typeof fromIndex || guard) && (fromIndex = 0);
        return _.indexOf(obj, item, fromIndex) >= 0;
      };
      _.invoke = function(obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function(value) {
          var func = isFunc ? method : value[method];
          return null == func ? func : func.apply(value, args);
        });
      };
      _.pluck = function(obj, key) {
        return _.map(obj, _.property(key));
      };
      _.where = function(obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
      };
      _.findWhere = function(obj, attrs) {
        return _.find(obj, _.matcher(attrs));
      };
      _.max = function(obj, iteratee, context) {
        var result = -Infinity, lastComputed = -Infinity, value, computed;
        if (null == iteratee && null != obj) {
          obj = isArrayLike(obj) ? obj : _.values(obj);
          for (var i = 0, length = obj.length; i < length; i++) {
            value = obj[i];
            value > result && (result = value);
          }
        } else {
          iteratee = cb(iteratee, context);
          _.each(obj, function(value, index, list) {
            computed = iteratee(value, index, list);
            if (computed > lastComputed || -Infinity === computed && -Infinity === result) {
              result = value;
              lastComputed = computed;
            }
          });
        }
        return result;
      };
      _.min = function(obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity, value, computed;
        if (null == iteratee && null != obj) {
          obj = isArrayLike(obj) ? obj : _.values(obj);
          for (var i = 0, length = obj.length; i < length; i++) {
            value = obj[i];
            value < result && (result = value);
          }
        } else {
          iteratee = cb(iteratee, context);
          _.each(obj, function(value, index, list) {
            computed = iteratee(value, index, list);
            if (computed < lastComputed || Infinity === computed && Infinity === result) {
              result = value;
              lastComputed = computed;
            }
          });
        }
        return result;
      };
      _.shuffle = function(obj) {
        var set = isArrayLike(obj) ? obj : _.values(obj);
        var length = set.length;
        var shuffled = Array(length);
        for (var index = 0, rand; index < length; index++) {
          rand = _.random(0, index);
          rand !== index && (shuffled[index] = shuffled[rand]);
          shuffled[rand] = set[index];
        }
        return shuffled;
      };
      _.sample = function(obj, n, guard) {
        if (null == n || guard) {
          isArrayLike(obj) || (obj = _.values(obj));
          return obj[_.random(obj.length - 1)];
        }
        return _.shuffle(obj).slice(0, Math.max(0, n));
      };
      _.sortBy = function(obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        return _.pluck(_.map(obj, function(value, index, list) {
          return {
            value: value,
            index: index,
            criteria: iteratee(value, index, list)
          };
        }).sort(function(left, right) {
          var a = left.criteria;
          var b = right.criteria;
          if (a !== b) {
            if (a > b || void 0 === a) return 1;
            if (a < b || void 0 === b) return -1;
          }
          return left.index - right.index;
        }), "value");
      };
      var group = function group(behavior) {
        return function(obj, iteratee, context) {
          var result = {};
          iteratee = cb(iteratee, context);
          _.each(obj, function(value, index) {
            var key = iteratee(value, index, obj);
            behavior(result, value, key);
          });
          return result;
        };
      };
      _.groupBy = group(function(result, value, key) {
        _.has(result, key) ? result[key].push(value) : result[key] = [ value ];
      });
      _.indexBy = group(function(result, value, key) {
        result[key] = value;
      });
      _.countBy = group(function(result, value, key) {
        _.has(result, key) ? result[key]++ : result[key] = 1;
      });
      _.toArray = function(obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (isArrayLike(obj)) return _.map(obj, _.identity);
        return _.values(obj);
      };
      _.size = function(obj) {
        if (null == obj) return 0;
        return isArrayLike(obj) ? obj.length : _.keys(obj).length;
      };
      _.partition = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var pass = [], fail = [];
        _.each(obj, function(value, key, obj) {
          (predicate(value, key, obj) ? pass : fail).push(value);
        });
        return [ pass, fail ];
      };
      _.first = _.head = _.take = function(array, n, guard) {
        if (null == array) return;
        if (null == n || guard) return array[0];
        return _.initial(array, array.length - n);
      };
      _.initial = function(array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (null == n || guard ? 1 : n)));
      };
      _.last = function(array, n, guard) {
        if (null == array) return;
        if (null == n || guard) return array[array.length - 1];
        return _.rest(array, Math.max(0, array.length - n));
      };
      _.rest = _.tail = _.drop = function(array, n, guard) {
        return slice.call(array, null == n || guard ? 1 : n);
      };
      _.compact = function(array) {
        return _.filter(array, _.identity);
      };
      var flatten = function flatten(input, shallow, strict, startIndex) {
        var output = [], idx = 0;
        for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
          var value = input[i];
          if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
            shallow || (value = flatten(value, shallow, strict));
            var j = 0, len = value.length;
            output.length += len;
            while (j < len) output[idx++] = value[j++];
          } else strict || (output[idx++] = value);
        }
        return output;
      };
      _.flatten = function(array, shallow) {
        return flatten(array, shallow, false);
      };
      _.without = function(array) {
        return _.difference(array, slice.call(arguments, 1));
      };
      _.uniq = _.unique = function(array, isSorted, iteratee, context) {
        if (!_.isBoolean(isSorted)) {
          context = iteratee;
          iteratee = isSorted;
          isSorted = false;
        }
        null != iteratee && (iteratee = cb(iteratee, context));
        var result = [];
        var seen = [];
        for (var i = 0, length = getLength(array); i < length; i++) {
          var value = array[i], computed = iteratee ? iteratee(value, i, array) : value;
          if (isSorted) {
            i && seen === computed || result.push(value);
            seen = computed;
          } else if (iteratee) {
            if (!_.contains(seen, computed)) {
              seen.push(computed);
              result.push(value);
            }
          } else _.contains(result, value) || result.push(value);
        }
        return result;
      };
      _.union = function() {
        return _.uniq(flatten(arguments, true, true));
      };
      _.intersection = function(array) {
        var result = [];
        var argsLength = arguments.length;
        for (var i = 0, length = getLength(array); i < length; i++) {
          var item = array[i];
          if (_.contains(result, item)) continue;
          for (var j = 1; j < argsLength; j++) if (!_.contains(arguments[j], item)) break;
          j === argsLength && result.push(item);
        }
        return result;
      };
      _.difference = function(array) {
        var rest = flatten(arguments, true, true, 1);
        return _.filter(array, function(value) {
          return !_.contains(rest, value);
        });
      };
      _.zip = function() {
        return _.unzip(arguments);
      };
      _.unzip = function(array) {
        var length = array && _.max(array, getLength).length || 0;
        var result = Array(length);
        for (var index = 0; index < length; index++) result[index] = _.pluck(array, index);
        return result;
      };
      _.object = function(list, values) {
        var result = {};
        for (var i = 0, length = getLength(list); i < length; i++) values ? result[list[i]] = values[i] : result[list[i][0]] = list[i][1];
        return result;
      };
      function createPredicateIndexFinder(dir) {
        return function(array, predicate, context) {
          predicate = cb(predicate, context);
          var length = getLength(array);
          var index = dir > 0 ? 0 : length - 1;
          for (;index >= 0 && index < length; index += dir) if (predicate(array[index], index, array)) return index;
          return -1;
        };
      }
      _.findIndex = createPredicateIndexFinder(1);
      _.findLastIndex = createPredicateIndexFinder(-1);
      _.sortedIndex = function(array, obj, iteratee, context) {
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0, high = getLength(array);
        while (low < high) {
          var mid = Math.floor((low + high) / 2);
          iteratee(array[mid]) < value ? low = mid + 1 : high = mid;
        }
        return low;
      };
      function createIndexFinder(dir, predicateFind, sortedIndex) {
        return function(array, item, idx) {
          var i = 0, length = getLength(array);
          if ("number" == typeof idx) dir > 0 ? i = idx >= 0 ? idx : Math.max(idx + length, i) : length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1; else if (sortedIndex && idx && length) {
            idx = sortedIndex(array, item);
            return array[idx] === item ? idx : -1;
          }
          if (item !== item) {
            idx = predicateFind(slice.call(array, i, length), _.isNaN);
            return idx >= 0 ? idx + i : -1;
          }
          for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) if (array[idx] === item) return idx;
          return -1;
        };
      }
      _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
      _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
      _.range = function(start, stop, step) {
        if (null == stop) {
          stop = start || 0;
          start = 0;
        }
        step = step || 1;
        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);
        for (var idx = 0; idx < length; idx++, start += step) range[idx] = start;
        return range;
      };
      var executeBound = function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
        if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
        var self = baseCreate(sourceFunc.prototype);
        var result = sourceFunc.apply(self, args);
        if (_.isObject(result)) return result;
        return self;
      };
      _.bind = function(func, context) {
        if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        if (!_.isFunction(func)) throw new TypeError("Bind must be called on a function");
        var args = slice.call(arguments, 2);
        var bound = function bound() {
          return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
        };
        return bound;
      };
      _.partial = function(func) {
        var boundArgs = slice.call(arguments, 1);
        var bound = function bound() {
          var position = 0, length = boundArgs.length;
          var args = Array(length);
          for (var i = 0; i < length; i++) args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
          while (position < arguments.length) args.push(arguments[position++]);
          return executeBound(func, bound, this, this, args);
        };
        return bound;
      };
      _.bindAll = function(obj) {
        var i, length = arguments.length, key;
        if (length <= 1) throw new Error("bindAll must be passed function names");
        for (i = 1; i < length; i++) {
          key = arguments[i];
          obj[key] = _.bind(obj[key], obj);
        }
        return obj;
      };
      _.memoize = function(func, hasher) {
        var memoize = function memoize(key) {
          var cache = memoize.cache;
          var address = "" + (hasher ? hasher.apply(this, arguments) : key);
          _.has(cache, address) || (cache[address] = func.apply(this, arguments));
          return cache[address];
        };
        memoize.cache = {};
        return memoize;
      };
      _.delay = function(func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function() {
          return func.apply(null, args);
        }, wait);
      };
      _.defer = _.partial(_.delay, _, 1);
      _.throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function later() {
          previous = false === options.leading ? 0 : _.now();
          timeout = null;
          result = func.apply(context, args);
          timeout || (context = args = null);
        };
        return function() {
          var now = _.now();
          previous || false !== options.leading || (previous = now);
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0 || remaining > wait) {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            timeout || (context = args = null);
          } else timeout || false === options.trailing || (timeout = setTimeout(later, remaining));
          return result;
        };
      };
      _.debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        var later = function later() {
          var last = _.now() - timestamp;
          if (last < wait && last >= 0) timeout = setTimeout(later, wait - last); else {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
              timeout || (context = args = null);
            }
          }
        };
        return function() {
          context = this;
          args = arguments;
          timestamp = _.now();
          var callNow = immediate && !timeout;
          timeout || (timeout = setTimeout(later, wait));
          if (callNow) {
            result = func.apply(context, args);
            context = args = null;
          }
          return result;
        };
      };
      _.wrap = function(func, wrapper) {
        return _.partial(wrapper, func);
      };
      _.negate = function(predicate) {
        return function() {
          return !predicate.apply(this, arguments);
        };
      };
      _.compose = function() {
        var args = arguments;
        var start = args.length - 1;
        return function() {
          var i = start;
          var result = args[start].apply(this, arguments);
          while (i--) result = args[i].call(this, result);
          return result;
        };
      };
      _.after = function(times, func) {
        return function() {
          if (--times < 1) return func.apply(this, arguments);
        };
      };
      _.before = function(times, func) {
        var memo;
        return function() {
          --times > 0 && (memo = func.apply(this, arguments));
          times <= 1 && (func = null);
          return memo;
        };
      };
      _.once = _.partial(_.before, 2);
      var hasEnumBug = !{
        toString: null
      }.propertyIsEnumerable("toString");
      var nonEnumerableProps = [ "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString" ];
      function collectNonEnumProps(obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;
        var prop = "constructor";
        _.has(obj, prop) && !_.contains(keys, prop) && keys.push(prop);
        while (nonEnumIdx--) {
          prop = nonEnumerableProps[nonEnumIdx];
          prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop) && keys.push(prop);
        }
      }
      _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) _.has(obj, key) && keys.push(key);
        hasEnumBug && collectNonEnumProps(obj, keys);
        return keys;
      };
      _.allKeys = function(obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        hasEnumBug && collectNonEnumProps(obj, keys);
        return keys;
      };
      _.values = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) values[i] = obj[keys[i]];
        return values;
      };
      _.mapObject = function(obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = _.keys(obj), length = keys.length, results = {}, currentKey;
        for (var index = 0; index < length; index++) {
          currentKey = keys[index];
          results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
      };
      _.pairs = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) pairs[i] = [ keys[i], obj[keys[i]] ];
        return pairs;
      };
      _.invert = function(obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) result[obj[keys[i]]] = keys[i];
        return result;
      };
      _.functions = _.methods = function(obj) {
        var names = [];
        for (var key in obj) _.isFunction(obj[key]) && names.push(key);
        return names.sort();
      };
      _.extend = createAssigner(_.allKeys);
      _.extendOwn = _.assign = createAssigner(_.keys);
      _.findKey = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj), key;
        for (var i = 0, length = keys.length; i < length; i++) {
          key = keys[i];
          if (predicate(obj[key], key, obj)) return key;
        }
      };
      _.pick = function(object, oiteratee, context) {
        var result = {}, obj = object, iteratee, keys;
        if (null == obj) return result;
        if (_.isFunction(oiteratee)) {
          keys = _.allKeys(obj);
          iteratee = optimizeCb(oiteratee, context);
        } else {
          keys = flatten(arguments, false, false, 1);
          iteratee = function iteratee(value, key, obj) {
            return key in obj;
          };
          obj = Object(obj);
        }
        for (var i = 0, length = keys.length; i < length; i++) {
          var key = keys[i];
          var value = obj[key];
          iteratee(value, key, obj) && (result[key] = value);
        }
        return result;
      };
      _.omit = function(obj, iteratee, context) {
        if (_.isFunction(iteratee)) iteratee = _.negate(iteratee); else {
          var keys = _.map(flatten(arguments, false, false, 1), String);
          iteratee = function iteratee(value, key) {
            return !_.contains(keys, key);
          };
        }
        return _.pick(obj, iteratee, context);
      };
      _.defaults = createAssigner(_.allKeys, true);
      _.create = function(prototype, props) {
        var result = baseCreate(prototype);
        props && _.extendOwn(result, props);
        return result;
      };
      _.clone = function(obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
      };
      _.tap = function(obj, interceptor) {
        interceptor(obj);
        return obj;
      };
      _.isMatch = function(object, attrs) {
        var keys = _.keys(attrs), length = keys.length;
        if (null == object) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
          var key = keys[i];
          if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
      };
      var eq = function eq(a, b, aStack, bStack) {
        if (a === b) return 0 !== a || 1 / a === 1 / b;
        if (null == a || null == b) return a === b;
        a instanceof _ && (a = a._wrapped);
        b instanceof _ && (b = b._wrapped);
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
         case "[object RegExp]":
         case "[object String]":
          return "" + a === "" + b;

         case "[object Number]":
          if (+a !== +a) return +b !== +b;
          return 0 === +a ? 1 / +a === 1 / b : +a === +b;

         case "[object Date]":
         case "[object Boolean]":
          return +a === +b;
        }
        var areArrays = "[object Array]" === className;
        if (!areArrays) {
          if ("object" != ("undefined" === typeof a ? "undefined" : _typeof(a)) || "object" != ("undefined" === typeof b ? "undefined" : _typeof(b))) return false;
          var aCtor = a.constructor, bCtor = b.constructor;
          if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) return false;
        }
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) if (aStack[length] === a) return bStack[length] === b;
        aStack.push(a);
        bStack.push(b);
        if (areArrays) {
          length = a.length;
          if (length !== b.length) return false;
          while (length--) if (!eq(a[length], b[length], aStack, bStack)) return false;
        } else {
          var keys = _.keys(a), key;
          length = keys.length;
          if (_.keys(b).length !== length) return false;
          while (length--) {
            key = keys[length];
            if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
          }
        }
        aStack.pop();
        bStack.pop();
        return true;
      };
      _.isEqual = function(a, b) {
        return eq(a, b);
      };
      _.isEmpty = function(obj) {
        if (null == obj) return true;
        if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return 0 === obj.length;
        return 0 === _.keys(obj).length;
      };
      _.isElement = function(obj) {
        return !!(obj && 1 === obj.nodeType);
      };
      _.isArray = nativeIsArray || function(obj) {
        return "[object Array]" === toString.call(obj);
      };
      _.isObject = function(obj) {
        var type = "undefined" === typeof obj ? "undefined" : _typeof(obj);
        return "function" === type || "object" === type && !!obj;
      };
      _.each([ "Arguments", "Function", "String", "Number", "Date", "RegExp", "Error" ], function(name) {
        _["is" + name] = function(obj) {
          return toString.call(obj) === "[object " + name + "]";
        };
      });
      _.isArguments(arguments) || (_.isArguments = function(obj) {
        return _.has(obj, "callee");
      });
      "function" != typeof /./ && "object" != ("undefined" === typeof Int8Array ? "undefined" : _typeof(Int8Array)) && (_.isFunction = function(obj) {
        return "function" == typeof obj || false;
      });
      _.isFinite = function(obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
      };
      _.isNaN = function(obj) {
        return _.isNumber(obj) && obj !== +obj;
      };
      _.isBoolean = function(obj) {
        return true === obj || false === obj || "[object Boolean]" === toString.call(obj);
      };
      _.isNull = function(obj) {
        return null === obj;
      };
      _.isUndefined = function(obj) {
        return void 0 === obj;
      };
      _.has = function(obj, key) {
        return null != obj && hasOwnProperty.call(obj, key);
      };
      _.noConflict = function() {
        root._ = previousUnderscore;
        return this;
      };
      _.identity = function(value) {
        return value;
      };
      _.constant = function(value) {
        return function() {
          return value;
        };
      };
      _.noop = function() {};
      _.property = property;
      _.propertyOf = function(obj) {
        return null == obj ? function() {} : function(key) {
          return obj[key];
        };
      };
      _.matcher = _.matches = function(attrs) {
        attrs = _.extendOwn({}, attrs);
        return function(obj) {
          return _.isMatch(obj, attrs);
        };
      };
      _.times = function(n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for (var i = 0; i < n; i++) accum[i] = iteratee(i);
        return accum;
      };
      _.random = function(min, max) {
        if (null == max) {
          max = min;
          min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
      };
      _.now = Date.now || function() {
        return new Date().getTime();
      };
      var escapeMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      };
      var unescapeMap = _.invert(escapeMap);
      var createEscaper = function createEscaper(map) {
        var escaper = function escaper(match) {
          return map[match];
        };
        var source = "(?:" + _.keys(map).join("|") + ")";
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, "g");
        return function(string) {
          string = null == string ? "" : "" + string;
          return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
      };
      _.escape = createEscaper(escapeMap);
      _.unescape = createEscaper(unescapeMap);
      _.result = function(object, property, fallback) {
        var value = null == object ? void 0 : object[property];
        void 0 === value && (value = fallback);
        return _.isFunction(value) ? value.call(object) : value;
      };
      var idCounter = 0;
      _.uniqueId = function(prefix) {
        var id = ++idCounter + "";
        return prefix ? prefix + id : id;
      };
      _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
      };
      var noMatch = /(.)^/;
      var escapes = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
      };
      var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
      var escapeChar = function escapeChar(match) {
        return "\\" + escapes[match];
      };
      _.template = function(text, settings, oldSettings) {
        !settings && oldSettings && (settings = oldSettings);
        settings = _.defaults({}, settings, _.templateSettings);
        var matcher = RegExp([ (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source ].join("|") + "|$", "g");
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
          source += text.slice(index, offset).replace(escaper, escapeChar);
          index = offset + match.length;
          escape ? source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" : interpolate ? source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" : evaluate && (source += "';\n" + evaluate + "\n__p+='");
          return match;
        });
        source += "';\n";
        settings.variable || (source = "with(obj||{}){\n" + source + "}\n");
        source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
        try {
          var render = new Function(settings.variable || "obj", "_", source);
        } catch (e) {
          e.source = source;
          throw e;
        }
        var template = function template(data) {
          return render.call(this, data, _);
        };
        var argument = settings.variable || "obj";
        template.source = "function(" + argument + "){\n" + source + "}";
        return template;
      };
      _.chain = function(obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
      };
      var result = function result(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
      };
      _.mixin = function(obj) {
        _.each(_.functions(obj), function(name) {
          var func = _[name] = obj[name];
          _.prototype[name] = function() {
            var args = [ this._wrapped ];
            push.apply(args, arguments);
            return result(this, func.apply(_, args));
          };
        });
      };
      _.mixin(_);
      _.each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
          var obj = this._wrapped;
          method.apply(obj, arguments);
          "shift" !== name && "splice" !== name || 0 !== obj.length || delete obj[0];
          return result(this, obj);
        };
      });
      _.each([ "concat", "join", "slice" ], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
          return result(this, method.apply(this._wrapped, arguments));
        };
      });
      _.prototype.value = function() {
        return this._wrapped;
      };
      _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
      _.prototype.toString = function() {
        return "" + this._wrapped;
      };
      "function" === typeof define && define.amd && define("underscore", [], function() {
        return _;
      });
    }).call(void 0);
    cc._RF.pop();
  }, {} ]
}, {}, [ "GlobalGameData", "CCLoaderHelper", "DataHelper", "GameHelper", "PBHelper", "UpdateHelper", "ChooseGame", "CustomScene", "LoadingScene", "ComChooseGameState", "ComHotUpdate", "GameDownComponent", "UpdateComponent", "ShaderUtils", "LZString", "big-number", "CryptUtil", "MD5", "XXTea", "pomelo", "qrcode", "underscore", "DlgGameNeedDownload", "DlgSetting" ]);