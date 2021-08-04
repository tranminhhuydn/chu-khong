
var hostDB = '//votandang.net/chu-khong';
//import(hostDB+"/person.php?get-list-full-dic");

var uidb = (function (exports) {
  'use strict';
var host = 'https://tranminhhuydn.github.io/gh-page/'

Array.prototype.clone = function(){
  return this.map(e => Array.isArray(e) ? e.clone() : e);
};

var listDBName = [{"id":"1","name":"100_mau_cau_viet_so_yeu_li_lich","order":"1"}, 
    {"id":"2","name":"3000_CDT_GianThe","order":"2"}, 
    {"id":"3","name":"3000_CDT_PhonThe","order":"3"}, 
    {"id":"4","name":"bktd_dv","order":"3"}, 
    {"id":"5","name":"CV_Lac_Viet_Hoa_Viet","order":"1"}, 
    {"id":"6","name":"Free_Chinese_Vietnamese","order":"6"}, 
    {"id":"7","name":"Han_Hoa_Anh","order":"5"}, 
    {"id":"8","name":"Han_Yu_Da_Ci_Dian","order":"7"}, 
    {"id":"9","name":"Han_viet_dai_tu_dien","order":"2"}, 
    {"id":"10","name":"Khang_Hi","order":"8"}, 
    {"id":"11","name":"Nguyen_Quoc_Hung","order":"4"}, 
    {"id":"12","name":"Nien_Hieu_Trung_Quoc","order":"12"}];
var getDBName =(num)=>{
	var 
	find = (v,k,s)=>{return v.id==num},
	r = listDBName.filter(find)[0]
	return r.name
}
// Array.prototype.clone = function() {
//     var i,newObj = [] ;
//     for (i in this) {
//         if (i == 'clone') 
//             continue;
//         if (this[i] && typeof this[i] == "object") {
//             newObj[i] = this[i].clone();
//         } 
//         else 
//             newObj[i] = this[i]
//     } 
// 	return newObj;
// 	//return this;
// };

//writeScript(listScript)



// var lw;
// function loadWorker() {
//   if (typeof(Worker) !== "undefined") {
//     if (typeof(lw) == "undefined") {
//       lw = new Worker("load_workers.js");
//     }
//     lw.onmessage = function(event) {
//       switch(event.data.type){
//     	case 'searchWord':  wordresult.innerHTML=event.data.data;  break;
//       }
//     };
//   } else {
//   }
// }
 
// loadWorker()
function updateResultFilter(ele,update) {
	if(update){	
		console.log(ele);
		wordresult.innerHTML+=ele
	}
}
function filterWord(words,update) {
	var word;
	var r = []; 
	//var arr = [[1, 2], [3, 4], [5,7]];

	async function asyncFilter (arr, predicate) {
		var results = await Promise.all(arr.map(predicate)).then();
		return arr.filter((_v, index) => results[index]);
	}

	// var asyncRes = await asyncFilter(arr, async (i) => {
	// 	return i[1] % 2 === 0;
	// });

	function _filterWord(i) {
	  if(i[1]==word||i[7]==word)
	  	updateResultFilter(i,update)
	  if(i[4]=="object"){
	  	try{
		  	var obj = JSON.parse(i[3])
		  	i[3] ='';
		  	for (var o  in obj){
		  		if(obj[o].trim().length!=0)
		  		i[3] +=o +': '+obj[o]+"<br>"
		  	}
		  }catch(e){

		  }
	  }
	  return i[1]==word||i[7]==word
	}
	function _filter() {
	 	for (var o  in personaldb) {
	 		//console.log(o);
			var ele = personaldb[o].clone()
		
			var r1 = ele.filter(_filterWord)
			var r2 = []
			//console.log(r1);
			if(r1.length!=0){
				r2[0]=[r1[0][0],r1[0][1],r1[0][2],r1[0][3],r1[0][4],r1[0][5],r1[0][6],r1[0][7],r1[0][8]]
				r2[0][8]=o.replace('.js','')//+"<br>"+r2[0][1]
			}
			//r = r.concat(ele.filter(_filterWord))
			//r = r.concat(r2)
			r = r.concat(r2)
			//r1.clone();
		}

		// for (var o  in fulldic_zsql) {
		// 	if(o!='clone'){			
		// 	    var ele = fulldic_zsql[o]
		// 	    //console.log(o);
		// 	    var r1 = ele.filter(_filterWord)
		// 	    r = r.concat(r1)
		// 	}
		// }
		if(word.trim().length==0)
			return;
		var find = (v,k,s)=>{return v[0] == word || v[4] == word}
		r = r.concat(data.filter(find))

	}
	if(Array.isArray(words)){
		// chuyển đổi giản phồn
		words.forEach(ele1=>{	
			word = ele1		
	 		var k1 = app.fnGianToPhon(word)
	 		if(k1!=word){
	 			words.push(k1)
	 		}
	 		var k2 = app.fnPhonToGian(word)
			if(k2!=word){
				words.push(k2)
	 		}
		})
		//console.log(words);
		words.forEach(ele1=>{
			word = ele1
			_filter()
		})
 	}else{

 		word = words
		_filter()
		// chuyển đổi giản phồn
 		var k1 = app.fnGianToPhon(words)
 		if(k1!=words){
 			word = k1
			_filter()
 		}
 		var k2 = app.fnPhonToGian(words)
		if(k2!=words){
 			word = k2
			_filter()
 		}
 	}
 	//sort z-a
 	r.sort(function(a, b){
    	// old return b[2] - a[2] 
    	// new
    	return b[1] - a[1] 
	});

 	return r;
}
app.filterWord = filterWord;

function sort(points) {
  return points.sort(function(a, b){
    return b[2] - a[2] 
	});
}
// self.onmessage = function(event) {
//     console.log(event.data.type);
//     switch(event.data.type){
//     	case 'searchWord':  filterWord(event.data.data.split(',')); break;
//     }
// };
  var countLoadScript=0
// function persenDBLoad (){
// 	//console.log("countLoadScript*100"+ (countLoadScript*100));	
// 	// console.log("listScript.length" + listScript.length);	
// 	// console.log(countLoadScript*100/listScript.length);	
// 	if(document.querySelector('#resultDBLoad'))
// 	document.querySelector('#resultDBLoad').value =  Math.round(countLoadScript*100/listScript.length)+"%"
// 	setTimeout(()=>{
// 		if(closer && document.querySelector('#resultDBLoad') && document.querySelector('#resultDBLoad').value=="100%"){
// 			setIgnoreFocusOutSmsBox(false)
// 			closer.click()
// 		}
// 	}, 1000);
		
// }

function searchWord (value){
	if (typeof(lw) !== "undefined") {
		console.log(word.value);
		lw.postMessage({type:'searchWord',data:value})
	}else{
		//cach 1
		//var r = filterWord(word.value.split(','))
		//wordresult.innerHTML=r

		//cach 2
		//wordresult.innerHTML = ''
		//filterWord(word.value.split(','),true)
		//xem 

		//cach 3
		var r1,sr,r= filterWord(value.split(/[,;.:-]/g))
		// sr = JSON.stringify(r1)
		// r = JSON.parse(sr);
		//r=r1.clone();
		var l = []
		r.forEach(e=>{
			var  c
			// if(typeof e[3] =='object'){
			// 	console.log(e[3]);
			// 	var o = e[3]
			// 	var tmp=''
			// 	for(var i in o)
			// 		tmp+=i+": "+o[i]+"<br>"
			// 	c = [e[1]+"<br>",e[7]+"<br>",tmp]
			// }
			// else
			// 	c = [e[1]+"<br>",e[7]+"<br>",e[3].replace(/\n/g,'<br>')]
			// l.push(c)
			if(e.length==5)
				c = [e[0],e[4],e[2].replace(/\n/g,'<br>'),getDBName(e[3])].join("<br>")
			else
				c = [e[1],e[3],e[4],e[8]].join("<br>")
			l.push(c)
		})
		r=l
		showWord('Tìm',r)
	}
 }

 function checkLoadScript(event){
 	var s = event.path[0].src.split("/")
 	var name = s[s.length-1]

	//fulldicStore.set(name,fulldic_zsql[name])
	personalStore.set(name,personaldb[name])
	countLoadScript++
	//persenDBLoad()
 	
	if(countLoadScript == listScript.length){

	 	if(closer){
			setIgnoreFocusOutSmsBox(false)
			closer.click()
		}	
	}
 }
 var coundErrorLoad = 0;
 function onErrorHandler(){
 	countLoadScript--
 	coundErrorLoad++;
 	console.log("error load");
 	//console.log(this.id);
 	// var id = Number(this.id.replace('scriptId',''))
 	// listScript[]
 	var s = this.src.split("/")
 	var name = s[s.length-1]
 	if(coundErrorLoad<500)
 	_addScript(name)
 }
function _addScript(src){
 	var head = document.getElementsByTagName('body').item(0);
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', host+src);
	script.onload = checkLoadScript
	script.onerror = onErrorHandler;
	head.appendChild(script);
}
 /*
 *collects: String,Array,Oject
 **/
 function overlayPage(title,collects){
 	var closer = document.createElement('div');
 	var ignoreFocusOut = false;

 	closer.style.cssText = 'margin: 0; padding: 0; ' +
        'position: fixed; top:0; bottom:0; left:0; right:0;' +
        'z-index: 9990; background-color: rgba(0, 0, 0, 0.3);'

    var el = document.createElement('div');

    function setIgnoreFocusOut(ignore) {
        ignoreFocusOut = ignore;
        if (ignore) {
            closer.style.pointerEvents = "none";
            el.style.pointerEvents = "auto";
        }
    }

    var commands
    if(Array.isArray(collects))
    	commands = '<div>'+collects.join("</div><div>")+'</div>'
    if(typeof(collects)==='string')
    	commands = collects

    el.id = 'idshowlist';
    el.innerHTML = `<p style='line-height: 20px;margin: 0px;padding: 5px;border-bottom: 1px dotted #273136;'><span>${title}</span><button style='float: right;'>close</button></p>` + commands ;
    el.querySelector('button').onclick = close
    function close() {
        if (!closer) return;
        //document.removeEventListener('keydown', documentEscListener);
        closer.parentNode.removeChild(closer);
        closer = null;
    }
    el.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    closer.addEventListener('click', function(e) {
    	if(typeof(e)==='boolean'){
    		setIgnoreFocusOut(e)
    		console.log(typeof(e));
    	}
    	if(!ignoreFocusOut)
        close();

    });
    closer.appendChild(el);

    document.body.appendChild(closer);

    document.onkeydown = (e)=>{
		if(e.keyCode==27)
		close()
	}
	return {closer:closer,setIgnoreFocusOut:setIgnoreFocusOut}

 }
 function showWord(title,collects){
 	var {closer,setIgnoreFocusOut} = overlayPage(title,collects)
 	var idshowlist = closer.querySelector('#idshowlist')
 	idshowlist.style.width= '50%';
 	
 	idshowlist.style.fontSize = `${app.options.fontSize}`;

 	return {closer:closer,setIgnoreFocusOut:setIgnoreFocusOut}
 }
 function smsBox(title,sms){
 	var {closer,setIgnoreFocusOut} = overlayPage(title,sms)
	var idshowlist = closer.querySelector('#idshowlist')
 	idshowlist.style.bottom= '20%';
 	idshowlist.style.right= '25%';
 	idshowlist.style.top= '20%';
 	idshowlist.style.width= '50%';
 	
 	idshowlist.style.fontSize = `${app.options.fontSize}`;
 	setIgnoreFocusOut(true)
 	return {closer:closer,setIgnoreFocusOut:setIgnoreFocusOut}
 }
 function reloadDB(){
 	fulldic_zsql = []
 	// persenDBLoad()
 	fulldicStore.clear()
 	//loadScript()
 }
 function loadScript (){
 	if(!personaldb['tranminhhuydn@gmail.com.js'])
 	_addScript('tranminhhuydn@gmail.com.js')
 }

 // exports.persenDBLoad = persenDBLoad;
 exports.reloadDB = reloadDB;
 exports.loadScript = loadScript;
 exports.overlayPage = overlayPage;
 exports.showWord = showWord;
 exports.smsBox = smsBox;
 exports.searchWord = searchWord;

 return exports;

}({}));

//desable oncontextmenu in screen toutch
app.textArea.oncontextmenu = (event)=>{
	var e = event || window.event;
	e.preventDefault && e.preventDefault();
  	e.stopPropagation && e.stopPropagation();
  	return false;
}
	
var closer,setIgnoreFocusOutSmsBox

window.onload = ()=>{
	
	appStore.get('user').then(o=>{
		if(o!=null){
			cmdUser.querySelector('.material-icons').innerHTML='person'
		}
		personalCtrl.infor = o
		//console.log(app.options );
	})
	appStore.get('list-inorder-translate').then(r=>{
		if(r!=null && r.length!=0)
			app.listInorderTranslate = r
		else
			app.listInorderTranslate = []
	})

	cmddaotu.iniSetting()
	

	//loadDBDefult
	personalStore.get('tranminhhuydn@gmail.com.js').then(r=>{
		if(r==null){
			uidb.loadScript()
		}
	})

	personalCtrl.loadScript()

	appStore.get('options').then(o=>{
		if(o!=null){
			app.options = o;
			app.textArea.style.fontSize = `${app.options.fontSize}`;
			app.textArea.style.fontFamily = app.options.fontFamily

			document.querySelector('#mainStyle').innerText =  `.menuContainer button {font-size: ${app.options.iconSize};}`
		}
		//console.log(app.options );
	})

}
