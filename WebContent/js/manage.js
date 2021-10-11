var record = null
var varifyString = JSON.parse(window.localStorage.getItem("hhnczss")||'[]')
websocket = new WebSocket("wss://rpro.cevier.com/WebSocketRPRO")
websocket.onopen = function(event){
	websocket.send('v--' + varifyString)
}
websocket.onmessage = function(event){
	var msg = event.data.split("--")
	if(msg[0] == 'v'){
		if(msg[1] != 'Verified'){
			websocket.close()
			window.location.href="./index.html"
		}else
			websocket.send('m--')
	}else if(msg[0] == 'm'){
		record = JSON.parse(msg[1])
//		alert(record[0].questionnairename)
		websocket.close()
		
		new Vue({
		el: "#box",
		data:{
			records:record
		},
		methods:{
			button(){
				alert(this.records[0].questionnairename)
			},
			edit(qid){
				window.localStorage.setItem("editHere", JSON.stringify(qid))
				window.location.href = './edit.html'
			},
			preview(qid){
				window.open("./fill.html?qid=" + qid, "_blank")
			},
			deleteRecord(id){
				var confirmtag = confirm("问卷“" + this.records[id].questionnairename + "”删除后不可恢复\n确定要删除吗？")
				if(confirmtag){
					websocket = new WebSocket("wss://rpro.cevier.com/WebSocketRPRO")
					var tmpmsg = 'd--' + this.records[id].qid
					websocket.onopen = function(event){
						websocket.send(tmpmsg)
					}
					var tmpid = id
					websocket.onmessage = function(event){
						if(event.data == 'd--Failed'){
							websocket.close()
							alert("删除失败")
							window.location.href="./manage.html"
						}else
							alert("删除成功")
						websocket.close()
					}
					this.records.splice(tmpid, 1)
				}
				
			},
			downloadQRCode(id) {
				var name = this.records[id].questionnairename + '.png'
				var qrcodeurl = "https://rpro.cevier.com/fill.html?qid=" + this.records[id].qid;
				var qrcode = new QRCode(document.getElementById("qrcode"), {
					text: qrcodeurl,
					width: 128,
					height: 128,
					colorDark : "#000000",
					colorLight : "#ffffff",
					correctLevel : QRCode.CorrectLevel.H
				});
				setTimeout(function(){
					var img = document.getElementById('qrcode').getElementsByTagName('img')[0]
					var canvas = document.createElement('canvas')
					canvas.width = img.width
					canvas.height = img.height
					canvas.getContext('2d').drawImage(img, 0, 0)
					url = canvas.toDataURL('image/png')
					var downloadLink = document.getElementById('downloadLink')
					downloadLink.setAttribute('href', url)
					downloadLink.setAttribute('download', name)
					downloadLink.click()
				},100)
				setTimeout(function(){
					document.getElementById('qrcode').innerHTML = ""
				},150)
			},
			copyURL(qid){
				var url = "https://rpro.cevier.com/fill.html?qid=" + qid
				const input = document.createElement('input');
				document.body.appendChild(input);
				input.setAttribute('value', url);
				input.select();
				if (document.execCommand('copy')) {
					document.execCommand('copy')
					alert("链接 " + url + "\n已复制到剪切板")
				}
				document.body.removeChild(input);
			},
			showResult(qid){
				window.open("./result.html?qid=" + qid, "_blank")
			},
			Logout(){
				window.localStorage.removeItem("hhnczss")
				window.location.href="./index.html"
			},
			backhome(){
				window.location.href="./index.html"
			},
		}
		})
	}
}
//
//setTimeout(function(){
//	new Vue({
//		el: "#box",
//		data:{
//			records:record
//		},
//		methods:{
//			button(){
//				alert(this.records[0].questionnairename)
//			},
//			deleteRecord(id){
//				var confirmtag = confirm("问卷“" + this.records[id].questionnairename + "”删除后不可恢复\n确定要删除吗？")
//				if(confirmtag){
//					websocket = new WebSocket("ws://127.0.0.1:8080/RPOR/WebSocketRPRO")
//					var tmpmsg = 'd--' + this.records[id].qid
//					websocket.onopen = function(event){
//						websocket.send(tmpmsg)
//					}
//					var tmpid = id
//					websocket.onmessage = function(event){
//						if(event.data == 'd--Failed'){
//							websocket.close()
//							alert("删除失败")
//							window.location.href="./manage.html"
//						}
//						websocket.close()
//					}
//					this.records.splice(tmpid, 1)
//				}
//				
//			},
//			downloadQRCode(id) {
//				var name = this.records[id].questionnairename + '.png'
//				var qrcodeurl = "https://rp.cevier.com?" + this.records[id].qid;
//				var qrcode = new QRCode(document.getElementById("qrcode"), {
//					text: qrcodeurl,
//					width: 128,
//					height: 128,
//					colorDark : "#000000",
//					colorLight : "#ffffff",
//					correctLevel : QRCode.CorrectLevel.H
//				});
//				setTimeout(function(){
//					var img = document.getElementById('qrcode').getElementsByTagName('img')[0]
//					var canvas = document.createElement('canvas')
//					canvas.width = img.width
//					canvas.height = img.height
//					canvas.getContext('2d').drawImage(img, 0, 0)
//					url = canvas.toDataURL('image/png')
//					var downloadLink = document.getElementById('downloadLink')
//					downloadLink.setAttribute('href', url)
//					downloadLink.setAttribute('download', name)
//					downloadLink.click()
//				},100)
//				setTimeout(function(){
//					document.getElementById('qrcode').innerHTML = ""
//				},150)
//			},
//			copyQRCode(qid){
//				var url = "https://rp.cevier.com?" + qid
//				const input = document.createElement('input');
//				document.body.appendChild(input);
//				input.setAttribute('value', url);
//				input.select();
//				if (document.execCommand('copy')) {
//					document.execCommand('copy')
//					alert("链接 " + url + "\n已复制到剪切板")
//				}
//				document.body.removeChild(input);
//			},
//			Logout(){
//				window.localStorage.removeItem("hhnczss")
//				window.location.href="./index.html"
//			},
//			backhome(){
//				window.location.href="./index.html"
//			},
//		}
//		})
//},3000)
