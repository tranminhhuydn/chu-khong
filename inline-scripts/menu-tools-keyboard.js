(function(app) {
"use strict";
var {log} = console,
elekey = '',
VINUM = /[^a-zA-Zà-ỹÀ-Ỹ0-9]/g,
collectKey = [],
{d} = app //document
app.fnVietToHan = (key)=>{
	var 
	find = (v,k,s)=>{var ds = v[1].split(/[\,\;\s]/g);return ds.indexOf(key)!=-1},
	d = hanviet.data,
	r = d.filter(find).map((v,k,s)=>{return v[0]})
	return r
}
app.fnPhienAm = (text,callBack) =>{
	var
	r = text,
	d = hanviet.data
	for (var i=0; i < text.length; i++) {
		elekey = text[i]
		//console.log(elekey)
		collectKey = []

		var hanToViet = (v,k,s)=>{
			if(v[0]==elekey){
				collectKey = v[1].split(',')
				return;
			}
			return;
		}
		d.find(hanToViet)
		if(collectKey[0])
			r = r.replace(elekey,collectKey[0].trim()+" ").trim()
		
	};
	callBack && callBack(r)
}
app.fnVietToNom = (key)=>{
	var 
	find = (v,k,s)=>{ return v[0].trim() == key.trim()},
	d = hannom.data,
	r = d.filter(find)
    var ds =  []
    if(r[0])
    	ds = r[0][1].split(',');
	return ds;
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
			if(app.autoClick(e,cmdhanviet)||elekey.length==0||VINUM.test(elekey))
			 	return;
			collectKey = []

			elekey = elekey.toLowerCase().trim()
			collectKey = app.fnVietToHan(elekey)

			var html = '', htmlLine = `<span><a href="#" style="text-decoration: none;">{key}</a> <span>`
			collectKey.forEach(e=>{html+=htmlLine.replace("{key}",e)})
			var obj = uidb.smsBox('Hán Việt',html)
			var eles = obj.closer.querySelectorAll('a');
			
			// var obj = uidb.smsBox('Hán Việt',collectKey)
			// var eles = obj.closer.querySelectorAll('div');
			if(!eles)
				return;
			//console.log(eles)
			eles.forEach((e,i)=>{
				// if(i==0)
				// 	return;
				updateEventObj(e,obj)
			})
		}
		cmdhannom.onclick = (e)=> { 
			collectKey = []
			elekey = app.getTextSelection()

			if(app.autoClick(e,cmdhannom) || elekey.trim().length==0||VINUM.test(elekey))
				return;


			elekey = elekey.toLowerCase().trim()
			collectKey = app.fnVietToNom(elekey)

			//console.log(collectKey)
			var html = '', htmlLine = `<span><a href="#" style="text-decoration: none;">{key}</a> <span>`
			collectKey.forEach(e=>{html+=htmlLine.replace("{key}",e)})
			var obj = uidb.smsBox('Hán Việt',html)
			var eles = obj.closer.querySelectorAll('a');
			if(!eles)
				return;
			//console.log(eles)
			eles.forEach((e,i)=>{
				// if(i==0)
				// 	return;
				updateEventObj(e,obj)
				
			})
		}
		
		cmdphienam.onclick = ()=> { 
			var text = app.getTextSelection()
			if(text.length==0){
				text = app.getTextPreviousLine();
			}
			app.fnPhienAm(text,(r)=>{
				var 
				start = app.textArea.selectionStart,
				end = start +r.length

				app.insertIntoDoc(r)
				app.select(start,end)
				cmdspellcheck.click()
			})
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
		cmdgianthe.addEventListener('click',()=> { //phon sang gian
			var text = app.getTextSelection(),
			r = text;
			r = app.fnPhonToGian(r);
			app.insertIntoDoc(r)
			//session.replaceSelectAndSelectAgain(r);			
		})
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
		app.fnGianHayPhon = (text)=>{
			var r1= app.fnGianToPhon(text),
			r2 = app.fnPhonToGian(text)
			r1 = (r1==text)?(r2==r1?'':r2):r1
			return r1;
		}
		app.fnMultiGianHayPhon = (arr) =>{
			var r = []
			arr.forEach(e=>{
				var i = app.fnGianHayPhon(e)
				if(i.length!=0) r.push(i)
			})
			return r;
		}
		app.insertChar = (ev)=>{
			// console.log(ev.target)
			// alert(ev.target.innerText)
			app.dialog.closer.click()
			app.textArea.focus()
			app.insertIntoDoc(ev.target.innerText)
		}
		app.trabo = (boso)=>{
			var
			html = ``,
			conTraBo = d.querySelector("div.conTraBo"),
			trabo = d.querySelector("div.trabo")
			trabo.classList.toggle("hidden")
			conTraBo.innerHTML = '';
			for(var ee in app.boFull[boso]){
				setTimeout((e)=>{
					var 
					group = d.create('span',{'class':'num'})
					group.innerHTML = e 
					conTraBo.append(group)
					app.boFull[boso][e].forEach(c=>{
							//html+=lineHtml.replace("{kytu}",c)
							var
							a = d.create('a',{'href':'#','onclick':'app.insertChar(event)'})
							a.innerHTML = c
							conTraBo.append(a)
					})
				}, 1,ee);
			}
			return false;
		}
		cmdTraBo.onclick=()=>{
			var html = `<div class="trabo"></div><a href="#" onclick="document.querySelector('div.trabo').classList.toggle('hidden')">↩</a><hr><div class="conTraBo"></div>`
			app.dialog =  uidb.dialogTraBo("Tra Bộ Unicode 6.1.0 Radical-Stroke Index",html)
			var trabo = d.querySelector("div.trabo")
			for(var ee in app.boFull.bo){
				setTimeout((e)=>{
					var
					group = d.create('span',{'class':'num','id':'bo'+e})
					group.innerHTML = e
					trabo.append(group)
					app.boFull.bo[e].forEach(c=>{
						var cs = c.split(/\t|\s/g)
						// 0:kytu 1:bo so 2:title 3:sotrang
						if(cs.length==4||cs.length>4){
							if(cs.length>4)
								cs[2] = cs[2]+" "+cs[3]
							var ele = d.create('a',{'href':"#",'title':cs[2],'onclick':"app.trabo("+cs[1]+")"})
							ele.innerHTML = cs[0]
							trabo.append(ele)
						}else{
							var ele = d.create('span',{'class':"similar"})
							ele.innerHTML = c
							trabo.append(ele)
						}
					})

				}, 1,ee);
			}
		}
})(app);