Array.prototype.clone = function(){
  return this.map(e => Array.isArray(e) ? e.clone() : e);
};
Array.prototype.unique = function(){
	return this.filter((v, i, s) =>{
	  var findIndex = (e) => e[0] == v[0];
	  return s.findIndex(findIndex) === i;
	})
}
var hostDB = '//votandang.net/chu-khong';
//var hostDB = 'http://localhost/cakephp-4-0-4/chu-khong';
//import(hostDB+"/person.php?get-list-full-dic");

var listDBName = [
    {"id":"2","name":"hv_org","order":"2"}, 
    {"id":"4","name":"bktd_dv","order":"4"}, 
    {"id":"5","name":"CV_Lac_Viet_Hoa_Viet","order":"5"}, 
    {"id":"6","name":"Free_Chinese_Vietnamese","order":"6"}, 
    {"id":"7","name":"Han_Hoa_Anh","order":"7"}, 
    {"id":"8","name":"Han_Yu_Da_Ci_Dian","order":"8"}, 
    {"id":"9","name":"Han_viet_dai_tu_dien","order":"9"}, 
    {"id":"10","name":"Khang_Hi","order":"10"}, 
    {"id":"11","name":"Nguyen_Quoc_Hung","order":"11"},
    {"id":"12","name":"nomfoundation.com","order":"12"},
    {"id":"13","name":"TĐ Chữ Nôm Dẫn Giải - \nGS.TSKH Nguyễn Quang Hồng","order":"13"},
    {"id":"14","name":"TĐ Hán Nôm - \nNguyễn Trãi Quốc Âm Từ Điển","order":"14"},
    {"id":"15","name":"TĐ Nôm Tày - \nHoàng Triều Ân \nDương Nhật Thanh \nHoàng Tuấn Nam","order":"15"},
    {"id":"16","name":"TĐ Thiền Tông - \nHT Thích Thông Thiền","order":"16"}];

var uidb = (function (exports) {
  'use strict';
	var {log}= console
	var host = 'https://tranminhhuydn.github.io/chu-khong/json/'
	if(location.hostname=='localhost')
		host = location.href.replace(/\#/g,'')+'json/'




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
	var word,
	r = [],
	currentDBOfUser = null, 
	personFilter = (v,k,s)=>{
		return v[0]==word||v[5]==word
	},
	filter = ()=>{
		word = word.trim()
		if(word.length==0)
			return;
		for (var o in personaldb) {
	 		var person = personaldb[o],
	 		r1 = person.filter(personFilter),
	 		r2 = []
	 		if(r1.length!=0){
	 			var c ='',
	 			v = r1[0], key1 = v[0], length = v[1], mean = v[2], key2 = v[5]

				if((mean.split && mean.indexOf('từ kép')!=-1) //string
					|| mean['từ kép'] //object
				){
					if(mean.split && mean.indexOf('từ kép')!=-1) //string
						mean = JSON.parse(mean)
					for (var o1 in mean){
				  		if(mean[o1].trim().length!=0)
				  		c +='<b>'+o1 +'</b>: '+mean[o1]+"<br>"
				  	}
				}else
					c = mean
				var username = o.split('@')
				username = username[0]
				r2[0] = [v[0],v[1],c,v[3],v[4],v[5],username]
	 			r = r.concat(r2)
	 		}
	 	}
	}
	words.forEach(ele1=>{
		word = ele1
		filter()
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
        r1 = r.filter((v,k,s)=>{if(v.length==7) return v})
        
        //order by
        listOrder.map((v,k,s)=>{
            var c = r.filter((v1,k1,s1)=>{return v1.length==5 && v1[3]==v})
            if(c[0]){
               rOrder= rOrder.concat(c)
            }
            return c
        })
        r = r1.concat(rOrder)
        // show 
        r.forEach(e=>{
            var  c
            if(e.length==5){
                c = [e[0],e[4],e[2].replace(/\n/g,'<br>'),uidb.getDBName(e[3])].join("<br>")
                l.push(c)
            }

            if(e.length==7){
                //log(e)
                var tuLoai = e[3],
                key = e[0]
                if(tuLoai=="object")
                    tuLoai = ""
                
                if(e[5] && e[5].trim && e[5].trim().length!=0)
                	key += " / "+e[5]
                c = [key,e[2],tuLoai,e[6]].join("<br>").replace("<br><br>","<br>")
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
    keys = value.split(/[0-9a-zA-Zà-ỹÀ-Ỹ，。\/；【】=-~！@#￥%……&*（）——+{}‘’“”：？》《、、。〃〄々〆〇〈〉《》「」『』【】〒〓〔〕〖〗〘〙〚〛〜〝〞〟〠〡〢〣〤〥〦〧〨〩〪〭〮〯〫〬〰〱〲〳〴〵〶〷〸〹〺〻〼〽 〾 〿]/g),
    v = app.fnMultiGianHayPhon(keys)
    if(v.length!=0)
        keys = keys.concat(v)
    keys = keys.filter((v1)=> {return v1.length!=0})
    
    r = app.filterWord(keys)
    r = r.unique() // case duplicaste

    keys.forEach(word=>{		
		var find = (v,k,s)=>{return v[0] == word || v[4] == word}
		r = r.concat(rootData.data.filter(find))
	})

 	//sort z-a
 	r.sort((a, b)=>{return b[1] - a[1]});
	beforeShow(r)
 }
 function searchWordV2 (keys,data){
	var 
	r = app.filterWord(keys)
	r = r.concat(rootData.data)
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
 	var 
 	{d} = app,
 	head = d.getElementsByTagName('body').item(0),
	script = d.create('script',{'type':'text/javascript','src':host+src})
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
 	fulldicStore.clear()
 	//loadScript()
 }
 function loadScript (){
 	if(!personaldb['tranminhhuydn@gmail.com.js'])
 	_addScript('tranminhhuydn@gmail.com.js')
 }

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
var rgtClickContextMenu = document.getElementById('div-context-menu');

/** close the right click context menu on click anywhere else in the page*/
document.onclick = function(e) {
  rgtClickContextMenu.style.display = 'none';
}


app.textArea.oncontextmenu = (event)=>{
	// var e = event || window.event;
	// e.preventDefault && e.preventDefault();
	// e.stopPropagation && e.stopPropagation();
	// return false;
 	event.preventDefault();
    rgtClickContextMenu.style.left = event.pageX + 'px'
    rgtClickContextMenu.style.top = event.pageY + 'px'
    rgtClickContextMenu.style.display = 'block'
    return false;
}

app.deleteCache = ()=>{
	(async () => {
	    // import module for side effects
	    var v = await appStore.get("app.version")
	    if(!v){
			v = app.version?app.version:'2.0'
			appStore.set("app.version",v)
		}
		if(app.version && v!=app.version){	
			appStore.set("app.version",app.version)
			//console.log("Đã có phiên bản mới bạn nên cập nhật để được thừa hưởng các tính năng mới")
			if(window.caches){
				appStore.set("deleteCache",true)
				var cacheNames = await caches.keys()
				cacheNames.forEach(cacheName => {
				    caches.delete(cacheName);
				});
				var persons = await personalStore.keys()
					persons.forEach(personName => {
					    personalStore.del(personName);
					});
				setTimeout(()=>{
					serviceWorkerUpdate()
				},5000);
			}else{
				alert("Đã có phiên bản mới bạn nên cài đặt lại để được thừa hưởng các tính năng mới")
			}
		}
		if(!app.version)
			app.version = v
	})();
}	

var closer,setIgnoreFocusOutSmsBox

window.addEventListener("load",()=>{
	
	cmdReport.classList.toggle('hidden')
	
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



	// cheack new version
	// begin version "2.0" 
	appStore.keys().then(s=>{
		if(s)
		s.forEach(e=>{
			var key = e.replace(/\-/g,'')
			//console.log(key);
			appStore.get(e).then(v=>{
					window[key] = v 
			})
		})
	})

	app.deleteCache()


	var myRe = new Request("./json/boFull.json");

    fetch(myRe)
    .then(response  => response.json())
    .then(data => {
        app.boFull = data.data
        //console.log(data)
    })

})

