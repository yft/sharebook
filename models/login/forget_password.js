(function($, doc) {
	$.init();
	$.plusReady(function() {
		var sendButton = doc.getElementById('sendMail');
		var emailBox = doc.getElementById('email');
		sendButton.addEventListener('tap', function() {
			app.forgetPassword(emailBox.value, function(err, info) {
				plus.nativeUI.toast(err || info);
				
				plus.webview.getLaunchWebview().show("pop-in", 200, function() {
					plus.webview.currentWebview().close("none");
				});
			});
		}, false);
	});
}(mui, document));