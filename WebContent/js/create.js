var savedata =  JSON.parse(window.localStorage.getItem("temp-questionnaire")||'[]') //读取缓存
var usrflag = false
var qdatas = null
if(savedata.questionnairename != null)
	usrflag = confirm("检测到有未保存的记录，是否恢复？")

if(usrflag){
	qdatas = savedata
	qdatas.questionnairedescription = qdatas.questionnairedescription.replace(/<br>/g, '\n')
}else
	qdatas = {
	questionnairename:"问卷标题",
	questionnairedescription:"问卷描述",
	questions:[],	
	bflag:"0"
}

Vue.component('allquestions', {
	props:['qname', 'options', 'qindex', 'type', 'qstyle'],
	template: '<div :class="qstyle">' +
				'<h3 class="ql1">{{qindex + 1}}&ensp;{{qname}}&ensp;<button class="button button-highlight button-rounded button-tiny" @click="modify">modify</button>' +
				'&ensp;<button class="button button-caution button-rounded button-jumbo button-tiny" @click="del">delete</button></h3>' + 
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
	},
	modify(){
		this.$emit('modifyquestion', this.qindex);
	},
	del(){
		this.$emit('deletequestion', this.qindex);
	}
}
});


new Vue({
	el: "#box",
	data: {datas:qdatas,
		qnrdpt:qdatas.questionnairedescription,
		name:"问题",
		type: 0,
		optionNumbers:4,
		htmlOption: '<div class="optionsposition2"><input type="radio">A&ensp;<input value="" type="text" id="i0" class="optionipt"><br></div>' +
					'<div class="optionsposition2"><input type="radio">B&ensp;<input value="" type="text" id="i1" class="optionipt"><br></div>' +
					'<div class="optionsposition2"><input type="radio">C&ensp;<input value="" type="text" id="i2" class="optionipt"><br></div>' +
					'<div class="optionsposition2"><input type="radio">D&ensp;<input value="" type="text" id="i3" class="optionipt"><br></div>',
		saveOrUpdate: "save",
		updateIndex: null,
	},
	methods:{
		save(items){
			window.localStorage.setItem("temp-questionnaire", JSON.stringify(items))
		},
		preview(){
			this.datas.questionnairedescription = this.datas.questionnairedescription.replace(/[\r\n]/g, "<br>")
//			alert(this.datas.questionnairedescription)
			this.save(this.datas)
			window.open("./preview.html", "_blank")
		},
		ok(){
			var tem1 = {qname:"这是第一个问题",
				qtype:0,//0 radio, 1 checkbox, 2 radio diy, 3 checkbox diy
				qoption:new Array(),
				qstyle:"qb1"}
			
			tem1.qname = this.name
			tem1.qtype = this.type
			var tem2 = {tag:'0', content:'极差', ischecked: false}
			// tem[2].qoption = []
			// alert(this.datas.questions[0][0].qname)
			var i = 0
			if(this.type == 0 || this.type == 1){
				for(; i < this.optionNumbers; i++){
					tem2.tag = String.fromCharCode(65 +i)
					tem2.content = document.getElementById("i" + i).value
					var tempa = new Array()
					tempa = JSON.parse(JSON.stringify(tem2))
					tem1.qoption.push(tempa)
				}
			}else{
				for(; i < this.optionNumbers - 1; i++){
					tem2.tag = String.fromCharCode(65 +i)
					tem2.content = document.getElementById("i" + i).value
					var tempa = new Array()
					tempa = JSON.parse(JSON.stringify(tem2))
					tem1.qoption.push(tempa)
				}
				tem2.tag = String.fromCharCode(65 +i)
				tem2.content = ''
				tem2.ischecked = null
				var tempa = new Array()
				tempa = JSON.parse(JSON.stringify(tem2))
				tem1.qoption.push(tempa)
				// alert(tem1[2].qoption[i].tag)
			}
			if(this.saveOrUpdate == "save")
				this.datas.questions.push(tem1)
			else if(this.saveOrUpdate = "update"){
				this.datas.questions.splice(this.updateIndex, 1)
				this.datas.questions.splice(this.updateIndex, 0, tem1)
				// this.datas.questions[this.updateIndex] = tem1
				// alert("您可以刷新浏览器查看修改结果")
			}
			this.save(this.datas)
			this.whethershowadd(false)
			for(var j = 0; j < this.optionNumbers; j++){
				document.getElementById("i" + j).value = ""
			}
			this.save(this.datas)
		},
		changeType(tp){
			this.type = tp
		},
		optionChange(){
			this.htmlOption = ""
			var temp = "<div class=\"optionsposition2\"><input type=\"radio\">"
			if(this.type == 1 || this.type == 3)
				temp = "<div class=\"optionsposition2\"><input type=\"checkbox\">"
			var i = 0
			for(; i < this.optionNumbers - 1; i++){
				this.htmlOption += temp + String.fromCharCode(65 +i) + "&ensp;<input value=\"\" type=\"text\" id=\"i" + i + "\" class=\"optionipt\"></div>"
			}
			if(this.type == 0 || this.type == 1)
				this.htmlOption += temp +  String.fromCharCode(65 +i) + "&ensp;<input value=\"\" type=\"text\" id=\"i" + i + "\" class=\"optionipt\"></div>";
			else
				this.htmlOption += "<div class=\"optionsposition2\">" + "&ensp;" + String.fromCharCode(65 +i) + "&ensp;<input value=\"\" type=\"text\" class=\"diyoptionipt\" disabled></div>";
		},
		saveall(){
			document.getElementById("SaveB").disabled = true
			websocket = new WebSocket("wss://rpro.cevier.com/WebSocketRPRO")
			websocket.onopen = function(event){
				qdatas.questionnairedescription.replace(/[\r\n]/g, "<br>")
//				alert(qdatas.questionnairedescription)
				var jsdata = JSON.stringify(qdatas) //String type
				var i = jsdata.length / 8000
				var j = parseInt(i)
				var subData = new Array()
				var a = 0
				for(; a < j; a++)
					subData[a] = jsdata.slice(0 + a * 8000, 8000 + a * 8000)
				if(i - j > 0)
					subData[a] = jsdata.substring(8000 + (a - 1) * 8000);
				
				for(var b = 0; b < subData.length; b++)
					websocket.send('c--' + subData[b] + '--' + subData.length + '--' + (b + 1) + '--' + qdatas.questionnairename)
//				alert(typeof jsdata)
//				websocket.send('c--' + jsdata)
//				websocket.close()
			}
			websocket.onmessage = function(event){
				if(event.data == 'c--Saved'){
					localStorage.removeItem("temp-questionnaire")
					setTimeout(function(){
						document.getElementById("SaveB").disabled = false
						window.location.href="./manage.html"
					},10)
				}else{
					document.getElementById("SaveB").disabled = false
					alert("Save Failed!")
				}
				websocket.close()
		    }
		},
		add(){
			this.name = ''
			this.whethershowadd(true)
			this.saveOrUpdate = "save"
			scroll(0,document.body.scrollHeight)
		},
		canceladd(){
			this.whethershowadd(false)
			this.name = "问题"
			this.type = 0
			this.optionNumbers = 4
			for(var j = 0; j < this.optionNumbers; j++){
				document.getElementById("i" + j).value = ""
			}			
		},
		whethershowadd(a){
			var apd = document.getElementById("addqid")
			if(a)
				apd.style.display="block"
			else
				apd.style.display="none"
		},
		modify(index){
			this.updateIndex = index
			this.saveOrUpdate = "update"
			this.whethershowadd(true)
			// alert(this.datas.questions[index][1].qtype)
			this.name = this.datas.questions[index].qname
			this.type = this.datas.questions[index].qtype
			this.optionNumbers = this.datas.questions[index].qoption.length
			// if(this.datas.questions[index][1].qtype == 0 || this.datas.questions[index][1].qtype == 1)
			
			// this.optionChange()

			//制造双击效果； 第一次后浏览器还没渲染htmlOption(this.optionChange())
			// setTimeout(function(){
			// 	scroll(0,document.body.scrollHeight) 
			// }, 200)
			// for(var j = 0; j < this.optionNumbers; j++){
			// 	document.getElementById("i" + j).value = this.datas.questions[index][2].qoption[j].content
			// }

			this.htmlOption = ""
			var temp = "<div class=\"optionsposition2\"><input type=\"radio\">"
			if(this.type == 1 || this.type == 3)
				temp = "<div class=\"optionsposition2\"><input type=\"checkbox\">"
			var i = 0
			for(; i < this.optionNumbers - 1; i++){
				this.htmlOption += temp + String.fromCharCode(65 +i) + "&ensp;<input value=\"" + 
					this.datas.questions[index].qoption[i].content + "\" type=\"text\" id=\"i" + i + "\" class=\"optionipt\"></div>"
			}
			if(this.type == 0 || this.type == 1)
				this.htmlOption += temp +  String.fromCharCode(65 +i) + "&ensp;<input value=\"" + 
					this.datas.questions[index].qoption[i].content + "\" type=\"text\" id=\"i" + i + "\" class=\"optionipt\"></div>";
			else
				this.htmlOption += "<div class=\"optionsposition2\">" + "&ensp;" + String.fromCharCode(65 +i) + "&ensp;<input value=\"\" type=\"text\" class=\"diyoptionipt\" disabled></div>";
		
			scroll(0,document.body.scrollHeight)
		},
		delfun(index){
			// alert(this.datas.questions[index][0].qname)
			this.datas.questions.splice(index, 1)
			this.save(this.datas)
		},
		backhome(){
			window.location.href="./index.html"
		},
		Logout(){
			window.localStorage.removeItem("hhnczss")
			window.location.href="./index.html"
		}
	},
	watch:{
		optionNumbers:function(){
			this.optionChange()
		},
		type:function(){
			this.optionChange()
		},
		datas:{},
		deep:true
	}
})