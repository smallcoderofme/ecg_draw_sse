import * as http from "http";
export namespace tinyMiddleware {
    export function ServerSideEvent( res: http.ServerResponse, domian:string = "*" ) {
        res.setHeader("Access-Control-Allow-Origin", domian);
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control":"no-cache, no-transform",
            "Connection":"keep-alive",
            "X-Accel-Buffering": "no"
        });
    }
    export function HttpJsonResponse( res: http.ServerResponse ) {
        res.writeHead(200, {
            "Content-Type":"application/json",
            "Cache-Control":"no-cache"
        });
    }
}