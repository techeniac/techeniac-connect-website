/**
 * TechEniac Digital Connect - Offline Client Script
 * Pure JavaScript with local GSAP engine
 */

const SPLASH_ATTRIBUTE = "data-splash";
const BIRD_VIEWBOX = { width: 76.1, height: 60 };
const LOGO_VIEWBOX = { width: 300, height: 60 };
const TAIL_END = { x: 76.0968, y: 0.575995 };

function buildTail(startX, startY) {
  const dx = TAIL_END.x - startX, dy = TAIL_END.y - startY;
  const midX = startX + dx * 0.58, midY = startY + dy * 0.3;
  const f = (n) => n.toFixed(2);
  return `M${f(startX)} ${f(startY)}C${f(startX + dx * 0.22)} ${f(startY - dy * 0.04)} ${f(midX + dx * 0.16)} ${f(midY - dy * 0.2)} ${f(midX)} ${f(midY)}S${f(TAIL_END.x + 30)} ${f(TAIL_END.y - dy * 0.32)} ${TAIL_END.x} ${TAIL_END.y}`;
}

function whenPageReady() {
  return new Promise((resolve) => {
    if (document.readyState === "complete") return resolve();
    const timer = setTimeout(resolve, 2500);
    window.addEventListener("load", () => { clearTimeout(timer); resolve(); }, { once: true });
  });
}

function initSplashScreen() {
  const html = document.documentElement;
  const root = document.getElementById("splash");
  if (!root || !html.hasAttribute(SPLASH_ATTRIBUTE)) {
    if (root) root.remove();
    return;
  }

  window.scrollTo(0, 0);
  html.style.overflow = "hidden";

  let cancelled = false;
  const finish = () => {
    html.classList.add("cards-animate");
    html.removeAttribute(SPLASH_ATTRIBUTE);
    html.style.overflow = "";
    if (root.parentNode) root.remove();
  };

  if (typeof gsap === "undefined") return finish();

  playSplash(gsap, root, () => cancelled, finish);
  window.addEventListener("pagehide", () => { cancelled = true; finish(); }, { once: true });
}

function playSplash(gsap, root, isCancelled, finish) {
  const all = (sel) => gsap.utils.toArray(sel, root);
  const bird = root.querySelector("[data-bird]");
  const backdrop = root.querySelector("[data-backdrop]");
  const fill = root.querySelector("[data-fill]");
  const shine = root.querySelector("[data-shine]");
  const strokeGroups = all("[data-core]");
  const logo = document.querySelector("header [data-site-logo]");

  if (logo) gsap.set(logo, { opacity: 0, clipPath: "inset(0 0 0 25.5%)" });

  const rect = bird.getBoundingClientRect();
  const unit = rect.width / BIRD_VIEWBOX.width;
  const tail = buildTail((window.innerWidth + 80 - rect.left) / unit, (-80 - rect.top) / unit);
  all('[data-thread="tail"]').forEach((el) => el.setAttribute("d", tail));

  all("[data-thread]").forEach((el) => {
    el.setAttribute("stroke-dasharray", "1 2");
    el.setAttribute("stroke-dashoffset", "1");
  });
  gsap.set(shine, { x: -30, skewX: -20 });

  const fly = () => {
    if (isCancelled()) return;

    let dx = 0, dy = 0, scale = 0.2;
    if (logo) {
      const lr = logo.getBoundingClientRect();
      const s = Math.min(lr.width / LOGO_VIEWBOX.width, lr.height / LOGO_VIEWBOX.height);
      const w = BIRD_VIEWBOX.width * s, h = BIRD_VIEWBOX.height * s;
      dx = (lr.left + (lr.width - LOGO_VIEWBOX.width * s) / 2 + w / 2) - (rect.left + rect.width / 2);
      dy = (lr.top + (lr.height - LOGO_VIEWBOX.height * s) / 2 + h / 2) - (rect.top + rect.height / 2);
      scale = w / rect.width;
    }

    const tl = gsap.timeline({ onComplete: finish });
    const flight = 1.0;
    tl.to(bird, { x: dx, y: dy, scale, duration: flight, ease: "power3.inOut" }, "go");
    tl.to(backdrop, { opacity: 0, duration: flight, ease: "power3.inOut" }, "go");
    if (fill) tl.to(fill, { fill: "#425EF9", duration: flight * 0.75, ease: "power2.inOut" }, "go+=0.15");
    if (logo) {
      tl.to(logo, { opacity: 1, duration: 0.35, ease: "power1.out" }, `go+=${flight - 0.25}`);
      tl.set(logo, { clipPath: "none" }, `go+=${flight}`);
    }
    tl.to(bird, { opacity: 0, duration: 0.2, ease: "none" }, `go+=${flight}`);
    tl.add(() => document.documentElement.classList.add("cards-animate"), `go+=${flight}`);
  };

  const intro = gsap.timeline({ onComplete: () => whenPageReady().then(fly) });
  intro.timeScale(1.65);

  const draw = (id, at, duration, ease) => {
    intro.to(all(`[data-thread="${id}"]`), { attr: { "stroke-dashoffset": 0 }, duration, ease }, at);
  };

  draw("tail", 0.45, 0.85, "power2.inOut");
  draw("outline", 1.25, 1.4, "sine.inOut");
  draw("wing", 2.55, 0.5, "power2.inOut");
  draw("crest", 2.55, 0.6, "power2.inOut");

  intro.to(all('[data-thread="tail"]'), { attr: { "stroke-dashoffset": -1 }, duration: 0.55, ease: "power2.in" }, 2.65);

  const solid = 3.15;
  intro.to(fill, { opacity: 1, duration: 0.7, ease: "power1.inOut" }, solid);
  intro.to(strokeGroups, { opacity: 0, duration: 0.6, ease: "power1.out" }, solid + 0.25);

  const shineAt = solid + 0.5;
  intro.set(shine, { opacity: 1 }, shineAt);
  intro.to(shine, { x: 105, duration: 0.85, ease: "power2.inOut" }, shineAt);
  intro.to({}, { duration: 0.3 }, shineAt + 0.85);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSplashScreen);
} else {
  initSplashScreen();
}

/* ==========================================================================
   Page Interactions & Toast
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById("toast");
  const text = document.getElementById("toast-text");
  if (!toast || !text) return;
  text.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => toast.classList.remove("show"), 2400);
}

document.addEventListener("DOMContentLoaded", () => {
  const addressLink = document.querySelector(".footer-address-link");
  if (addressLink) {
    addressLink.addEventListener("click", () => showToast("Opening Ahmedabad HQ in Maps..."));
  }

  const updateTouch = (card, clientX, clientY) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--touch-x", `${(clientX - r.left).toFixed(1)}px`);
    card.style.setProperty("--touch-y", `${(clientY - r.top).toFixed(1)}px`);
  };

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointerdown", (e) => {
      card.classList.add("is-touching");
      updateTouch(card, e.clientX, e.clientY);
    }, { passive: true });
    card.addEventListener("pointermove", (e) => updateTouch(card, e.clientX, e.clientY), { passive: true });
    const endTouch = () => card.classList.remove("is-touching");
    card.addEventListener("pointerup", endTouch, { passive: true });
    card.addEventListener("pointercancel", endTouch, { passive: true });
    card.addEventListener("mouseleave", endTouch, { passive: true });
  });

  initTouchContrastEngine();
});

/* ==========================================================================
   Interactive Touch & Scrape Contrast Animation Engine
   No tap animation: responds fluidly as finger moves, scrapes, or scrolls
   ========================================================================== */
function initTouchContrastEngine() {
  const canvas = document.getElementById("touch-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  let width = 0, height = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const particles = [], ripples = [];
  let isRunning = false, isTouching = false, lastPos = null;

  const footer = document.querySelector(".footer-wave-section");
  const isOverFooter = (y) => Boolean(footer && y >= footer.getBoundingClientRect().top);

  function addScrapeEffect(x, y) {
    const onFooter = isOverFooter(y);
    const rgb = onFooter ? "255, 255, 255" : "66, 94, 249";

    ripples.push({
      x, y,
      radius: 2,
      maxRadius: onFooter ? 12 : 16,
      alpha: onFooter ? 0.8 : 0.6,
      decay: 0.075,
      lineWidth: 1.0,
      rgb,
    });

    const count = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.8 + 0.8;
      particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 1.6 + 1.0,
        alpha: onFooter ? 0.85 : 0.75,
        decay: Math.random() * 0.035 + 0.045,
        rgb,
        glow: onFooter ? 5 : 3,
      });
    }

    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(render);
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += (r.maxRadius - r.radius) * 0.24;
      r.alpha -= r.decay;
      if (r.alpha <= 0) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.rgb}, ${r.alpha})`;
      ctx.lineWidth = r.lineWidth;
      ctx.shadowColor = `rgba(${r.rgb}, ${r.alpha * 0.7})`;
      ctx.shadowBlur = 6;
      ctx.stroke();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${p.rgb}, ${p.alpha})`;
      ctx.lineWidth = 0.75;
      ctx.shadowColor = `rgba(${p.rgb}, ${p.alpha * 0.6})`;
      ctx.shadowBlur = p.glow;
      ctx.stroke();
      ctx.fillStyle = `rgba(${p.rgb}, ${p.alpha * 0.35})`;
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    if (ripples.length || particles.length) {
      requestAnimationFrame(render);
    } else {
      isRunning = false;
    }
  }

  const handleScrapeMove = (x, y) => {
    if (!lastPos) {
      lastPos = { x, y };
      return;
    }
    const dist = Math.hypot(x - lastPos.x, y - lastPos.y);
    if (dist < 4) return;

    const steps = Math.min(Math.max(1, Math.floor(dist / 9)), 6);
    for (let i = 1; i <= steps; i++) {
      const ix = lastPos.x + (x - lastPos.x) * (i / steps);
      const iy = lastPos.y + (y - lastPos.y) * (i / steps);
      addScrapeEffect(ix, iy);
    }
    lastPos = { x, y };
  };

  // Touch and pointer tracking (Movement and scraping only, NO tap animation)
  window.addEventListener("pointerdown", (e) => {
    isTouching = true;
    lastPos = { x: e.clientX, y: e.clientY };
  }, { passive: true });

  window.addEventListener("pointermove", (e) => {
    if (isTouching) handleScrapeMove(e.clientX, e.clientY);
  }, { passive: true });

  const endTouch = () => { isTouching = false; lastPos = null; };
  window.addEventListener("pointerup", endTouch, { passive: true });
  window.addEventListener("pointercancel", endTouch, { passive: true });
  window.addEventListener("touchend", endTouch, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      handleScrapeMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Scroll scraping animation
  const appWrapper = document.querySelector(".app-wrapper");
  let lastScrollY = window.scrollY || 0;
  let lastScrollTime = 0;
  const onScroll = () => {
    const now = performance.now();
    if (now - lastScrollTime < 32) return;
    lastScrollTime = now;
    const currentY = window.scrollY || (appWrapper ? appWrapper.scrollTop : 0);
    const diff = Math.abs(currentY - lastScrollY);
    lastScrollY = currentY;
    if (diff > 2) {
      const sx = lastPos ? lastPos.x : (width * 0.5 + (Math.random() - 0.5) * 80);
      const sy = lastPos ? lastPos.y : (height * 0.5 + (Math.random() - 0.5) * 60);
      addScrapeEffect(sx, sy);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  if (appWrapper) {
    appWrapper.addEventListener("scroll", onScroll, { passive: true });
  }

  window.addEventListener("wheel", (e) => {
    handleScrapeMove(e.clientX, e.clientY);
  }, { passive: true });
}
