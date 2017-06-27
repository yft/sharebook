(function($, doc) {
	$.init();
	$.plusReady(function() {
		// 初始化存储 SDK
		AV.init({
		  appId: 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz', 
		  appKey:'OUrrgkcEUrRuoLuNqjivOQGN',
		});
		// 初始化实时通讯 SDK
		var Realtime = AV.Realtime;
		var realtime = new Realtime({
		  appId: 'd7B8g93F2VPXRjF2Nm8ousnh-gzGzoHsz',
		  plugins: [AV.TypedMessagesPlugin], // 注册富媒体消息插件
		});
		// 在浏览器中直接加载时，富媒体消息插件暴露的所有的成员都挂载在 AV 命名空间下
//		var imageMessage = new AV.ImageMessage(file);

		// 发送图片
		var picture = document.getElementById('picture');
		picture.addEventListener('tap', function (e) {
			plus.gallery.pick(function (e) {
				for (var i in e.files) {
					sendMsgBubble('i', e.files[i]);
				}
			}, function (e) {
				console.log('cancel');
			}, {
				filter: 'image',
				multiple: true
			});
		});
	});
	var msgInput = document.getElementById('msg-input');
	var more = document.getElementById('more');
	var send = document.getElementById('send');
	msgInput.addEventListener('input', function () {
		var sendClassName = send.className;
		if (this.value.trim().length > 0) {
			if (sendClassName.indexOf('active') == -1) {
				send.className = send.className + ' active';
			}
		} else {
			if (sendClassName.indexOf('active') >= 0) {
				send.className = sendClassName.substring(0, sendClassName.length-7);
			}
		}
	});
	send.addEventListener('tap', function () {
		if (this.className.indexOf('active') == -1) {
			return;
		}
		var msg = msgInput.value;
		
		sendMsgBubble('s', msg);
		
		var sendClassName = send.className;
		send.className = sendClassName.substring(0, sendClassName.length-7);
	});
	more.addEventListener('tap', function (e) {
		var morebox = document.querySelector('.footer-more');
		morebox.style.display = (morebox.style.display == '') ? 'block' : '';
	});
}(mui, document));

function sendMsgBubble (type, data) {
	var data = (type == 's') ? ('<pre>' + data + '</pre>') : ('<img src="' + data + '" alt="" />');
	var willSendMsg = 	'<div class="chat-box chat-box-right mui-clearfix mui-content-padded">' +
				    	'	<img class="chat-avatar" src="" alt="" />' +
				    	'	<div class="chat-content">' +
				    	'		<div class="chat-content-inner">' +
				    	data +
				    	'		</div>' +
				    	'		<div class="chat-content-arrow"></div>' +
				    	'	</div>' +
				    	'	<div class="clear-box"></div>' +
				    	'</div>';
	var newDom =  document.createElement('div');
	newDom.innerHTML = willSendMsg;
	var msgList = document.querySelector('.chat-list');
	msgList.appendChild(newDom);
	msgList.scrollTop = msgList.scrollHeight - msgList.offsetHeight;
}
