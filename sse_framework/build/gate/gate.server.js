'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = __importDefault(require("net"));
var typing_1 = require("../typing");
var GateServer = /** @class */ (function (_super) {
    __extends(GateServer, _super);
    function GateServer() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    GateServer.getInstance = function (config) {
        if (config === void 0) { config = null; }
        if (!this._instance) {
            GateServer._config = config;
            this._instance = new GateServer();
        }
        return this._instance;
    };
    GateServer.prototype.init = function () {
        this._server = new net_1.default.Server(function (socket) {
            // socket.end('goodbye\n');
            socket.on('data', function (data) {
                console.log("server socket data: ", data.toString().replace('\n', ''));
            });
        });
        this._server.on('error', function (err) {
            throw err;
        });
        this._server.on('close', function (err) {
            console.log("server close: ", close);
        });
        this._server.on('connection', function (socket) {
            console.log("connection: ", socket.address());
        });
    };
    GateServer.prototype.start = function () {
        var _this = this;
        var gateConfig = GateServer._config.gate;
        if (!gateConfig) {
            console.error("Error: config file error >> config.json not defined root gate server.");
            return;
        }
        this._server.listen({
            host: gateConfig.host,
            port: parseInt(gateConfig.port),
            exclusive: true
        }, function () {
            console.log('opened gate server on', _this._server.address());
        });
    };
    GateServer.prototype.stop = function () {
        var _this = this;
        this._server.close(function () {
            console.log('closed gate server on', _this._server.address());
        });
    };
    return GateServer;
}(typing_1.Server));
exports.GateServer = GateServer;
