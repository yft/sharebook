(function($, doc) {
	$.init();
	$.plusReady(function() {
		document.querySelector('#logout').addEventListener('tap', function (e) {
			app.setState({});
			removeUserId();
			var allwebview = plus.webview.all();
			for (var i in allwebview) {
				if (allwebview[i].id != 'HBuilder') {
					allwebview[i].close();
				}
			}
		});
		
		document.querySelector('#wanted').addEventListener('tap', function (e) {
			$.openWindow({
				url: 'wanted.html',
				id: 'wanted'
			});
		});
		
		document.querySelector('#editInfo').addEventListener('tap', function (e) {
			$.openWindow({
				url: 'editInfo.html',
				id: 'editInfo'
			});
		});
		
		document.querySelector('#buyed').addEventListener('tap', function (e) {
			$.openWindow({
				url: 'buyed.html',
				id: 'buyed'
			});
		});
	});
}(mui, document));