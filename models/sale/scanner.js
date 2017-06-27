(function($, doc) {
	$.init();
	$.plusReady(function() {
		var scan;
		
		try {
			scan = new plus.barcode.Barcode('bcid', [
				plus.barcode.EAN13
			], {
				frameColor: '#399a0e',
				scanbarColor: '#399a0e'
			});
			scan.onmarked = function (type, res) {
				setScanBarcode(res);
				plus.webview.getWebviewById('sale').reload();
				$.back();
			};
			scan.onerror = onerror;
			scan.start();
			
			var flag = false;
			document.getElementById('lightToggle').addEventListener('tap', function () {
				scan.setFlash(!flag);
				flag = !flag;
			});
		} catch (e) {
			$.alert('出现错误：' + e);
		}
		function onerror (e) {
			$.alert('出现错误：' + e);
		}
	});
}(mui, document));