function timedCount() {
	const MAX_REPAINT = 100;
	var _newData = new Array();
	var draw_array = new Array();
	var enough = false;
	var ws = new WebSocket('ws://127.0.0.1:8080');
	ws.onopen = () => {
		console.log('open');
	}
	ws.onmessage = (e) => {
		_newData = JSON.parse(e.data);
		getArr();
	}

	var result = {};

	function calc() {
		var curDatas = _newData.slice(0,MAX_REPAINT);
		_newData.splice(0,MAX_REPAINT);
		var n = 1;
		if(draw_array.length < 2000){
			for(var i = 0;i < MAX_REPAINT; i++) {
				draw_array.push( draw_array.length / 2 * n, curDatas[i] );
			}
		}else{
			enough = true;
			draw_array.splice(0, MAX_REPAINT);
			var step = 0;
			for(var i = 0; i < draw_array.length; i++){

				if(i % 2 == 0){
					draw_array.splice(i, 1, step * n);
					step ++;
				}
			}
			for(var i = 0;i < MAX_REPAINT; i++) {
				draw_array.push( draw_array.length / 2 * n, curDatas[i] );
			}
			draw_array.splice(0, MAX_REPAINT * 2);
		}
	}
	function getArr() {
		calc();
		var d = max_min();
		var arr = new Array();
		arr = draw_array.concat();
		for(var i = 0; i < arr.length; i++){
			if(i % 2 != 0){
				var n = 520 / d;
				arr[i] = ( (520 / 2) + (arr[i] * n) ) ;
			}
		}
		postMessage({state: enough, data: arr});
		// console.log(arr);
	}
	function max_min(){
		var min = Math.min.apply(null,draw_array);
		var max = Math.max.apply(null,draw_array);
		var d = Math.abs(max) > Math.abs(min) ? Math.abs(max) : Math.abs(min);
		d = d * 2;
		return d;
	}
}

timedCount();
