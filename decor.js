// Анимация линии этапов и строк кейсов. Контент работает и без этого файла.
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("decor-ready");

  // Срабатывает один раз при показе на экране
  var drawObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-drawn");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -6% 0px" },
  );
  document.querySelectorAll("[data-draw]").forEach(function (el) {
    drawObserver.observe(el);
  });
})();
