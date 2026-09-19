const body=document.body;
const toggle=document.querySelector('[data-menu-toggle]');
const menu=document.querySelector('[data-mobile-menu]');
const main=document.querySelector('main');
const footer=document.querySelector('.site-footer');

function setBackgroundInert(on){
  [main,footer,...document.querySelectorAll('.site-header>*:not(.menu-button)')].forEach(el=>{
    if(!el)return;
    on?el.setAttribute('inert',''):el.removeAttribute('inert');
  });
}
function openMenu(){
  body.classList.add('menu-open');
  menu?.setAttribute('aria-hidden','false');
  toggle?.setAttribute('aria-expanded','true');
  setBackgroundInert(true);
  requestAnimationFrame(()=>menu?.querySelector('a')?.focus());
}
function closeMenu({restore=true}={}){
  if(!body.classList.contains('menu-open'))return;
  body.classList.remove('menu-open');
  menu?.setAttribute('aria-hidden','true');
  toggle?.setAttribute('aria-expanded','false');
  setBackgroundInert(false);
  if(restore)requestAnimationFrame(()=>toggle?.focus());
}
toggle?.addEventListener('click',()=>body.classList.contains('menu-open')?closeMenu():openMenu());
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu({restore:false})));
addEventListener('keydown',event=>{
  if(event.key==='Escape')closeMenu();
  if(event.key!=='Tab'||!body.classList.contains('menu-open'))return;
  const focusables=[toggle,...(menu?[...menu.querySelectorAll('a')]:[])].filter(Boolean);
  const first=focusables[0];
  const last=focusables.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems=[...document.querySelectorAll('[data-reveal]')];
if(reduced){
  revealItems.forEach(el=>el.classList.add('is-visible'));
}else{
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  revealItems.forEach(el=>observer.observe(el));
}


/* Booking demo: local state only, no network or persistent storage. */
const booking=document.querySelector('[data-booking-demo]');
if(booking){
  let service='';
  let time='';
  const stepLabel=booking.querySelector('[data-booking-step]');
  const steps=[...booking.querySelectorAll('[data-step]')];
  const success=booking.querySelector('[data-booking-success]');
  const showStep=n=>{
    steps.forEach(el=>{const active=Number(el.dataset.step)===n;el.hidden=!active;el.classList.toggle('is-active',active);});
    if(stepLabel)stepLabel.textContent=String(n).padStart(2,'0');
  };
  booking.querySelectorAll('[data-booking-choice]').forEach(btn=>btn.addEventListener('click',()=>{
    service=btn.dataset.bookingChoice||'Consulenza';showStep(2);
  }));
  booking.querySelectorAll('[data-booking-time]').forEach(btn=>btn.addEventListener('click',()=>{
    time=btn.dataset.bookingTime||'Primo slot disponibile';
    const serviceOut=booking.querySelector('[data-booking-summary-service]');
    const timeOut=booking.querySelector('[data-booking-summary-time]');
    if(serviceOut)serviceOut.textContent=service;
    if(timeOut)timeOut.textContent='Preferenza: '+time;
    showStep(3);
  }));
  booking.querySelector('[data-booking-confirm]')?.addEventListener('click',()=>{
    steps.forEach(el=>el.hidden=true);
    booking.querySelector(':scope > h2')?.setAttribute('hidden','');
    success.hidden=false;
    success.focus();
  });
  booking.querySelector('[data-booking-reset]')?.addEventListener('click',()=>{
    service='';time='';success.hidden=true;booking.querySelector(':scope > h2')?.removeAttribute('hidden');showStep(1);
  });
}
