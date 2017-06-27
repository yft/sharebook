(function($, doc) {
	$.plusReady(function() {
		var scanbarcode = getScanBarcode();
		if (scanbarcode) {
			document.querySelector('[name=outisbn]').value = scanbarcode;
			removeScanBarcode();
		}

		var outSubmit = document.getElementById('outSubmit');
		var barcode = document.getElementById('barcode');

		outSubmit.addEventListener('tap', function(e) {
			var userContact = getUserContact();
			if (!userContact.qq && !userContact.wechat) {
				$.alert('请前往“我的”界面补充您的联系信息，以方便其他用户购买您的书籍');
				return;
			}
			var outisbn = document.getElementById('outisbn').value;
			var outprice = document.getElementById('outprice').value;
			var outnum = document.getElementById('outnum').value;
			if(!/^\d{13}$/.test(outisbn)) {
				$.alert('ISBN要求为13位数字');
				return;
			}
			if(!/^[0-9]+(.[0-9]{1,2})?$/.test(outprice)) {
				$.alert('单价要求大于0，最多两位小数');
				return;
			}
			if(!/^\+?[1-9][0-9]*$/.test(outnum)) {
				$.alert('数量要求为大于0的正整数');
				return;
			}
			plus.nativeUI.showWaiting('查询中...');
			$.ajax({
				url: 'https://api.douban.com/v2/book/search?q=' + outisbn,
				type: 'get',
				success: function(res) {
					//存储获取到的书籍信息
					setBookList(res);
					//存储用户填写的信息
					setOutBookInfo({
						'isbn': outisbn,
						'price': outprice,
						'num': outnum
					});
					plus.nativeUI.closeWaiting();
					$.openWindow({
						'url': 'booklist.html',
						'id': 'booklist'
					});
				},
				error: function(err) {
					plus.nativeUI.closeWaiting();
					$.alert('请求失败');
				}
			});
		});
		barcode.addEventListener('tap', function () {
			$.openWindow({
				url: "scanner.html",
				id: "scanner"
			});
		});
	});
}(mui, document));