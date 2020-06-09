(function() {
	'use strict';
	var root = document.getElementById('root');
	var btns = document.getElementsByTagName('button');
	
	var routers = [
		{ path: '/index', component: 'main.html'},
		{ path: '/post', component: 'post.html'}
	];

	render();
	
	function render() {
		var path = location.pathname.replace('.html','');
		for (var i = 0; i < routers.length; i++) {
			if( routers[i].path == path) {
				loadTemplate(routers[i].component, (data) => {
					root.innerHTML = data;
				});
			}
		}
	}

	btns[0].addEventListener('click', function() {
		history.pushState(routers[0].component, '', 'index');
		render();
	});
	btns[1].addEventListener('click', function() {
		history.pushState(routers[1].component, '', 'post');
		render();
	});

	window.addEventListener('popstate', function(e) {
		root.innerHTML = e.state;
	});

	function loadTemplate(url, callback) {
		var xhr = new XMLHttpRequest(); 
		xhr.onreadystatechange = result;      
		xhr.open('GET', '/' + url);
		xhr.send();  
		function result() {
		    if (xhr.readyState === 4) {     
		        callback(xhr.responseText);
		    }   
		}
	}

})();