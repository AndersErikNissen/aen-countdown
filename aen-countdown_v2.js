"use strict";

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
   * @param {Boolean} state - Should the current state of the Countdown be disabled?
   */
  set disabled(state) {
    let disable = Boolean(state);
    disable
    ? this.setAttribute('disabled','')
    : this.removeAttribute('disabled');
  }

  /**
   * @param {Number} now - a new Date representing now 
   */
  set time(now) {
    if(!now) return;
    if (isNaN(now)) return;
    
    var 
    remaining = this.stopDate - now;
    
    if (remaining <= 0) return;
    
    {
      this.disabled = true;
      this.time = null;
    }
    
    var
    formatTime = function(time) {
      let formated = Math.floor(time);
      return formated < 10 
      ? '0' + formated
      : String(formated);
    },
    /**
     * Help from this article: https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
     */
    timeObject = {
      days: formatTime(remaining/(24*60*60*1000)),
      hours: formatTime((remaining/(60*60*1000)) % 24),
      minutes: formatTime((remaining/1000/60) % 60),
      seconds: formatTime((remaining/1000) % 60 )
    };
    timeObject.digits = Object.values(timeObject)
    .reduce((previousValue, currentValue) => previousValue + currentValue)
    .split('');

    this.time = timeObject;
  }


  
  constructor() {
    super();

    // Should this be just a const? Not sure if I can access that correctæy then??
    this.shadow = this.attachShadow({ mode: 'open' });
   

  }

  
  connectedCallback() {
    console.warn(this.startDate)
    console.warn(this.time)
    this._coreCallback(); // Run 1 time, before first interval fires
    this._core();
  }

  _coreCallback() {
    console.log("coreCallback")
    if (this.disabled) return;

    this.time = new Date().getTime();
    console.log(this.time)
  }

  _core() {
    const loop = setInterval(this._coreCallback, 1000);

    if(!stop) clearInterval(loop);
  }


  createStyling() {
    let style = document.createElement('style');
    style.innerHTML = `

    `;
    this.shadow.innerHTML += style;
  }


  createTimer(value) {
    this.shadow.innerHTML += `
      <div data-aen-countdown-timer data-value="${value}">
        <span>${value}</span>
        <span>${value}</span>
      </div>
    `;
  }

 
});
