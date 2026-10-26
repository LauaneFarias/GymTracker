import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root='dist';
const manifest={name:'Gym Tracker',short_name:'Gym Tracker',id:'/',start_url:'/',scope:'/',display:'standalone',background_color:'#FAFAFB',theme_color:'#D8B5F2',icons:[192,512].map(size=>({src:`/icon-${size}.png`,sizes:`${size}x${size}`,type:'image/png',purpose:'any maskable'}))};
fs.writeFileSync(`${root}/manifest.webmanifest`,JSON.stringify(manifest));
let html=fs.readFileSync(`${root}/index.html`,'utf8').replace('</head>','<link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" content="#D8B5F2"><meta name="apple-mobile-web-app-capable" content="yes"><link rel="apple-touch-icon" href="/icon-192.png"></head>');
html=html.replace('</body>',`<script>if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(console.error));}</script></body>`);
fs.writeFileSync(`${root}/index.html`,html);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(root).filter(f=>!f.endsWith('.map')&&!f.endsWith('sw.js'));
const version=crypto.createHash('sha256');for(const f of files)version.update(fs.readFileSync(f));
const cache=`gym-shell-${version.digest('hex').slice(0,12)}`;
fs.writeFileSync(`${root}/sw.js`,`const CACHE=${JSON.stringify(cache)},ASSETS=${JSON.stringify(files.map(f=>'/'+path.relative(root,f)))};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(async cache=>{for(const url of ASSETS){const response=await fetch(url,{credentials:'same-origin'});if(!response.ok||response.redirected)throw new Error('App assets unavailable');await cache.put(url,response);}})));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('gym-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;if(url.pathname==='/'||url.pathname==='/index.html'){event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html')));return;}if(ASSETS.includes(url.pathname))event.respondWith(caches.match(url.pathname).then(hit=>hit||fetch(event.request)));});`);
console.log(`PWA prepared: ${files.length} offline assets, ${cache}`);
