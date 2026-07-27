/* ═══════════════════════════════════════════════════════════════
   حركة ظهور لطيفة للعناصر عند التمرير.
   الصفحة تعمل كاملةً بدون هذا الملف؛ فهو تحسينٌ لا شرط.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var items = [].slice.call(document.querySelectorAll(".reveal"));
  if (!items.length) return;

  function showAll() {
    items.forEach(function (el) {
      el.style.transitionDelay = "";
      el.classList.add("is-visible");
    });
    items = [];
  }

  // احترام تفضيل تقليل الحركة، أو غياب الدعم في المتصفحات القديمة
  if (
    !window.requestAnimationFrame ||
    (window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  ) {
    showAll();
    return;
  }

  // تأخير متدرّج داخل كل مجموعة ليتتابع الظهور
  var seen = new Map();
  items.forEach(function (el) {
    var i = seen.get(el.parentElement) || 0;
    el.style.transitionDelay = Math.min(i, 5) * 90 + "ms";
    seen.set(el.parentElement, i + 1);
  });

  var ticking = false;

  function check() {
    ticking = false;
    var limit = window.innerHeight * 0.92;
    var rest = [];

    items.forEach(function (el) {
      // الشرط يشمل ما هو فوق الشاشة أيضًا (top سالب)،
      // فلا يبقى شيء مخفيًا عند القفز المفاجئ إلى أسفل الصفحة
      if (el.getBoundingClientRect().top < limit) {
        el.classList.add("is-visible");
      } else {
        rest.push(el);
      }
    });

    items = rest;
    if (!items.length) {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    }
  }

  function request() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(check);
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  check();
})();
