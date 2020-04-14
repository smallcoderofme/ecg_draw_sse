'use strict';

const SerialPort = require('serialport')

function toInt32(hexStr) {
  const intMin=-2147483648;
  const intMax=2147483647;
  var real = parseInt(hexStr, 16);
  return real >= intMax ? (real - intMax + intMin) : real;
}
var http = require("http");

var port_list = [];

SerialPort.list().then(
  ports => ports.forEach(function(port){
    port_list.push(port.path);
  }),
  err => port_list.push(err)
)

var resHandle = null;
var port = null;
function initPort(portName) {
    port = new SerialPort(portName, 
      { baudRate: 115200, 
        autoOpen:false }
    );
    port.on('error', function(err) {
      console.log('Error: ', err.message)
    })
}

function start(handler) {
  resHandle = handler;
  port.open(function(err) {
    if (err) {
      return console.log('Error opening port: ', err.message)
    }
  });
  console.log("handler");
  port.on('readable', readcallback);
}

function stop() {
  port.off('readable', readcallback);
  port.close();
}

function readcallback() {
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
    var currD = toInt32(currR);

    resHandle.write("data: " + currD + "\n\n", 'utf8');
  }
}

http.createServer((req, res) => {
  req.on('close', function(e) {
    console.log("close", e);
    stop();
  });
  if (!port) {
    initPort('COM5');
  }
  res.setHeader("Access-Control-Allow-Origin", '*');
  var fileName = "." + req.url;
  if (fileName === "./stream") {
    res.writeHead(200, {
      "Content-Type":"text/event-stream",
      "Cache-Control":"no-cache, no-transform",
      "Connection":"keep-alive",
      "X-Accel-Buffering": "no"
    });
    start(res);
    // res.write("data: "+ "456465" + "\n\n", 'utf8');
  } else if (req.method === "GET" && fileName === "./port_list") {
      res.writeHead(200, {
        "Content-Type":"application/json",
        "Cache-Control":"no-cache"
      });
      res.end(JSON.stringify({list: port_list}), 'utf8');
  } else if(req.method === "POST" && fileName === "./confirm_port") {
      let newData = '';
      req.on('data', chunk => {
        newData+=chunk;
      })
      req.on('end', () => {
        let result = JSON.parse(newData);
        console.log("POST: ", result.selected);
        if (exist(result.selected)) {
          res.end(JSON.stringify({"status": "ok"}));
        } else {
          res.end(JSON.stringify({"status": "error", "message":"所选的串口不存在。"}));
        }
        
      })
  }
}).listen(8844, "127.0.0.1");

function exist(selectedPort) {
   for (let port of port_list) {
     if (port === selectedPort) {
       return true;
     }
   }
   return false;
}