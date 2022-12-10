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

  get disable() {

  }

  set disable(value) {

  }
  
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    this.status = 'active';
   

  }

  runCountdown() {
    if(!this.disable)
  }

  connectedCallback() {
    console.warn(this.startDate)
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
