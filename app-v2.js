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
