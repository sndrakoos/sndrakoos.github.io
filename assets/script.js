const slideElements = ['.back__slide', '.card__slide', '.content__slide'];
let inProgress = false;

const goToSlide = (slideElements, index) => {
  if (!inProgress) {
    inProgress = true;

    $('.active').addClass('exit');
    $('.active').removeClass('active');
    slideElements.forEach(elem => {
      $(`${elem}:nth-child(${index})`).addClass('active');
    });

    const evenSlide = index % 2 === 0;
    if (evenSlide)
    $('.content__ping').addClass('content__ping--right');else

    $('.content__ping').removeClass('content__ping--right');
    $('.content__ping--noanimation').removeClass('content__ping--noanimation');

    setTimeout(() => $('.exit').removeClass('exit'), 1000);
    setTimeout(() => inProgress = false, 2000);
  }
};

$('.content__slide:nth-child(1) .button').on('click', () => goToSlide(slideElements, 2));
$('.content__slide:nth-child(2) .button').on('click', () => goToSlide(slideElements, 1));

setTimeout(() => goToSlide(slideElements, 2), 2000);
setTimeout(() => goToSlide(slideElements, 1), 6000);

// let amount = 0;
// let slide = 0;

// const progress = () => {
//   amount++
//   $('.active .progress').css('transform', `scaleX(${amount/400})`)
//   if (amount >= 400){
//     amount = 0;
//     $('.active .progress').css('transform', `scaleX(${amount/400})`)
//     slide = (slide + 1) % 2 ;
//     goToSlide(slideElements, slide + 1);
//     clearInterval(progressInterval);
//     setTimeout(()=>{ 
//       progressInterval = setInterval(progress,20); 
//       $('.back__slide:not(.active) .progress').css('transform', 'scaleX(0)')
//     }, 2000);
//   }
// }

// let progressInterval = setInterval(progress,20);

function redirectIt(obj){
  var goToLink = obj.getAttribute("href");
  window.location.href=goToLink;
}

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