(function($, doc) {
	$.init();
	$.plusReady(function() {
		var conObj = getSearchCondition();
		var isbn = conObj.isbn;
		var bookname = conObj.bookname;
		var author = conObj.author;
		var markerSet = {};
		var map = new plus.maps.Map('maps');
		var curOverlay;
		//获取用户当前位置
		map.getUserLocation(function (state, point) {
			if (0 == state) {
				
				map.showZoomControls(true);
				map.centerAndZoom(point, 14);
				
				refresh(point);
				$('#scroll').scroll({
					indicators: true
				});
				
				// 本人当前位置
				var myself = new plus.maps.Marker(point);
				myself.setIcon('/common/location.png');
				map.addOverlay(myself);
				myself.bringToTop();
				
				map.onclick = function (e) {
					myself.setPoint(e);
					map.setCenter(e);
					refresh(e);
				};
			} else {
				alert('获取当前位置失败');
			}
		});
		
		$('#list-ul').on('tap', '.bookitem', function () {
			var center = new plus.maps.Point(Number(this.dataset.long), Number(this.dataset.lati));
			var cur = new plus.maps.Marker(center);
			cur.setIcon('/common/circle.png');
			map.removeOverlay(curOverlay);
			map.addOverlay(cur);
			curOverlay = cur;
			map.setCenter(center);
		});
		
		$('#list-ul').on('tap', '.store-want', function () {
			var userContact = getUserContact();
			if (!userContact.qq && !userContact.wechat) {
				$.alert('请前往“我的”界面补充您的联系信息，以方便其他用户购买您的书籍');
				return;
			}
			var _this = this;
			$.confirm(
				'若申请购买，则您将出现在被出售书籍的买方排队列表中，是否确定申请？',
				'是否确定申请？',
				['确定', '放弃'],
				function (e) {
					if (e.index == 0) { // 确定申请
						AV.init({
							appId: 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz', 
							appKey: 'OUrrgkcEUrRuoLuNqjivOQGN'
						});
						var query = new AV.Query('Userinfo');
						// 更新两处 Book.wanted 和 Userinfo.wanted
						query.get(getUserId()).then(function (userinfo) {
							userinfo.addUnique('wanted', [_this.dataset.bookid]);
							userinfo.save().then(function (res) {
								var query = new AV.Query('Book');
								query.get(_this.dataset.bookid).then(function (book) {
									book.addUnique('wanted', [getUserId()]);
									book.save().then(function (res) {
										plus.nativeUI.toast('申请成功，请在“我的-购买申请列表”中查看');
									}, function (err) {
										plus.nativeUI.toast('申请失败：' + err);
									});	
								}, function (err) {
									plus.nativeUI.toast('申请失败：' + err);
								});
							}, function (err) {
								plus.nativeUI.toast('申请失败：' + err);
							});
						}, function (err) {
							plus.nativeUI.toast('申请失败：' + err);
						});
					}
				});
		});
		
		function checkExistPoint(point) {
			var str = point.longitude.toString().replace('.', '_') + point.latitude.toString().replace('.', '_');
			var flag = false;
			console.log(str);
			if (markerSet[str]) {
				flag = true;
			}
			return flag ? markerSet[str] : str;
		}
		
		function refresh(point) {
			var bounds = map.getBounds();
			var condition = {
				withdraw: false,
				longitude: {
					'$gte': bounds.southwest.longitude,
					'$lte': bounds.northease.longitude
				},
				latitude: {
					'$gte': bounds.southwest.latitude,
					'$lte': bounds.northease.latitude
				}
			};
			if (isbn) {
				condition.isbn = {'$regex': isbn};
			}
			if (bookname) {
				condition.name = {'$regex': bookname};
			}
			if (author) {
				condition.author = {'$regex': author};
			}
			var url = 'https://leancloud.cn:443/1.1/classes/Book?where=';
			url += encodeURIComponent(JSON.stringify(condition));
			url += '&&&order=-updatedAt&&';
			sendAjax(plus, $, {
				url: url,
				type: 'get',
				callback: function (res) {
					
					var htmlstr = '';
					var Point = plus.maps.Point;
					$.each(res.results, function(i, e) {
						if (e.buyerId.length >= e.num) return;
						if (e.userId == getUserId()) return;
						
						// 如果该点之前不存在，则在地图上添加标记
						var check = checkExistPoint(e.location);
						if (typeof check === 'string') {
							var marker = new plus.maps.Marker(e.location);
							marker.setIcon('/common/dot.png');
							markerSet[check] = marker;
							map.addOverlay(marker);
						}
						
						htmlstr += '<li class="mui-table-view-cell mui-collapse mui-media bookitem" data-long="' + e.longitude + '" data-lati="' + e.latitude + '">' +
			            '    <a href="javascript:;">' +
			            '        <img class="mui-media-object mui-pull-left" src="' + e.image + '">' +
			            '        <div class="mui-media-body">' +
			            e.name +
			            '            <p class="mui-ellipsis">';
			            
			            var lat = [e.location.latitude, point.latitude];
					    var lng = [e.location.longitude, point.longitude];
					    var R = 6378137;
					    var dLat = (lat[1] - lat[0]) * Math.PI / 180;
					    var dLng = (lng[1] - lng[0]) * Math.PI / 180;
					    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
					    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
					    var d = R * c;
					    e.distance = (d/1000).toFixed(1);
			            
			            var remain = e.num - e.buyerId.length;
		            	htmlstr += e.distance + 'km ISBN:' + e.isbn + '</p>' +
			            '       </div>' +
			            '    </a>' +
			            '	 <div class="mui-collapse-content">' +
			            '		<p class="store-remain">库存及单价：' + remain + ' * ¥' + e.price + '</p>' +
			            '		<p>' + e.brief + '</p>' +
			            '		<a class="mui-btn mui-btn-primary mui-btn-block store-want" data-bookid="' + e.objectId + '">申请购买</a>' +
			            '	 </div>' +
			            '</li>';
					});
					document.querySelector('#list-ul').innerHTML = htmlstr;
				}
			});
		}
	});
}(mui, document));
