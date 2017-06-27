(function($, doc) {
	$.init();
	$.plusReady(function() {
		AV.init({
			appId: 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz', 
			appKey: 'OUrrgkcEUrRuoLuNqjivOQGN'
		});
		var query = new AV.Query('Userinfo');
		query.get(getUserId()).then(function (userinfo) {
			var buyed = userinfo.attributes.buyed;
			if (buyed.length) {
				var url = 'https://leancloud.cn:443/1.1/classes/Book?where=';
				url += encodeURIComponent(JSON.stringify({
					"objectId": {
						"$in": buyed
					}
				}));
				url += '&&&order=-updatedAt&&';
				sendAjax(plus, $, {
					url: url, 
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
									var buyedcount = 0;
									$.each(e.buyerId, function(i, e) {
										if (e == getUserId()) {
											buyedcount ++;
										}
									});
									htmlStr += '<li class="mui-table-view-cell mui-collapse">' +
								    '    <a class="mui-navigate-right" href="#">' +
								    '    	<img class="mui-media-object mui-pull-left" src="' + e.image + '">' +
								    '        <div class="mui-media-body">' + e.name +
								    '            <p class="mui-ellipsis">ISBN：' + e.isbn + '</p>' +
								    '        </div>' +
								    '    </a>' +
								    '    <div class="mui-collapse-content">' +
								    '    	<p class="remain">购买数量及单价：' + buyedcount + ' * ¥' + e.price + '</p>';
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
								    '    </div>' +
								    '</li>';
								});
								document.querySelector('#booklist').innerHTML = htmlStr;
							}
						});
					}
				});
			}
		});
	});
}(mui, document));