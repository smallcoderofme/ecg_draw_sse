
import * as http from "http";
import { v4 as uuidv4 } from "uuid";
import { Routers, ROUTER_TYPE } from "./router";
import { Socket } from "net";

const WARNNING: boolean = true;
export namespace TinyServer {

    export interface Connector {
        connectorId: string;
        online: boolean;
        reqHandler: http.IncomingMessage;
        resHandler: http.ServerResponse;
    }
    
    export interface MsgPackage {
        status: string;
        message: string;
        commandId: string;
        data: any;
    }

    export class SSE {
        private connectorPool: Map<string, Connector> = new Map();
        private static _instance: SSE;
        private _http: http.Server | undefined;
        constructor() {
            if (!WARNNING) {
                console.log("This is a singleton!");
                return;
            }
            this.init();
        }

        static getInstance(): SSE {
            if ( !this._instance ) {
                this._instance = new SSE();
            }
            return this._instance;
        }

        private init() {
            this._http = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
                let defind: boolean = false;
                for ( let router of Routers ) {
                    /**
                     * 是否是已经定义的路由
                     */
                    if ( req.url === router.path ) {
                        /**
                         * 使用定义路由自己的中间件
                         */
                        router.middles.forEach(middle => {
                            middle(req, res);
                        });

                        if ( router.type === ROUTER_TYPE.SSE ) {
                            /**
                             * server side event
                             */
                            this.listener(req);
                            this.reconnecting(req, res);
            
                            const connector = { connectorId: uuidv4(), online: true, reqHandler: req, resHandler: res };
                            this.connectorPool.set( connector.connectorId, connector );
                        } else {
                            /**
                             * http
                             */
                            
                        }
                        defind = true;
                        return;
                    }
                }
                if (!defind) {
                    console.error("Current requst router is undefind!");
                }
            }).listen(8844, "127.0.0.1", () => {
                console.log("start listening http://127.0.0.1:8844 ...");
            });
            this._http.on("close", () => {
                console.log("server close.");
            });
            this._http.on("connection", (socket: Socket) => {
                console.log("server connection.");
            });
            this._http.on("listening", () => {
                console.log("server listening.");
            });
            this._http.on("error", (err: Error) => {
                console.log("server error.");
            });
        }

        private listener(req: http.IncomingMessage) {
            req.once("close", (e: any) => {
                for ( let connector of this.connectorPool.values() ) {
                    if ( connector.connectorId === req.headers["connectorId"] ) {
                        connector.online = false;
                    }
                }
            });
        }

        private reconnecting( req: http.IncomingMessage, res: http.ServerResponse ) {
            const connectorId: any = req.headers["connectorId"];
            if (connectorId) {
                for ( let connector of this.connectorPool.values() ) {
                    if ( connector.connectorId === connectorId ) {
                        connector.online = true;
                        connector.reqHandler = req;
                        connector.resHandler = res;
                    }
                }
            }
        }

        broadcast(data: MsgPackage) {
            for ( let connector of this.connectorPool.values() ) {
                if ( connector.online ) {
                    connector.resHandler.write("data: " + JSON.stringify(data) + "\n\n", 'utf8');
                }
            }
        }

        send(connectorId: string, data: MsgPackage) {
            const connector = this.connectorPool.get(connectorId);
            if(connector && connector.online) {
                connector.resHandler.write("data: " + JSON.stringify(data) + "\n\n", 'utf8')
            }
        }

        private postBody( req: http.IncomingMessage, callback:Function ) {
            let body: string = "";
            let on_data_fun:any = (chunk: string):void => {
                body += chunk;
            }
            req.on("data", on_data_fun);
            req.once("end", ()=> {
                req.off("data", on_data_fun);
                callback(JSON.parse(body));
            });
        }
    }
}

