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

// var sha256 = require('js-sha256');

// console.log(sha256('Message to hash'));
 
// var hash = sha256.create();
// hash.update('Message to hash');
// console.log(hash.hex());
// console.log(sha256.finalize());

var CryptoJS = require("crypto-js");
 
// Encrypt
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
 console.log(ciphertext);
// Decrypt
var bytes  = CryptoJS.AES.decrypt('U2FsdGVkX18zh/dkULQvDzIqX6RTaW5pCsc9rpxDBRqyUQWE8tImeaq7jGNSY38kPslsY102Zfy7LUt+GRQjOA==', 'S6I');
var originalText = bytes.toString(CryptoJS.enc.Utf8);
 
console.log(originalText); // 'my message'