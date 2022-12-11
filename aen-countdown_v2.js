"use strict";


let timer = document.createElement('template');
timer.innerHTML = `
  
`
customElements.define('aen-countdown', class extends HTMLElement {
  get startDate() {
    let start = Date.parse( this.getAttribute('start') );
    return !isNaN(start) 
    ? start
    : new Date().getTime();
  }

  get stopDate() {
    let stop = Date.parse( this.getAttribute('stop') );
    return !isNaN(stop) 
    ? stop
    : false;
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  /**
   * @params {Boolean} state - Should the current state of the Countdown be disabled?
   */
  set disabled(state) {
    let disable = Boolean(state);
    disable
    ? this.setAttribute('disabled','')
    : this.removeAttribute('disabled');
  }

  get time() {    
    /**
     * Help from this article: https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
     */
    if (!this.stopDate) {
      this.disabled = true;
      return false;
    };

    var 
    remaining = this.stopDate - new Date().getTime(),
    formatTime = function(time) {
        let formated = Math.floor(time);
        return formated < 10 
        ? '0' + formated
        : String(formated);
    },
    timeObject = {
      days: formatTime(remaining/(24*60*60*1000)),
      hours: formatTime((remaining/(60*60*1000)) % 24),
      minutes: formatTime((remaining/1000/60) % 60),
      seconds: formatTime((remaining/1000) % 60 )
    };
    timeObject.digits = Object.values(timeObject)
    .reduce((previousValue, currentValue) => previousValue + currentValue)
    .split('');

    return timeObject;
  }


  
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
   

  }

  _core() {
    const loop = setInterval(_coreCallback, 1000);

    if(!stop) clearInterval(loop);
  }

  _coreCallback() {
    if (this.disabled) return;

  }

  connectedCallback() {
    console.warn(this.startDate)
    console.warn(this.time)
  }

  createTimer(value) {
    shadow.innerHTML += `
      <div data-aen-countdown-timer data-value="${value}">
        <span>${value}</span>
        <span>${value}</span>
      </div>
    `;
  }

 
});
