'use strict';

importScripts("../jszip/jszip.min.js");
var 
log = (str) => {
    postMessage(str);
},
rootData = null,
data = [];

Date.prototype.diffSeconds = function (date) {return Math.abs(this.getTime() - date.getTime())/1000;};

var listDB = [
'../../tu-dien-thieu-chuu/hanviet/dbzip/bktd_dv.json.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/CV_Lac_Viet_Hoa_Viet.json.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/Free_Chinese_Vietnamese.json.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/Han_Hoa_Anh.json.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/Han_viet_dai_tu_dien.json.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/hanNomDics.json.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/nguyenTraiQuocAm.json.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_0.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_1.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_2.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_3.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_4.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_5.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/Khang_Hi.json.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/TDTT.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/NomTayHOANGTRIEUANDics.zip',
'../../tu-dien-thieu-chuu/hanviet/dbzip/Nguyen_Quoc_Hung.json.zip'];


onmessage = (event)=>{
    var {data} = event
    switch (data.key){
        case 'load': loadMulti();break;
        case 'query': filterWord(data.text);break;
        default: break;
    }
}

var 
timeLoad ,
countLoad = 0, 
loadDB = (url)=>{ 
    // (listUrl,index)=>{
    //var url = new Request(listUrl[index])
    return fetch(new Request(url))       // 1) fetch the url
    .then(function (response) {                       // 2) filter on 200 OK
        if (response.status === 200 || response.status === 0) {
            return Promise.resolve(response.blob());
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    })
    .then(JSZip.loadAsync)                            // 3) chain with the zip promise
    // .then(function (zip) {
    //     // console.log("loadDB: "+index)
    //     for(var fileName in zip.files){
    //         zip.file(fileName).async("string")
    //         .then(text=>{
    //             var cn = JSON.parse(text)
    //             if(rootData == null)
    //                 rootData = cn
    //             else
    //                 rootData.data = rootData.data.concat(cn.data)
    //             countLoad++

    //             var persend = (countLoad*100/listDB.length)
                
    //             log({key:"persend",text:persend +"%"})
    //             if(persend==100){
    //                 console.log(timeLoad.diffSeconds(new Date()))
    //             }
    //         })
    //     }
    // })
    .then(function (zip) {
        var fileName;
        zip.forEach(function (relativePath, zipEntry) {
            fileName = zipEntry.name
        })
        return Promise.resolve(zip.file(fileName).async("string"))
    })
    .then(function (text) {
        var cn = JSON.parse(text)
        if(rootData == null)
            rootData = cn
        else
            rootData.data = rootData.data.concat(cn.data)
        countLoad++

        var persend = (countLoad*100/listDB.length)
        
        log({key:"persend",text:persend +"%"})
        if(persend==100){
            var rtime = timeLoad.diffSeconds(new Date())
            console.log(rtime)
            return Promise.resolve(rtime)
        }
        return Promise.resolve(null)
    })
    .catch(e=>{
        log({key:"error",text:e});
    })
},

loadMulti = ()=>{
    timeLoad = new Date()
    //21.59 
    //19.989
    //26.426
    // listDB.forEach(url=>{
    //     loadDB(url)
    // })

   //loadDB(listDB,0)
   //25.25
    Promise.all(
      // use the urls to create an array of promises
      listDB.map(loadDB)
    )
    .then((ttTimes) => {
        if(ttTimes!=null)
            console.log(ttTimes);
    })
    //25.647
    //18.936
},
filterWord = (words) => {
    var r = []
    words.forEach(word=>{
        r = r.concat(rootData.data.filter((v,k,s)=>{return v[0] == word || v[4] == word}))
    })
    log({key:'query',text:r})
    //return r;
}