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
 // Theme engine: presets, live controls, and local persistence.
 const root=document.documentElement, dockWrap=$('.dock-wrap');
 const defaults={preset:'midnight',accent:'#b99aff',wallpaper:'aurora',blur:24,radius:22,motion:100,dock:'bottom'};
 const presets={midnight:{accent:'#b99aff',wallpaper:'aurora'},arctic:{accent:'#83c9ff',wallpaper:'ocean'},rose:{accent:'#ff9fc8',wallpaper:'dusk'},emerald:{accent:'#8ee0bd',wallpaper:'plain'}};
 let theme={...defaults};
 try{const saved=JSON.parse(localStorage.getItem('jammle-theme')||'null');if(saved)theme={...defaults,...saved}}catch(e){}
 function applyTheme(){root.style.setProperty('--accent',theme.accent);root.style.setProperty('--blur',theme.blur+'px');root.style.setProperty('--radius',theme.radius+'px');root.style.setProperty('--motion',String(theme.motion/100));const backgrounds={aurora:'radial-gradient(ellipse at 18% 12%,#312449 0,transparent 38%),radial-gradient(ellipse at 85% 85%,#172d4b 0,transparent 38%),linear-gradient(145deg,#090a12,#11111e 60%,#090b14)',dusk:'radial-gradient(ellipse at 18% 15%,#512b48 0,transparent 42%),radial-gradient(ellipse at 85% 85%,#30203e 0,transparent 40%),linear-gradient(145deg,#100a13,#1b111e)',ocean:'radial-gradient(ellipse at 20% 12%,#17465a 0,transparent 42%),radial-gradient(ellipse at 85% 80%,#172d55 0,transparent 40%),linear-gradient(145deg,#071018,#0d1826)',plain:'linear-gradient(145deg,#08090d,#11131a)'};root.style.setProperty('--wallpaper-bg',backgrounds[theme.wallpaper]||backgrounds.aurora);dockWrap.classList.remove('dock-left','dock-right');if(theme.dock==='left')dockWrap.classList.add('dock-left');if(theme.dock==='right')dockWrap.classList.add('dock-right');$('#accent-picker').value=theme.accent;$('#wallpaper-select').value=theme.wallpaper;$('#blur-range').value=theme.blur;$('#radius-range').value=theme.radius;$('#motion-range').value=theme.motion;$('#dock-select').value=theme.dock;$('#blur-value').textContent=theme.blur;$('#radius-value').textContent=theme.radius;$('#motion-value').textContent=theme.motion;$('[data-preset]').forEach(b=>b.classList.toggle('selected',b.dataset.preset===theme.preset));}
 function saveTheme(){try{localStorage.setItem('jammle-theme',JSON.stringify(theme));$('#theme-saved').textContent='Saved on this device'}catch(e){$('#theme-saved').textContent='Changes active until you close this page'}}
 function updateTheme(key,value){theme[key]=value;if(key==='accent'||key==='wallpaper')theme.preset='custom';applyTheme();saveTheme()}
 $('[data-preset]').forEach(b=>b.addEventListener('click',()=>{const p=b.dataset.preset;theme={...theme,...presets[p],preset:p};applyTheme();saveTheme()}));
 $('#accent-picker').addEventListener('input',e=>updateTheme('accent',e.target.value));
 $('#wallpaper-select').addEventListener('change',e=>updateTheme('wallpaper',e.target.value));
 $('#blur-range').addEventListener('input',e=>updateTheme('blur',Number(e.target.value)));
 $('#radius-range').addEventListener('input',e=>updateTheme('radius',Number(e.target.value)));
 $('#motion-range').addEventListener('input',e=>updateTheme('motion',Number(e.target.value)));
 $('#dock-select').addEventListener('change',e=>updateTheme('dock',e.target.value));
 $('#reset-theme').addEventListener('click',()=>{theme={...defaults};applyTheme();saveTheme()});
 applyTheme();
 $('#back-home').addEventListener('click',()=>{desktop.classList.remove('active');home.classList.remove('hidden')});
 $('#anime-demo').addEventListener('click',()=>$('#anime-status').textContent='The player interface is ready. Streaming sources and backend support will be added in a later phase.');
 $('#make-link').addEventListener('click',()=>{const app=$('#link-app').value;const link=location.origin+location.pathname+'?app='+encodeURIComponent(app);$('#generated-link').value=link;$('#generated-link').select();});
 const params=new URLSearchParams(location.search);if(params.get('app')&&apps[params.get('app')]){enterDesktop();openApp(params.get('app'))}
})();