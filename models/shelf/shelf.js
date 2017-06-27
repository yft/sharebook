var $ = mui;
$.plusReady(function() {
	var curCate = 'notyet';
	var getDataing = false;
	// 书架分类 + 相关用户
	var booklist = {
		saled: [],
		notyet: [],
		withdraw: [],
		relatedUsers: {}
	};
	$.init({
	    pullRefresh: {
	        container: "#booklist",
	        down: {
	            height: 50,
	            auto: false,
	            contentdown: "下拉可以刷新",
	            contentover: "释放立即刷新",
	            contentrefresh: "正在刷新...",
	            callback: getData
	        }
	    }
	});
	
	getData(true);
	
	$('#category').on('tap', '.mui-control-item', function () {
		curCate = this.dataset.booktype;
		changeCategory();
	});
	$('#booklist').on('tap', '.book-withdraw', function () {
		toggleWithdraw(this.parentNode.dataset.bookid, true);
		getData(true);
	});
	$('#booklist').on('tap', '.book-wantedlist', function () {
		var bookid = this.parentNode.dataset.bookid;
		for (var i in booklist.notyet) {
			if (booklist.notyet[i].objectId == bookid) {
				var item = booklist.notyet[i];
				var wantedList = {bookid: bookid, arr: []};
				for (var j in item.wanted) {
					wantedList.arr.push(booklist.relatedUsers[item.wanted[j]]);
				}
				setBookSelectForWanted(wantedList);
				break;
			}
		}
		$.openWindow({
			url: 'wantedlist.html',
			id: 'wantedlist'
		});
	});
	$('#booklist').on('tap', '.book-grounding', function () {
		toggleWithdraw(this.parentNode.dataset.bookid, false);
		getData(true);
	});
	
	function getData (isNormal) {
		if (getDataing) {
			if (!isNormal) $('#booklist').pullRefresh().endPulldownToRefresh();
			return;
		}
		getDataing = true;
		// 获取书架信息
		sendAjax(plus, $, {
			url: 'https://leancloud.cn:443/1.1/classes/Book?where=%7B%22userId%22%3A%22' + getUserId() + '%22%7D&&&order=-updatedAt&&',
			type: 'get',
			callback: function(res) {
				booklist = {
					saled: [],
					notyet: [],
					withdraw: [],
					relatedUsers: {}
				};
				if (res.results && res.results.length) {
					for (var i in res.results) {
						var item = res.results[i];
						item.wanters = {};
						for (var j in item.buyerId) {
							booklist.relatedUsers[item.buyerId[j]] = 1;
						}
						for (var j in item.wanted) {
							booklist.relatedUsers[item.wanted[j]] = 1;
						}
						if (item.withdraw) {
							booklist.withdraw.push(item);
						} else if (item.buyerId && item.buyerId.length == item.num) {
							booklist.saled.push(item);
						} else {
							booklist.notyet.push(item);
						}
					}
					// 获取相关用户信息
					var userIdArr = [];
					for (var u in booklist.relatedUsers) {
						userIdArr.push("%22" + u + "%22");
					}
					if (userIdArr.length) {
						sendAjax(plus, $, {
							url: 'https://leancloud.cn:443/1.1/classes/_User?where=%7B%22objectId%22%3A%7B%22%24in%22%3A%5B' + userIdArr.join('%2C') + '%5D%7D%7D&&&order=-updatedAt&&', 
							type: 'get', 
							callback: function(res) {
								for (var i in res.results) {
									booklist.relatedUsers[res.results[i].objectId] = res.results[i];
								}
								changeCategory();
							}
						});
					}
				}
			}
		});
		if (!isNormal) $('#booklist').pullRefresh().endPulldownToRefresh();
		getDataing = false;
	}
	function changeCategory() {
		var htmlStr = '';
		var curBookList = booklist[curCate];
		// 如果该书架下有书
		if (curBookList.length) {
			// 遍历书籍
			for (var i in curBookList) {
				var rest = curBookList[i].num-(curBookList[i].buyerId.length||0);
				htmlStr += '<li class="mui-table-view-cell mui-collapse">' +
				'	<a class="mui-navigate-right" href="#">' +
				'		<img class="mui-media-object mui-pull-left" src="' + curBookList[i].image + '">' +
				'		<div class="mui-media-body">' + curBookList[i].name +
				'			<p class="mui-ellipsis">ISBN ' + curBookList[i].isbn + ' （¥' + curBookList[i].price + ' * ' + curBookList[i].num + ' 余' + rest + '）</p>' +
				'		</div>' +
				'	</a>' +
				'	<div class="mui-collapse-content" data-bookid="' + curBookList[i].objectId + '">' +
				curBookList[i].brief;
				if (curCate == 'notyet') {
					htmlStr += '<button type="button" class="mui-btn mui-btn-blue mui-btn-outlined book-operbtn book-withdraw">下架</button>';
					// 拼接想要购买的用户信息
					if (curBookList[i].wanted
						&& curBookList[i].wanted.length) {
						htmlStr += '<button type="button" class="mui-btn mui-btn-blue mui-btn-outlined book-operbtn book-wantedlist">查看想买这本书的人</button>';
					}
				} else if (curCate == 'withdraw') {
					htmlStr += '<button type="button" class="mui-btn mui-btn-blue mui-btn-outlined book-operbtn book-grounding">重新上架</button>';
				}
				htmlStr += '</div></li>';
			}
		} else {
			htmlStr = '<li class="mui-table-view-cell mui-collapse mui-content-padded">此书架还未有任何书籍</li>';
		}
		document.querySelector('#booklist').innerHTML = htmlStr;
	}
	function toggleWithdraw (bookid, status) {
		sendAjax(plus, $, {
			url: 'https://leancloud.cn:443/1.1/classes/Book/' + bookid,
			type: 'put',
			data: {
				"withdraw": status
			},
			callback: function(res) {
			}
		});
	}

});