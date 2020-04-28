'use strict';
import net from 'net';
import { Server } from '../typing';

export class GateServer extends Server {
    private static _instance: GateServer;
    private _server: net.Server | undefined;
    private static _config: any|undefined;
    constructor(){
        super();
        this.init();
    }
    
    static getInstance(config: any = null): GateServer {
        if ( !this._instance ) {
            GateServer._config = config;
            this._instance = new GateServer();
        }
        return this._instance;
    }

    private init() {
        this._server = new net.Server( ( socket: net.Socket ) => {
            // socket.end('goodbye\n');
            socket.on('data', (data) => {
                console.log("socket data: ", data.toString().replace('\n', ''));
            });
            socket.on('close', (e: Event) => {
                console.log("socket close: ", e);
            });
        });
        this._server.on('error', (err: Error) => {
            throw err;
        });
        this._server.on('close', (err: Event) => {
            console.log("server close: ", close);
        });
        this._server.on('connection', ( socket: net.Socket ) => {
            console.log("connection: ", socket.address(), );
        });
    }

    public start() {
        const gateConfig = GateServer._config.gate;
        if (!gateConfig) {
            console.error("Error: config file error >> config.json not defined root gate server.");
            return;
        }
        this._server!.listen({
            host: gateConfig.host,
            port: parseInt(gateConfig.port),
            exclusive: true
        }, () => {
            console.log('opened gate server on', this._server!.address());
        });
    }
    public stop() {
        this._server!.close(() => {
            console.log('closed gate server on', this._server!.address());
        });
    }
}