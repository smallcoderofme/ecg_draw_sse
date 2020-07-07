'use strict';

const fs = require("fs");
const http = require("http");

function toInt32(hexStr) {
  const intMin=-2147483648;
  const intMax=2147483647;
  var real = parseInt(hexStr, 16);
  return real >= intMax ? (real - intMax + intMin) : real;
}

var data_config;
var responseHander;
var index = 0;
var iter = 0;
fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    console.log('Read config file success!');
    // console.log(data)
    const final = data.toString().replace(/"/g,'').split(',')
    const LENG = final.length
    // data_config = JSON.parse(result);
    // const LENG = data_config.length
    // console.log(data_config);
  //   const LENG = data_config.length
  //   var id = setInterval(()=>{
  //   	var hex = data_config[iter]
		// var index = hex.indexOf('aaaaf108');
		// hex = hex.substr(index, hex.length-index);
		// var result = hex.replace(/aaaaf108/g,'');
		// var len = result.length/8;
		// var offset = 0;
		// for (var i = 1; i < len; i++) {
		// 	if (i%2==0) {
		// 	  offset += 2;
		// 	  continue;
		// 	}
		// 	var currR = result.substr(i*8+offset,8);
		// 	if (!currR || currR.length < 8) {
		// 	  continue;
		// 	}
		// 	var currD = toInt32(currR);
		// 	console.log(currD)
		// 	// res.write("data: " + currD + "\n\n", 'utf8');
		// }
		// iter++
		// if (iter == LENG) {
		// 	iter = 0
		// }
  //   }, 100);

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


	    // var hex = data.toString("hex");

	    var id = setInterval(()=>{
	    	var hex = final[iter]
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
				// console.log(currD)
				res.write("data: " + currD + "\n\n", 'utf8');
			}
			iter++
			if (iter == LENG) {
				iter = 0
			}
	    }, 4);



	//     // var id = setInterval(()=>{
 //    	//   res.write("data: " + data_config[index] + "\n\n", 'utf8');
 //    	//   index++;
 //    	//   if(index == 25000) {
 //    	//   	index = 0;
 //    	//   }
	//     // }, 3);
	 
	  }
	}).listen(8844, "127.0.0.1");

});





