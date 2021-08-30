
var hostDB = '//votandang.net/chu-khong';
//var hostDB = 'http://localhost/cakephp-4-0-4/chu-khong';
//import(hostDB+"/person.php?get-list-full-dic");
var listDBName = [
    {"id":"4","name":"bktd_dv","order":"3"}, 
    {"id":"5","name":"CV_Lac_Viet_Hoa_Viet","order":"1"}, 
    {"id":"6","name":"Free_Chinese_Vietnamese","order":"6"}, 
    {"id":"7","name":"Han_Hoa_Anh","order":"5"}, 
    {"id":"8","name":"Han_Yu_Da_Ci_Dian","order":"7"}, 
    {"id":"9","name":"Han_viet_dai_tu_dien","order":"2"}, 
    {"id":"10","name":"Khang_Hi","order":"8"}, 
    {"id":"11","name":"Nguyen_Quoc_Hung","order":"4"},
    {"id":"12","name":"nomfoundation.com","order":"12"},
    {"id":"13","name":"TĐ Chữ Nôm Dẫn Giải - \nGS.TSKH Nguyễn Quang Hồng","order":"13"},
    {"id":"14","name":"TĐ Hán Nôm - \nNguyễn Trãi Quốc Âm Từ Điển","order":"14"},
    {"id":"15","name":"TĐ Nôm Tày - \nHoàng Triều Ân \nDương Nhật Thanh \nHoàng Tuấn Nam","order":"15"},
    {"id":"16","name":"TĐ Thiền Tông - \nHT Thích Thông Thiền","order":"16"}];

var uidb = (function (exports) {
  'use strict';
  var {log}= console
var host = 'https://tranminhhuydn.github.io/gh-page/'

Array.prototype.clone = function(){
  return this.map(e => Array.isArray(e) ? e.clone() : e);
};


var getDBName =(num)=>{
	var 
	find = (v,k,s)=>{return v.id==num},
	r = listDBName.filter(find)[0]
	return r.name
}
var getIDDicts =(name)=>{
	var 
	find = (v,k,s)=>{return v.name==name},
	r = listDBName.filter(find)[0]
	if(r)
	return r.id
}

//writeScript(listScript)

function filterWord(words,update) {
	var word;
	var r = []; 
	var currentDBOfUser = null

	function _filterWord(i) {
	  if(i[4]=="object"){
	  	try{
		  	var obj = JSON.parse(i[3])
		  	i[3] ='';
		  	for (var o  in obj){
		  		if(obj[o].trim().length!=0)
		  		i[3] +=o +': '+obj[o]+"<br>"
		  	}
		}catch(e){
			if(typeof(i[3])==="object"){
				var obj = i[3]
		  		i[3] ='';
		  		for (var o  in obj){
			  		if(obj[o].trim().length!=0)
			  		i[3] +=o +': '+obj[o]+"<br>"
			  	}
	  		}
		  }
	  }
	  return i[1]==word||i[7]==word
	}
	function _filter() {

	 	for (var o  in personaldb) {
			var ele = personaldb[o].clone()
		
			var r1 = ele.filter(_filterWord)
			// log(r1)
			var r2 = []

			if(r1.length!=0){
				r2[0]=[r1[0][0],r1[0][1],r1[0][2],r1[0][3],r1[0][4],r1[0][5],r1[0][6],r1[0][7],r1[0][8]]
				r2[0][8]=o.replace('.js','')//+"<br>"+r2[0][1]
			}
			r = r.concat(r2)
		}

		if(word.trim().length==0)
			return;
	}
	words.forEach(ele1=>{
		word = ele1
		_filter()
	})

 	return r;
}

app.filterWord = filterWord;

var 
beforeShow = (value) =>{
    (async ()=>{
        var listDics = await appStore.get("list-dics")
        var listOrder = []
        if(!listDics)
            listDics = uidb.listDBName.map((v)=>{return v.name})
        listDics.forEach((e)=>{
            listOrder.push(uidb.getIDDicts(e))
        })
    
        var r1,sr,r= value
        var l = [],
        rOrder = [],
        r1 = r.filter((v,k,s)=>{if(v.length==9) return v})
        
        //order by
        rOrder = listOrder.map((v,k,s)=>{
            var c = r.filter((v1,k1,s1)=>{return v1.length==5 && v1[3]==v})
            if(c[0])
                return c[0]
            return []
        })
        r = r1.concat(rOrder)
        // show 
        r.forEach(e=>{
            var  c
            if(e.length==5){
                c = [e[0],e[4],e[2].replace(/\n/g,'<br>'),uidb.getDBName(e[3])].join("<br>")
                l.push(c)
            }
            if(e.length==9){
                //log(e)
                var tuLoai = e[4]
                if(tuLoai=="object")
                    tuLoai = ""
                c = [e[1]+" / "+e[7],e[3],tuLoai,e[8]].join("<br>").replace("<br><br>","<br>")
                l.push(c)
            }
        })
        
        r=l
        uidb.showWord('Tìm',r,`<button title='Thêm từ mới' id='cmdaddnewword2' class="menuTop" style="float:right"><i class='material-icons'>create</i></button>`)
    
    })()
 }

var countLoadScript=0

function searchWord (value){
	var 
    r,
    keys = value.split(/[,;.:-。《》【】·~，；：‘“？\/\}\{——+！@#￥%……&*（）\|\、]/g),
    v = app.fnMultiGianHayPhon(keys)
    if(v.length!=0)
        keys = keys.concat(v)
	r = app.filterWord(keys)

	keys.forEach(word=>{		
		var find = (v,k,s)=>{return v[0] == word || v[4] == word}
		r = r.concat(data.filter(find))
	})
 	//sort z-a
 	r.sort((a, b)=>{return b[1] - a[1]});
	beforeShow(r)
 }
 function searchWordV2 (keys,data){
	var 
	r = app.filterWord(keys)
	r = r.concat(data)
 	//sort z-a
 	r.sort((a, b)=>{return b[1] - a[1]});
	beforeShow(r)
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
 function overlayPage(title,collects,bar){
 	var closer = document.createElement('div');
 	var ignoreFocusOut = false;
 	bar = bar||""
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
    el.innerHTML = `<p style='line-height: 20px;margin: 0px;padding: 5px;border-bottom: 1px dotted #273136;'><span>${title}</span><button id='$cmdClose' style='float: right;'>close</button><span>${bar}</span></p>` + commands ;
    el.querySelector('button').onclick = close
    function close() {
        //if (!closer) return;
        //document.removeEventListener('keydown', documentEscListener);
        closer.parentNode.removeChild(closer);
        closer = null;
    }

    el.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    //closer.close = close
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
 function showWord(title,collects,bar){
 	var {closer,setIgnoreFocusOut} = overlayPage(title,collects,bar)
 	var idshowlist = closer.querySelector('#idshowlist')
 	idshowlist.style.width= '50%';
 	
 	idshowlist.style.fontSize = `${app.options.fontSize}`;

 	var cmdaddnewword2 = closer.querySelector("#cmdaddnewword2")
 	if(cmdaddnewword2)
 	cmdaddnewword2.onclick = ()=>{
 		closer.click()
 		cmdaddnewword.click()
 	}

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
 	//setIgnoreFocusOut(true)
 	return {closer:closer,setIgnoreFocusOut:setIgnoreFocusOut}
 }
 function dialogTraBo(title,sms){
 	var {closer,setIgnoreFocusOut} = overlayPage(title,sms)
	var idshowlist = closer.querySelector('#idshowlist')
 	idshowlist.style.bottom= '5%';
 	idshowlist.style.right= '0';
 	idshowlist.style.left= '0';
 	idshowlist.style.top= '5%';
 	idshowlist.style.width= '100%';
 	
 	idshowlist.style.fontSize = `${app.options.fontSize}`;
 	//setIgnoreFocusOut(true)
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
 exports.searchWordV2 = searchWordV2;
 exports.dialogTraBo = dialogTraBo;
 exports.getIDDicts = getIDDicts
 exports.getDBName = getDBName
 exports.listDBName = listDBName
 exports.beforeShow = beforeShow
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

window.addEventListener("load",()=>{
	
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
		}else{
			app.options.fontSize = 'x-large'
			app.options.iconSize = 'x-large'
		}
		app.textArea.style.fontSize = `${app.options.fontSize}`;
		app.textArea.style.fontFamily = app.options.fontFamily
		document.querySelector('#mainStyle').innerText =  `.menuContainer button {font-size: ${app.options.iconSize};}`

		//console.log(app.options );
	})


	//cheack new version
	// begin version "2.0" 
	if(!app.version){
		appStore.get("app.version").then(v=>{
			if(!v){
				appStore.set("app.version","2.0")
			}
			if(v)
				app.version = v
		})
	}else{
		appStore.get("app.version").then(v=>{
			if(v!=app.version){
				console.log("Đã có phiên bản mới bạn nên cập nhật để được thừa hưởng các tính năng mới")
				if(window.caches){
					caches.keys().then(cacheNames => {
						//console.log(cacheNames);
					  cacheNames.forEach(cacheName => {
					  	//console.log(cacheName);
					    caches.delete(cacheName);
					  });
					});
					appStore.set("app.version",app.version).then(v=>{
						//alert("ok")
						location.reload();
					})
				}else{
					alert("Đã có phiên bản mới bạn nên cài đặt lại để được thừa hưởng các tính năng mới")
				}
			}
		})
	}

	var myRe = new Request("./json/boFull.json");

    fetch(myRe)
    .then(response  => response.json())
    .then(data => {
        app.boFull = data.data
        //console.log(data)
    })

})
