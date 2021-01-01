(function(app) {
"use strict";
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

cmdsearchword.onclick = (e)=> {
	var text = app.getTextSelection()
	if(app.autoClick(e,cmdsearchword) || text.trim().length==0||/[a-zA-Z0-9]/g.test(text))
		return;
	try {
      const contents = app.getTextSelection()
      uidb.searchWord(contents)      
    } catch (ex) {
      console.error('Unable to paste', ex);
      gaEvent('Error', 'findWord', ex.name);
    }
}
		// cmdaddnewword.onclick = ()=>{
		// 	app.addNewWord()
		// }
// 		cmdselectdbtranslate.onclick = ()=>{
// //			app.sqlite.loadDirDefault((list)=>{
// //				console.log(list)
// //				app.formSelectDb(list)
// //			})
// 				//dbNewPathSelect.onclick()
// 				setTimeout(()=>{
// 					cmdaddnewword.onclick()
// 				},1)
// 				setTimeout(()=>{
// 						id('dbNewPathSelect').onclick()
// 				},100)

// 		}

function firstStr(str){
	if(typeof(str)!='string')
		return str
	var strs = str.split(/[\,\;\|]/g)
	return strs[0] 
}
cmdtranslateoffline.oncontextmenu = () =>{
	personalStore.keys().then(r=>{
		if (r==null|| r.length==0)return;

		appStore.get('list-inorder-translate').then(iT=>{
			if(iT && iT.length>=r.length)
				r = iT
			var ctrl = uidb.smsBox('Dữ liệu dịch offline',r),
			c = ctrl.closer.querySelector("div[id]"),
			divs = c.querySelectorAll('div')

			divs.forEach((e,i)=>{
				e.onclick = ()=>{
					var tmp = divs[0].innerText
					divs[0].innerText = e.innerText
					e.innerText = tmp;
					var list = []
					divs.forEach(e1=>{
						list.push(e1.innerText)
					})
					console.log(list);
					appStore.set('list-inorder-translate',list)
					app.listInorderTranslate = list
				}
			})
		})
	})
	return false;
}
cmdtranslateoffline.onclick = ()=>{
	var startPos = textArea.selectionStart;
	var text = app.getTextPreviousLine();

	var r = personalCtrl.searchWord(text)
	for (var i=0; i < r.length; i++) {
		var fstr,k = r[i][1],c=r[i][3],t=r[i][4],k2 = r[i][7]
		//4 = "object"
		if(t=="object"){
			try{

				c = JSON.parse(c)
				fstr = firstStr(c['từ kép'])
				text = text.replace(new RegExp(k,'g'),fstr+" ")
				if(k2.trim().length!=0)
					text = text.replace(new RegExp(k2,'g'),fstr+" ")
			}catch(e){
				//console.log(c);
				fstr = firstStr(c['từ kép'])
				text = text.replace(new RegExp(k,'g'),fstr+" ")
				if(k2.trim().length!=0)
					text = text.replace(new RegExp(k2,'g'),fstr+" ")
			}
		}else{
			fstr = firstStr(c)
			text = text.replace(new RegExp(k,'g'),firstStr(c)+" ")
			if(k2 && k2.trim().length!=0)
				text = text.replace(new RegExp(k2,'g'),fstr+" ")
		}
	};
	var contents = text
	app.insertIntoDoc(contents)
	var newPos = startPos + contents.length;
	textArea.selectionStart = newPos;
	textArea.selectionEnd = newPos;
	textArea.focus();
}
cmdgtranslate.onclick = ()=> { 
}

})(app);