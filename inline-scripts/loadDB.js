'use strict';
var 
{log} = console,
rootData = null,
data = [];
(function(app) {
var listDB = [
'../tu-dien-thieu-chuu/hanviet/dbzip/bktd_dv.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/CV_Lac_Viet_Hoa_Viet.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Free_Chinese_Vietnamese.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Han_Hoa_Anh.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Han_viet_dai_tu_dien.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_3.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Khang_Hi.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Nguyen_Quoc_Hung.json.zip'];

var myBar = document.getElementById("myBar");

var countLoad = 0

var loadDB = (url)=>{
    //url = listDB[url]
    fetch(url)       // 1) fetch the url
    .then(function (response) {                       // 2) filter on 200 OK
        if (response.status === 200 || response.status === 0) {
            return Promise.resolve(response.blob());
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    })
    .then(JSZip.loadAsync)                            // 3) chain with the zip promise
    .then(function (zip) {
        //console.log(zip)
        
        for(var fileName in zip.files){
            zip.file(fileName).async("string")
            .then(text=>{
                var cn,c= ' cn = '+text
                eval(c)
                if(rootData == null)
                    rootData = cn
                else
                    rootData.data = rootData.data.concat(cn.data)
                countLoad++
                //var r = cn.data.filter((v,k,s)=>{return v[0]=='????'})
                // console.log(cn.data.length)
                // console.log(rootData.data.length)
                
                data = rootData.data

                var persend = (countLoad*100/listDB.length)
                myBar.style.width = persend +"%"
                if(persend==100)
                    setTimeout(()=>{
                        console.log(rootData.columns)
                        myBar.style.display='none'
                    },1000);
            })
        }
    })
}

listDB.forEach(url=>{
    loadDB(url)
})

})(app);