// import { TinyServer } from "./tiny.server";

// const server = TinyServer.SSE.getInstance();
// // console.log(server);

// var counter: number = 0;
// setInterval(()=> {
//     counter ++;
//     server.broadcast({status:"ok", message:"echo", commandId: counter.toString(), data: Date.now() });
// }, 1000);

import fs from 'fs';
import { Global } from './typing';
import { GateServer } from './gate/gate.server';

var global: Global = { config: null, gate: undefined };
function loadCONFIG() {
    fs.readFile('config.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        console.info('>> Read config file success!');
        const config = JSON.parse(data);
        
        global.config = config;
        global.gate = GateServer.getInstance(config);
        global.gate.start();
    });
}

loadCONFIG();