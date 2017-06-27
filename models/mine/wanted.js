(function($, doc) {
	$.init();
	$.plusReady(function() {
		AV.init({
			appId: 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz', 
			appKey: 'OUrrgkcEUrRuoLuNqjivOQGN'
		});
		var query = new AV.Query('Userinfo');
		query.get(getUserId()).then(function (userinfo) {
			var wanted = userinfo.attributes.wanted;
			$.each(wanted, function (i, item) {
				wanted[i] = "%22" + item + "%22";
			});
			if (wanted.length) {
				sendAjax(plus, $, {
					url: 'https://leancloud.cn:443/1.1/classes/Book?where=%7B%22objectId%22%3A%7B%22%24in%22%3A%5B' + wanted.join('%2C') + '%5D%7D%7D&&&order=-updatedAt&&', 
					type: 'get', 
					callback: function(res) { // 获取书籍信息
						var booklist = res;
						var htmlStr = '';
						var ownerArr = [];
						$.each(booklist.results, function(i, e) {
							ownerArr.push(e.userId);
						});
						var url = 'https://leancloud.cn:443/1.1/classes/_User?where=';
						url += encodeURIComponent(JSON.stringify({
							"objectId": {
								"$in": ownerArr
							}
						}));
						url += '&&&order=-updatedAt&&keys=qq%2Cwechat';
						sendAjax(plus, $, {
							url: url,
							type: 'get',
							callback: function (res) {
								var ownerInfo = {};
								$.each(res.results, function(i, e) {
									ownerInfo[e.objectId] = {};
									if (e.qq) {
										ownerInfo[e.objectId].qq = e.qq;
									}
									if (e.wechat) {
										ownerInfo[e.objectId].wechat = e.wechat;
									}
								});
								$.each(booklist.results, function(i, e) {
									htmlStr += '<li class="mui-table-view-cell mui-collapse">' +
								    '    <a class="mui-navigate-right" href="#">' +
								    '    	<img class="mui-media-object mui-pull-left" src="' + e.image + '">' +
								    '        <div class="mui-media-body">' + e.name +
								    '            <p class="mui-ellipsis">ISBN：' + e.isbn + '</p>' +
								    '        </div>' +
								    '    </a>' +
								    '    <div class="mui-collapse-content">' +
								    '    	<p class="remain">库存及单价：' + (e.num - e.buyerId.length) + ' * ¥' + e.price + '</p>';
								    if (ownerInfo[e.userId].qq || ownerInfo[e.userId].wechat) {
								    	htmlStr += '<p>出售者的联系方式（长按复制）：</p>';
								    	if (ownerInfo[e.userId].qq) {
								    		htmlStr += 'QQ <span class="copiable color-blue text-underline">' + ownerInfo[e.userId].qq + '</span> '; 
								    	}
								    	if (ownerInfo[e.userId].wechat) {
								    		htmlStr += '微信 <span class="copiable color-blue text-underline">' + ownerInfo[e.userId].wechat + '</span>';
								    	}
								    }
								    htmlStr += '<p class="brief">' + e.brief + '</p>' +
								    '    	<button type="button" class="mui-btn mui-btn-blue mui-btn-outlined wanted-btn" data-bookid="' + e.objectId + '">取消申请</button>' +
								    '    </div>' +
								    '</li>';
								});
								document.querySelector('#booklist').innerHTML = htmlStr;
							}
						});
					}
				});
			}
		}, function (err) {
			plus.nativeUI.toast('请求出错');
		});
		
		// 取消购买申请
		$('#booklist').on('tap', '.wanted-btn', function () {
			var _this = this;
			AV.init({
				appId: 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz', 
				appKey: 'OUrrgkcEUrRuoLuNqjivOQGN'
			});
			var query = new AV.Query('Userinfo');
			// 更新两处 Book.wanted 和 Userinfo.wanted
			query.get(getUserId()).then(function (userinfo) {
				userinfo.remove('wanted', _this.dataset.bookid);
				userinfo.save().then(function (res) {
					var query = new AV.Query('Book');
					query.get(_this.dataset.bookid).then(function (book) {
						book.remove('wanted', getUserId());
						book.save().then(function (res) {
							plus.nativeUI.toast('取消成功，请重新进入查看');
						}, function (err) {
							plus.nativeUI.toast('取消失败：' + err);
						});
					}, function (err) {
						plus.nativeUI.toast('取消失败：' + err);
					});	
				}, function (err) {
					plus.nativeUI.toast('取消失败：' + err);
				});
			}, function (err) {
				plus.nativeUI.toast('取消失败：' + err);
			});
		});
	});
}(mui, document));