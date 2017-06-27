(function($, doc) {
	$.init();
	$.plusReady(function() {

		//获取父webview
		var parentWv = plus.webview.currentWebview();
		//创建子webview，并显示第一个
		var pageList = [
			{
				url: '../store/store.html',
				id: 'store'
			}, {
				url: '../sale/sale.html',
				id: 'sale'
			}, {
				url: '../shelf/shelf.html',
				id: 'shelf'
			}, {
//				url: '../find/find.html',
//				id: 'find'
//			}, {
				url: '../mine/mine.html',
				id: 'mine'
			}
		];
		var l = pageList.length;
		for(var i = 0; i < l; i++) {
			var url = pageList[i].url;
			var id = pageList[i].id;

			//如果该webview已经存在，则跳过本次循环
			if(plus.webview.getWebviewById(id)) {
				continue;
			}

			var newWv = plus.webview.create(url, id, {
				bottom: '50px',
				top: '0px',
				popGesture: 'none'
			});
			i == 0 ? newWv.show() : newWv.hide();

			//将子webview追加到父webview
			parentWv.append(newWv);

		}

		var curWv = 'store';
		$('.mui-bar').on('tap', '.mui-tab-item', function(e) {
			var showWvId = this.dataset.id;
			if(curWv === showWvId) {
				return;
			}
			plus.webview.getWebviewById(curWv).hide();
			plus.webview.getWebviewById(showWvId).show();
			curWv = showWvId;
		});
		
		var t = setInterval(function () {
			if (getAddBookRes()) {
				clearInterval(t);
				removeAddBookRes();
				var arr = $('.mui-bar .mui-tab-item');
				for (var i = 0; i < arr.length; i ++) {
					arr[i].classList.remove('mui-active');
				}
				$('#shelf')[0].classList.add('mui-active');
			}
		}, 600);
	});
}(mui, document));