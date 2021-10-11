function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}

var qsid = getQueryString("qid")

websocket = new WebSocket("wss://rpro.cevier.com/WebSocketRPRO")
websocket.onopen = function(event){
	websocket.send('f--' + qsid)
}
var tempdata = ''
var datas = null
websocket.onmessage = function(event){
	msg = event.data.split("--")
//	alert(datas.questions[0].qoption[0].tag)
	if(msg[1] == 'Deleted'){
		websocket.close()
		alert("问卷已被删除")
		window.location.href = 'https://Cevier.com'
	}else if(msg[1] == 'None'){
		websocket.close()
		alert("问卷不存在！")
		window.location.href = 'https://Cevier.com'
	}else{
		if(msg[2] == 'Wait')
			tempdata += msg[1];
		else if(msg[2] == 'Finished'){
			tempdata += msg[1];
			websocket.close()
			datas = JSON.parse(tempdata)
			new Vue({
				el: "#box",
				data:datas,
				mounted(){
					this.init()
				}, 
				methods: {
					submit: function(){
						var asrArray = new Array(this.questions.length) 
						for(var i = 0; i < this.questions.length; i++){
							for(var j = 0; j < this.questions[i].qoption.length; j++){
								if(this.questions[i].qoption[j].ischecked == null && this.questions[i].qoption[j].content != '')
									if(asrArray[i] == null)
										asrArray[i] = this.questions[i].qtype.toString() + 'u' + this.questions[i].qoption[j].content
									else
										asrArray[i] += 'u' + this.questions[i].qoption[j].content
								if(this.questions[i].qoption[j].ischecked)
									if(asrArray[i] == null)
										asrArray[i] = this.questions[i].qtype.toString() + j
									else
										asrArray[i] += j
							}
						}
						var jdata = JSON.stringify(asrArray)
						websocket = new WebSocket("wss://rpro.cevier.com/WebSocketRPRO")
						websocket.onopen = function(event){
							try{
								websocket.send('r--'+ qsid  + '--' + jdata + '--' + returnCitySN.cip)
							}catch(err){
								try{
									websocket.send('r--'+ qsid  + '--' + jdata + '--failedToGetIP')
								}catch(err){
									alert("提交失败！\n请刷新重试")
									websocket.close()
								}
							}
						}
						websocket.onmessage = function(event){
							if(event.data != "r--Succeed"){
								websocket.close()
								alert("提交失败！\n请刷新重试")
							}else{
								alert("提交成功！")
								websocket.close()
								window.location.href = './fill.html?qid=' + qsid
							}
						}
					},
					init(){
						for(var i = 0; i < datas.questions.length; i++)
							datas.questions[i].qstyle = "qb" + (1 + Math.round(Math.random()*5))
					}
				}

			})	
		}
	}
}

Vue.component('allquestions', {
		props:['qname', 'options', 'qindex', 'type', 'qstyle'],
		template: '<div :class="qstyle">' +
					'<h3 class="ql1">{{qindex + 1}}&ensp;{{qname}}</h3>' + 
						'<div id="q1" class="ql2" v-for="(option, index) in options" :key="index">' + 
							'<div v-if="type == 0" v-on:click="rdclick(index)" style="width:80%">' +
								'<input type="radio" class="iptsz" v-bind:checked="option.ischecked">{{option.tag}}、 {{option.content}}' + 
							'</div>' +  
							'<div v-if="type == 1"  v-on:click="cbclick(index)">' +
								'<input type="checkbox" class="iptsz" v-bind:checked="option.ischecked">{{option.tag}}、 {{option.content}}' + 
							'</div>' +  
							'<div v-if="type == 2 && option.ischecked != null" v-on:click="rddclick(index)">' +
								'<input type="radio" class="iptsz" v-bind:checked="option.ischecked">{{option.tag}}、 {{option.content}}' + 
							'</div>' +
							'<input type="text" class="diysz" v-if="type == 2 && option.ischecked == null" v-model="option.content" @click="iptclick">' + 
							'<div  v-if="type == 3 && option.ischecked != null" v-on:click="cbclick(index)">' +
								'<input type="checkbox" class="iptsz" v-bind:checked="option.ischecked">{{option.tag}}、 {{option.content}}' +
							'</div>' +
							'<input type="text" class="diysz" v-if="type == 3 && option.ischecked == null" v-model="option.content">' +
						'</div><br>' + 
					'</div>',
		methods: {
		rdclick: function (a) {
			//alert(String.fromCharCode(65 + a));
			for(var i = 0; i < this.options.length; i++)
				if(i != a)
					this.options[i].ischecked = false
			this.options[a].ischecked = ~this.options[a].ischecked
			// useroption = this.options[a].ischecked&&String.fromCharCode(65 + a) || !this.options[a].ischecked&&null
		},
		cbclick: function (a) {
			this.options[a].ischecked = ~this.options[a].ischecked
		},
		rddclick: function (a) {
			//alert(String.fromCharCode(65 + a));
			for(var i = 0; i < this.options.length; i++)
				if(this.options[i].ischecked == null)
					this.options[i].content = ""

			for(var i = 0; i < this.options.length; i++)
				if(i != a && this.options[i].ischecked != null)
					this.options[i].ischecked = false
			this.options[a].ischecked = ~this.options[a].ischecked
		},
		iptclick: function(){
			for(var i = 0; i < this.options.length; i++)
				if(this.options[i].ischecked != null)
					this.options[i].ischecked = false
		}
	}
	});
//
//setTimeout(function(){
//	new Vue({
//		el: "#box",
//		data:datas,
//		mounted(){
//			this.init()
//		}, 
//		methods: {
//			submit: function(){
//				// alert(this.questions[0][1].qoption[0].ischecked)
//				// this.useroptions[userdata[0]] = userdata[1] 
//				// alert(userdata[0] + " " + this.useroptions[userdata[0]])
//				s = ""
//				for(var i = 0; i < this.questions.length; i++){
//					for(var j = 0; j < this.questions[i].qoption.length; j++){
//						if(this.questions[i].qoption[j].ischecked == null && this.questions[i].qoption[j].content != '')
//							s += (i + 1) + " " + this.questions[i].qoption[j].content + "\n"
//						if(this.questions[i].qoption[j].ischecked)
//							s += (i + 1) + " " + this.questions[i].qoption[j].tag + "\n"
//					}
//				}
//				alert(s)
//				websocket = new WebSocket("ws://127.0.0.1:8080/RPOR/WebSocketRPRO")
//				websocket.onopen = function(event){
//					websocket.send('r--' + s)
//				}
//				websocket.onmessage = function(event){
//					if(event.data != "r--Succeed")
//						alert("提交失败")
//					websocket.close()
//				}
//			},
//			init(){
//				for(var i = 0; i < datas.questions.length; i++)
//					datas.questions[i].qstyle = "qb" + (1 + Math.round(Math.random()*5))
//			}
//		}
//
//	})	
//}, 100)
