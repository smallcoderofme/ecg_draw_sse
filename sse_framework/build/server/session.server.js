"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var PROTECTING = uuid_1.v4();
var GateSession = /** @class */ (function () {
    function GateSession(p) {
        this._session = new Map();
        if (p !== PROTECTING) {
            console.error("GateSession is a Singleton!");
            return;
        }
    }
    ;
    GateSession.getInstance = function () {
        return GateSession._instance;
    };
    GateSession.prototype.addSession = function (sessionData, sid) {
        if (sid === void 0) { sid = ''; }
        if (sid == '') {
            sid = uuid_1.v4();
        }
        this._session.set(sid, sessionData);
    };
    GateSession.prototype.existSession = function (sid) {
        return this._session.has(sid);
    };
    GateSession.prototype.getSession = function (sid) {
        this._session.get(sid);
    };
    GateSession.prototype.deleteSession = function (sid) {
        this._session.delete(sid);
    };
    GateSession._instance = new GateSession(PROTECTING);
    return GateSession;
}());
exports.GateSession = GateSession;
