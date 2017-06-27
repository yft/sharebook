(function($, doc) {
	$.init({
		swipeBack: false
	});
	$.plusReady(function() {
		var wantedInfo = getBookSelectForWanted();
		var wantedList = wantedInfo.arr;
		removeBookSelectForWanted();
		console.log(wantedInfo);
		var htmlStr = '';
		for (var i in wantedList) {
			htmlStr += '<li class="mui-table-view-cell mui-collapse" data-qq="' + wantedList[i].qq + '">' +
				'	<a class="mui-navigate-right" href="javascript:;">' +
			    '        <img class="mui-media-object mui-pull-left" src="http://placehold.it/40x30">' +
			    '        <div class="mui-media-body mui-ellipsis lineheight42">' + wantedList[i].username + '</div>' +
			    '    </a>' +
				'	<div class="mui-collapse-content">' +
				'		<button type="button" class="wantedlist-oper mui-btn mui-btn-primary mui-btn-outlined oper-sale" data-userid="' + wantedList[i].objectId + '" data-name="' + wantedList[i].username + '">出售给Ta</button>';
				if (wantedList[i].qq || wantedList[i].wechat) {
					htmlStr += '<p>Ta的联系方式（长按复制）：</p>';
				}
				if (wantedList[i].qq) {
					htmlStr += 'QQ ' + '<span class="copiable color-blue text-underline">' + wantedList[i].qq + '</span> ';
				}
				if (wantedList[i].wechat) {
					htmlStr += '微信 ' + '<span class="copiable color-blue text-underline">' + wantedList[i].qq + '</span>';
				}
				htmlStr += '</div></li>';
		}
		$('.mui-table-view')[0].innerHTML = htmlStr;
		// 出售操作 --------------------------------- begin
		$('.mui-content').on('tap', '.oper-sale', function () {
			var _this = this;
			$.confirm(
				'您准备将此书出售给'+_this.dataset.name+'，“出售”操作完成后，买方可在刷新后的“买到的书籍列表”查看您提供的支付宝账号，也可双方协商进行支付操作。出售操作不可逆。',
				'是否确定出售？',
				['确定', '放弃'],
				function (e) {
					if (e.index == 0) { // 确定出售
						AV.init({
							appId: 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz', 
							appKey: 'OUrrgkcEUrRuoLuNqjivOQGN'
						});
						var query = new AV.Query('Userinfo');
						query.get(_this.dataset.userid).then(function (userinfo) {
							userinfo.add('buyed', [wantedInfo.bookid]);
							userinfo.save().then(function (res) {
								var query = new AV.Query('Book');
								query.get(wantedInfo.bookid).then(function (book) {
									book.add('buyerId', [_this.dataset.userid]);
									book.save().then(function (res) {
										plus.nativeUI.toast('出售成功');
										plus.webview.getWebviewById('shelf').reload();
										$.back();
									}, function (err) {
										plus.nativeUI.toast('出售失败：' + err);
									});
								}, function (err) {
									plus.nativeUI.toast('出售失败：' + err);
								});
							}, function (err) {
								plus.nativeUI.toast('出售失败：' + err);
							});
						}, function (err) {
							plus.nativeUI.toast('出售失败：' + err);
						});
//						sendAjax(plus, $, {
//							url: 'https://leancloud.cn:443/1.1/classes/Book/' + wantedInfo.bookid,
//							type: 'put',
//							data: {
//								"buyerId": {
//									"__op": "Add",
//									"objects": [_this.dataset.userid]
//								}
//							},
//							callback: function(res) {
//								console.log(res);
//							}
//						});
					}
				});
		});
		// 出售操作 --------------------------------- end
	});
}(mui, document));