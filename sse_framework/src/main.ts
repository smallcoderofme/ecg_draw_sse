import { TinyServer } from "./tiny.server";

const server = TinyServer.SSE.getInstance();
// console.log(server);

var counter: number = 0;
setInterval(()=> {
    counter ++;
    server.broadcast({status:"ok", message:"echo", commandId: counter.toString(), data: Date.now() });
}, 1000);