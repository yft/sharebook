(function($, doc) {
	$.init();
	$.plusReady(function() {
		document.getElementById('searchBooks').addEventListener('tap', function () {
			removeSearchCondition();
			var obj = {
				isbn: document.querySelector("[name=isbn]").value,
				bookname: document.querySelector("[name=bookname]").value,
				author: document.querySelector("[name=author]").value
			};
			setSearchCondition(obj);
			$.openWindow({
				'url': 'booklist.html',
				'id': 'store-booklist'
			});
		}, false);
	});
}(mui, document));