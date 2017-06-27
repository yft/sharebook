(function($, doc) {
	$.init({
		statusBarBackground: '#f7f7f7'
	});
	$.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var settings = app.getSettings();
		var state = app.getState();
		
		var toMain = function() {
			$.openWindow({
				url: '../main/main.html',
				id: 'main',
				preload: true,
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});
		};
		if(settings.autoLogin && state.token) {
			toMain();
		}
		// close splash
		setTimeout(function() {
			//关闭 splash
			plus.navigator.closeSplashscreen();
		}, 600);
		//检查 "登录状态/锁屏状态" 结束
		var loginButton = doc.getElementById('login');
		var accountBox = doc.getElementById('account');
		var passwordBox = doc.getElementById('password');
		var autoLoginButton = doc.getElementById("autoLogin");
		var regButton = doc.getElementById('reg');
		var forgetButton = doc.getElementById('forgetPassword');
		loginButton.addEventListener('tap', function(event) {
			var loginInfo = {
				username: accountBox.value,
				password: passwordBox.value
			};
			app.login(loginInfo, function(err) {
				if(err) {
					plus.nativeUI.toast(err);
					return;
				}
				localStorage.setItem('$password', passwordBox.value);
				toMain();
			});
		});
		$.enterfocus('#login-form input', function() {
			$.trigger(loginButton, 'tap');
		});
		autoLoginButton.classList[settings.autoLogin ? 'add' : 'remove']('mui-active')
		autoLoginButton.addEventListener('toggle', function(event) {
			setTimeout(function() {
				var isActive = event.detail.isActive;
				settings.autoLogin = isActive;
				app.setSettings(settings);
			}, 50);
		}, false);
		regButton.addEventListener('tap', function(event) {
			$.openWindow({
				url: 'reg.html',
				id: 'reg',
				preload: true,
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});
		}, false);
		forgetButton.addEventListener('tap', function(event) {
			$.openWindow({
				url: 'forget_password.html',
				id: 'forget_password',
				preload: true,
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});
		}, false);
		//
//		window.addEventListener('resize', function() {
//			oauthArea.style.display = document.body.clientHeight > 400 ? 'block' : 'none';
//		}, false);
		//
		var backButtonPress = 0;
		$.back = function(event) {
			backButtonPress++;
			if(backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};
	});
}(mui, document));