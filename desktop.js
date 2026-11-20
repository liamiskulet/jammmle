(() => {
 const $ = (s,root=document) => root.querySelector(s);
 const $$ = (s,root=document) => [...root.querySelectorAll(s)];
 const home=$('#home'), desktop=$('#desktop'), windows=$$('.window'), dock=$('#dock');
 let z=20, activeWindow=null;
 const apps={browser:{title:'Browser',icon:'◎'},anime:{title:'Anime',icon:'▷'},settings:{title:'Settings',icon:'⚙'},files:{title:'Files',icon:'▤'},links:{title:'Link Studio',icon:'↗'}};
 function enterDesktop(){home.classList.add('hidden');desktop.classList.add('active');openApp('browser')}
 function focus(win){if(!win)return;z++;win.style.zIndex=z;activeWindow=win}
 function openApp(name){const win=$('#win-'+name);if(!win)return;win.hidden=false;win.classList.add('active');focus(win);const btn=$('[data-launch="'+name+'"]');if(btn)btn.classList.add('open')}
 function closeApp(win){win.hidden=true;win.classList.remove('active');const name=win.dataset.window;const btn=$('[data-launch="'+name+'"]');if(btn)btn.classList.remove('open')}
 $('#search-form').addEventListener('submit',e=>{e.preventDefault();const q=$('#home-query').value.trim();if(!q)return;enterDesktop();openApp('browser');navigate(q)});
 function navigate(raw){const value=raw.trim();if(!value)return;const url=/^https?:\/\//i.test(value)?value:/^([\w-]+\.)+[a-z]{2,}([/\?#].*)?$/i.test(value)?'https://'+value:'https://www.google.com/search?q='+encodeURIComponent(value);$('#browser-address').value=url;$('#browser-view').innerHTML='<div><div style="font-size:2rem;margin-bottom:10px">↗</div><strong>Ready to visit</strong><p style="max-width:430px">Some websites block being displayed inside another website. Open the address in a new tab if the preview does not load.</p><button class="primary" id="open-external">Open website ↗</button></div>';$('#open-external').onclick=()=>window.open(url,'_blank','noopener,noreferrer')}
 $('#browser-go').addEventListener('click',()=>navigate($('#browser-address').value));
 $('#browser-address').addEventListener('keydown',e=>{if(e.key==='Enter')navigate(e.target.value)});
 $$('#home [data-open]').forEach(b=>b.addEventListener('click',()=>{enterDesktop();openApp(b.dataset.open)}));
 $$('[data-launch]').forEach(b=>b.addEventListener('click',()=>{if(!desktop.classList.contains('active'))enterDesktop();openApp(b.dataset.launch)}));
 $$('.window').forEach(win=>{
  win.addEventListener('pointerdown',()=>focus(win));
  $('.close',win).addEventListener('click',()=>closeApp(win));
  $('.min',win).addEventListener('click',()=>{win.hidden=true});
  $('.max',win).addEventListener('click',()=>{win.classList.toggle('maximized');if(win.classList.contains('maximized')){win.dataset.prev=win.getAttribute('style')||'';Object.assign(win.style,{left:'50%',top:'50%',width:'calc(100vw - 22px)',height:'calc(100svh - 112px)',transform:'translate(-50%,-50%)',borderRadius:'18px'})}else{win.setAttribute('style',win.dataset.prev||'')}})
  const head=$('.window-head',win);let drag=null;
  head.addEventListener('pointerdown',e=>{if(e.target.closest('button')||win.classList.contains('maximized'))return;const r=win.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top};head.setPointerCapture(e.pointerId);focus(win)});
  head.addEventListener('pointermove',e=>{if(!drag)return;win.style.left=Math.max(12,Math.min(innerWidth-win.offsetWidth-12,e.clientX-drag.x+win.offsetWidth/2))+'px';win.style.top=Math.max(55,Math.min(innerHeight-win.offsetHeight-85,e.clientY-drag.y+48))+'px';win.style.transform='translate(-50%,-50%)'});
  head.addEventListener('pointerup',()=>drag=null);head.addEventListener('pointercancel',()=>drag=null);
 });
 $('#logo').addEventListener('click',e=>{const el=e.currentTarget;el.classList.remove('replay');void el.offsetWidth;el.classList.add('replay')});
 $$('.swatch').forEach(b=>b.addEventListener('click',()=>{const c=b.dataset.color;document.documentElement.style.setProperty('--accent',c);document.documentElement.style.setProperty('--accent-rgb',c)}));
 $('#back-home').addEventListener('click',()=>{desktop.classList.remove('active');home.classList.remove('hidden')});
 $('#anime-demo').addEventListener('click',()=>$('#anime-status').textContent='The player interface is ready. Streaming sources and backend support will be added in a later phase.');
 $('#make-link').addEventListener('click',()=>{const app=$('#link-app').value;const link=location.origin+location.pathname+'?app='+encodeURIComponent(app);$('#generated-link').value=link;$('#generated-link').select();});
 const params=new URLSearchParams(location.search);if(params.get('app')&&apps[params.get('app')]){enterDesktop();openApp(params.get('app'))}
})();