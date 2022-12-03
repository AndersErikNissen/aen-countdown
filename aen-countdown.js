"use strict";

(function(d) {
  var countdown = function(node) {
    this.node = node;
    this.content = node.querySelector('[data-content]');
    this.startTime = Date.parse(node.querySelector('[data-start]').value); 
    this.stopTime = Date.parse(node.querySelector('[data-stop]').value); 
    this.type = node.querySelector('[data-countdown-type').value;
  };
  
  countdown.prototype = {
    get2Digits(number) {
      return number < 10 ? "0" + number : String(number);
    },
    times() {
      var now = new Date().getTime();
      
      if (this.startTime >= now || now >= this.stopTime) return false;
      
      // % used since we only want whole "times"
      var 
      remaining = this.stopTime - now,
      days = this.get2Digits( Math.floor( remaining/(24*60*60*1000) ) ),
      hours = this.get2Digits( Math.floor( (remaining/(60*60*1000)) % 24 ) ),
      minutes = this.get2Digits( Math.floor( (remaining/1000/60) % 60 ) ),
      seconds = this.get2Digits( Math.floor( (remaining/1000) % 60 ) ),
      total = String(days + hours + minutes + seconds).split('');
      
      return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        total: total
      };
    },
    timerNode1(number,id) {
      this.content.innerHTML += `
        <div data-timer-id=${id} data-timer-value="${number}">
          <span data-time-one>${number}</span>
          <span data-time-two>${number}</span>
        </div>
      `;
    },
    createNodes() {
      this.times().total.forEach(function(number,index) {
        var nodeFunction = this['timerNode_' + this.type];

        if(typeof nodeFunction === 'function') {
          this['timerNode' + this.type](number,index);
        }
      }.bind(this));
    }
  };
  
  d.querySelectorAll('[data-aenother-countdown]').forEach( parent => {
    const cd = new countdown(parent);
    cd.createNodes();
  console.warn(cd.times())
 
  })
})(document);

customElements.define('aen-countdown', class AENCountdown extends HTMLElement {
  constructor() {
    super();
    
    //const shadow = this.attachShadow({ mode: open });

    this.start = this.hasAttribute('start')
      ? this.getAttribute('start') !== '' 
      ? this.getAttribute('start') : new Date().getTime()
      : new Date().getTime();

    this.stop = this.hasAttribute('stop')
      ? this.getAttribute('stop') !== '' 
      ? this.getAttribute('stop') : false
      : false;

      console.log(this.start,this.stop)
  }

  getTimes() {
    var now = new Date().getTime();
    
    if (this.getAttribute('start') >= now || now >= this.getAttribute('stop')) return false;
 
    var 
    remaining = this.stopTime - now,
    days = this.get2Digits( Math.floor( remaining/(24*60*60*1000) ) ),
    hours = this.get2Digits( Math.floor( (remaining/(60*60*1000)) / 24 ) ),
    minutes = this.get2Digits( Math.floor( (remaining/1000/60) / 60 ) ),
    seconds = this.get2Digits( Math.floor( (remaining/1000) / 60 ) ),
    total = String(days + hours + minutes + seconds).split('');
    
    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      total: total
    };
  }
  // Check after if the countdown should begin, only clearInterval when we are passed stop


});
