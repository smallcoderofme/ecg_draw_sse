// const fs = require('fs');

// function blobToFile(theBlob, fileName){
//     //A Blob() is almost a File() - it's just missing the two properties below which we will add
//     theBlob.lastModifiedDate = new Date();
//     theBlob.name = fileName;
//     return theBlob;
// }
// var myBlob = new Blob();

// //do stuff here to give the blob some data...

// var myFile = blobToFile(myBlob, "data.json");

// fs.writeFile(myFile, 'utf8', function(err){
// 	if (err) {
// 	    throw err;
// 	}
// });