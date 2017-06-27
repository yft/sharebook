//LeanCloud初始化
var APP_ID = 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz';
var APP_KEY = 'OUrrgkcEUrRuoLuNqjivOQGN';
AV.init({
	appId: APP_ID,
	appKey: APP_KEY,
});

(function($, doc) {
	$.init();

	//初始化书籍列表
	var booklist = getBookList();
	var htmlstr = '';
	for(var i = 0; i < booklist.count; i++) {
		htmlstr += '<li class="mui-table-view-cell mui-collapse">' +
			'	<a class="mui-navigate-right" href="#">' +
			'        <img class="mui-media-object mui-pull-left" src="' + booklist.books[i].image + '">' +
			'        <div class="mui-media-body">' +
			booklist.books[i].title +
			'            <p class="mui-ellipsis">ISBN ' + booklist.books[i].isbn13 + '</p>' +
			'        </div>' +
			'	</a>' +
			'	<div class="mui-collapse-content">' +
			((booklist.books[i].summary).trim().length ? booklist.books[i].summary : '没有简介') +
			'		<a data-key="' + i + '" href="#popover" id="openPopover" class="mui-btn mui-btn-primary mui-btn-block booklist-its">就是它了</a>' +
			'	</div>' +
			'</li>';
	}
	document.getElementById('booklist').innerHTML += htmlstr;
	
	mui('.mui-scroll-wrapper').scroll();
	
	$.plusReady(function() {
		$('#popover').on('tap', '.mui-table-view-cell', function (e) {
			var locationSelect = this.dataset.locationSelect;
			switch (locationSelect) {
				case 'yes':
					$.openWindow({
						'url': 'location.html',
						'id': 'location'
					});
					break;
				case 'no': // 该部分逻辑的界面部分已经注释
					plus.nativeUI.showWaiting('发布中...');
					addBook($);
			}
		});
		$('#booklist').on('tap', '.booklist-its', function(e) {
			setBookSelect(this.dataset.key);
		});
	});
}(mui, document));