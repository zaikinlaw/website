(function () {
  const KEY = "cookie_consent"; // "yes" | "no"
  const METRIKA_ID = 106587867;

  function getConsent() {
    try {
      return localStorage.getItem(KEY); // "yes", "no" или null
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {}
  }

  // Яндекс.Метрика подключается только после согласия
  function loadMetrika() {
    if (window.__metrikaLoaded) return;
    window.__metrikaLoaded = true;

    (function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = 1 * new Date();
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(
      window,
      document,
      "script",
      "https://mc.yandex.ru/metrika/tag.js?id=" + METRIKA_ID,
      "ym",
    );

    ym(METRIKA_ID, "init", {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    });
  }

  function showBanner() {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Использование файлов cookie");
    banner.innerHTML = `
      <p class="cookie-banner-text">
        Этот сайт использует файлы cookie и метрические программы для
        улучшения работы. Подробнее в
        <a class="link subtle" href="policy.html">Политике конфиденциальности</a>.
      </p>
      <div class="cookie-banner-actions">
        <button class="btn cookie-banner-btn cookie-banner-decline" type="button">Отказаться</button>
        <button class="btn btn-primary cookie-banner-btn cookie-banner-accept" type="button">Согласен</button>
      </div>
    `;
    document.body.appendChild(banner);

    requestAnimationFrame(() => banner.classList.add("is-visible"));

    function close() {
      banner.classList.remove("is-visible");
      setTimeout(() => banner.remove(), 300);
    }

    banner
      .querySelector(".cookie-banner-accept")
      .addEventListener("click", () => {
        setConsent("yes");
        close();
        loadMetrika();
      });

    banner
      .querySelector(".cookie-banner-decline")
      .addEventListener("click", () => {
        setConsent("no");
        close();
      });
  }

  const consent = getConsent();

  if (consent === "yes") {
    loadMetrika();
  } else if (consent === null) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBanner);
    } else {
      showBanner();
    }
  }
  // consent === "no": ничего не грузим и баннер не показываем
})();
