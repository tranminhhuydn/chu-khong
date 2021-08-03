cmdCopyRecode.onclick = ()=>{
   textEditor.value += recodeText.value+"\n"
   recodeText.value=''
}
fileAudio.onchange = ()=> {
  var preview = ctrlAudio
  var file = fileAudio.files[0];
  var reader = new FileReader();

  reader.addEventListener("load", function () {
    // convert image file to base64 string
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}
setAudioTime.onclick = ()=>{
  ctrlAudio.currentTime = Number(app.getTextSelection())
}
getAudioTime.onclick = ()=>{
  textEditor.value += ctrlAudio.currentTime+"\n"
}
function pauseSound(e) {
  if (e.altKey && e.keyCode == 75) {
    if(ctrlAudio.paused)
  	    ctrlAudio.play()
    else
        ctrlAudio.pause()
  }

  if (e.altKey && e.keyCode == 67) {
    cmdCopyRecode.onclick()
  }
  if (e.altKey && e.keyCode == 88) {
    setAudioTime.onclick()
  }
}
document.addEventListener('keyup', pauseSound, false);