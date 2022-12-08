"use strict";


let timer = document.createElement('template');
timer.innerHTML = `
  
`
customElements.define('aen-countdown', class AENCountdown extends HTMLElement {
  get start() {
    if (this.hasAttribute('begin') && this.getAttribute('begin') != '')
      return true
    else
      return new Date().getTime();
      // Instead of returning false, just let the countdown start now.
      // - .getTime() is so we get the date in seconds.
  }

  

  get finish() {
    if (this.hasAttribute('finish') && this.getAttribute('finish') != '')
      return true
    else
      return false
  }
  
  constructor() {
    super();

    console.warn(this.start)
    console.warn(this.finish)
    this.fisk = 10;
    //const shadow = this.attachShadow({ mode: open });

    this.status = 'active';
   

    console.log(this.test)
  }

 
});


var obj = function() {
  this.fx = 10;
}

var obj1 = new obj;

var testy = function() { return 11}

Object.defineProperty(obj.prototype, 'test', {
  get : function() {
    var test = testy();

    Object.defineProperty(this, 'test', {
      value: test
    })

    //Returned the first time(on initialization)
    return test + 12
  }
})

console.log(obj1.test)