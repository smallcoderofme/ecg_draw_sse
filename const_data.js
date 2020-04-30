'use strict';

const fs = require("fs");
const http = require("http");

var data_config;
var responseHander;
var index = 0;
fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    console.log('Read config file success!');
    data_config = JSON.parse(data);
    // console.log(data_config);
	http.createServer((req, res) => {
	  req.on('close', function(e) {
	    console.log("close", e);
	  });
	  res.setHeader("Access-Control-Allow-Origin", '*');
	  var fileName = "." + req.url;
	  if (fileName === "./stream") {
	    res.writeHead(200, {
	      "Content-Type":"text/event-stream",
	      "Cache-Control":"no-cache, no-transform",
	      "Connection":"keep-alive",
	      "X-Accel-Buffering": "no"
	    });
	    var id = setInterval(()=>{
    	  res.write("data: " + data_config[index] + "\n\n", 'utf8');
    	  index++;
    	  if(index == 25000) {
    	  	index = 0;
    	  }
	    }, 3);
	 
	  }
	}).listen(8844, "127.0.0.1");
});