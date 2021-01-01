//var listScriptPersonal=[]
var hostDB = 'http://votandang.net/chu-khong';
//import(hostDB+"/person.php?get-list-user")
var personaldb = {}

var personalCtrl = (function (exports) {
 	'use strict';

	var host = hostDB+"/personal/"

	function split(next,removeSpecial,input){
	  var text = input
	  ,strArr = []
	  function unique(k){
	    for (var i = 0; i < strArr.length; i++) {
	      if(strArr[i]==k)
	        return i;
	    }
	    return -1
	  }
	  //.for (var i = 0; i < text.length; i+=next) {
	  text=text.replace(/[a-zA-Z0-9]/g,"")
	  text=text.replace(/[〈…；、：『』，？。「」！【】《》“”\(\)\"\[\]\'\:\;\>\<\,\.\?\/\\\|\+\=\-\%\$\#\@\!\~\`\′]/g,"")

	  text = text.replace(/[\n\s]/g,'')

	  for (var i = 0; i < text.length; i++) {
	    var ele = ''
	    ,j = 0

	    if(i+next<=text.length)
	    ele = text.slice(i,i+next)

	    if(removeSpecial!=(undefined||null))
	      ele = ele.replace(removeSpecial,'')

	    if(ele.length==next && unique(ele)==-1)
	      strArr.push(ele)
	  }
	  return strArr
	}
	function splitLine(currentLine){
		var paragraphHasSplit = []
	  for (var i = 14; i >=1; i--) {
	    paragraphHasSplit = paragraphHasSplit.concat(split(i,null,currentLine))
	  }
	  return paragraphHasSplit
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
		  return i[1]==word||i[7]==word
		}
		 function _filter() {
		 	var it = app.listInorderTranslate
		 	if(it.length!=0){
		 		for (var i = 0; i < it.length; i++) {
		 			var e = it[i]
		 			var ele = personaldb[e]
			 		r = r.concat(ele.filter(_filterWord))
		 		}
		 	}else{

			 	for (var i in personaldb) {
			 		//console.log(i);
			 		//personaldb[i]
			 		var ele = personaldb[i]
			 		r = r.concat(ele.filter(_filterWord))
			 	}
		 	}
			// personaldb.forEach(ele=>{
			// 	// asyncFilter(ele,_filterWord).then(r1=>{
			// 	// 	r = r.concat(r1)
			// 	// })
			// 	r = r.concat(ele.filter(_filterWord))
			// 	//console.log();	
			// })
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

	function persenDBLoad (){
		if(document.querySelector('#resultDBLoad'))
		document.querySelector('#resultDBLoad').value =  Math.round(personaldb.length*100/118)+"%"
	}

	function searchWord (value){
		var r1 = splitLine(value)
		//console.log(r1);
		var r = filterWord(r1)
		return r;
		
	 }
	function searchWordForm (email,word){
		var r = []; 
		function _filterWord(i) {
		  return i[1]==word||i[7]==word
		}
		function _filter() {
	 		var ele = personaldb[email]
	 		if(ele)
	 			r = r.concat(ele.filter(_filterWord))
	 		else
	 			alert(email+' không tồn tại')
		}
	 	_filter()
		return r;	
	 }
	function searchWordUpdate (email,word,callback){
		var logIndex = -1;
		function _filterWord(i,index) {
			//console.log(index);
			if(i[1]==word||i[7]==word)
				logIndex=index
			return i[1]==word||i[7]==word
		}
		function _filter() {
	 		var ele = personaldb[email]
	 		if(ele){
	 			ele.filter(_filterWord)
	 		}
	 		else
	 			alert(email+' không tồn tại')
		}
	 	_filter()
	 	if(callback)
	 		callback(logIndex)
	 }
	 var countLoadScript = 0;
	function checkLoadScript(event){
	 	function doStore(){
	 		console.log(listScriptPersonal.length+"/"+countLoadScript+" "+name);
	 		if(countLoadScript==listScriptPersonal.length){
	 			//personaldb[name] = r

				//personalStore.set("personaldb",personaldb).then(r=>{

					if(closer){
						//setIgnoreFocusOutSmsBox(false)
						//closer.click()
					}
				//})
			}
	 	}
	 	var s = event.path[0].src.split("/")
	 	var name = s[s.length-1]
	 	countLoadScript++;

	 	
	 	listScriptPersonal.forEach(e=>{
	 		var checklist =e
	 		personalStore.get(checklist).then(r=>{
		 		if(r!=null){
		 			countLoadScript++;
		 			//console.log(countLoadScript+"/"+r);
		 			doStore()
		 		}
		 	})

	 	})
	 	
	 	
	 	personalStore.get(name).then(r=>{
			if(r==null){
				//console.log(personaldb);
				personalStore.set(name,personaldb[name])
				persenDBLoad()
				//personalStore.set("personaldb",personaldb)
			}
		})
		doStore()
	 }
	function onErrorHandler(){
	 	console.log("error load");
	 	var s = this.src.split("/")
	 	var name = s[s.length-1] //.replace('.js','')
	 	_addScript(name)
	 }
	function _addScript(src){
	 	var body = document.getElementsByTagName('body').item(0);
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', host+src);
		script.onload = checkLoadScript
		script.onerror = onErrorHandler;
		body.appendChild(script);
	}
	function addScript(srcs){
	 	if(Array.isArray(srcs)){

	 		srcs.forEach((e,i)=>{
	 			var e1 = e.split("/")
	 			var name = e1[e1.length-1]

	 			personalStore.get(name).then(r=>{
	 				if(r==null){
	 					_addScript(e)
	 				}
	 				//else
	 				//console.log(r);
	 			})
	 		})

	 	}else{
	 		_addScript(srcs)
	 	}
	 }
	 function reloadDB(){
	 	personaldb = []
	 	persenDBLoad()
	 	personalStore.clear()
	 	addScript(listScriptPersonal)
	 }
	function loadScript(){
	 	function _loadScript(){
			listScriptPersonal.forEach((e,i)=>{
	 			var e1 = e.split("/")
	 			var name = e1[e1.length-1]

	 			personalStore.get(name).then(r=>{
	 				if(r==null){
	 					_addScript(e)
	 				}else{
	 					personaldb[name] = r
	 				}
	 			})
	 		})
	 	}
	 	if(listScriptPersonal.length==0){
	 		console.log('load offline');
	 		personalStore.keys().then(r=>{
	 			if(r!=null){
	 				listScriptPersonal = r
	 				_loadScript()
	 			}
	 		})
	 	}else{
	 		console.log('load online');
	 		_loadScript()
	 	}
	 	
	 }

	 exports.searchWordForm = searchWordForm;
	 exports.searchWordUpdate = searchWordUpdate;
	 exports.persenDBLoad = persenDBLoad;
	 exports.reloadDB = reloadDB;
	 exports.addScript = addScript;
	 exports.searchWord = searchWord;
	 exports.loadScript = loadScript;

	 return exports;

}({}));



function dateTimeNow(){
	//'2020-06-12 00:10:58'
	var fullday = (new Date()).toLocaleDateString().replace(/\//g, "-")
	var fullTime = (new Date()).toLocaleTimeString()
	return fullday+" "+fullTime
}
var log = [];
function post(path,params,callback) {
	var http = new XMLHttpRequest();
	var url = path
	//var params = 'orem=ipsum&name=binny';
	http.open('POST', url, true);

	//Send the proper header information along with the request
	//http.setRequestHeader('Content-type', 'application/json');// x-www-form-urlencoded');

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
	        //alert(http.responseText);
	        if(callback)
	         callback(true,http.responseText)
	    }else{
	    	 if(http.status!=200 && callback)
	    	 callback(false,http.status)
	    }
	}
	http.send(params);
}

function get(path,callback) {
	var http = new XMLHttpRequest();
	var url = path
	//var params = 'orem=ipsum&name=binny';
	http.open('GET', url, true);

	//Send the proper header information along with the request
	//http.setRequestHeader('Content-type', 'application/json');// x-www-form-urlencoded');

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
	        //alert(http.responseText);
	        if(callback)
	         callback(true,http.responseText)
	    }else{
	    	 if(http.status!=200 && callback)
	    	 callback(false,http.status)
	    }
	}
	http.send();
}

function updateStatus(obj){
	obj = obj||cmdsyncdb
	appStore.get('log').then(r=>{
		log = r==null?[]:r;
		var status = obj.querySelector('span')
		status.innerHTML = "("+log.length+")"
		status.style.color=log.length==0?'':'red';
	})
}
updateStatus()
function logAdd(type,recode){

	appStore.get('log').then(r=>{
		log = r==null?[]:r;
		//update()
		log.push([type,recode])
		appStore.set('log',log)
		updateStatus()
	})
}
function dateParse(arg){
	var args = arg.split(' ')
	args[0] = args[0].split('-')
	args[1] = args[1].split(':')
	return {
		y:args[0][0],
		m:args[0][1],
		d:args[0][2],

		h:args[1][0],
		i:args[1][1],
		s:args[1][2]
	}
}
function getListDay(year1,month1,day1){
	var listResult = [];
	var getDaysInMonth = function(month,year) {
		// Here January is 1 based
		//Day 0 is the last day in the previous month
		return new Date(year, month, 0).getDate();
		// Here January is 0 based
		// return new Date(year, month+1, 0).getDate();
	};
	var dd = new Date();
	var year = dd.getFullYear()
	var month = dd.getMonth()+1
	var day = dd.getDate()

	//getDaysInMonth()
	year1 = year1||year
	month1 = month1||month
	day1 = day1||day
	var i=0,j=0,l=0,startday = {year:year1,month:month1,day:day1}

	for(i=startday.year;i<=year;i++){
		//console.log(i);
		if(i == startday.year)
			j=startday.month
		else
			j = 1
		var endMonth = 12
		if(i==year)
			endMonth = month
		for(;j<=endMonth;j++){
			//console.log(j);
			var ttd = getDaysInMonth(j,i)
			//console.log(ttd+" 1/"+j+"/"+i);
			l = 1
			if(i==year && j==month1)
				l = day1
			if(i==year && j==endMonth)
				ttd = day
			for (; l <= ttd; l++) {
				var j1 = j,l1 = l
				j1 = (j1<=9)? "0"+j1:j1
				l1 = (l1<=9)? "0"+l1:l1
				//console.log(i+"/"+j1+"/"+l1);
				listResult.push(i+"/"+j1+"/"+l1)
			};
		}
	}
	return listResult;
}
function downloadDB(obj,callBack){
	var countDownload =0
	var list = getListDay(Number(obj.y),Number(obj.m),Number(obj.d))
	function eachDB(dbTime,callBack){
		for(var t in dbTime){
			console.log(t);
			console.log(dbTime[t]);
			for(var user in dbTime[t]){
				var infor = user.split(";")
				var userEmail = infor[0] 
				var device = infor[1]
				//console.log(user);
				var rows =dbTime[t][user]
				if(callBack)
					callBack(t,userEmail,device,rows)
			}
		}
	}
	function _downloadDB(index,max,callBack){
		
		get(hostDB+"/index.php?file="+list[index]+".json",(d,body)=>{
			console.log(d);
			if(d==false){
				alert('Xuất hiện lỗi trong khi đồng bộ dữ liệu, xin thử lại lúc khác.')
				return;
			}
			var dbTime = JSON.parse(body)
			//console.log(dbTime);
			eachDB(dbTime,(t,userEmail,device,rows)=>{
				console.log(t,userEmail,device,rows);
				rows.forEach(ele=>{
					//console.log(e[1][1]);
					var e = JSON.parse(ele)
					var text = e[1][1]
					var emailjs = userEmail+".js"

					countDownload++;
					console.log(countDownload);
					callBack && callBack(countDownload)
					personalCtrl.searchWordUpdate(emailjs,text,(index)=>{
						console.log(index);
						console.log(e[1]);
						if(index!=-1){
							personaldb[emailjs][index]=e[1]
						}else{
							personaldb[emailjs].push(e[1])
						}
						personalStore.set(emailjs,personaldb[emailjs])
					})
				})

			})			

			var dateupdate = list[index].replace(/\//g,'-')+" "+(new Date()).toLocaleTimeString();
			appStore.set('date-update',dateupdate)

			if(index<max-1){
				index++;
				_downloadDB(index,max,callBack)
			}
		})
	}
	console.log(list);
	if(list.length){
		index = 0;
		_downloadDB(index,list.length,callBack)
	}
}
cmdsyncdb.onclick = ()=>{
	function syncdb (callBack) {
		var data = new FormData();
		appStore.get('user').then(u=>{
			if(u==null){
				alert('Bạn chưa đăng nhập')
				return;
			}
			data.append('email', u.email);
			data.append('userid', u.userId);
			data.append('secure', u.appSecure);
			data.append('device', jscd.device);
			appStore.get('log').then(l=>{
				if(l==null||l.length==0)return;
				l.forEach(e=>{
					data.append('cmd[]', JSON.stringify(e));
				})
				post(hostDB+'/index.php', data,(ok,body)=>{
					if(ok){
						appStore.set('log',[]).then(r=>{
							updateStatus()
							callBack && callBack()
							alert('đồng bộ thành công')
						})
					}else{
						alert('Lỗi khi đồng bộ')
					}
				});
			})
			
		})
	}
	var html = `
	<button id='dialogShareWord' class="menuItemContainer twoIcon"><i class='material-icons'>a</i><i class='material-icons icon2'>cloud_upload</i><span>(0)</span></button> Chia sẽ các từ của tôi<br>
	<button id='dialogDownloadWord' class="menuItemContainer"><i class="material-icons">cloud_download</i></button> Tải về các từ của người khác đã được chia sẽ<br>
	<span id='dialogStatus'></span>
	` 
	var c = uidb.smsBox('Đồng bộ',html)
	var dialogShareWord = document.querySelector('#dialogShareWord')
	var dialogDownloadWord = document.querySelector('#dialogDownloadWord')
	var dialogStatus = document.querySelector('#dialogStatus')
	updateStatus(dialogShareWord)

	dialogShareWord.onclick = ()=>{
		syncdb(()=>{updateStatus(dialogShareWord)})
	}
	dialogDownloadWord.onclick = ()=>{
		//alert('hôm nay dữ liệu đã cập nhật '+countDownload+' từ')
		appStore.get('date-update').then(d=>{
			if(d==null){
				d='2020-12-25 05:00:00'
			}
			downloadDB(dateParse(d),(count)=>{
				dialogStatus.innerText = "Có "+count+" từ mới"
			})
		})
	}
	return;
	
	
}

cmdaddnewword.onclick = ()=>{
	var text = app.getTextSelection();

	var icheck = new RegExp(app.VI0,'g')
	if(icheck.test(text)){
		alert('Không phải là chữ Hán')
		return;
	}
	if(text.length==0)
		return;
	function updateEvent(r,ctrl,emailjs){
		
		var dialog = document.querySelector("#insertDialog")
		var dbkey2 = document.getElementById("dbkey2")
		var tukep = document.getElementById("dbtừ kép")
		var dbNewWord = dialog.querySelector("#dbNewWord")
		function builtRecodeDB(){
			var ob={}
			var keyTemplate = ['từ kép','danh từ','động từ','tính từ','trạng từ','thuật ngữ','giới từ','phó từ','số từ']
			keyTemplate.forEach(e=>{
				var ele = document.getElementById("db"+e)
				if(ele.value.trim().length!=0)
					ob[e] = ele.value.trim()
			})
			return ob
			//return JSON.stringify(ob)
		}
		if(r[0]){
			if(r[0][4]=='object'){
				//var objs = JSON.parse(r[0][3])
				var objs = r[0][3]
				for(o in objs){
					console.log(o);
					//console.log(o+":"+objs[o]);
					var c = document.getElementById("db"+o)
					if(c) c.value = objs[o]
				}
			}else{
				tukep.value = r[0][3]
			}
			dbkey2.value = r[0][7]
		}
		dbNewWord.onclick = ()=>{
			//check error
			if(tukep.value.trim().length==0){
				alert('Từ kép không được để trống')
				return;
			}
			
			if(icheck.test(dbkey2.value.trim())){
				alert('Giản/Phồn: phải là chữ Hán')
				return;
			}
			//appStore
			// key log
			//log khi thêm vào, hoặc update
			// device | type   | reocde
			// win32  | update | [id,key,len,content,type,rex,1,key2,datetime]
			// win32  | addnew | [id,key,len,content,type,rex,1,key2,datetime]
			// giờ log tại local không quan trọng
			// giờ lấy từ server
			// biến date-update được lưu trong appStore

			//SERVER
			//year/month/day.json
			//time|email|device|type|reocde
			// h:m
			//time chứa giờ với phút thôi

			personalCtrl.searchWordUpdate(emailjs,text,(index)=>{
				if(index!=-1){
					personaldb[emailjs][index][3]=builtRecodeDB()
					console.log("update "+index);
					console.log("update "+personaldb[emailjs][index]);
					logAdd('update',personaldb[emailjs][index])
				}else{
					var dateTime = dateTimeNow();

					var newRecode = [0,text,text.length,builtRecodeDB(),'object',0,1,dbkey2.value,dateTime]
					personaldb[emailjs].push(newRecode)

					logAdd('insert',newRecode)
					console.log("add new");

				}
				personalStore.set(emailjs,personaldb[emailjs])
			})
			ctrl.closer.querySelector('button').click()
		}
	}
	appStore.get('user').then(u=>{
		//武宗
		var html = `
		<div id='insertDialog'>
		<label>Từ: </label><span>{keyword}</span><br>
		<label>Email: </label><span>{email}</span><br>
						<input id="dbid" type="hidden" value="">
						<label>Giản/Phồn: </label><input id="dbkey2"><br>
						<label>từ kép: </label><input id="dbtừ kép" type="text"><br><label>danh từ: </label><input id="dbdanh từ" type="text"><br><label>động từ: </label><input id="dbđộng từ" type="text"><br><label>tính từ: </label><input id="dbtính từ" type="text"><br><label>trạng từ: </label><input id="dbtrạng từ" type="text"><br><label>thuật ngữ: </label><input id="dbthuật ngữ" type="text"><br><label>giới từ: </label><input id="dbgiới từ" type="text"><br><label>phó từ: </label><input id="dbphó từ" type="text"><br><label>số từ: </label><input id="dbsố từ" type="text"><br>
						<button id="dbNewWord">Lưu<i class="material-icons">add</i></button></div>
		<style>#insertDialog label {
		    text-transform: capitalize;
		    width: 80px;
		    display: inline-block;
		    font-size: 14px;
		}</style>
		`
		html = html.replace('{keyword}',text) 
		if(u!=null){
			html = html.replace('{email}',u.email)
			var r = personalCtrl.searchWordForm(u.email+'.js',text)

			//console.log(r);
			var ctrl = uidb.smsBox('Thêm từ mới',html)
			
			updateEvent(r,ctrl,u.email+'.js')
		}
		else
		alert('Bạn chưa đăng nhập')
	})
}
var crltSmSBox
cmdUser.onclick = ()=>{
	var html = `		
	<iframe id='myiframe' src='http://votandang.net/chu-khong/person.php?login'></iframe>
	`
	var c = uidb.smsBox('Đăng Nhập',html)
	crltSmSBox = c.closer
	myiframe = document.querySelector('#myiframe')
	myiframe.onload=(e)=>{
		myiframe.style.width="100%"
		myiframe.style.height="-webkit-fill-available"
		
		e.target.contentWindow.postMessage("initial message", "*");

	}

}
function affterLoginCreateDb(o){
	appStore.get('user').then(r=>{
			console.log('new user set');
			appStore.set('user',o).then(r=>{
				if(crltSmSBox){
					crltSmSBox.querySelector('button').onclick()
					cmdUser.querySelector('.material-icons').innerHTML='person'
				}
				console.log('set ok');
				//window.location = window.location.href.replace('person.php',"app/index.html")
			})
	})
} 
window.onmessage = (event) => {
	console.log(event.data);
  if(event.data.userId && event.data.appSecure){
	  	affterLoginCreateDb(event.data)	
  }
  if(event.data=='upload finish'){
  	// chrome.storage.sync.set({'collectSqlCommand':[]});
  	// collectSqlCommand = []
  	// cmduploaddb.disabled = true;
  }
}