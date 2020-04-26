"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tinyMiddleware;
(function (tinyMiddleware) {
    function ServerSideEvent(req, res, domian) {
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
    function HttpJsonResponse(req, res) {
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        });
        switch (req.method) {
            case "GET":
                break;
            case "POST":
                var body_1 = "";
                var on_data_fun_1 = function (chunk) {
                    body_1 += chunk;
                };
                req.on("data", on_data_fun_1);
                req.once("end", function () {
                    req.off("data", on_data_fun_1);
                    req.body.data = JSON.parse(body_1);
                });
                break;
        }
    }
    tinyMiddleware.HttpJsonResponse = HttpJsonResponse;
})(tinyMiddleware = exports.tinyMiddleware || (exports.tinyMiddleware = {}));
