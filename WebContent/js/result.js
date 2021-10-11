function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}

var varifyString = JSON.parse(window.localStorage.getItem("hhnczss")||'[]')
websocket = new WebSocket("wss://rpro.cevier.com/WebSocketRPRO")
websocket.onopen = function(event){
	websocket.send('v--' + varifyString)
}

var qid = getQueryString("qid")
var qsid = 'q--' + qid
var subData = ''
	
websocket.onmessage = function(event){
	var msg = event.data.split("--")
	if(msg[0] == 'v'){
		if(msg[1] != 'Verified'){
			websocket.close()
			window.location.href="./index.html"
		}else
			websocket.send(qsid)
	}else if(msg[0] == 'q'){
		if(msg[1] == 'None'){
			websocket.close()
			alert('未查到结果或问卷不存在！')
			window.location.href="./manage.html"
		}else{
			if(msg[2] == 'Wait')
				subData += msg[1]
			else if(msg[2] == 'Finished'){
				websocket.close()
				subData += msg[1]
				fData = subData.split('-+')
				var questions = JSON.parse(fData[1])
				var userAsrs = JSON.parse(fData[2])
				new Vue({
					el: "#box",
					data:{
						questionnairename: fData[0],
						Questions: questions,
						UserAsrs: userAsrs
		//					questionnairename: '问卷名字~',
		//					Questions:['问题1', '问题2', '问题3', '问题4', '问题5', '问题6', '问题7', '问题8', '问题9', '问题1', '问题2', '问题3', '问题4', '问题5', '问题6', '问题7', '问题8', '问题9', '问题1', '问题2', '问题3', '问题4', '问题5', '问题6', '问题7', '问题8', '问题9'],
		//				    UserAsrs:[['不同意', '色发射发生色发色疯', '非常不同意', '同意', '不清楚', '清楚', '非常同意', '不清楚', '较同意','不同意', '色发射发生色发色疯', '非常不同意', '同意', '不清楚', '清楚', '非常同意', '不清楚', '较同意','不同意', '色发射发生色发色疯', '非常不同意', '同意', '不清楚', '清楚', '非常同意', '不清楚', '较同意'],
		//							['非常同意', '不清楚', '较同意', '不同意', '色发射发生色发色疯', '非常不同意', '同意', '不清楚', '清楚','不同意', '色发射发生色发色疯', '非常不同意', '同意', '不清楚', '清楚', '非常同意', '不清楚', '较同意','不同意', '色发射发生色发色疯', '非常不同意', '同意', '不清楚', '清楚', '非常同意', '不清楚', '较同意'],
		//						],
					},
					methods: {
						downloadResult: function(){
							alert("我们需要一些时间来生成Excel文件\n稍后将为您自动下载")
							websocket = new WebSocket("wss://rpro.cevier.com/WebSocketRPRO")
							websocket.onopen = function(event){
								websocket.send('g--' + qid)
							}
							websocket.onmessage = function(event){
								var msg = event.data.split("--")
								if(msg[1] == "Failed")
									alert("获取下载链接失败！")
								else
									window.location = msg[1]
//									window.open(msg[1], "_blank")
									
								websocket.close()
							}
						},
						backhome(){
							window.location.href="./index.html"
						},
						Logout(){
							window.localStorage.removeItem("hhnczss")
							window.location.href="./index.html"
						}
					}
		
				})
			}
		}
	}
}
