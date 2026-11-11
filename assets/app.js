/* Ankush Portfolio — interactions. Content lives in assets/content.js */
(function () {
  "use strict";
  var C = window.SITE_CONTENT || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var get = function (path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, C); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  var startHash = location.hash.replace("#", "");
  window.scrollTo(0, 0);

  /* ---------------- 1. render content ---------------- */
  if (C.pageTitle) document.title = C.pageTitle;
  $$("[data-c]").forEach(function (el) { var v = get(el.dataset.c); if (v != null) el.textContent = v; });
  $$("[data-html]").forEach(function (el) { var v = get(el.dataset.html); if (v != null) el.innerHTML = v; });
  $$("[data-src]").forEach(function (el) { el.src = get(el.dataset.src) || ""; el.alt = get(el.dataset.alt) || ""; });
  $$("[data-list]").forEach(function (el) {
    var arr = get(el.dataset.list) || [];
    var isUl = el.tagName === "UL";
    el.innerHTML = arr.map(function (t) { return isUl ? "<li>" + t + "</li>" : "<span><i>" + t + "</i></span>"; }).join("");
  });
  var navLinks = $$(".dock a");
  (C.nav || []).forEach(function (t, i) { if (navLinks[i]) navLinks[i].textContent = t; });
  $("#stickerText").textContent = (C.sticker || "MORE CREATIVE • BY MINDSET • ");
  $("#year").textContent = new Date().getFullYear();
  var mail = (C.contact && C.contact.email) || "";
  var mailLink = $("#mailLink"); mailLink.textContent = mail; mailLink.href = "mailto:" + mail;
  $("#socials").innerHTML = ((C.contact && C.contact.socials) || []).map(function (s) {
    return '<li><a href="' + s.url + '" target="_blank" rel="noopener">' + s.label + " ↗</a></li>";
  }).join("");

  // stats with connecting arrows
  var stats = (C.projectsSheet && C.projectsSheet.stats) || [];
  $("#stats").innerHTML = stats.map(function (s, i) {
    var arrow = i < stats.length - 1 ? '<svg class="stat__arrow" viewBox="0 0 34 34" aria-hidden="true"><path d="M7 17h19M19 10l7 7-7 7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' : "";
    return '<div class="stat"><span class="stat__fig">FIG.0' + (i + 1) + '</span><span class="stat__n" data-n="' + s.value + '">' + s.value + '</span><span class="stat__l">' + s.label + "</span>" + arrow + "</div>";
  }).join("");

  // jagged burst sticker
  (function () {
    var pts = [], n = 22, cx = 120, cy = 120;
    for (var i = 0; i < n * 2; i++) {
      var a = (Math.PI * i) / n, r = i % 2 ? 92 + ((i * 7) % 5) : 116 - ((i * 3) % 6);
      pts.push((cx + Math.cos(a) * r).toFixed(1) + "," + (cy + Math.sin(a) * r).toFixed(1));
    }
    $("#burstPoly").setAttribute("points", pts.join(" "));
  })();

  // train
  var projects = (C.train && C.train.projects) || [];
  var track = $("#trainTrack");
  var wheels = function () {
    return '<div class="wheels">' + [6, 13, 80, 87].map(function (p) { return '<span class="wheel" style="left:' + p + '%"></span>'; }).join("") + "</div>";
  };
  var html = '<div class="engine"><div class="engine__body"><div class="engine__name">' + (C.name || "Ankush") + ' Express<small>LDH 07 · BEST WORK SPECIAL</small></div><div class="engine__glass"></div><div class="engine__light"></div></div>' + wheels() + '</div>';
  projects.forEach(function (p, i) {
    var no = String(i + 1).padStart(2, "0");
    html += '<span class="coupler"></span><div class="coach" data-i="' + i + '"><div class="coach__roof"></div><span class="coach__no">LDH 07 · COACH C' + no + '</span>' +
      '<span class="coach__door coach__door--l"></span><span class="coach__door coach__door--r"></span>' +
      '<a class="coach__win" href="' + (p.link || "#") + '"' + (p.link && p.link !== "#" ? ' target="_blank" rel="noopener"' : "") + ' aria-label="' + p.title + '">' +
      '<div class="card"><img src="' + p.img + '" alt="' + p.title + ' thumbnail" loading="lazy" width="800" height="560"><div class="card__label"><span class="card__t">' + p.title + '</span><span class="card__m">' + p.type + " · " + p.year + "</span></div></div></a>" +
      wheels() + "</div>";
  });
  track.innerHTML = html;
  $$(".coach__win").forEach(function (a) { if (a.getAttribute("href") === "#") a.addEventListener("click", function (e) { e.preventDefault(); }); });

  /* ---------------- 2. cursor ---------------- */
  var cursor = $(".cursor");
  if (finePointer && cursor) {
    var cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy, started = false;
    window.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!started) { started = true; cx = tx; cy = ty; document.documentElement.classList.add("has-cursor"); loop(); }
    }, { passive: true });
    document.addEventListener("mouseleave", function () { cursor.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { cursor.style.opacity = ""; });
    var loop = function () {
      cx += (tx - cx) * (reduce ? 1 : 0.28); cy += (ty - cy) * (reduce ? 1 : 0.28);
      cursor.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      requestAnimationFrame(loop);
    };
    document.addEventListener("mouseover", function (e) {
      cursor.classList.toggle("is-hover", !!e.target.closest("a,button"));
    });
  }

  /* ---------------- helpers ---------------- */
  var absTop = function (el) { return el.getBoundingClientRect().top + window.scrollY; };
  var jump = function (y) { window.scrollTo({ top: y, left: 0, behavior: "instant" }); };
  var targetY = function (id) {
    var stage = $("#home");
    if (id === "home") return 0;
    if (id === "about") return absTop(stage) + (stage.offsetHeight - innerHeight) * 0.78;
    var el = document.getElementById(id);
    return el ? absTop(el) : 0;
  };

  if (!hasGsap) { // graceful fallback without GSAP
    $("#loader").remove(); document.body.classList.remove("is-loading"); document.body.classList.add("is-ready");
    $$("[data-go]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: targetY(a.dataset.go), behavior: "smooth" }); }); });
    return;
  }

  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  var draw = function (sel) { gsap.set(sel, { strokeDasharray: 1, strokeDashoffset: 1 }); };

  /* ---------------- 3. dock nav + hand-drawn circle ---------------- */
  var dock = $("#dock"), circle = $("#dockCircle"), circlePath = $("#dockCircle path"), activeGroup = null;
  draw(circlePath);
  function placeCircle(link, animate) {
    var w = link.offsetWidth + 14, h = link.offsetHeight + 10;
    circle.style.width = w + "px"; circle.style.height = h + "px";
    circle.style.transform = "translate(" + (link.offsetLeft - 7) + "px," + (link.offsetTop - 5) + "px)";
    if (animate) gsap.fromTo(circlePath, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: reduce ? 0.01 : 0.7, ease: "power2.out", delay: 0.15 });
  }
  function setActive(group) {
    if (group === activeGroup) return;
    activeGroup = group;
    var link = null;
    navLinks.forEach(function (a) { var on = a.dataset.group === group; a.classList.toggle("is-active", on); if (on) { link = a; a.setAttribute("aria-current", "true"); } else a.removeAttribute("aria-current"); });
    if (link) placeCircle(link, true);
  }
  window.addEventListener("resize", function () { var l = $(".dock a.is-active"); if (l) placeCircle(l, false); });

  /* ---------------- 4. transitions ---------------- */
  var busy = false;
  var zoomfx = $("#zoomfx");
  function zoomTo(id) {
    if (busy) return; busy = true;
    var y = targetY(id);
    if (reduce) { jump(y); busy = false; return; }
    gsap.timeline({ onComplete: function () { busy = false; } })
      .set(zoomfx, { opacity: 1, scale: 0.15, borderRadius: 60 })
      .to(zoomfx, { scale: 1, borderRadius: 0, duration: 0.45, ease: "power3.in" })
      .add(function () { jump(y); ST.update(); })
      .add(function () { gsap.set("main", { transformOrigin: "50% " + (window.scrollY + innerHeight / 2) + "px" }); })
      .fromTo("main", { scale: 1.12 }, { scale: 1, duration: 0.6, ease: "power3.out", clearProps: "transform" }, ">")
      .to(zoomfx, { scale: 2.2, opacity: 0, duration: 0.5, ease: "power2.out" }, "<");
  }
  // scribble path generator
  function makeScribble() {
    var x = 80, y = 300, d = "M" + x + " " + y, i;
    for (i = 0; i < 34; i++) {
      var nx = 60 + Math.random() * 880, ny = 60 + Math.random() * 480;
      var c1x = x + (Math.random() - 0.5) * 400, c1y = y + (Math.random() - 0.5) * 300;
      d += " Q" + c1x.toFixed(0) + " " + c1y.toFixed(0) + " " + nx.toFixed(0) + " " + ny.toFixed(0);
      x = nx; y = ny;
    }
    return d;
  }
  var bwfx = $("#bwfx"), scribble = $("#scribblePath");
  function bestWorkFx(id) {
    if (busy) return; busy = true;
    var y = targetY(id || "best-work");
    scribble.setAttribute("d", makeScribble());
    var k = reduce ? 0.25 : 1;
    bwfx.classList.add("is-on");
    gsap.timeline({ onComplete: function () { bwfx.classList.remove("is-on"); busy = false; } })
      .set(bwfx, { opacity: 0 })
      .set(scribble, { strokeDasharray: 1, strokeDashoffset: 1 })
      .set(".bwfx__pill", { scale: 0, rotation: -6 })
      .set(".bwfx__flash", { opacity: 0 })
      .to(bwfx, { opacity: 1, duration: 0.25 * k })
      .to(scribble, { strokeDashoffset: 0, duration: 1.15 * k, ease: "power1.in" })
      .to(".bwfx__pill", { scale: 1, rotation: 0, duration: 0.4 * k, ease: "back.out(2.4)" }, "-=" + 0.35 * k)
      .to(".bwfx__pill", { scale: 1.08, duration: 0.12 * k, yoyo: true, repeat: 1 })
      .to(".bwfx__flash", { opacity: 1, duration: 0.12 * k })
      .add(function () { jump(y); ST.update(); })
      .to(bwfx, { opacity: 0, duration: 0.5 * k, delay: 0.05 });
  }
  $$("[data-go]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var id = a.dataset.go;
      if (id === "best-work") bestWorkFx("best-work");
      else if (a.classList.contains("hero__hint")) window.scrollTo({ top: targetY("about"), behavior: reduce ? "auto" : "smooth" });
      else zoomTo(id);
    });
  });
  $("#boardBtn").addEventListener("click", function () {
    window.scrollTo({ top: absTop($("#train")) + 2, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------------- 5. scroll scenes ---------------- */
  function buildScenes() {
    // hero zooms out -> about scrapbook
    draw("#aboutCircle");
    gsap.timeline({ scrollTrigger: { trigger: "#home", start: "top top", end: "bottom bottom", scrub: 0.6 } })
      .to("#hero", { scale: 0.1, rotation: -10, borderRadius: 320, ease: "power2.in", duration: 0.45 }, 0)
      .to("#hero", { autoAlpha: 0, ease: "none", duration: 0.08 }, 0.38)
      .fromTo(".about__paper", { scale: 0.78, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: "power2.out", duration: 0.4 }, 0.12)
      .fromTo("#aboutCircle", { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "power1.inOut", duration: 0.3 }, 0.52)
      .to({}, { duration: 0.18 });

    // z-depth entry for sections
    $$(".zin").forEach(function (el) {
      gsap.fromTo(el, { scale: 0.86, autoAlpha: 0.2, transformOrigin: "50% 0%" }, {
        scale: 1, autoAlpha: 1, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "top 30%", scrub: true }
      });
    });

    // data sheet details
    draw(".messy path"); draw("#sheetLine");
    gsap.to(".messy path", { strokeDashoffset: 0, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: ".sheet__script", start: "top 80%" } });
    gsap.to("#sheetLine", { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".sheet__line", start: "top 95%", end: "bottom 45%", scrub: true } });
    $$(".stat__n").forEach(function (el) {
      var raw = el.dataset.n, m = raw.match(/^(\D*)(\d+)(.*)$/);
      if (!m || reduce) return;
      var o = { v: 0 };
      gsap.to(o, { v: +m[2], duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%" },
        onUpdate: function () { el.textContent = m[1] + Math.round(o.v) + m[3]; } });
    });
    gsap.from(".stat__arrow", { x: -20, autoAlpha: 0, stagger: 0.15, duration: 0.6, scrollTrigger: { trigger: "#stats", start: "top 85%" } });

    // train: vertical scroll -> horizontal ride
    var trainSec = $("#train");
    var dist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
    ST.addEventListener("refreshInit", function () { trainSec.style.height = dist() + innerHeight + "px"; });
    trainSec.style.height = dist() + innerHeight + "px";
    var coaches = $$(".coach"), count = $("#trainCount");
    gsap.to(track, {
      x: function () { return -dist(); }, ease: "none",
      scrollTrigger: {
        trigger: trainSec, start: "top top", end: function () { return "+=" + dist(); }, scrub: reduce ? true : 0.5, invalidateOnRefresh: true,
        onUpdate: function (self) {
          var px = self.progress * dist();
          track.style.setProperty("--rot", (px / 138) * 360 + "deg");
          var idx = nearestCoach(px);
          count.textContent = String(idx + 1).padStart(2, "0") + " / " + String(coaches.length).padStart(2, "0");
        }
      }
    });
    function coachX(i) { var c = coaches[i]; return Math.min(dist(), Math.max(0, c.offsetLeft + c.offsetWidth / 2 - innerWidth / 2)); }
    function nearestCoach(px) { var b = 0, bd = 1e9; coaches.forEach(function (c, i) { var d = Math.abs(coachX(i) - px); if (d < bd) { bd = d; b = i; } }); return b; }
    function currentPx() { return Math.min(dist(), Math.max(0, window.scrollY - absTop(trainSec))); }
    function goCoach(dir) {
      var px = currentPx(), i = nearestCoach(px), tx;
      if (dir > 0) { tx = coachX(i) > px + 10 ? coachX(i) : (i < coaches.length - 1 ? coachX(i + 1) : dist() + 2); }
      else { tx = coachX(i) < px - 10 ? coachX(i) : (i > 0 ? coachX(i - 1) : -innerHeight * 0.0); }
      window.scrollTo({ top: absTop(trainSec) + tx, behavior: reduce ? "auto" : "smooth" });
    }
    $("#nextBtn").addEventListener("click", function () { goCoach(1); });
    $("#prevBtn").addEventListener("click", function () { goCoach(-1); });
    var trainVisible = false;
    ST.create({ trigger: trainSec, start: "top top", end: "bottom bottom", onToggle: function (s) { trainVisible = s.isActive; } });
    window.addEventListener("keydown", function (e) {
      if (!trainVisible) return;
      if (e.key === "ArrowRight") { e.preventDefault(); goCoach(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goCoach(-1); }
    });
    // touch swipe + horizontal trackpad
    var sticky = $("#trainSticky"), sx = 0, sy = 0, lx = 0, lock = null;
    sticky.addEventListener("touchstart", function (e) { var t = e.touches[0]; sx = lx = t.clientX; sy = t.clientY; lock = null; }, { passive: true });
    sticky.addEventListener("touchmove", function (e) {
      var t = e.touches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (lock === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) lock = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (lock === "x") { e.preventDefault(); window.scrollBy(0, (lx - t.clientX) * 1.6); }
      lx = t.clientX;
    }, { passive: false });
    sticky.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); window.scrollBy(0, e.deltaX); }
    }, { passive: false });

    // nav active groups
    [["#home", "#home", "home"], ["#projects", "#projects", "projects"], ["#best-work", "#train", "best"], ["#contact", "#contact", "contact"]].forEach(function (g) {
      ST.create({ trigger: g[0], endTrigger: g[1], start: "top 55%", end: "bottom 55%",
        onToggle: function (s) { if (s.isActive) setActive(g[2]); } });
    });
    setActive("home");
  }

  /* ---------------- 6. loader ---------------- */
  var loader = $("#loader"), numEl = $("#loaderNum"), bar = $("#loaderBar"), finished = false, counter;
  var lines = $$(".loader__left i, .loader__right i");
  gsap.to(lines, { y: 0, duration: reduce ? 0.01 : 0.7, ease: "power3.out", stagger: 0.08, delay: 0.1 });
  var prog = { v: 0 };
  counter = gsap.to(prog, {
    v: 100, duration: reduce ? 0.5 : 2.8, ease: "power2.inOut", delay: 0.3,
    onUpdate: function () { var v = Math.round(prog.v); numEl.textContent = v; bar.style.width = v + "%"; },
    onComplete: function () { finish(false); }
  });
  $("#skipBtn").addEventListener("click", function () { finish(true); });

  function finish(skipped) {
    if (finished) return; finished = true;
    counter.kill(); numEl.textContent = 100; bar.style.width = "100%";
    loader.classList.add("is-done");
    var k = reduce ? 0.01 : 1;
    gsap.timeline()
      .to(lines, { y: "-105%", duration: 0.45 * k, ease: "power3.in", stagger: 0.03 })
      .to(loader, { yPercent: -100, duration: (skipped ? 0.6 : 0.85) * k, ease: "power4.inOut" }, "-=0.1")
      .add(function () {
        loader.remove();
        document.body.classList.remove("is-loading");
        document.body.classList.add("is-ready");
        buildScenes();
        ST.refresh();
        if (startHash && document.getElementById(startHash)) jump(targetY(startHash));
      }, "-=0.35")
      .from(".hero__logo", { scale: 0.6, rotation: -20, autoAlpha: 0, duration: 0.9 * k, ease: "back.out(1.8)", clearProps: "all" }, "-=0.25")
      .from(".blob", { scale: 0.4, autoAlpha: 0, duration: 1 * k, ease: "power3.out" }, "<")
      .from(".hero__roles li", { x: -30, autoAlpha: 0, stagger: 0.08, duration: 0.5 * k }, "<0.2")
      .from(".burst", { scale: 0, rotation: -90, duration: 0.8 * k, ease: "back.out(2)", clearProps: "transform" }, "<")
      .from(".hero__top, .hero__hint", { autoAlpha: 0, duration: 0.5 * k }, "<");
  }

  // debug hook for tests
  window.__ankush = { finish: function () { finish(true); }, bestWorkFx: bestWorkFx, zoomTo: zoomTo, targetY: targetY };
})();
