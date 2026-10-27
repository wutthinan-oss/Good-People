/* ติดตั้งเป็นแอปบนมือถือ (PWA): service worker + ปุ่ม/แบนเนอร์ชวนติดตั้ง */
(function () {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  var ua = navigator.userAgent || '';
  var standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  var ios = /iphone|ipad|ipod/i.test(ua);
  var inApp = /Line\/|FBAN|FBAV|Instagram|MicroMessenger/i.test(ua);
  var deferred = null;

  addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; syncBtns(); });
  addEventListener('appinstalled', function () { deferred = null; hideBar(true); syncBtns(); });

  function syncBtns() {
    var b = document.getElementById('bInstall');
    if (b && !standalone && (deferred || ios)) b.hidden = false;
  }

  /* ขั้นตอนติดตั้งแบบมือ (ใช้เมื่อเบราว์เซอร์ไม่เด้งหน้าต่างติดตั้งเอง) */
  function help() {
    var m = document.getElementById('installHelp');
    if (!m) { alert(ios ? 'กดปุ่มแชร์ใน Safari แล้วเลือก "เพิ่มไปยังหน้าจอโฮม"' : 'เปิดเมนูของเบราว์เซอร์ แล้วเลือก "ติดตั้งแอป" หรือ "เพิ่มไปยังหน้าจอหลัก"'); return; }
    m.querySelectorAll('[data-os]').forEach(function (x) {
      var show = ios ? x.dataset.os === 'ios' : (inApp ? x.dataset.os === 'inapp' : x.dataset.os === 'android');
      x.hidden = !show;
    });
    m.hidden = false;
  }
  window.CADET_INSTALL = function () {
    if (deferred) { deferred.prompt(); deferred.userChoice.finally(function () { deferred = null; hideBar(true); syncBtns(); }); }
    else help();
  };

  /* แบนเนอร์ชวนติดตั้ง (หน้าแรก) */
  var KEY = 'cadet_install_dismiss';
  function dismissed() { try { return Date.now() - Number(localStorage.getItem(KEY) || 0) < 7 * 864e5; } catch (e) { return false; } }
  function hideBar(forever) {
    var bar = document.getElementById('installBar'); if (bar) bar.hidden = true;
    try { localStorage.setItem(KEY, String(forever ? Date.now() + 3650 * 864e5 : Date.now())); } catch (e) {}
  }
  function init() {
    syncBtns();
    document.querySelectorAll('[data-install]').forEach(function (el) { el.addEventListener('click', function (e) { e.preventDefault(); window.CADET_INSTALL(); }); });
    var bar = document.getElementById('installBar');
    var m = document.getElementById('installHelp');
    if (m) m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) m.hidden = true; });
    if (bar && !standalone && !dismissed() && (matchMedia('(max-width:900px)').matches || matchMedia('(pointer:coarse)').matches)) {
      setTimeout(function () { bar.hidden = false; }, 1200);
      var x = bar.querySelector('[data-later]'); if (x) x.addEventListener('click', function () { hideBar(false); });
    }
  }
  if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);

  var btn = document.getElementById('bInstall');
  if (btn) btn.addEventListener('click', function () { window.CADET_INSTALL(); });
})();
