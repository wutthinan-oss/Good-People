/* ติดตั้งเป็นแอปบนมือถือ (PWA) */
(function () {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  var btn = document.getElementById('bInstall'), deferred = null;
  var standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (!btn || standalone) return;
  addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; btn.hidden = false; });
  if (ios) btn.hidden = false;
  btn.addEventListener('click', function () {
    if (deferred) { deferred.prompt(); deferred.userChoice.finally(function () { deferred = null; btn.hidden = true; }); }
    else alert(ios ? 'บน iPhone/iPad: กดปุ่มแชร์ (สี่เหลี่ยมมีลูกศร) ใน Safari แล้วเลือก "เพิ่มไปยังหน้าจอโฮม"' : 'เปิดเมนูของเบราว์เซอร์ แล้วเลือก "ติดตั้งแอป" หรือ "เพิ่มลงในหน้าจอหลัก"');
  });
  addEventListener('appinstalled', function () { btn.hidden = true; });
})();
