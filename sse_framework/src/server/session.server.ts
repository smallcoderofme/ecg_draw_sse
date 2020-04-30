import { Socket } from "net";

import { v4 as uuidv4 } from 'uuid';

const PROTECTING: string = uuidv4();

export interface SessionData {
    socket: Socket;
    username: string;
    userId: string;
}

export class GateSession {
    private static _instance: GateSession = new GateSession(PROTECTING);
    private _session: Map<string, SessionData> = new Map();;
    constructor(p: string) {
        if(p !== PROTECTING) {
            console.error("GateSession is a Singleton!");
            return;
        }
    }

    static getInstance(): GateSession {
        return GateSession._instance;
    }

    addSession(sessionData: SessionData, sid: string = ''):void {
        if (sid == '') {
            sid = uuidv4();
        }
        this._session.set(sid, sessionData);
    }

    existSession(sid: string): boolean {
        return this._session.has(sid);
    }

    getSession(sid: string) {
        this._session.get(sid);
    }

    deleteSession(sid: string) {
        this._session.delete(sid);
    }

}