var verifyString = JSON.parse(window.localStorage.getItem("hhnczss")||'[]')
websocket = new WebSocket("wss://rpro.cevier.com/WebSocketRPRO")
websocket.onopen = function(event){
	websocket.send('v--' + verifyString)
}
websocket.onmessage = function(event){
//	alert(event.data)
	if(event.data != 'v--Verified'){
		window.location.href="./index.html"
	}
	websocket.close()
}