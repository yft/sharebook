//LeanCloud初始化
var APP_ID = 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz';
var APP_KEY = 'OUrrgkcEUrRuoLuNqjivOQGN';
AV.init({
	appId: APP_ID,
	appKey: APP_KEY,
});

(function($, doc) {
	$.init();
	$.plusReady(function() {
		
		getContentHeight('search-box', 'maps');
		//创建地图
		var map = new plus.maps.Map('maps');
		//获取用户当前位置
		var pos;
		var laAndLo;
		map.getUserLocation(function (state, point){
			if( 0 == state ){
				map.setCenter(point);
				map.setZoom(14);
				pos = new plus.maps.Marker(point);
				pos.setIcon('/common/location.png');
				plus.maps.Map.reverseGeocode(point, {}, function (e) {
					laAndLo = point;
					pos.setLabel(e.address);
				}, function (err) {
					$.alert('获取用户当前位置失败');
				});
				var bubble = new plus.maps.Bubble('使用该位置');
				bubble.onclick = function (bubble) {
					//此loading需在发布书籍之后停止
					plus.nativeUI.showWaiting('发布中...');
					addBook($, laAndLo);
				};
				pos.setBubble(bubble, true);
				map.addOverlay(pos);
			}else{
				alert( "定位失败" );
			}
		});
		//搜索框事件
		var searchForm = document.getElementById('search-form');
		searchForm.addEventListener('submit', function (e) {
			var searchBox = document.getElementById('search');
			var keywords = searchBox.value;
			plus.maps.Map.geocode(keywords, {}, function (e) {
				laAndLo = e.coord;
				pos.setPoint(laAndLo);
				map.setCenter(laAndLo);
			}, function (err) {
				console.log(err);
				$.alert('搜索失败');
			})
			e.preventDefault();
			return false;
		});
		// 地图点击事件
		map.onclick = function (e) {
			laAndLo = e;
			pos.setPoint(e);
			map.setCenter(e);
		};
	});
}(mui, document));