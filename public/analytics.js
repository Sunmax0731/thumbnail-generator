(function () {
  var config = window.SUNMAX_ANALYTICS || {};
  var measurementId = config.googleAnalyticsMeasurementId;
  if (!/^G-[A-Z0-9]+$/.test(measurementId || "")) return;
  if (window.__sunmaxAnalyticsLoaded) return;
  window.__sunmaxAnalyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId);
})();
