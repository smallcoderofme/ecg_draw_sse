import * as http from "http";
export namespace tinyMiddleware {
    export function ServerSideEvent( req: http.IncomingMessage, res: http.ServerResponse, domian:string = "*" ) {
        res.setHeader("Access-Control-Allow-Origin", domian);
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control":"no-cache, no-transform",
            "Connection":"keep-alive",
            "X-Accel-Buffering": "no"
        });
    }
    export function HttpJsonResponse(req: http.IncomingMessage, res: http.ServerResponse ) {
        res.writeHead(200, {
            "Content-Type":"application/json",
            "Cache-Control":"no-cache"
        });
        switch (req.method) {
            case "GET":
                break;
            case "POST":
                let body: string = "";
                let on_data_fun:any = (chunk: string):void => {
                    body += chunk;
                }
                req.on("data", on_data_fun);
                req.once("end", ()=> {
                    req.off("data", on_data_fun);
                    req.body.data = JSON.parse(body);
                });
                break;
        }

    }
}