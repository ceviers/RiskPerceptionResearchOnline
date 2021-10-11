new Vue({
	el: "#box",
	mounted(){
		this.init()
	},
	methods:{
		toAbout(){
			window.open("./about.html", "_blank")
		},
		login(){
//			document.getElementById("login").style.display = "none"
//			document.getElementById("main").style.display = "inline"
			// JSON.parse(window.localStorage.getItem(STORAGE_KEY)||'[]') 取
			document.getElementById("loginB").style.display="none"
			var usr = document.getElementById("usrn").value
			var psw = document.getElementById("psw").value
			var ulogdata ='l--' +  usr + "--" + psw
			websocket = new WebSocket("wss://rpro.cevier.com/WebSocketRPRO")
			websocket.onopen = function(event){
				websocket.send(ulogdata)
			}
			websocket.onmessage = function(event){
				var msg = event.data.split('--')
				if(msg[1] == 'Success'){
					document.getElementById("loginB").style.display="inline"
					document.getElementById("login").style.display = "none"
					document.getElementById("main").style.display = "inline"
					window.localStorage.setItem("hhnczss",JSON.stringify(msg[2]))
				}else{
					document.getElementById("loginB").style.display="inline"
					alert("用户名或密码错误！")
				}
				websocket.close()
		    }
		},
		logout(){
			document.getElementById("login").style.display = "inline"
			document.getElementById("main").style.display = "none"
			window.localStorage.removeItem("hhnczss")
		},
		CNQClick(){
			window.location.href="./create.html"
		},
		MQClick(){
			window.location.href="./manage.html"
		},
		init(){
			var verifyString = JSON.parse(window.localStorage.getItem("hhnczss")||'[]')
			websocket = new WebSocket("wss://rpro.cevier.com/WebSocketRPRO")
			websocket.onopen = function(event){
				websocket.send('v--' + verifyString)
			}
			websocket.onmessage = function(event){
				if(event.data == 'v--Verified'){
					document.getElementById("login").style.display = "none"
					document.getElementById("main").style.display = "inline"
				}
				websocket.close()
		    }
		}
	}
})