window.resultDB = (function(){
	"use strict";
	if (window.indexedDB) {
		var resDB = {} || resultDB;
		resDB.expResult = "expResult";
		resDB.version = 1; /* 新建数据库时，默认为1 */
		resDB.db;
		function open() {
			resDB.req = window.indexedDB.open(resDB.expResult, resDB.version);
			resDB.req.onerror = function (e) {
				console.error("打开数据库错误");
			}
			resDB.req.onblocked = function (e) {
				console.log("上一次的数据库连接未关闭");
			}
			/**
				新建数据库与打开数据库是同一个操作。如果指定的数据库不存在，就会新建。不同之处在于，后续的操作主要在upgradeneeded事件的监听函数里面完成，因为这时版本从无到有，所以会触发这个事件。
			*/
			resDB.req.onupgradeneeded = function (e) { /* 如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded */
				resDB.db = e.target.result;
				var objectStore;
				console.log("IndexedDB upgradeneeded");
				if (!resDB.db.objectStoreNames.contains('exp_ecg')) {   /*是否存在，不存在再进行存储*/
					// objectStore = db.createObjectStore('person', { keyPath: 'id' });
					objectStore = resDB.db.createObjectStore('exp_ecg', { autoIncrement: true });
				}
			}
			resDB.req.onsuccess = function (e) {
				resDB.db = resDB.req.result;
				console.info("打开数据库成功");
			}
		}
		function add(data) {
			if (!resDB.db) {
				console.info("数据库未打开");
			}
			var request = resDB.db.transaction(['exp_ecg'], "readwrite")
				.objectStore("exp_ecg")
				.add(data);
			request.onsuccess = function (e) {
				console.info("写入成功");
			}
			request.onerror = function (e) {
				console.error("写入失败");
			}
		}

		function read(key, complete) {
			if (!resDB.db) {
				console.info("数据库未打开");
			}

			if (!key) { console.log("请设定要删除的数据Key值"); return; }
			if (typeof key !== 'number') {
				console.log("key不是number类型");
				return;
			}

		   	var transaction = resDB.db.transaction(['exp_ecg']);
		   	var objectStore = transaction.objectStore('exp_ecg');
		   	var request = objectStore.get(1);

		   	request.onerror = function(event) {
		    	console.error('读取失败', event);
	    	}

			request.onsuccess = function( event) {
				if (request.result) {
					var data = JSON.stringify(request.result);
					if(complete) complete(data);
					else console.log(data);
				} else {
					console.info('未得到数据');
				}
			}
		}
		function readAll(complete) {
			if (!resDB.db) {
				console.info("数据库未打开");
			}
		  	var objectStore = resDB.db.transaction('exp_ecg').objectStore('exp_ecg');
		  	var allData = [];
		   	objectStore.openCursor().onsuccess = function (event) {
			    var cursor = event.target.result;
			    if (cursor) {
			       	// console.log('Key: ' + cursor.key);
			       	// console.log('Name: ' + JSON.stringify(cursor.value));
			       	allData.push(JSON.stringify(cursor.value));
			       	cursor.continue();
			    } else {
			      	console.log('已经没有数据了');
			      	if(complete) complete(allData);
			    }
		  	};
		}
		function update(data) {
			if (!resDB.db) {
				console.info("数据库未打开");
			}
		  	var request = resDB.db.transaction(['exp_ecg'], 'readwrite')
		    	.objectStore('exp_ecg')
		    	.put(data);

		  	request.onsuccess = function (event) {
		   		console.log('数据更新成功');
		  	};

		  	request.onerror = function (event) {
		    	console.log('数据更新失败');
		  	}
		}
		function remove(key) {
			if (!resDB.db) {
				console.info("数据库未打开");
			}
			if (!key) { console.log("请设定要删除的数据Key值"); return; }
			if (typeof key !== 'number') {
				console.log("key不是number类型");
				return;
			}
			var request = resDB.db.transaction(['exp_ecg'], 'readwrite')
				.objectStore('exp_ecg')
				.delete(key);

			request.onsuccess = function (event) {
				console.log('数据删除成功');
			};
		}
		function clearAll() {
			if (resDB.db) {
				resDB.close();
			}
			var DBDeleteRequest = window.indexedDB.deleteDatabase(resDB.expResult);

			DBDeleteRequest.onerror = function (event) {
			  console.log('Error');
			};

			DBDeleteRequest.onsuccess = function (event) {
			  console.log('success');
			};
		}
		resDB.open = open;
		resDB.save = add;
		resDB.read = read;
		resDB.readAll = readAll;
		resDB.remove = remove;
		resDB.clearAll = clearAll;
		resDB.close = function() { if(resDB.db) {resDB.db.close(); console.log("关闭数据库");} }
		return resDB;
	} else {
		alert("您的浏览器不支持indexedDB数据库");
	}
})();