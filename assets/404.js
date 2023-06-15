function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=+<>,./?[{()}]!@#$%^&*~`\|'.split('');

var progress404 = 0;
var total404 = $('.text__error').data('text').length;

var progressLink = 0;
var totalLink = $('.text__link a').data('text').length;

var scrambleInterval = setInterval(function() {
	var string404 = $('.text__error').data('text');
	var stringLink = $('.text__link a').data('text');
	
	for(var i = 0; i < total404; i++) {
		if(i >= progress404) {
			string404 = setCharAt(string404, i, characters[Math.round(Math.random() * (characters.length - 1))]);
		} 
	}
	
	for(var i = 0; i < totalLink; i++) {
		if(i >= progressLink) {
			stringLink = setCharAt(stringLink, i, characters[Math.round(Math.random() * (characters.length - 1))]);
		} 
	}
	
	$('.text__error').text(string404);
	$('.text__link a').text(stringLink);
}, 1000 / 60);

setTimeout(function() {
	var revealInterval = setInterval(function() {
		if(progress404 < total404) {
			progress404++;
		}else if(progressLink < totalLink) {
			progressLink++;
		}else{
			clearInterval(revealInterval);
			clearInterval(scrambleInterval);
		}
	}, 50);
}, 1000);

document.onkeypress = function (event) {
	event = (event || window.event);
	return keyFunction(event);
  }
  document.onmousedown = function (event) {
	event = (event || window.event);
	return keyFunction(event);
  }
  document.onkeydown = function (event) {
	event = (event || window.event);
	return keyFunction(event);
  }
  
  //Disable right click script 
  var message="Sorry, right-click has been disabled"; 
  
  function clickIE() {if (document.all) {(message);return false;}} 
  function clickNS(e) {if 
  (document.layers||(document.getElementById&&!document.all)) { 
  if (e.which==2||e.which==3) {(message);return false;}}} 
  if (document.layers) 
  {document.captureEvents(Event.MOUSEDOWN);document.onmousedown=clickNS;} 
  else{document.onmouseup=clickNS;document.oncontextmenu=clickIE;} 
  document.oncontextmenu=new Function("return false")
  
  function keyFunction(event){
	//"F12" key
	if (event.keyCode == 123) {
		return false;
	}
  
	if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
		return false;
	}
	//"J" key
	if (event.ctrlKey && event.shiftKey && event.keyCode == 74) {
		return false;
	}
	//"S" key
	if (event.keyCode == 83) {
	   return false;
	}
	//"U" key
	if (event.ctrlKey && event.keyCode == 85) {
	   return false;
	}
	//F5
	if (event.keyCode == 116) {
	   return false;
	}
  }