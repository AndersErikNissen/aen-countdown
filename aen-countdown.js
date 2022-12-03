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
    timerNode_1(number,id) {
      var 
      outer = d.createElement('div'),
      span1 = d.createElement('span'),
      span2 = d.createElement('span');

      outer.setAttribute('data-timer-id', id);
      outer.setAttribute('data-timer-value', number);

      outer.appendChild(span1);
      outer.appendChild(span2);
      this.content.innerHTML += `
        <div data-timer-id=${id} data-timer-value="${number}">
          <span data-timer-one>${number}</span>
          <span data-timer-two>${number}</span>
        </div>
      `;
    },
    createNodes() {
      this.times().total.forEach(function(number,index) {
        var nodeFunction = this['timerNode_' + this.type];

        if(typeof nodeFunction === 'function') {
          this['timerNode_' + this.type](number,index);
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


