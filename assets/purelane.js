/* ============================================================
   PURELANE SHOPIFY THEME - CORE JAVASCRIPT
   Exact behavioral reproduction of purelane-homepage.html
   ============================================================ */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initPurelane() {
    /* ---------- reveal on scroll ---------- */
    var revs = document.querySelectorAll('.rv');
    if ('IntersectionObserver' in window && !reduce) {
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            ro.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
      revs.forEach(function (el) { ro.observe(el); });
    } else {
      revs.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- scene crossfade ---------- */
    var scenes = [].slice.call(document.querySelectorAll('.scene'));
    var zones = [].slice.call(document.querySelectorAll('[data-scene]'));
    var stage = document.getElementById('scenes');
    var current = 0;

    function setScene(n) {
      if (n === current) return;
      current = n;
      scenes.forEach(function (s, i) { s.classList.toggle('on', i + 1 === n); });
      if (stage) stage.setAttribute('data-d', String(n));
    }

    function pickScene() {
      var focus = window.scrollY + window.innerHeight * 0.5, n = 1;
      for (var i = 0; i < zones.length; i++) {
        var z = zones[i], top = 0, el = z;
        while (el) { top += el.offsetTop; el = el.offsetParent; }
        if (top <= focus) n = parseInt(z.getAttribute('data-scene'), 10) || n;
      }
      setScene(n);
    }

    /* ---------- rail sync ---------- */
    function getAbsoluteTop(el) {
      var top = 0;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
      }
      return top;
    }

    function syncRail() {
      var railLinks = [].slice.call(document.querySelectorAll('.rail a'));
      if (!railLinks.length) return;
      var mid = window.scrollY + window.innerHeight * 0.42;
      var activeIndex = 0;
      var maxTop = -1;

      railLinks.forEach(function (a, i) {
        var href = a.getAttribute('href');
        if (!href) return;
        var t = document.querySelector(href);
        if (t) {
          var top = getAbsoluteTop(t);
          if (top <= mid && top > maxTop) {
            maxTop = top;
            activeIndex = i;
          }
        }
      });

      railLinks.forEach(function (a, i) {
        a.classList.toggle('on', i === activeIndex);
      });
    }

    /* ---------- parallax + header ---------- */
    var hdr = document.getElementById('hdr');
    var prod = document.getElementById('heroProd');
    var raf = null;

    function frame() {
      raf = null;
      var y = window.scrollY || window.pageYOffset;
      if (hdr) hdr.classList.toggle('up', y > 90);
      if (!reduce) {
        var wl = document.querySelectorAll('#water .wl');
        for (var i = 0; i < wl.length; i++) {
          var d = [0.05, 0.09, 0.03, 0.02][i] || 0.05;
          wl[i].style.setProperty('--px', '0px');
          wl[i].style.setProperty('--py', (-y * d).toFixed(1) + 'px');
        }
        if (prod) {
          var f = Math.min(y / 700, 1);
          prod.style.transform = 'translate3d(0,' + (-f * 54).toFixed(2) + 'px,0) scale(' + (1 - f * 0.06).toFixed(3) + ')';
          prod.style.opacity = (1 - f * 0.55).toFixed(3);
        }
      }
      syncRail();
      pickScene();
    }

    function onScroll() { if (!raf) raf = requestAnimationFrame(frame); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    /* ---------- hero stage: 1 -> 2 -> 3 products ---------- */
    var hstage = document.getElementById('hstage');
    if (hstage) {
      var hs = [].slice.call(hstage.querySelectorAll('.hslide'));
      var hd = [].slice.call(document.querySelectorAll('#hdots button'));
      var hi = 0, htimer = null;

      function hgo(n) {
        if (!hs.length) return;
        hi = (n + hs.length) % hs.length;
        hs.forEach(function (s, i) { s.classList.toggle('on', i === hi); });
        hd.forEach(function (d, i) { d.classList.toggle('on', i === hi); });
      }

      function hplay() { if (!htimer && !reduce && hs.length > 1) htimer = setInterval(function () { hgo(hi + 1); }, 3800); }
      function hstop() { if (htimer) { clearInterval(htimer); htimer = null; } }

      hd.forEach(function (d, i) {
        d.addEventListener('click', function () { hstop(); hgo(i); hplay(); });
      });
      hstage.addEventListener('mouseenter', hstop);
      hstage.addEventListener('mouseleave', hplay);

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { e.isIntersecting ? hplay() : hstop(); });
        }, { threshold: 0.2 }).observe(hstage);
      } else { hplay(); }
    }

    /* ---------- product rotator ---------- */
    var rot = document.getElementById('rot');
    if (rot) {
      var rimgs = [].slice.call(rot.querySelectorAll('.frame .pimg'));
      var rdots = [].slice.call(rot.querySelectorAll('.dots i'));
      var rcapB = rot.querySelector('.cap b');
      var rcapS = rot.querySelector('.cap span');
      var ri = 0, rtimer = null;

      function rstep() {
        if (!rimgs.length) return;
        rimgs[ri].classList.remove('on');
        if (rdots[ri]) rdots[ri].classList.remove('on');
        ri = (ri + 1) % rimgs.length;
        rimgs[ri].classList.add('on');
        if (rdots[ri]) rdots[ri].classList.add('on');
        if (rcapB) rcapB.innerHTML = rimgs[ri].getAttribute('data-name') || '';
        if (rcapS) rcapS.textContent = rimgs[ri].getAttribute('data-note') || '';
      }

      if (!reduce && rimgs.length > 1) {
        var rio = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting && !rtimer) rtimer = setInterval(rstep, 2900);
            else if (!e.isIntersecting && rtimer) { clearInterval(rtimer); rtimer = null; }
          });
        }, { threshold: 0.25 });
        rio.observe(rot);
      }
    }

    /* ---------- FLOATING PROGRESS SIDE RAIL SYNC ---------- */
    var railLinks = [].slice.call(document.querySelectorAll('.rail a'));
    function syncRail() {
      if (!railLinks.length) return;
      var sy = window.scrollY + window.innerHeight * 0.35;
      var curIdx = 0;
      for (var i = 0; i < railLinks.length; i++) {
        var href = railLinks[i].getAttribute('href');
        if (!href || href === '#') continue;
        var target = document.querySelector(href);
        if (target) {
          var top = target.offsetTop;
          if (sy >= top) {
            curIdx = i;
          }
        }
      }
      railLinks.forEach(function (a, idx) {
        if (idx === curIdx) {
          a.classList.add('on');
        } else {
          a.classList.remove('on');
        }
      });
    }

    window.addEventListener('scroll', syncRail, { passive: true });
    syncRail();

    frame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPurelane);
  } else {
    initPurelane();
  }

  /* Shopify Theme Editor integration */
  document.addEventListener('shopify:section:load', function () {
    initPurelane();
  });
})();
