(function(app) {
"use strict";

var elekey = ''
var collectKey = []
function vietToHan(el,i,o){
	if(el[1].indexOf(elekey)!=-1)
		collectKey.push(el[0])
	if(i==o.length-1)
		return;
}
function hanToViet(el){
	if(el[0]==elekey){
		collectKey = el[1].split(',')
		return;
	}
	return;
}
function vietToNom(el){
	if(el[0].indexOf(elekey)!=-1){
		collectKey = el[1].split(',')
		return;
	}
}

function updateEventObj(e,obj){
	e.eventMove = false;
	e.onclick = ()=>{
		if(e.eventMove == true)
			return;
		app.textArea.focus()
		app.insertIntoDoc(e.innerHTML)
		obj.setIgnoreFocusOut(false)
		obj.closer.click()
	}
	e.ontouchend = e.onclick
	e.ontouchmove = ()=>{
		e.eventMove = true;
	}
}
		//---------------
		//keyboard
		//---------------
		cmdhanviet.onclick = (e)=> {
			elekey = app.getTextSelection()
			if(app.autoClick(e,cmdhanviet)||elekey.length==0)
			 	return;
			collectKey = []

			elekey = elekey.toLowerCase().trim()
			//console.log(elekey)
			var d = hanviet.data
			d.find(vietToHan)
			//console.log(collectKey)
			var obj = uidb.smsBox('Hán Việt',collectKey)
			var eles = obj.closer.querySelectorAll('div');
			if(!eles)
				return;
			//console.log(eles)
			eles.forEach((e,i)=>{
				if(i==0)
					return;
				updateEventObj(e,obj)
				// e.onclick = ()=>{
				// 	app.textArea.focus()
				// 	app.insertIntoDoc(e.innerHTML)
				// 	obj.setIgnoreFocusOut(false)
				// 	obj.closer.click()
				// }
				// e.ontouchend = e.onclick
			})
		}
		cmdhannom.onclick = (e)=> { 
			collectKey = []
			elekey = app.getTextSelection()
			if(app.autoClick(e,cmdhannom)||elekey.length==0)
			 	return;

			elekey = elekey.toLowerCase().trim()
			//console.log(elekey)
			var d = hannom.data
			d.find(vietToNom)
			//console.log(collectKey)
			var obj = uidb.smsBox('Hán Việt',collectKey)
			var eles = obj.closer.querySelectorAll('div');
			if(!eles)
				return;
			//console.log(eles)
			eles.forEach((e,i)=>{
				if(i==0)
					return;
				updateEventObj(e,obj)
				
			})
		}
		cmdphienam.onclick = ()=> { 
			var text = app.getTextSelection(),
			r = text,
			d = hanviet.data
			for (var i=0; i < text.length; i++) {
				elekey = text[i]
				//console.log(elekey)
				collectKey = []
				d.find(hanToViet)
				if(collectKey[0])
					r = r.replace(elekey,collectKey[0].trim()+" ")
				
			};
			var 
			start = app.textArea.selectionStart,
			end = start +r.length

			app.insertIntoDoc(r)
			app.select(start,end)
		}
		app.fnPhonToGian = (text) =>{
			var d,re,r = text;
			d = gianphonthe.data;
			for (var i=0; i < text.length; i++) {
				elekey = text[i]
				re = null
				d.find((ele)=>{
					if(ele[1]==elekey){
						re = ele[0];
						return;
					}
					return;
				})
				if(re)
					r = r.replace(elekey,re)
				
			};
			return r;
		}
		cmdgianthe.onclick = ()=> { //phon sang gian
			var text = app.getTextSelection(),
			r = text;
			r = app.fnPhonToGian(r);
			app.insertIntoDoc(r)
			//session.replaceSelectAndSelectAgain(r);			
		}
		app.fnGianToPhon = (text)=>{
			var re,
			r = text,
			d = gianphonthe.data
			for (var i=0; i < text.length; i++) {
				elekey = text[i]
				re = null
				d.find((ele)=>{
					if(ele[0]==elekey){
						re = ele[1];
						return;
					}
					return;
				})
				if(re)
					r = r.replace(elekey,re)
				
			};
			return r;
		}
		cmdphonthe.onclick = ()=> { // gian sang phon
			var text = app.getTextSelection()
			var r = app.fnGianToPhon(text);
			app.insertIntoDoc(r)
			//session.replaceSelectAndSelectAgain(r);
		}

})(app);