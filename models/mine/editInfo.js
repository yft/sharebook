(function($, doc) {
	$.init();
	$.plusReady(function() {
		AV.init({
			appId: 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz', 
			appKey: 'OUrrgkcEUrRuoLuNqjivOQGN'
		});
		var query = new AV.Query('_User');
		query.get(getUserId()).then(function (userinfo) {
			document.querySelector('[name=qq]').value = userinfo.attributes.qq || '';
			document.querySelector('[name=wechat]').value = userinfo.attributes.wechat || '';
		});
		
		document.querySelector('#editBtn').addEventListener('tap', function () {
			AV.User.logIn(app.getState().username, getPwd()).then(function (loginUser) {
				var qq = document.querySelector('[name=qq]').value;
				var wechat = document.querySelector('[name=wechat]').value;
				if(qq || wechat) {
					if (qq) {
						loginUser.set('qq', qq);
					}
					if (wechat) {
						loginUser.set('wechat', wechat);
					}
					loginUser.save().then(function (res) {
						if (qq) {
							localStorage.setItem('$qq', qq);
						}
						if (wechat) {
							localStorage.setItem('$wechat', wechat);
						}
						plus.nativeUI.toast('修改成功');
					}, function (err) {  
						plus.nativeUI.toast('修改失败：' + err);
					});
				} else {
					$.alert('信息未有改动');
				}
			});
		});
			
	});
}(mui, document));