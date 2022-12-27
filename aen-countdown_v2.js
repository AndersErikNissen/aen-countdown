"use strict";

/**
 * Attributes
 * {Date}       stop      (REQUIRED)
 * {Date}       start     (OPTIONAL)
 * {String}     type      (DEFAULT: "blink") - Options: Blink, Elevator
 * {Boolean}    disabled  (OPTIONAL)
 * {String}     split     (DEFAULT: "")
 * {Array**}    after     (OPTIONAL)
 * 
 * Description
 * Array*   An array created by splitting the string with comma (,).
 * Array**  Same as Array*, but will be used on after the countdowns depending on the amount of values given. 
 *          -- The the array will be used differently depending on the lenght of the array.
 *          -- (0)   The attribute will be ignored.
 *          -- (1)   Array[0] -> Days / Hours / Minutes / Seconds
 *          -- (2)   Array[0] -> Days / Minutes, Array[1] -> Hours / Seconds
 *          -- (3)   Array[0] -> Days, Array[1] -> Hours, Array[2] -> Minutes, Array[0] -> Seconds
 *          -- (4)   Same as (3), but Array[3] -> Seconds.
 *          -- (4+)  First 4 will be used, rest is ignored.
 */
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

  get time() {
    return this.now;
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

    this.now = timeObject;
  }

  get type() {
    return this.getAttribute('type')
    ? this.getAttribute('type').toLowerCase() === "elevator"
      ? "elevator"
      : "blink"
    : "blink";
  }

  get split() {
    return this.getAttribute('split')
    ? this.getAttribute('split')
    : "";
  }

  get after() {
    return this.getAttribute('after')
    ? this.getAttribute('after') !== ""
      ? this.getAttribute('after').split(',')
      : false
    : false;
  }
  
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.time = new Date().getTime();
    this._createShadowDOM();
    this._coreCallback(); // Run 1 time, before first interval fires
    this._core();
  }

  _updateElevator(node, time) {
    let elevator = node.querySelector('[data-aen-countdown-elevator]');
    let timer = node.querySelector('[data-aen-countdown-time]');

    elevator.textContent = time;
    node.classList.add('elevating');
    
    setTimeout(function() {
      timer.textContent = time;
      node.classList.remove('elevating');
    }, 500)
  }

  _compareAndUpdate(oneTime, twoTime) {
    let timers = this.shadow.querySelectorAll('[data-aen-countdown-digit]');

    oneTime.forEach((one, i) => {
      if (one !== twoTime[i]) {
        if (this.type == "elevator") {
          this._updateElevator(timers[i],twoTime[i]);
        }

        if (this.type == "blink") {
          timers[i].querySelector('[data-aen-countdown-time]').textContent = twoTime[i];
        }
      } 
    });
  }

  _coreCallback() {
    if (this.startDate > new Date().getTime()) this.disabled = true;
    if (this.disabled) return;

    let before = this.time;
    this.time = new Date().getTime();
  
    this._compareAndUpdate(before.digits, this.time.digits);
  }

  _core() {
    const loop = setInterval(this._coreCallback.bind(this), 1000);

    if(!this.stopDate) clearInterval(loop);
  }

  createStyling() {
    let style = document.createElement('style');
    let lineHeight = 1.6;

    style.innerHTML = `
      :host {
        display: flex;
        font-size: 16px;
        line-height: ${lineHeight};
      }

      [data-aen-countdown-digit="elevator"].aen-countdown__digit {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: calc(1em * ${lineHeight});
        overflow: hidden;
      }

      [data-aen-countdown-digit="blink"].aen-countdown__digit {
        display: inline-block;
      }
      
      .aen-countdown__digit.elevating > * {
        transform: translateY(100%);
        transition: transform .5s ease;
      }

      [data-aen-countdown-digit="elevator"] .aen-countdown__time {
        display: block;
      }
    `;
    this.shadow.appendChild(style);
  }

  createDigit(value, type) {
    const digit = document.createElement('div');
    digit.setAttribute('data-aen-countdown-digit', type);
    digit.classList.add('aen-countdown__digit')

    const time = document.createElement('span');
    time.classList.add('aen-countdown__time');
    time.textContent = value;
    
    if (type == "elevator") {
      let elevator = time.cloneNode(true);
      elevator.setAttribute('data-aen-countdown-elevator','');
      elevator.classList.add('aen-countdown__elevator');
      digit.appendChild(elevator);
    }

    let basic = time.cloneNode(true);
    basic.setAttribute('data-aen-countdown-time','');

    digit.appendChild(basic);
    
    return digit;
  }

  addSplit() {
    const split = document.createElement('span');
    split.classList.add('aen-countdown__split');
    split.textContent = this.split;

    return split;
  }

  addAfter(string) {
    const after = document.createElement('span');
    after.classList.add('aen-countdown__after');
    after.textContent = string;

    return after;
  }

  _createShadowDOM() {
    let digits = this.time.digits;
    let afterIndex = 0;

    digits.forEach((digit,i) => {
      this.shadow.appendChild(this.createDigit(digit,this.type));

      let split = i + 1;
      let useAfter = this.after
      ? afterIndex < digits.length
        ? true
        : false
      : false;

      if (split % 2 !== 0) return;
      if (useAfter) {
        if(this.after[afterIndex] !== "") {
          this.shadow.appendChild(this.addAfter(this.after[afterIndex]));
        }
        afterIndex++;
      }

      if (split > digits.length - 1) return;
      this.shadow.appendChild(this.addSplit());
    });

    this.createStyling();
  }
});