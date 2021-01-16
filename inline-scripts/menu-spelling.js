(function(app) {
"use strict";
 app.VI0 = "[a-zA-Z\u00e1\u00e0\u00e3\u1ea3\u1ea1\u0103\u1eaf\u1eb1\u1eb5\u1eb3\u1eb7\u00e2\u1ea5\u1ea7\u1eab\u1ea9\u1ead\u0111\u00e9\u00e8\u1ebd\u1ebb\u1eb9\u00ea\u1ec1\u1ebf\u1ec5\u1ec3\u1ec7\u00f9\u00fa\u0169\u1ee7\u1ee5\u01b0\u1eeb\u1ee9\u1eef\u1eed\u1ef1\u00f3\u00f2\u00f5\u1ecf\u1ecd\u00f4\u1ed3\u1ed1\u1ed7\u1ed5\u1ed9\u01a1\u1edd\u1edb\u1ee1\u1edf\u00ec\u00ed\u0129\u1ec9\u1ecb\u1ef3\u00fd\u1ef9\u1ef7\u1ef5\u00c1\u00c0\u00c3\u1ea2\u1ea0\u0102\u1eae\u1eb0\u1eb4\u1eb2\u1eb6\u00c2\u1ea4\u1ea6\u1eaa\u1ea8\u1eac\u0110\u00c9\u00c8\u1ebc\u1eba\u1eb8\u00ca\u1ec0\u1ebe\u1ec4\u1ec2\u1ec6\u00d9\u00da\u0168\u1ee6\u1ee4\u01af\u1eea\u1ee8\u1eee\u1eec\u1ef0\u00d3\u00d2\u00d5\u1ece\u1ecc\u00d4\u1ed2\u1ed0\u1ed6\u1ed4\u1ed8\u01a0\u1edc\u1eda\u1ee0\u1ede\u00cc\u00cd\u0128\u1ec8\u1eca\u1ef2\u00dd\u1ef8\u1ef6\u1ef4]"
 var
 VI0 = app.VI0, 
 VI = "("+VI0+"{1})"

function autoSpellCheck (str,hoadaudong){
	//‘“；：？》《，。{}【】、！
	var
	 FORMMATTRANSLATE = [
			{re:/\s+/g,t:" "},//hai khoan trang
			{re:/‘|’/g,t:"'"}, // chuyen dau tieng TQ sang anh
			{re:/“|”/g,t:"\""}, // chuyen dau tieng TQ sang anh
			{re:/“|”/g,t:"\""}, // chuyen dau tieng TQ sang anh
			{re:/；/g,t:";"}, // chuyen dau tieng TQ sang anh
			{re:/：/g,t:":"}, // chuyen dau tieng TQ sang anh
			{re:/？/g,t:"?"}, // chuyen dau tieng TQ sang anh
			{re:/！/g,t:"!"}, // chuyen dau tieng TQ sang anh
			{re:/《/g,t:"<"}, // chuyen dau tieng TQ sang anh
			{re:/》/g,t:">"}, // chuyen dau tieng TQ sang anh
			{re:/，|、/g,t:","}, // chuyen dau tieng TQ sang anh
			{re:/。/g,t:"."}, // chuyen dau tieng TQ sang anh
			{re:/【/g,t:"["}, // chuyen dau tieng TQ sang anh
			{re:/】/g,t:"]"}, // chuyen dau tieng TQ sang anh
			{re:new RegExp("([\\,\\.\\;\\!\\:\\?]{1})"+VI,"g"),t:"$1 $2"}, // chu dinh voi dau
			{re:new RegExp("([\\.\\!\\:\\?]{1})\\s"+VI,"g"),t:(x)=>{x = x.toUpperCase();return x;	}}, // hoa dau
			{re:new RegExp(VI+"\\s([\\.\\;\\!\\:\\?]{1})","g"),t:"$1$2"}, // bo khoan trang giua chu va dau
			{re:new RegExp("^"+VI,"g"),t:(x)=>{x = x.toUpperCase();return x;	}}, // hoa tu dau dong
			{re:new RegExp(VI+"(\\s)([\\,\\.\\;\\!\\:\\?]{1})","g"),t:"$1$3"}, //noi chu voi dau
	]
	for (var i = 0; i < FORMMATTRANSLATE.length; i++) {
		if(hoadaudong==false && i==FORMMATTRANSLATE.length-1)
			continue
		var re = FORMMATTRANSLATE[i].re
		var toformax = FORMMATTRANSLATE[i].t
	  str = str.replace(re,toformax)
	}
	return str
}

cmdspellcheck.onclick = ()=>{
	var text = app.getTextSelection()
	text = autoSpellCheck(text)
	//app.insertIntoDoc(text)
	var 
	start = app.textArea.selectionStart,
	end = start+text.length

	app.insertIntoDoc(text)
	app.select(start,end)
}
cmddaotu.iniSetting =()=>{
	appStore.get('daotu').then(r=>{
		if(r==null) return;
		var span = cmddaotu.querySelector('span')
		span.innerText = r
	})
}
cmddaotu.oncontextmenu = ()=>{
	//alert('mymenu')
	var html = `
	<div class="daotu">3-4: Đảo 3 từ hay 4 từ</div>
	<div class="daotu">của: Đảo từ của</div>
	<div class="daotu">là: Đảo từ là</div>
	`
	var ctrl = uidb.smsBox('Đảo từ ',html)
	console.log(ctrl)
	var cmds= ctrl.closer.querySelectorAll('div.daotu')
	console.log(cmds);
	cmds.forEach(e=>{
		e.onclick = ()=>{
			//console.log(cmddaotu)
			var span = cmddaotu.querySelector('span')
			span.innerText = e.innerText.split(':')[0]
			ctrl.closer.querySelector('button').click()
			appStore.set('daotu',span.innerText)
		}
	})
	return false;
}
cmddaotu.onclick = ()=> { 
	//var range = app.getSelectionRange(),
	var text = app.getTextSelection(),
	ts = text.split(' '),
	span = cmddaotu.querySelector('span'),
	fnbabon = ()=>{
		switch(ts.length){
			case 3:text = ts[2]+' '+ts[1]+' '+ts[0]; break;
			case 4:text = ts[2]+' '+ts[3]+' '+ts[0]+' '+ts[1]; break;
		}
	},
	fnchu = ()=>{
		var ts = text.split(span.innerText)
		text = ts[1].trim()+' '+span.innerText+' '+ts[0].trim()
	}
	switch(span.innerText){
		case '3-4':fnbabon(); break;
		default:
		fnchu(); break;
	}
	
	//app.insertIntoDoc(text)
	var 
	start = app.textArea.selectionStart,
	end = app.textArea.selectionEnd

	app.insertIntoDoc(text)
	app.select(start,end)

	// session.replace(range,text)
	
	// selection.setSelectionRange(range)
}
function checkVi(text){
	var isvi = new RegExp(VI0,'g');
	if(isvi.test(text))
		return true;
	return false;
}
cmdmoveleft.onclick = ()=> { 

	if(checkVi(text) && app.textArea.value[app.textArea.selectionEnd]==' ')
		app.textArea.selectionEnd++
	
	var 
	text,
	start = app.textArea.selectionStart,
	end =  app.textArea.selectionEnd
	app.select(start,end)

	text = app.getTextSelection()
	// if(text.length==0)
	// 	cmdselect.onclick()
	if(checkVi(text)){
		start--
		var preLine = app.textArea.value.lastIndexOf('\n',start-1)+1
		start = app.textArea.value.lastIndexOf(' ',start-1)+1
		start = preLine>start?preLine:start
	}else
		start--

	start = start<0?0:start
	//console.log(start);
	cmdcut.click()
	app.textArea.selectionStart = start
	app.textArea.selectionEnd = start
	//document.execCommand("insertText", false, text);
	app.setFocus();
	document.execCommand("insertText", false, text);
	app.textArea.selectionStart = app.textArea.selectionStart-text.length
	app.select(app.textArea.selectionStart,app.textArea.selectionStart+text.length)

}
app.indexCmdSelect = 0;
cmdselect.onclick = ()=> { 
	var text = app.getTextSelection(),
	start = app.textArea.selectionStart,
	end =  app.textArea.selectionStart+text.length+1
	if(text.length==0)
		text = app.getTextSelection(start,end)
	if(checkVi(text)){
		if(text.length==1){
			end = app.textArea.value.indexOf(' ',start)
			start = app.textArea.value.lastIndexOf(' ',start)+1
		}else{
			end = app.textArea.value.indexOf(' ',end)
		}
	}
	app.select(start,end)
	setTimeout(()=>{
		text = app.getTextSelection()
		if(checkVi(text))
			app.indexCmdSelect = text.length
		else
			app.indexCmdSelect++
		if(app.indexCmdSelect==text.length){
			app.textArea.onmouseup()
			console.log(app.indexCmdSelect+"/"+text.length);
		}
	},500)
}
cmdmoveright.onclick = ()=> { 
	var text = app.getTextSelection()

	if(checkVi(text) && app.textArea.value[app.textArea.selectionEnd]==' '){
		app.textArea.selectionEnd++
		app.select(app.textArea.selectionStart,app.textArea.selectionEnd)
	}

	text = app.getTextSelection()
	cmdcut.click()
	//app.setFocus();
	var start = app.textArea.selectionStart
	var end = start//app.textArea.selectionEnd
	app.textArea.selectionStart = start
	app.textArea.selectionEnd = start

	if(checkVi(text)){
		var nextLine = app.textArea.value.indexOf('\n',end)+1
		var index = app.textArea.value.indexOf(' ',end)
		if(index!=-1){
			end = index+1
			end = end>nextLine?nextLine:end;
		}
		else{// end of document
			end = app.textArea.value.length
			text = " "+text.trim()
		}
	}else
	end++

	end = end> app.textArea.value.length?app.textArea.value.length:end
	app.textArea.selectionStart = end
	app.textArea.selectionEnd = end
	app.setFocus();

	document.execCommand("insertText", false, text);
	//console.log(end);
	
	// console.log(end);
	//app.setFocus();
	// document.execCommand("insertText", false, text);
	// app.textArea.selectionEnd = app.textArea.selectionEnd-text.length
	app.select(app.textArea.selectionStart - text.length,app.textArea.selectionStart)
	
}
cmduplowcase.onclick = ()=> { 
	var titleCase=(string)=> {
      var sentence = string.toLowerCase().split(" ");
      for(var i = 0; i< sentence.length; i++){
         sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
      }
   		return sentence.join(" ");
  }
	var a = app.getTextSelection(),
	u = a.toUpperCase(),
	t = titleCase(a),
	l = a.toLowerCase()
	a = (a==u && u[1] && u[1]==a[1])?t:(a==l)?u:l
	var 
	start = app.textArea.selectionStart,
	end = app.textArea.selectionEnd

	app.insertIntoDoc(a)
	app.select(start,end)
}
cmdnoichu.onclick = ()=> {
	var 
	text = app.getTextSelection(),
	start = app.textArea.selectionStart,
	end = app.textArea.selectionEnd

	text = text.indexOf('-')==-1? text.replace(/\s/g,'-'):text.replace(/\-/g,' ')
	app.insertIntoDoc(text)
	app.select(start,end)
}
function selectSetStyle (ctrl,query,getSetValue){
	var obj = ctrl.querySelector(query)
	obj.value = getSetValue
	obj.onchange = ()=>{
		getSetValue = obj.value
	}
}
ctrlStyle.onclick =()=>{
	var 
	html,size = '',
	fonts = ['Arial, CN-Hanh','Arial, fangsong','Arial, MingLiu','Arial, PMingLiU','Arial, SimSun','Arial, SimHei','Arial, "Noto Serif SC"','Arial, "Noto Sans SC"','Arial, "Adobe Kaiti Std"'],
	o = ``
	fonts.forEach(e=>{
		o+=`<option value='${e}'>${e.replace(/\"/g,'')}</option>`
	})
	var x = ['xxx-large','xx-large','x-large','larger','large','medium','small','smaller','x-small','xx-small']
	x.forEach(i=>{
		size+=`<option value='${i}'>${i}</option>`
	})
	html =`
	<div><span>Font Name:</span><select name='fontFamily'>${o}</select></div>
	<div><span>Font size:</span><select name='fontSize'>${size}</select></div>
	<div><span>Icon size:</span><select name='iconSize'>${size}</select></div>
	`
	var c = uidb.showWord('Cấu Hình',html).closer
	,fontFamily = c.querySelector(`select[name='fontFamily']`)
	fontFamily.value = app.textArea.style.fontFamily
	fontFamily.onchange = ()=>{
		app.textArea.style.fontFamily = fontFamily.value
		app.options.fontFamily = fontFamily.value
		appStore.set('options',app.options)
	}
	//selectSetStyle(c,`select[name='fontFamily']`,app.textArea.style.fontFamily)
	var fontSize = c.querySelector(`select[name='fontSize']`)
	fontSize.value = app.textArea.style.fontSize
	fontSize.onchange = ()=>{
		app.textArea.style.fontSize = fontSize.value
		app.options.fontSize = fontSize.value
		appStore.set('options',app.options)
	}
	var iconSize = c.querySelector(`select[name='iconSize']`)
	iconSize.value = app.options.iconSize
	mainStyle.innerText =  `.menuContainer button {font-size: ${app.options.iconSize};}`
	iconSize.onchange = ()=>{
		mainStyle.innerText = `.menuContainer button {font-size: ${iconSize.value};}`
		app.options.iconSize = iconSize.value
		appStore.set('options',app.options)
		//app.textArea.style.fontSize = iconSize.value
	}
}
cmdHelp.onclick = ()=>{
	var html=`
<button class="menuItemContainer"><i class="material-icons">insert_drive_file</i></button> Tẹp - tẹp mới/mở tẹp/lưu tẹp<br>
<button class="menuItemContainer"><i class="material-icons">history</i></button> Các tẹp gần đây<br>
<button class="menuItemContainer"><i class="material-icons">undo</i></button> Trở lại thao tác trước<br>
<button class="menuItemContainer"><i class="material-icons">redo</i></button> Trở lại thao sau<br>
<button class="menuItemContainer"><i class="material-icons">select_all</i></button> Chọn tất cả<br>
<button class="menuItemContainer"><i class="material-icons">content_copy</i></button> Chép <br>
<button class="menuItemContainer"><i class="material-icons">content_cut</i></button> Cắt<br>
<button class="menuItemContainer"><i class="material-icons">content_paste</i></button> Dán<br>
<button class="menuItemContainer"><i class='material-icons'>search</i></button> Tra từ<br>
<button class="menuItemContainer"><i class='material-icons'>create</i></button> Thêm từ mới<br>
<button class="menuItemContainer"><i class='material-icons'>translate</i></button> Dịch không cần mạng<br>
<button class="menuItemContainer"><i class='material-icons'>g_translate</i></button> Google dịch<br>
<button class="menuItemContainer"><i class="material-icons">text_format</i></button> Hoa/Hoa đầu/thường<br>
<button class="menuItemContainer"><i class='material-icons'>spellcheck</i></button> Tự động chỉnh lỗi<br>
<button class="menuItemContainer"><i class="material-icons">linear_scale</i></button> Nối chữ với dấu -<br>
<button class="menuItemContainer twoIcon"><i class='material-icons'>a</i><i class='material-icons icon2'>swap_calls</i><span>3-4</span></button> Đảo ba/bốn từ<br>
<button class="menuItemContainer twoIcon"><i class='material-icons'>a</i><i class='material-icons icon2'>swap_calls</i><span>của</span></button> Đảo với từ của<br>
<button class="menuItemContainer twoIcon"><i class='material-icons'>a</i><i class='material-icons icon2'>swap_calls</i><span>là</span></button> Đảo với từ là<br>
<button class="menuItemContainer"><i class='material-icons'>skip_previous</i></button> Sang trái<br>
<button class="menuItemContainer"><i class='material-icons'>code</i></button> Chọn từ trái sang phải<br>
<button class="menuItemContainer"><i class='material-icons'>skip_next</i></button> Sang phải<br>
<button class='menuItemContainer twoIcon'><i class='material-icons'>a</i><i class='material-icons icon2'>keyboard</i><span>Việt</span></button> Bàn phím Hán Việt<br>
<button class='menuItemContainer twoIcon'><i class='material-icons'>a</i><i class='material-icons icon2'>keyboard</i><span>Nôm</span></button> Bàn phím Hán Nôm<br>
<button class="menuItemContainer"><i class='material-icons'>record_voice_over</i></button> Phiên Âm Hán Việt<br>
<button class='menuItemContainer twoIcon'><i class='material-icons'>a</i><i class='material-icons icon2'>keyboard</i><span>Giản</span></button> Chuyển sang giản thể<br>
<button class='menuItemContainer twoIcon'><i class='material-icons'>a</i><i class='material-icons icon2'>keyboard</i><span>Phồn</span></button> Chuyển sang phồn thể<br>
<button class="menuItemContainer"><i class='material-icons'>person_outline</i></button> Đăng nhập/đăng xuất<br>
<button class='menuItemContainer twoIcon'><i class='material-icons'>a</i><i class='material-icons icon2'>sync</i><span>(0)</span></button> Đồng bộ dữ liệu<br>
<button class="menuItemContainer"><i class="material-icons">wrap_text</i></button> Xuống dòng theo màng hình<br>
<button class="menuItemContainer"><i class='material-icons'>zoom_in</i></button> To chữ<br>
<button class="menuItemContainer"><i class='material-icons'>zoom_out</i></button> Nhỏ chữ<br>
<button class="menuItemContainer"><i class='material-icons'>help</i></button> Hướng Dẫn<br>`
uidb.showWord('Hướng Dẫn',html)
}
})(app);