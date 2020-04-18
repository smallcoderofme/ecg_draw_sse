"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tinyMiddleware;
(function (tinyMiddleware) {
    function ServerSideEvent(res) {
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        });
    }
    tinyMiddleware.ServerSideEvent = ServerSideEvent;
})(tinyMiddleware = exports.tinyMiddleware || (exports.tinyMiddleware = {}));
