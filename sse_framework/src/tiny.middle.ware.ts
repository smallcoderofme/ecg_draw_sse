import * as http from "http";
export namespace tinyMiddleware {
    export function ServerSideEvent( res: http.ServerResponse ) {
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control":"no-cache, no-transform",
            "Connection":"keep-alive",
            "X-Accel-Buffering": "no"
        });
    }
}