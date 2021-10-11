var datas = JSON.parse(window.localStorage.getItem("temp-questionnaire")||'[]')

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

new Vue({
	el: "#box",
	data:datas,
	mounted(){
		this.init()
	}, 
	methods: {
		submit: function(){
			// alert(this.questions[0][1].qoption[0].ischecked)
			// this.useroptions[userdata[0]] = userdata[1] 
			// alert(userdata[0] + " " + this.useroptions[userdata[0]])
			s = ""
			for(var i = 0; i < this.questions.length; i++){
				for(var j = 0; j < this.questions[i].qoption.length; j++){
					if(this.questions[i].qoption[j].ischecked == null && this.questions[i].qoption[j].content != '')
						s += (i + 1) + " " + this.questions[i].qoption[j].content + "\n"
					if(this.questions[i].qoption[j].ischecked)
						s += (i + 1) + " " + this.questions[i].qoption[j].tag + "\n"
				}
			}
			alert(s)
		},
		init(){
			for(var i = 0; i < datas.questions.length; i++)
				datas.questions[i].qstyle = "qb" + (1 + Math.round(Math.random()*5))
		}
	}

})	