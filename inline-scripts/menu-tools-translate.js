
function allowDrop(ev) {
  ev.preventDefault();
}
var eleDragid = null
var eleDropid = null
function drag(ev) {
  eleDragid = ev.target.parentNode.id
 	eleDropid = ev.target.parentNode.parentNode.id
}

function drop(ev) {
  ev.preventDefault();
	if (ev.target.className == "droptarget" ) {
      var data = ev.dataTransfer.getData("text"),
		  parenDrop = document.getElementById(eleDropid)
		  ev.target.style.background = "none";
	}

}
function dragEnter(ev) {
	var currenEle = ev.target
  if ( ev.target.className == "droptarget" && eleDropid!=null) {
    ev.target.style.background = "burlywood";
  	eleDrop = document.getElementById(eleDropid)
  	if(eleDrop && eleDrop.id!="idshowlist"){
		  currenEle.appendChild(eleDrop.children[0]);
		  eleDrop.appendChild(currenEle.children[0])
  	}
  }
}

function dragLeave(ev) {
  if ( ev.target.className == "droptarget" && eleDragid!=null ) {
    ev.target.style.background = "none";
    eleDropid = ev.target.id
  }
}

Date.prototype.diffSeconds = function (date) {return Math.abs(this.getTime() - date.getTime())/1000;};
// Array.prototype.delete = function(key){
// 	var i = typeof(key)=='function'? this.findIndex(key):this.indexOf(key)
// 	return this.splice(i,1)
// }

(function(app) {
"use strict";
var {log} = console;
const textArea = document.getElementById('textEditor');


var lastSelect = ''
// var autoFindWord = true
app.indexCmdSelect = 0;
textArea.onmouseup = ()=>{
	var text = app.getTextSelection()
	// if(!/[a-zA-Z0-9]/g.test(text) && app.autoFindWord && text.length && lastSelect!=text){
	// 	cmdsearchword.onclick()
	// 	//console.log(text);
	// }
	
	app.indexCmdSelect = 0;

	if(app.autoCMD!=null && text.length && lastSelect!=text)
	window[app.autoCMD].onclick()
	
}

cmdsearchword.onclick = async(e)=> {
	var text = app.getTextSelection()
	if(app.autoClick(e,cmdsearchword) || text.trim().length==0||/[a-zA-Zà-ỹÀ-Ỹ0-9]/g.test(text))
		return;
	try {
      const contents = app.getTextSelection()
      uidb.searchWord(contents) 
      //app.queryDB(contents)     
    } catch (ex) {
      console.error('Unable to paste', ex);
      gaEvent('Error', 'findWord', ex.name);
    }
}


app.dragEndListDics = (data)=>{
	//log(data)
	var doc = document.getElementById("idshowlist"),
	texts = doc.querySelectorAll("span.text"),
	list = []
	texts.forEach(e=>{list.push(e.innerText)})
	log(list)
	appStore.set('list-dics',list)
}
cmdsearchword.oncontextmenu = () =>{
		appStore.get('list-dics').then(iT=>{
			var r 
			if(iT==null){
				r = listDBName.map((v,k,s)=>{return v.name})
			}
			if(iT)
				r = iT
			var html = '',line = `<div id="tdb-drop-{id}" class = "droptarget" ondragenter="dragEnter(event)" ondragleave="dragLeave(event)" ondrop="drop(event)" ondragover="allowDrop(event)"><div id="tdb-drag-{id}"><span draggable="true"  ondragstart="drag(event)" ondragend="app.dragEndListDics(event)" class='cmd'> ↕ :: </span><span class='text'>{name}</span></div></div>`
			r.forEach((e,i)=>{
				html+=line.replace("{name}",e).replace(/\{id\}/g,i)
			})
			var ctrl = uidb.smsBox('Danh sách từ điển',html),
			c = ctrl.closer.querySelector("div[id]"),
			divs = c.querySelectorAll('span.cmd')
			log(divs)
			divs.forEach((e,i)=>{
				var self = e
				e.onclick = ()=>{
					log(self)
				}
			})
		})
	return false;
}

function firstStr(str){
	if(typeof(str)!='string')
		return str
	var strs = str.split(/[\,\;\|]/g)
	return strs[0] 
}
app.dragEndlistInorderTranslate = (ev)=>{
	var doc = document.getElementById("idshowlist"),
	texts = doc.querySelectorAll("span.rootText"),
	list = []
	texts.forEach(e=>{list.push(e.innerText)})
	log(list)
	appStore.set('list-inorder-translate',list)
	app.listInorderTranslate = list
}
cmdtranslateoffline.oncontextmenu = () =>{
	(async function() {

		var r = await personalStore.keys()
		if (r==null|| r.length==0) return;

		var iT = await appStore.get('list-inorder-translate')

		if(iT && iT.length>=r.length)
			r = iT

	//await personalStore.get(e)
		var html = '',line = `<div id="tdb-drop-{id}" class = "droptarget" ondragenter="dragEnter(event)" ondragleave="dragLeave(event)" ondrop="drop(event)" ondragover="allowDrop(event)"><div id="tdb-drag-{id}"><span draggable="true"  ondragstart="drag(event)" ondragend="app.dragEndlistInorderTranslate(event)" class='cmd'> ↕ :: </span><span class='text'>{name}</span> <span class='rootText'>{rootName}</span><span class='count'> ({count})</span></div></div>`
		r.forEach((e,i)=>{
			var v = personaldb[e].length 
			var c =  e.split("@")
			html+=line.replace("{name}",c[0]).replace("{rootName}",e).replace("{count}",v).replace(/\{id\}/g,i)
		})

		var ctrl = uidb.smsBox('Dữ liệu dịch offline',html),
		c = ctrl.closer.querySelector("div[id]"),
		divs = c.querySelectorAll('div')
	})({});
	return false;
}
cmdtranslateoffline.onclick = ()=>{
	var startPos = textArea.selectionStart;
	var text = app.getTextPreviousLine();

	var r = personalCtrl.translate(text)
	log(r.time)
	cmdReport.classList.toggle('hidden',false)
	app.logDetail = r.logDetail
	text = r.text
	var contents = text
	app.insertIntoDoc(contents)
	var newPos = startPos + contents.length;
	textArea.selectionStart = newPos;
	textArea.selectionEnd = newPos;
	textArea.focus();
}
cmdgtranslate.onclick = ()=> { 
	var txt = app.getTextSelection()
	var text = app.getTextPreviousLine();
	myFrame.contentWindow.postMessage(text)
}

cmdReport.onclick = ()=>{
		var 
		html = app.logDetail.map((v)=>{return [v[0],v[1]]}),
		ctrl = uidb.showWord('Từ đã tra',html)
}

//ok
})(app);

window.addEventListener("message", (event) => {
	var {data} = event
	if(data && data.key == "google-translate"){
		app.insertIntoDoc(data.text)
	}
}, false);