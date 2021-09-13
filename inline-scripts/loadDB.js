'use strict';
//import("../jszip/jszip.min.js");
var 
{log} = console,
rootData = null;
Date.prototype.diffSeconds = function (date) {return Math.abs(this.getTime() - date.getTime())/1000;};

//data = [];
(function(app) {
var listDB = [
'../tu-dien-thieu-chuu/hanviet/dbzip/bktd_dv.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/CV_Lac_Viet_Hoa_Viet.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Free_Chinese_Vietnamese.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Han_Hoa_Anh.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Han_viet_dai_tu_dien.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/hanNomDics.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/nguyenTraiQuocAm.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_0.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_1.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_2.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_3.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_4.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Han_Yu_Da_Ci_Dian_5.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Khang_Hi.json.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/TDTT.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/NomTayHOANGTRIEUANDics.zip',
'../tu-dien-thieu-chuu/hanviet/dbzip/Nguyen_Quoc_Hung.json.zip'];

var 
myBar = document.getElementById("myBar"), 
timeLoad,
countLoad = 0,
onlineStatus,
updateOnlineStatus = ()=>{
    onlineStatus = navigator.onLine ? "online" : "offline";
},
persend = (value)=>{
    myBar.style.width = value+"%"
    if(value==100)
    setTimeout(()=>{
        myBar.style.display='none'
    },1000);
},
loadMulti = ()=>{
    timeLoad = new Date()
    Promise.all(
      listDB.map(loadDB)
    )
    // .then((ttTimes) => {
    //     if(ttTimes!=null)
    //         console.log(ttTimes);
    // })
},
loadDB = (url)=>{
    return fetch(new Request(url))       // 1) fetch the url
    .then(function (response) {                       // 2) filter on 200 OK
        if (response.status === 200 || response.status === 0) {
            return Promise.resolve(response.blob());
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    })
    .then(JSZip.loadAsync) 
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

        var v = (countLoad*100/listDB.length)
        persend(v)
        if(v==100){
            var rtime = timeLoad.diffSeconds(new Date())
            console.log(rtime)
            return Promise.resolve(rtime)
        }
        return Promise.resolve(v)
    })
    .catch(e=>{
        console.log("ERROR: "+e);
        //console.log(url);
        var urli = url
        setTimeout(()=>{
            if(onlineStatus=='online')
            loadDB(urli)
        },1000)
    })
}
window.addEventListener("DOMContentLoaded",()=>{
    loadMulti()
})
window.addEventListener("load",()=>{
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
})

})(app);