"use strict";

var http = require("http");
var connecterPool = [];
http.createServer((req, res) => {
  // connecterPool.push();
  req.on('close', function(e) {
    console.log("close", e);
  });
  res.setHeader("Access-Control-Allow-Origin", '*');
  if (req.url === "/stream") {
    res.writeHead(200, {
      "Content-Type":"text/event-stream",
      "Cache-Control":"no-cache, no-transform",
      "Connection":"keep-alive",
      "X-Accel-Buffering": "no"
    });
    var resData = { user:"user1", user_id:"154531545" };
    res.write("data: " + JSON.stringify(resData) + "\n\n", 'utf8');
  }
}).listen(8844, "127.0.0.1");


 
