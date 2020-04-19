"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tiny_middle_ware_1 = require("./tiny.middle.ware");
var ROUTER_TYPE;
(function (ROUTER_TYPE) {
    ROUTER_TYPE[ROUTER_TYPE["SSE"] = 1] = "SSE";
    ROUTER_TYPE[ROUTER_TYPE["HTTP"] = 2] = "HTTP";
})(ROUTER_TYPE = exports.ROUTER_TYPE || (exports.ROUTER_TYPE = {}));
var Router = /** @class */ (function () {
    function Router() {
        this.path = '';
        this.type = ROUTER_TYPE.HTTP; // 0 http, 1 server-side-event
        this.middles = [];
    }
    return Router;
}());
exports.Router = Router;
exports.Routers = [
    { path: '/stream', type: ROUTER_TYPE.SSE, middles: [tiny_middle_ware_1.tinyMiddleware.ServerSideEvent] }
];
