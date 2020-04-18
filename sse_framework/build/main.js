"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tiny_server_1 = require("./tiny.server");
var server = tiny_server_1.TinyServer.SSE.getInstance();
// console.log(server);
var counter = 0;
setInterval(function () {
    counter++;
    server.broadcast({ status: "ok", message: "echo", commandId: counter.toString(), data: Date.now() });
}, 1000);
