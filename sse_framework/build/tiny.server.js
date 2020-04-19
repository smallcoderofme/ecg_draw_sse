"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = __importStar(require("http"));
var uuid_1 = require("uuid");
var router_1 = require("./router");
var WARNNING = true;
var TinyServer;
(function (TinyServer) {
    var SSE = /** @class */ (function () {
        function SSE() {
            this.connectorPool = new Map();
            if (!WARNNING) {
                console.log("This is a singleton!");
                return;
            }
            this.init();
        }
        SSE.getInstance = function () {
            if (!this._instance) {
                this._instance = new SSE();
            }
            return this._instance;
        };
        SSE.prototype.init = function () {
            var _this = this;
            this._http = http.createServer(function (req, res) {
                var e_1, _a;
                var defind = false;
                try {
                    for (var Routers_1 = __values(router_1.Routers), Routers_1_1 = Routers_1.next(); !Routers_1_1.done; Routers_1_1 = Routers_1.next()) {
                        var router = Routers_1_1.value;
                        if (req.url === router.path) {
                            if (router.type === router_1.ROUTER_TYPE.SSE) {
                                router.middles.forEach(function (middle) {
                                    middle(res);
                                });
                                _this.listener(req);
                                _this.reconnecting(req, res);
                                var connector = { connectorId: uuid_1.v4(), online: true, reqHandler: req, resHandler: res };
                                _this.connectorPool.set(connector.connectorId, connector);
                            }
                            else {
                            }
                            defind = true;
                            return;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (Routers_1_1 && !Routers_1_1.done && (_a = Routers_1.return)) _a.call(Routers_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (!defind) {
                }
            }).listen(8844, "127.0.0.1", function () {
                console.log("start listening http://127.0.0.1:8844 ...");
            });
            this._http.on("close", function () {
                console.log("server close.");
            });
            this._http.on("connection", function (socket) {
                console.log("server connection.");
            });
            this._http.on("listening", function () {
                console.log("server listening.");
            });
            this._http.on("error", function (err) {
                console.log("server error.");
            });
        };
        SSE.prototype.listener = function (req) {
            var _this = this;
            req.once("close", function (e) {
                var e_2, _a;
                try {
                    for (var _b = __values(_this.connectorPool.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var connector = _c.value;
                        if (connector.connectorId === req.headers["connectorId"]) {
                            connector.online = false;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            });
        };
        SSE.prototype.reconnecting = function (req, res) {
            var e_3, _a;
            var connectorId = req.headers["connectorId"];
            if (connectorId) {
                try {
                    for (var _b = __values(this.connectorPool.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var connector = _c.value;
                        if (connector.connectorId === connectorId) {
                            connector.online = true;
                            connector.reqHandler = req;
                            connector.resHandler = res;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        };
        SSE.prototype.broadcast = function (data) {
            var e_4, _a;
            try {
                for (var _b = __values(this.connectorPool.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var connector = _c.value;
                    if (connector.online) {
                        connector.resHandler.write("data: " + JSON.stringify(data) + "\n\n", 'utf8');
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        SSE.prototype.send = function (connectorId, data) {
            var connector = this.connectorPool.get(connectorId);
            if (connector && connector.online) {
                connector.resHandler.write("data: " + JSON.stringify(data) + "\n\n", 'utf8');
            }
        };
        return SSE;
    }());
    TinyServer.SSE = SSE;
})(TinyServer = exports.TinyServer || (exports.TinyServer = {}));
