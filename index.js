'use strict';

const SerialPort = require('serialport')

function toInt32(hexStr) {
  const intMin=-2147483648;
  const intMax=2147483647;
  var real = parseInt(hexStr, 16);
  return real >= intMax ? (real - intMax + intMin) : real;
}
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
  } else if (req.method === "GET" && fileName === "./port_list") {
      res.writeHead(200, {
        "Content-Type":"application/json",
        "Cache-Control":"no-cache"
      });
      res.end(JSON.stringify({list: ["COM1", "COM2", "COM3"]}), 'utf8');
  } else if(req.method === "POST" && fileName === "./confirm_port") {
      // res.setEncoding('utf8');
      let newData = '';
      req.on('data', chunk => {
        newData+=chunk;
      })
      req.on('end', () => {
        console.log(newData);
        res.end(JSON.stringify({"status": "ok"}));
      })
  }
}).listen(8844, "127.0.0.1");