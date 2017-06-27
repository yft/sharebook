//============================公用的ajax函数
function sendAjax (plus, $, params) {
	plus.nativeUI.showWaiting('请求中...');
	$.ajax({
		url: params.url,
		type: params.type,
		headers: {
			'X-LC-Id': 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz',
			'X-LC-Key': 'OUrrgkcEUrRuoLuNqjivOQGN',
			'Content-Type': 'application/json'
		},
		data: params.data || {},
		success: function(res) {
			plus.nativeUI.closeWaiting();
			// 获取出错处理
			if (res.error) {
				alert("请求出错：" + res.error);
				return;
			}
			params.callback && params.callback(res);
		},
		error: function(err) {
			plus.nativeUI.closeWaiting();
			$.alert('请求失败');
		}
	});
}
//============================此方法依赖LeanCloud的AV对象和mui对象
function addBook (mui, location) {
	var Book = AV.Object.extend('Book');
	var bookObj = new Book();
	var bookinfo1 = getBookList().books[getBookSelect()];
	var bookinfo2 = getOutBookInfo();
	bookObj.set('image', bookinfo1.image);
	bookObj.set('brief', bookinfo1.summary);
	bookObj.set('pub', bookinfo1.publisher);
	bookObj.set('author', bookinfo1.author[0]);
	bookObj.set('name', bookinfo1.title);
	bookObj.set('isbn', bookinfo2.isbn);
	bookObj.set('num', +bookinfo2.num);
	bookObj.set('price', +bookinfo2.price);
	bookObj.set('userId', getUserId());
	if (location) {
		bookObj.set('location', location);
		bookObj.set('longitude', location.longitude);
		bookObj.set('latitude', location.latitude);
	}
	bookObj.save().then(function(book) {
		plus.nativeUI.closeWaiting();
		removeBookInfo();
		setAddBookRes(true);
		plus.webview.close('location');
		plus.webview.close('booklist');
		plus.webview.currentWebview().hide();
		plus.webview.getWebviewById('shelf').show();
	}, function(err) {
		plus.nativeUI.closeWaiting();
		console.info(err);
		mui.alert('发布失败');
	});
}
//============================
function getContentHeight (minusId, eleId) {
	var header = document.getElementById(minusId);
	var ele = document.getElementById(eleId);
	ele.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
}
//============================根据isbn搜索到的书籍列表
function setBookList (book) {
	book = book || {};
	localStorage.setItem('$book', JSON.stringify(book));
}
function getBookList () {
	var bookList = localStorage.getItem('$book') || "{}";
	return JSON.parse(bookList);
}
//============================存储用户输入的转让书籍信息
function setOutBookInfo (info) {
	info = info || {};
	localStorage.setItem('$bookOutInfo', JSON.stringify(info));
}
function getOutBookInfo () {
	var bookOutInfo = localStorage.getItem('$bookOutInfo') || "{}";
	return JSON.parse(bookOutInfo);
}
//============================存储所选择的书籍编号
function setBookSelect (index) {
	localStorage.setItem('$bookSelect', index);
}
function getBookSelect () {
	return localStorage.getItem('$bookSelect') || '';
}
//============================查看想要购买此书的人时需要用到
function setBookSelectForWanted (obj) {
	localStorage.setItem('$bookSelectForWanted', JSON.stringify(obj));
}
function getBookSelectForWanted () {
	var info = localStorage.getItem('$bookSelectForWanted') || '{}';
	return JSON.parse(info);
}
function removeBookSelectForWanted() {
	localStorage.removeItem('$bookSelectForWanted');
}
//============================存储添加数据成功与否状态
function setAddBookRes (res) {
	localStorage.setItem('$addBookRes', res);
}
function getAddBookRes () {
	return localStorage.getItem('$addBookRes');
}
function removeAddBookRes() {
	localStorage.removeItem('$addBookRes');
}
//============================清除书籍信息
function removeBookInfo () {
	localStorage.removeItem('$book');
	localStorage.removeItem('$bookOutInfo');
	localStorage.removeItem('$bookSelect');
}
//============================userId
function setUserId (userId) {
	localStorage.setItem('$userId', userId);
}
function getUserId () {
	return localStorage.getItem('$userId');
}
function removeUserId () {
	localStorage.removeItem('$userId');
}
//============================scanBarcode
function setScanBarcode (scanBarcode) {
	localStorage.setItem('$scanBarcode', scanBarcode);
}
function getScanBarcode () {
	return localStorage.getItem('$scanBarcode');
}
function removeScanBarcode () {
	localStorage.removeItem('$scanBarcode');
}
//============================SearchCondition
function setSearchCondition (searchCondition) {
	localStorage.setItem('$searchCondition', JSON.stringify(searchCondition));
}
function getSearchCondition () {
	return JSON.parse(localStorage.getItem('$searchCondition'));
}
function removeSearchCondition () {
	localStorage.removeItem('$searchCondition');
}
//============================qq wechat
function getUserContact () {
	return {
		qq: localStorage.getItem('$qq'),
		wechat: localStorage.getItem('$wechat')
	};
}
function getPwd () {
	return localStorage.getItem('$password');
}
//-------------------------------------------------------------------

(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.username = loginInfo.username || '';
		loginInfo.password = loginInfo.password || '';
		if(loginInfo.username.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if(loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		mui.ajax({
			url: 'https://api.leancloud.cn/1.1/login',
			type: 'post',
			data: loginInfo,
			headers: {
				'X-LC-Id': 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz',
				'X-LC-Key': 'OUrrgkcEUrRuoLuNqjivOQGN',
				'Content-Type': 'application/json'
			},
			success: function(res) {
				localStorage.setItem('$qq', res.qq || '');
				localStorage.setItem('$wechat', res.wechat || '');
				setUserId(res.objectId);
				return owner.createState(loginInfo.username, res.sessionToken, callback);
			},
			error: function(err) {
				return callback('用户名或密码错误');
			}
		});
	};

	owner.createState = function(name, token, callback) {
		var state = owner.getState();
		state.username = name;
		state.token = token;
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.username = regInfo.username || '';
		regInfo.password = regInfo.password || '';
		if(regInfo.username.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if(regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if(!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		mui.ajax({
			url: 'https://api.leancloud.cn/1.1/users',
			type: 'post',
			data: regInfo,
			headers: {
				'X-LC-Id': 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz',
				'X-LC-Key': 'OUrrgkcEUrRuoLuNqjivOQGN',
				'Content-Type': 'application/json'
			},
			success: function(res) {
				return callback(res);
			},
			error: function(err) {
				return callback({err: '用户名或邮箱已被占用'});
			}
		});
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return(email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if(!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		mui.ajax({
			url: 'https://api.leancloud.cn/1.1/requestPasswordReset',
			type: 'post',
			data: {
				'email': email
			},
			headers: {
				'X-LC-Id': 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz',
				'X-LC-Key': 'OUrrgkcEUrRuoLuNqjivOQGN',
				'Content-Type': 'application/json'
			},
			success: function(res) {
				return callback(null, '邮件已经发送到您的邮箱，请注意查收邮件。');
			},
			error: function(err) {
				return callback('重置密码失败');
			}
		});
		
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
		}
		/**
		 * 获取本地是否安装客户端
		 **/
	owner.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));