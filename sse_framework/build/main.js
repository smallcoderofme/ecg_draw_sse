"use strict";
// import { TinyServer } from "./tiny.server";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const server = TinyServer.SSE.getInstance();
// // console.log(server);
// var counter: number = 0;
// setInterval(()=> {
//     counter ++;
//     server.broadcast({status:"ok", message:"echo", commandId: counter.toString(), data: Date.now() });
// }, 1000);
var fs_1 = __importDefault(require("fs"));
var gate_server_1 = require("./gate/gate.server");
var global = { config: null, gate: undefined };
function loadCONFIG() {
    fs_1.default.readFile('config.json', 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        console.info('>> Read config file success!');
        var config = JSON.parse(data);
        global.config = config;
        global.gate = gate_server_1.GateServer.getInstance(config);
        global.gate.start();
    });
}
loadCONFIG();
