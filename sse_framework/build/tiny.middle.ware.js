"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tinyMiddleware;
(function (tinyMiddleware) {
    function ServerSideEvent(res, domian) {
        if (domian === void 0) { domian = "*"; }
        res.setHeader("Access-Control-Allow-Origin", domian);
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        });
    }
    tinyMiddleware.ServerSideEvent = ServerSideEvent;
})(tinyMiddleware = exports.tinyMiddleware || (exports.tinyMiddleware = {}));
