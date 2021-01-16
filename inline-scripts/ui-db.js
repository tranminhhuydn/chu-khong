
var hostDB = '//votandang.net/chu-khong';
//import(hostDB+"/person.php?get-list-full-dic");

var uidb = (function (exports) {
  'use strict';
var host = 'https://tranminhhuydn.github.io/gh-page/'
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
			var ele = personaldb[o]
			//console.log(o);
			var r1 = ele.filter(_filterWord)
			var r2 = []
			//console.log(r1);
			if(r1.length!=0){
				r2[0]=[r1[0][0],r1[0][1],r1[0][2],r1[0][3],r1[0][4],r1[0][5],r1[0][6],r1[0][7],r1[0][8]]
				r2[0][1]=o.replace('.js','')+"<br>"+r2[0][1]
			}
			//r = r.concat(ele.filter(_filterWord))
			r = r.concat(r2)
		}

		for (var o  in fulldic_zsql) {
			var ele = fulldic_zsql[o]
			r = r.concat(ele.filter(_filterWord))
		}

	}
	if(Array.isArray(words)){
		words.forEach(ele1=>{
			word = ele1
			_filter()
		})
 	}else{
 		word = words
		_filter()
 	}
 	//sort z-a
 	r.sort(function(a, b){
    	return b[2] - a[2] 
	});

 	return r;
}
	
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
function persenDBLoad (){
	//console.log("countLoadScript*100"+ (countLoadScript*100));	
	// console.log("listScript.length" + listScript.length);	
	// console.log(countLoadScript*100/listScript.length);	
	if(document.querySelector('#resultDBLoad'))
	document.querySelector('#resultDBLoad').value =  Math.round(countLoadScript*100/listScript.length)+"%"
	setTimeout(()=>{
		if(closer && document.querySelector('#resultDBLoad') && document.querySelector('#resultDBLoad').value=="100%"){
			setIgnoreFocusOutSmsBox(false)
			closer.click()
		}
	}, 1000);
		
}

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
		var r = filterWord(value.split(/[,;.:-]/g))
		var l = []
		r.forEach(e=>{
			var  c
			if(typeof e[3] =='object'){
				console.log(e[3]);
				var o = e[3]
				var tmp=''
				for(var i in o)
					tmp+=i+": "+o[i]+"<br>"
				c = [e[1]+"<br>",e[7]+"<br>",tmp]
			}
			else
				c = [e[1]+"<br>",e[7]+"<br>",e[3].replace(/\n/g,'<br>')]
			l.push(c)
		})
		r=l
		showWord('Tìm',r)
	}
 }

 function checkLoadScript(event){
 	var s = event.path[0].src.split("/")
 	var name = s[s.length-1]

	fulldicStore.set(name,fulldic_zsql[name])
	countLoadScript++
	persenDBLoad()
 	
	if(countLoadScript == listScript.length){

	 	if(closer){
			setIgnoreFocusOutSmsBox(false)
			closer.click()
		}	
	}
 }
 function onErrorHandler(){
 	countLoadScript--
 	console.log("error load");
 	//console.log(this.id);
 	// var id = Number(this.id.replace('scriptId',''))
 	// listScript[]
 	var s = this.src.split("/")
 	var name = s[s.length-1]
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
 	
 	idshowlist.style.fontSize = app.options.fontSize;

 	return {closer:closer,setIgnoreFocusOut:setIgnoreFocusOut}
 }
 function smsBox(title,sms){
 	var {closer,setIgnoreFocusOut} = overlayPage(title,sms)
	var idshowlist = closer.querySelector('#idshowlist')
 	idshowlist.style.bottom= '20%';
 	idshowlist.style.right= '25%';
 	idshowlist.style.top= '20%';
 	idshowlist.style.width= '50%';
 	
 	idshowlist.style.fontSize = app.options.fontSize;
 	setIgnoreFocusOut(true)
 	return {closer:closer,setIgnoreFocusOut:setIgnoreFocusOut}
 }
 function reloadDB(){
 	fulldic_zsql = []
 	persenDBLoad()
 	fulldicStore.clear()
 	loadScript()
 }
 
 function loadScript(){
	function _loadScript(){
		listScript.forEach((e,i)=>{
			var e1 = e.split("/")
			var name = e1[e1.length-1]
			//console.log(e);
			fulldicStore.get(name).then(r=>{
				//console.log(name,e);
				if(r==null){
					
					_addScript(e)
				}else{
					fulldic_zsql[name] = r
					countLoadScript++;


				}				
				persenDBLoad()
			})
		})
 	}

 	var
 	html=`
 	<div id='dialogDownloadInfor'>Ứng dụng Chữ Không cần 300M để tải tự điển bạn có muốn không<br>
 	<button id='dialogYesDownload'>Có tôi muốn tải</button>
 	</div>
 	<div id='dialogDownloadingInfor' style='display:none'><span id='dialogDownloadingStype'>Đang tải:</span> <output id="resultDBLoad"></output><br><span id='dialogDownLoading'>....</span></div>`, 
 	o = uidb.smsBox('Tải tự điển ',html),
 	infor = document.querySelector('#dialogDownloadInfor'),
 	yesDownload = document.querySelector('#dialogYesDownload'),
 	dialogDownloadingInfor = document.querySelector('#dialogDownloadingInfor'),
 	loading = document.querySelector('#dialogDownLoading'),
 	dialogDownloadingStype = document.querySelector('#dialogDownloadingStype'),
 	resultDBLoad = document.querySelector('#resultDBLoad') 
	
	yesDownload.onclick = ()=>{
		dialogDownloadingInfor.style.display='block'
		closer = o.closer
		setIgnoreFocusOutSmsBox = o.setIgnoreFocusOut 
		persenDBLoad()
		var interval = setInterval(()=>{
			var a=loading.innerText=='....'?'.':loading.innerText+='.';loading.innerText=a
			if(closer && resultDBLoad && resultDBLoad.value=="100%"){
				clearInterval(interval)
				setIgnoreFocusOutSmsBox(false)
				closer.click()
			}
		},500);

	 	_loadScript()	
	}

	//if(listScript.length==0){
		fulldicStore.keys().then(r=>{
			if(r!=null && r.length!=0){
				dialogDownloadingStype.innerText = 'Đang nạp dữ liệu: '
				infor.style.display='none'
				dialogDownloadingInfor.style.display='block'
				listScript = r
				//_loadScript()
				yesDownload.onclick()
			}
		})
	//}
}

 
 exports.loadScript = loadScript;
 exports.persenDBLoad = persenDBLoad;
 exports.reloadDB = reloadDB;
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
	

	uidb.loadScript()
	personalCtrl.loadScript()

	appStore.get('options').then(o=>{
		if(o!=null){
			app.options = o;
			app.textArea.style.fontSize = app.options.fontSize;
			app.textArea.style.fontFamily = app.options.fontFamily

			document.querySelector('#mainStyle').innerText =  `.menuContainer button {font-size: ${app.options.iconSize};}`
		}
		//console.log(app.options );
	})

}
