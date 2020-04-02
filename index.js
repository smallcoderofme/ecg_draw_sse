'use strict';

const SerialPort = require('serialport')

function toInt32(hexStr) {
  const intMin=-2147483648;
  const intMax=2147483647;
  var real = parseInt(hexStr, 16);
  return real >= intMax ? (real - intMax + intMin) : real;
}
// const Readline = require('@serialport/parser-readline')

// const WebSocket = require('ws');
 
// const wss = new WebSocket.Server({
//   port: 8080,
//   perMessageDeflate: {
//     zlibDeflateOptions: {
//       // See zlib defaults.
//       chunkSize: 1024,
//       memLevel: 7,
//       level: 3
//     },
//     zlibInflateOptions: {
//       chunkSize: 10 * 1024
//     },
//     // Other options settable:
//     clientNoContextTakeover: true, // Defaults to negotiated value.
//     serverNoContextTakeover: true, // Defaults to negotiated value.
//     serverMaxWindowBits: 10, // Defaults to negotiated value.
//     // Below options specified as default values.
//     concurrencyLimit: 10, // Limits zlib concurrency for perf.
//     threshold: 1024 // Size (in bytes) below which messages
//     // should not be compressed.
//   }
// });

var http = require("http");
http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", '*');
  var fileName = "." + req.url;
  if (fileName === "./stream") {
    res.writeHead(200, {
      "Content-Type":"text/event-stream",
      "Cache-Control":"no-cache, no-transform",
      "Connection":"keep-alive",
      "X-Accel-Buffering": "no"
    });

     SerialPort.list().then(
      ports => ports.forEach(console.log),
      err => console.error(err)
    )

    const port = new SerialPort('COM5', 
      { baudRate: 115200, 
        autoOpen:true }
    )

    port.open(function (err) {
      if (err) {
        return console.log('Error opening port: ', err.message)
      }
    })

    // var loop = false;
    port.on('readable', function () {
      // console.log(loop?"uncomplete":"complete");
      // loop = true;
      var data = port.read();
      var hex = data.toString("hex");
      var index = hex.indexOf('aaaaf108');
      hex = hex.substr(index, hex.length-index);
      var result = hex.replace(/aaaaf108/g,'');
      var len = result.length/8;
      var offset = 0;
      for (var i = 1; i < len; i++) {
        if (i%2==0) {
          offset += 2;
          continue;
        }
        var currR = result.substr(i*8+offset,8);
        if (!currR || currR.length < 8) {
          continue;
        }
       var currD = toInt32(currR)
       res.write("data: " + currD + "\n\n", 'utf8');
      }
      // loop = false;
    });

    // var interval = setInterval(function () {
    
    //   // res.write("data: " + (new Date()) + "\n\n", 'utf8');
    //   // res.write(data);
    //   // var data;
    //   // if (DATA.length) {
    //   //   data = DATA.shift();
    //   // } else {
    //   //   res.end();
    //   //   return;
    //   // }

    //   index = index + 100;
    //   if (index > 129) {
    //     index = 0;
    //   }
      // res.write("data: " + JSON.stringify(DATA.slice(index, index + 100)) + "\n\n", 'utf8');
    // }, delay);

    // req.connection.addListener("close", function () {
    //   clearInterval(interval);
    // }, false);
  }
}).listen(8844, "127.0.0.1");

// var connectied = false;
// var _ws;
// wss.on('connection', function connection(ws) {
//     connectied = true;
//     setInterval(()=> {
//       ws.send('1');
//     }, 1);

//     SerialPort.list().then(
//       ports => ports.forEach(console.log),
//       err => console.error(err)
//     )

//     const port = new SerialPort('COM5', 
//       { baudRate: 115200, 
//         autoOpen:true }
//     )

//     port.open(function (err) {
//       if (err) {
//         return console.log('Error opening port: ', err.message)
//       }
//       port.write('main screen turn on')
//     })
//     var flag = false;
//     const DATA_NUM = 10;
//     var loop = false;
//     port.on('readable', function () {
//       // if (flag) {
//       //   return;
//       // }
//       // console.log(loop?"uncomplete":"complete");
//       loop = true;
//       var data = port.read();
//       var hex = data.toString("hex");
//       // console.log("hex",hex);
//       var index = hex.indexOf('aaaaf108');
//       hex = hex.substr(index, hex.length-index);
//       // console.log("hex: ",hex);
//       var result = hex.replace(/aaaaf108/g,'');
//       // console.log("result", result);
//       var len = result.length/8;
//       var offset = 0;
//       for (var i = 1; i < len; i++) {
//         if (i%2==0) {
//           offset += 2;
//           continue;
//         }
//         var currR = result.substr(i*8+offset,8);
//         if (!currR || currR.length < 8) {
//           // console.log("curr data: ",currR, currD);
//           continue;
//         }
//        var currD = toInt32(currR)
//        // console.log("curr send currR: ",currR, 'currD', currD);
//       // if (currD === 1) {
//       //    console.log("hex = ",hex);
//       //    console.log("result = ",result);
//          // console.log(currD);
//        // }
//        ws.send(currD);

//         // ws.send(toInt32(result.substr(i*8+offset,8)));
//       }
//       loop = false;
//     });


//     ws.on('close', function (message) {
//       console.log("------------------------------------ close");
//     });
// });


// const parser = new Readline({encoding:'hex'})
// port.pipe(parser)

// parser.on('data', line => {
// 	console.log('Line:', line);
// })
// port.write('ROBOT POWER ON\n')

