/* eazie analytics - Google Analytics 4, loaded ONLY after the visitor accepts.
   1) Paste your GA4 Measurement ID below (looks like G-ABC123DEF4).
   2) Make sure the privacy page link is right.
   Until the ID is set, nothing loads and no banner is shown. */
(function () {
  var ID = "G-N653ZDCX2G";          // <-- your GA4 Measurement ID
  var PRIVACY = "privacy.html";   // <-- your privacy policy page
  var KEY = "eazie_consent";
  var on = /^G-[A-Z0-9]{6,}$/.test(ID) && ID !== "G-XXXXXXXXXX";
  var loaded = false;

  window.track = function (name, params) {          // anonymous event, only if consent given
    if (loaded && window.gtag) window.gtag("event", name, params || {});
  };
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function load() {
    if (loaded || !on) return;
    loaded = true;
    window["ga-disable-" + ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(s);
  }
  function stop() {                                  // withdraw consent: stop and clear GA cookies
    window["ga-disable-" + ID] = true;
    document.cookie.split(";").forEach(function (c) {
      var n = c.split("=")[0].trim();
      if (n.indexOf("_ga") === 0) {
        var past = "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = n + past;
        document.cookie = n + past + ";domain=" + location.hostname;
        document.cookie = n + past + ";domain=." + location.hostname.replace(/^www\./, "");
      }
    });
  }
  function banner() {
    var old = document.getElementById("eb-consent"); if (old) old.remove();
    var b = document.createElement("div");
    b.id = "eb-consent"; b.setAttribute("role", "dialog"); b.setAttribute("aria-label", "Cookie settings");
    b.innerHTML = '<p>We use Google Analytics to count visits so we can improve eazie. It only runs if you say yes. <a href="' + PRIVACY + '">Privacy</a></p>' +
      '<div><button class="eb" data-c="1">Accept</button><button class="eb ghost" data-c="0">Decline</button></div>';
    b.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.dataset.c === "1") { set("granted"); load(); } else { set("denied"); stop(); }
      b.remove();
    });
    document.body.appendChild(b);
  }
  function init() {
    if (!on) return;
    var c = get();
    if (c === "granted") load(); else if (c !== "denied") banner();
    document.querySelectorAll("[data-cookie-settings]").forEach(function (a) {
      a.hidden = false;
      a.addEventListener("click", function (e) { e.preventDefault(); banner(); });
    });
  }
  window.addEventListener("appinstalled", function () { window.track("app_installed"); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
