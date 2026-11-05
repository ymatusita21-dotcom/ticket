// 電子チケット: 画面の部品を端末に保存して、電波が無くても開けるようにする (公演ポータルとの通信は保存しない)
const CACHE = 'ls-ticket-v4';
// キャストの写真 (Google ドライブ) も、一度出した物は端末に保存して電波が無くても出す
const IMG = 'ls-ticket-img';
const IMG_HOST = /(^|\.)(googleusercontent\.com|drive\.google\.com)$/;
const FILES = ['./', './index.html', './qrcode.min.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== IMG).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method === 'GET' && e.request.destination === 'image' && IMG_HOST.test(u.hostname)) {
    // 保存した物を先に出す (写真はめったに変わらない)。無ければ取りに行って保存
    e.respondWith(caches.open(IMG).then((c) => c.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) c.put(e.request, res.clone());
      return res;
    }))));
    return;
  }
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // 新しい物を優先し、つながらない時だけ保存した物を出す
  e.respondWith(fetch(e.request).then((res) => {
    if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'))));
});
