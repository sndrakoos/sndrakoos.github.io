window.addEventListener("DOMContentLoaded",() => {
    const c = new Clock30(".clock");
  });
  
  class Clock30 {
    time = [];
  
    constructor(el) {
      this.el = document.querySelector(el);
  
      this.init();
    }
    init() {
      this.timeUpdate();
    }
    get timeAsObject() {
      const date = new Date();
      const h = date.getHours();
      const m = date.getMinutes();
  
      return {h,m};
    }
    get timeInWords() {
      let {h} = this.timeAsObject;
      const {m} = this.timeAsObject;
      // hour
      if (h > 12) h -= 12;
      else if (h === 0) h = 12;
  
      const hrDigits = `${h}`.split("");
      if (h < 10) hrDigits.unshift("0");
      // minute
      const minDigits = `${m}`.split("");
      if (m < 10) minDigits.unshift("0");
  
      const numbers = {
        _1: "one",
        _2: "two",
        _3: "three",
        _4: "four",
        _5: "five",
        _6: "six",
        _7: "seven",
        _8: "eight",
        _9: "nine",
        _10: "ten",
        _11: "eleven",
        _12: "twelve",
        _13: "thirteen",
        _14: "fourteen",
        _15: "fifteen",
        _16: "sixteen",
        _17: "seventeen",
        _18: "eighteen",
        _19: "nineteen",
        _20: "twenty"
      };
  
      let words = "";
      const hour = numbers[`_${h}`];
      const nextHour = numbers[`_${(h + 1) % 12}`];
  
      if (m === 0) {
        words = `${hour} o’clock`;
      } else if (m === 15) {
        words = `quarter past ${hour}`;
      } else if (m < 30) {
        let min = numbers[`_${m}`];
        // values higher than 20 won’t be found
        if (!min) {
          const minFirstDigit = +minDigits[0];
          const minLastDigit = +minDigits[1];
          const firstWord = numbers[`_${minFirstDigit}0`];
          const lastWord = numbers[`_${minLastDigit}`];
          min = `${firstWord}-${lastWord}`;
        }
        words = `${min} minutes past ${hour}`;
      } else if (m === 30) {
        words = `half past ${hour}`;
      } else if (m === 45) {
        words = `quarter to ${nextHour}`;
      } else if (m > 30) {
        const minsLeft = 60 - m;
        let min = numbers[`_${minsLeft}`];
        // values higher than 20 won’t be found
        if (!min) {
          const digitString = `${minsLeft}`;
          const minsLeftFirstDigit = +digitString[0];
          const minsLeftLastDigit = +digitString[1];
          const firstWord = numbers[`_${minsLeftFirstDigit}0`];
          const lastWord = numbers[`_${minsLeftLastDigit}`];
          min = `${firstWord}-${lastWord}`;
        }
        words = `${min} minutes to ${nextHour}`;
      }
  
      return words;
    }
    timeUpdate() {
      const flyInClass = "clock__word--fade-fly-in";
      const time = this.timeInWords.split(" ");
      // if half past, insert a space between “half” and “past” so “past” is boldfaced
      if (time.indexOf("half") > -1) {
        time.splice(1,0,"");
      }
      // display the time
      const timeWordEls = Array.from(this.el.querySelectorAll(".clock__word"));
  
      for (let i = 0; i < timeWordEls.length; ++i) {
        const wordEl = timeWordEls[i];
        wordEl.innerText = time[i] || "";
  
        if (time[i] !== this.time[i]) {
          wordEl.classList.add(flyInClass);
        } else {
          wordEl.classList.remove(flyInClass);
        }
      }
  
      this.time = time;
      // loop
      clearTimeout(this.timeUpdateLoop);
      this.timeUpdateLoop = setTimeout(this.timeUpdate.bind(this),1e3);
    }
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