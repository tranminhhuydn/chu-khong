var hostDB = '//votandang.net/chu-khong';
//var hostDB = 'http://localhost/cakephp-4-0-4/chu-khong';
//import(hostDB+"/person.php?get-list-user")

Array.prototype.delete = function(key){
	var i = typeof(key)=='function'? this.findIndex(key):this.indexOf(key)
	return this.splice(i,1)
}
Array.prototype.clone = function(){
  return this.map(e => Array.isArray(e) ? e.clone() : e);
};
Array.prototype.unique = function(){
	return this.filter((v, i, s) =>{
	  var findIndex = (e) => e[0] == v[0];
	  return s.findIndex(findIndex) === i;
	})
}

var 
personaldb = {},
{d} = app
var personalCtrl = (function (exports) {
 	'use strict';

	var 
	{log} = console,
	host = hostDB+"/personal/",
	translate = (srcText)=>{
		var
		escapes = /[0-9a-zA-Zà-ỹÀ-Ỹ，。\/；【】=-~！@#￥%……&*（）——+{}‘’“”：？》《、]/g,
		timeTranslate  = new Date(), logDetail = [], count = 0, 
		srcString = srcText.replace(escapes,''), // string to length
		countStr = srcString.length,
		preparePersonList = ()=>{ var i,c = []; for (i in personaldb) c.push(i);return c;},
		personTranslate = (db)=>{
			var c, done = false,
			text = srcText,
			replacer = (match,point,offset,string)=>{
				//log(match+" "+c[0])
				count += match.length
				if(!/\d/g.test(match))
				logDetail.push([match,c[0],match.length])

				if(count>=countStr)
					done = true
				return c[0]+" "
			}
			db.sort((a,b)=>{return b[2]-a[2]})
			for(var i =0;i<db.length;i++){
				// cu va moi
				// 1 la 0 ->key1
				// 2 la 1 ->length
				// 3 la 2 ->mean
				// 7 la 5 ->key2
				var v = db[i],
				key1 = v[0],
				length = v[1],
				mean = v[2],
				key2 = v[5]

				if(done) break;

				if(mean['từ kép']){ //object
					c = mean['từ kép'].split(/[\,\;\|]/g)
				}else if(mean.split && mean.indexOf('từ kép')!=-1){//string
					var row = JSON.parse(mean)
					c = row['từ kép'].split(/[\,\;\|]/g)
				}else{
					c = mean.split(/[\,\;\|]/g)
				}
				var
				keys = key1
				if(key2 && key2.trim && key2.trim().length!=0){
					keys += "|"+key2
				}
				text = text.replace(new RegExp(keys,'g'),replacer)
			}
		},
		it = app.listInorderTranslate.length != 0? app.listInorderTranslate: preparePersonList()
		for (var j = 0; j < it.length; j++) {
			var e = it[j],
			db = personaldb[e]
			//if(done) break;
			personTranslate(db)
		}
		var 
		text = srcText
		logDetail = logDetail.filter(unique)
		logDetail.sort((a,b)=>{return b[2]-a[2]})
		//logDetail [key,nghia,length]
		logDetail.forEach((v)=>{
			text = text.replace(new RegExp(v[0],'g'),v[1]+' ')
		})
		text = text.trim()
		return {text:text,logDetail:logDetail,count:count,length:countStr,time:timeTranslate.diffSeconds(new Date())};//
	},
	unique = (v, i, s) =>{
	  var findIndex = (e) => e[0] == v[0];
	  return s.findIndex(findIndex) === i;
	}
	function filterWord(words,update) {
		var word,
		r = [], 
		preparePersonList = ()=>{ var i,c = []; for (i in personaldb) c.push(i);return c;},
		fnFilter = () => {
		 	var i, it = app.listInorderTranslate.length!=0?app.listInorderTranslate:preparePersonList()
		 		for (i = 0; i < it.length; i++) {
		 			var e = it[i],
		 			ele = personaldb[e],
		 			r1 = ele.filter((v) => { return v[1]==word||v[7]==word })
			 		r = r.concat(r1)
		 		}
		}
		if(Array.isArray(words)){
			words.forEach(ele1=>{
				word = ele1
				fnFilter()
			})
	 	}else{
	 		word = words
			fnFilter()
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

	function searchWordForm (email,word){
		var r = [],
 		ele = personaldb[email]
 		if(ele)
 			r = r.concat(ele.filter((i)=>{return i[0]==word||i[5]==word}))
 		else
 			alert(email+' không tồn tại')
		return r;	
	 }
	function searchWordUpdate (email,word,callback){
		var logIndex = -1;
 		var person = personaldb[email]
 		if(person)
 			person.filter((v,i) =>{logIndex = i; return v[0]==word||v[5]==word})
 		else
 			alert(email+' không tồn tại')

	 	if(callback)
	 		callback(logIndex)
	 }
	var countLoadScript = 0;
	function checkLoadScript(event){
	 	var s = event.path[0].src.split("/")
	 	var name = s[s.length-1]

	 	//add new
	 	personalStore.get(name).then(r=>{
			if(r==null){
				console.log("New user: "+name);
				personalStore.set(name,personaldb[name])
				countLoadScript++;
			}
		})

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
	 function reloadDB(){
	 	personaldb = []
	 	//personalStore.clear()
	 	//addScript(listScriptPersonal)
	 }
	function loadScript(){
		//load offline
	 	if(listScriptPersonal.length==0){
	 		console.log('load offline');
	 		personalStore.keys().then(r=>{
	 			if(r!=null){
	 				listScriptPersonal = r
	 			}
	 		})
	 	}
	 	// chỉ load những user mới
	 	listScriptPersonal.forEach((emailUser,i)=>{
	 			//console.log(emailUser);
	 			personalStore.get(emailUser).then(r=>{
	 				if(r==null){
	 					if(emailUser!='tranminhhuydn@gmail.com.js')
	 					_addScript(emailUser)
	 				}else{
	 					personaldb[emailUser] = r
	 					countLoadScript++;
	 				}
	 			})
	 	})
	}

	 exports.searchWordForm = searchWordForm;
	 exports.searchWordUpdate = searchWordUpdate;
	 exports.reloadDB = reloadDB;
	 exports.loadScript = loadScript;
	 exports.translate = translate;

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
function getPromise (url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

function updateStatus(obj){
	obj = obj||cmdUser //cmdsyncdb
	appStore.get('log').then(r=>{
		log = r==null?[]:r;
		var status = obj.querySelector('span')
		status.innerHTML = "("+log.length+")"
		status.style.color=log.length==0?'':'#ffc107';
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
				listResult.push(i+"/"+j1+"/"+l1+".json")
			};
		}
	}
	return listResult;
}
function downloadDB(obj,callBack){
	dialogPersendShareWord.parentElement.classList.remove('hidden')

	var 
	countDownload =0,
	persend = 0,
	listSrc = getListDay(Number(obj.y),Number(obj.m),Number(obj.d)),
	list = [],
	eachDB = (dbTime,callBack)=>{
		for(var t in dbTime){
			//console.log(t);
			//console.log(dbTime[t]);
			for(var user in dbTime[t]){
				var infor = user.split(";"),
				userEmail = infor[0],
				device = infor[1],
				rows = dbTime[t][user]
				if(callBack)
					callBack(t,userEmail,device,rows)
			}
		}
	},
	_downloadDB = (index,max,callBack) => {	
		get(hostDB+"/index.php?file="+list[index],(d,body)=>{
			//console.log(d);
			if(d==false){
				alert('Xuất hiện lỗi trong khi đồng bộ dữ liệu, xin thử lại lúc khác.')
				return;
			}
			//show persend loadder
			persend = ((index+1)*100/max)
			
			dialogPersendShareWord.style.width = persend+"%"
			if(persend==100)
				setTimeout(()=>{dialogPersendShareWord.parentElement.classList.add('hidden')}, 1500);

			var dbTime = JSON.parse(body)
			//console.log(dbTime);
			eachDB(dbTime,(t,userEmail,device,rows)=>{
				console.log(t,userEmail,device,rows);
				rows.forEach(ele=>{
					//console.log(e[1][1]);
					var e = JSON.parse(ele),
					text = e[1][0],
					emailjs = userEmail+".js"

					countDownload++;

					callBack && callBack(countDownload)

					var person = personaldb[emailjs],
					r = person.findIndex((v,k,s)=>{return v[0]==text||v[5]==text})
					console.log(text)
					console.log(r)
					if(r.length == 0){ //add new
						personaldb[emailjs].push(e[1])
					}else{ //update
						personaldb[emailjs][index]=e[1]
					}
					personalStore.set(emailjs,personaldb[emailjs])
				})
			})			

			var dateupdate = list[index].replace(/\//g,'-').replace('.json','')+" "+(new Date()).toLocaleTimeString();
			appStore.set('date-update',dateupdate)
			if(index<max-1){
				index++;
				_downloadDB(index,max,callBack)
			}
		})
	}
	//console.log(list);
	getPromise(hostDB+"/index.php?getListUpdate")
	.then(body=>{
    var length, listJson = JSON.parse(body);
		list = listSrc.filter((v,k,f)=>{return listJson.indexOf(v)!=-1 })
		length = list.length
		if(length){
			index = 0;
			_downloadDB(index,length,callBack)
		}
	})
	.catch(e=>{
		alert(e)
	});
}

var dialogShareWord, dialogDownloadWord, dialogStatus, dialogPersendShareWord,
crltSmSBox,
updateEventSyncdb = (dialog)=>{
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
							//console.log(ok);
							//console.log(body);
							alert('Lỗi khi đồng bộ\nThử đăng nhập lại ')
						}
					});
				})
				
			})
		}
	dialogShareWord = d.querySelector('#dialogShareWord')
	dialogDownloadWord = d.querySelector('#dialogDownloadWord')
	dialogStatus = d.querySelector('#dialogStatus')
	dialogPersendShareWord = d.querySelector('#dialogPersendShareWord .myBar')
	updateStatus(dialogShareWord)

	dialogShareWord.onclick = ()=>{
		syncdb(()=>{updateStatus(dialogShareWord)})
	}
	dialogDownloadWord.onclick = ()=>{
		//alert('hôm nay dữ liệu đã cập nhật '+countDownload+' từ')
		appStore.get('date-update').then(d=>{
			if(d==null){
				d='2021-9-12 00:00:00'
				//d='2020-12-25 05:00:00'
				//d='2021-08-01 05:00:00'
			}
			downloadDB(dateParse(d),(count)=>{
				dialogStatus.innerText = "Có "+count+" từ mới"
			})
		})
	}
	var cmdShowMyDicts = document.querySelector('#cmdShowMyDicts')
	cmdShowMyDicts.onclick = ()=>{
		
		var html = ""
		var tuLoai = ''
		appStore.get("user").then(user=>{
			if(user && user.email){
				// console.log(user)
				// console.log(user.email)
				var dic = personaldb[user.email+".js"]
				dic.forEach(i=>{
					var nghia = i[2], kytu= i[0]
					kytu =(i[5]!=null|| (i[5]&&i[5].length!=0))?i[0]+"/"+i[5]:i[0];
					tuLoai = "Từ loại: "+i[3]
				  if(i[3]=="object"){
				  	tuLoai =''
				  	try{
					  	var obj = JSON.parse(i[2])
					  	nghia ='';
					  	for (var o  in obj){
					  		if(obj[o].trim().length!=0)
					  		nghia +=o +': '+obj[o]+"<br>"
					  	}
						}catch(e){
							if(typeof(i[2])==="object"){
								var obj = i[2]
					  		nghia ='';
					  		for (var o  in obj){
						  		if(obj[o].trim().length!=0)
						  		nghia +=o +': '+obj[o]+"<br>"
						  	}
					  	}
						}
				  }

					html +="<div><h3>"+kytu+"</h3>"+tuLoai+"<br>"+nghia+"</div>"
				})
				uidb.dialogTraBo("tự điển của tôi",html)
			}
		})
		dialog.closer.click()
	}
	
},
affterLoginCreateDb =(o) =>{
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
cmdaddnewword.addEventListener("click", ()=>{
	var 
	{d} = app,
	text = app.getTextSelection();

	var icheck = new RegExp(app.VI0,'g')
	if(icheck.test(text)){
		alert('Không phải là chữ Hán')
		return;
	}
	if(text.length==0)
		return;
	function updateEvent(srcdb,ctrl,emailjs){
		
		var 
		r = srcdb.clone()
		cmdgianthe2 = d.querySelector("#cmdgianthe2"),
		cmdphienam2 = d.querySelector("#cmdphienam2"),
		cmdphienam3 = d.querySelector("#cmdphienam3"),
		dialog = d.querySelector("#insertDialog"),
		dbkey2 = d.id("dbkey2"),
		tukep = d.id("dbtừ kép"),
		dbNewWord = dialog.querySelector("#dbNewWord"),
		fillRecode = (i)=>{
			var objs = JSON.parse(i[2])
	  	for (var o in objs){
	  		var c = d.id("db"+o)
				if(c) c.value = objs[o]
	  	}
		},
		builtRecodeDB = () => {
			var ob={}
			var keyTemplate = ['từ kép','danh từ','động từ','tính từ','trạng từ','thuật ngữ','giới từ','phó từ','số từ']
			keyTemplate.forEach(e=>{
				var ele = d.id("db"+e)
				if(ele.value.trim().length!=0)
					ob[e] = ele.value.trim()
			})
			ob=JSON.stringify(ob)
			console.log(ob);
			return ob
		}
		if(r[0]){
			if(r[0][3]=='object'){
				var i = r[0]
				try{
			  	fillRecode(i)
				}catch(e){
					if(typeof(i[2])==="object"){
				  	i[2] ='';
				  	fillRecode(i)
			  		}
				}
			}else{
				tukep.value = r[0][2]
				r[0][3] = 'object'
			}
			dbkey2.value = r[0][5]
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
			// win32  | update | [key,len,content,type,1,key2]
			// win32  | addnew | [key,len,content,type,1,key2]
			// giờ log tại local không quan trọng
			// giờ lấy từ server
			// biến date-update được lưu trong appStore

			//SERVER
			//year/month/day.json
			//time|email|device|type|reocde
			// h:m
			//time chứa giờ với phút thôi

				var person = personaldb[emailjs],
				index = person.findIndex((v,k,s)=>{return v[0]==text||v[5]==text})
				if(index==-1){//addnew
					var newRecode = [text,text.length,builtRecodeDB(),'object',1,dbkey2.value]
					personaldb[emailjs].push(newRecode)

					logAdd('insert',newRecode)
					console.log("add new");
				}else{
					personaldb[emailjs][index][0]=text
					personaldb[emailjs][index][1]=text.length
					personaldb[emailjs][index][2]=builtRecodeDB()
					personaldb[emailjs][index][3]='object'
					personaldb[emailjs][index][4]=1
					personaldb[emailjs][index][5]=dbkey2.value
					console.log("update "+index);
					console.log("update "+personaldb[emailjs][index]);
					logAdd('update',personaldb[emailjs][index])
				}
				personalStore.set(emailjs,personaldb[emailjs])
			ctrl.closer.querySelector('button').click()
		}
		cmdgianthe2.onclick = ()=>{
			dbkey2.value = app.fnGianHayPhon(text);
		}
		cmdphienam2.onclick=()=>{
			app.fnPhienAm(text,(r)=>{				
				document.getElementById("dbtừ kép").value = r
			})
		}
		cmdphienam3.onclick=()=>{
			app.fnPhienAm(text,(r)=>{
				r = app.titleCase(r)
				document.getElementById("dbdanh từ").value = r
			})
		}
	}
	appStore.get('user')
	.then(u=>{
		//武宗
		var html = `
		<div id='insertDialog'>
						<button id="dbNewWord" style="float:right">Lưu<i class="material-icons">add</i></button><br>
						<label>Từ: </label><span>{keyword}</span><br>
						<label>User: </label><span>{email}</span><br>
						<input id="dbid" type="hidden" value="">
						<label>Giản/Phồn: </label><input id="dbkey2"><button title="Giản thể/Phồn thể" id="cmdgianthe2" class="menuTop twoIcon" aria-expanded="false"><i class="material-icons">keyboard</i></button><br>
						<label>từ kép: </label><input id="dbtừ kép" type="text"><button title="Phiên Âm" id="cmdphienam2" class="menuTop" aria-expanded="false"><i class="material-icons">record_voice_over</i></button><br>
						<label>danh từ: </label><input id="dbdanh từ" type="text"><button title="Phiên Âm" id="cmdphienam3" class="menuTop" aria-expanded="false"><i class="material-icons">record_voice_over</i></button><br>
						<label>động từ: </label><input id="dbđộng từ" type="text"><br>
						<label>tính từ: </label><input id="dbtính từ" type="text"><br>
						<label>trạng từ: </label><input id="dbtrạng từ" type="text"><br>
						<label>thuật ngữ: </label><input id="dbthuật ngữ" type="text"><br>
						<label>giới từ: </label><input id="dbgiới từ" type="text"><br>
						<label>phó từ: </label><input id="dbphó từ" type="text"><br>
						<label>số từ: </label><input id="dbsố từ" type="text"><br>
		</div>
		<style>#insertDialog label {
		    text-transform: capitalize;
		    width: 80px;
		    display: inline-block;
		    font-size: 14px;
		}</style>
		`
		html = html.replace('{keyword}',text) 
		if(u!=null){
			var userName = u.email.split('@')
			html = html.replace('{email}',userName[0])
			var r = personalCtrl.searchWordForm(u.email+'.js',text)

			//console.log(r);
			var ctrl = uidb.smsBox('Thêm từ mới',html)
			
			updateEvent(r,ctrl,u.email+'.js')
		}
		else
		alert('Bạn chưa đăng nhập')
	})
})
cmdUser.onclick = ()=>{
	appStore.get('user').then(r=>{
		var html = `		
		<iframe id='myiframe' src='`+hostDB+`/person.php?login'></iframe>
		`
		if(r!=null){
			html = `Chào: `+r.email
			html +=`<br>
							<button id='cmdLogOut' class="menuItemContainer"><i class='material-icons'>exit_to_app</i> Đăng Xuất</button><br>
							<button id='cmdShowMyDicts' class="menuItemContainer"><i class='material-icons'>assignment_turned_in</i>Duyệt Tự điển của tôi</button><br>
							<button id='dialogShareWord' class="menuItemContainer twoIcon"><i class='material-icons'>cloud_upload</i><span>(0)</span> Chia sẽ các từ của tôi </button><br>
							<button id='dialogDownloadWord' class="menuItemContainer"><i class="material-icons">cloud_download</i> Cập nhật từ mới </button><br>
							<div id='dialogPersendShareWord' class="myProgress hidden"><div class="myBar"></div></div>
							<span id='dialogStatus'></span>`
		}
		
		var c = uidb.smsBox('Đăng Nhập',html)

		if(r!=null){
			updateEventSyncdb(c)
			
		}

		crltSmSBox = c.closer
		myiframe = document.querySelector('#myiframe')
		if(myiframe)
			myiframe.onload=(e)=>{
				myiframe.style.width="100%"
				myiframe.style.height="-webkit-fill-available"
				
				e.target.contentWindow.postMessage("initial message", "*");

			}
	})
}
window.onmessage = (event) => {
	//console.log(event.data);
  if(event.data.userId && event.data.appSecure){
	  	affterLoginCreateDb(event.data)	
  }
  if(event.data=='upload finish'){
  	// chrome.storage.sync.set({'collectSqlCommand':[]});
  	// collectSqlCommand = []
  	// cmduploaddb.disabled = true;
  }
}
