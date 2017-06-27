(function($, doc) {
	$.init();
	$.plusReady(function() {
		var settings = app.getSettings();
		var regButton = doc.getElementById('reg');
		var accountBox = doc.getElementById('account');
		var passwordBox = doc.getElementById('password');
		var passwordConfirmBox = doc.getElementById('password_confirm');
		var emailBox = doc.getElementById('email');
		regButton.addEventListener('tap', function(event) {
			var regInfo = {
				username: accountBox.value,
				password: passwordBox.value,
				email: emailBox.value
			};
			if(regInfo.username.length < 5) {
				$.alert('用户名最小长度为5');
				return;
			}
			if(regInfo.password.length < 6) {
				$.alert('密码最小长度为6');
				return;
			}
			if(!/^\w+@\w+\.\w+$/.test(regInfo.email)) {
				$.alert('邮箱格式错误');
				return;
			}
			var passwordConfirm = passwordConfirmBox.value;
			if(passwordConfirm != regInfo.password) {
				plus.nativeUI.toast('密码两次输入不一致');
				return;
			}
			app.reg(regInfo, function(res) {
				if(res.err) {
					plus.nativeUI.toast(res.err);
					return;
				}
				plus.nativeUI.toast('注册成功');
				/*
				 * 注意：
				 * 1、因本示例应用启动页就是登录页面，因此注册成功后，直接显示登录页即可；
				 * 2、如果真实案例中，启动页不是登录页，则需修改，使用mui.openWindow打开真实的登录页面
				 */
				plus.webview.getLaunchWebview().show("pop-in", 200, function() {
					plus.webview.currentWebview().close("none");
				});
				//若启动页不是登录页，则需通过如下方式打开登录页
				//							$.openWindow({
				//								url: 'login.html',
				//								id: 'login',
				//								show: {
				//									aniShow: 'pop-in'
				//								}
				//							});
				sendAjax(plus, $, {
					url: 'https://leancloud.cn:443/1.1/classes/Userinfo',
					type: 'post',
					data: {
						"objectId": res.objectId,
						"userid": res.objectId
					}
				});
			});
		});
	});
}(mui, document));