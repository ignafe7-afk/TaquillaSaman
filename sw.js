// Guarda la app en el teléfono para que abra aunque falle el internet.
var CACHE='taquilla-v4';
var APP=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','lib-xlsx.js','lib-jspdf.js','lib-autotable.js'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(APP);}));self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}));self.clients.claim();});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var url=new URL(e.request.url);
  // la página: primero internet (para recibir actualizaciones), si no hay, la copia guardada
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(function(r){var cp=r.clone();caches.open(CACHE).then(function(c){c.put('index.html',cp);});return r;}).catch(function(){return caches.match('index.html');}));
    return;
  }
  // resto (íconos, fuentes): copia guardada primero
  e.respondWith(caches.match(e.request).then(function(hit){
    return hit||fetch(e.request).then(function(r){
      if(r.ok||url.hostname.indexOf('gstatic')>-1||url.hostname.indexOf('googleapis')>-1){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp);});}
      return r;
    });
  }));
});
