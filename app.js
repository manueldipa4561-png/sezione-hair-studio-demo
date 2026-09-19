const body=document.body;
const btn=document.querySelector('[data-menu-toggle]');
const menu=document.getElementById('mobile-nav');
const main=document.querySelector('main');
const footer=document.querySelector('.footer');
function inert(on){[main,footer,...document.querySelectorAll('.header>*:not(.menu-toggle)')].forEach(el=>{if(!el)return;on?el.setAttribute('inert',''):el.removeAttribute('inert')})}
function openMenu(){body.classList.add('menu-open');menu?.setAttribute('aria-hidden','false');btn?.setAttribute('aria-expanded','true');inert(true);requestAnimationFrame(()=>menu?.querySelector('a')?.focus())}
function closeMenu({restore=true}={}){if(!body.classList.contains('menu-open'))return;body.classList.remove('menu-open');menu?.setAttribute('aria-hidden','true');btn?.setAttribute('aria-expanded','false');inert(false);if(restore)requestAnimationFrame(()=>btn?.focus())}
btn?.addEventListener('click',()=>body.classList.contains('menu-open')?closeMenu():openMenu());
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu({restore:false})));
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();if(e.key!=='Tab'||!body.classList.contains('menu-open'))return;const fs=[btn,...(menu?[...menu.querySelectorAll('a')]:[])].filter(Boolean);const first=fs[0],last=fs.at(-1),active=document.activeElement;if(e.shiftKey&&active===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&active===last){e.preventDefault();first.focus()}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const reveals=[...document.querySelectorAll('.reveal')];if(reduced){reveals.forEach(x=>x.classList.add('is-visible'))}else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -5% 0px'});reveals.forEach(x=>io.observe(x))}
document.querySelector('[data-demo-book]')?.addEventListener('click',e=>{const panel=e.currentTarget.closest('.contact-form');if(panel)panel.innerHTML='<p class="kicker">DEMO PORTFOLIO</p><h2>Prenotazione simulata.</h2><p class="lede">Nessun dato è stato inviato o salvato. In un progetto reale questa interfaccia si collegherebbe al gestionale scelto dal salone.</p><a class="cta-light" href="./">Torna alla home</a>'});