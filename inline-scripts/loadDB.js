'use strict';
(function(app) {
    var
    {log} = console,
    myBar = document.getElementById("myBar"),
    persend = (data)=>{
        myBar.style.width = data.text
        //data = data.data
        if(data.text=="100%")
        setTimeout(()=>{
            myBar.style.display='none'
        },1000);
    },

    worker = new Worker("./inline-scripts/load-db-worker.js");
    app.getQuery = (data) =>{
        uidb.searchWordV2(app.bufferKeys,data.text)
    }
    app.queryDB = (value)=>{
        var 
        keys = value.split(/[,;.:-。《》【】·~，；：‘“？\/\}\{——+！@#￥%……&*（）\|\、]/g),
        v = app.fnMultiGianHayPhon(keys)
        if(v.length!=0)
            keys = keys.concat(v)
        //console.log(keys);
        //app.filterWord(keys)
        app.bufferKeys = keys
        worker.postMessage({key:'query',text:keys})
    }

    worker.onmessage = function (event) {
        var {data} = event
        //log(data);
        switch (data.key){
            case 'persend': persend(data);break;
            case 'query': app.getQuery(data);break;
            case 'error': console.log(data);break;
            default: break;
        }
    };

    window.addEventListener("load",()=>{
        worker.postMessage({key:"load"});
    })
    
})(app);