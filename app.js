/**
 * TechEniac Digital Connect - Offline Client Script
 * 100% pure JavaScript with local GSAP engine
 * Theme: Crisp White & Electric Blue (#425EF9)
 */

/* ==========================================================================
   Splash Screen Geometry & Configuration
   ========================================================================== */
const SPLASH_ATTRIBUTE = "data-splash";
const BIRD_VIEWBOX = { width: 76.1, height: 60 };
const LOGO_VIEWBOX = { width: 300, height: 60 };
const TAIL_END = { x: 76.0968, y: 0.575995 };
const THREAD_IDS = ["tail", "outline", "wing", "crest"];

/**
 * Loose thread entering from beyond top-right corner of viewport.
 * Built dynamically at runtime so it always starts off-screen at any viewport size.
 */
function buildTail(startX, startY) {
  const dx = TAIL_END.x - startX;
  const dy = TAIL_END.y - startY;
  const midX = startX + dx * 0.58;
  const midY = startY + dy * 0.3;
  const f = (n) => n.toFixed(2);
  return (
    `M${f(startX)} ${f(startY)}` +
    `C${f(startX + dx * 0.22)} ${f(startY - dy * 0.04)} ${f(midX + dx * 0.16)} ${f(midY - dy * 0.2)} ${f(midX)} ${f(midY)}` +
    `S${f(TAIL_END.x + 30)} ${f(TAIL_END.y - dy * 0.32)} ${TAIL_END.x} ${TAIL_END.y}`
  );
}

/**
 * Ensures the page is fully ready before launching flight, with a 2.5s fallback.
 */
function whenPageReady() {
  return new Promise((resolve) => {
    if (document.readyState === "complete") return resolve();
    const timeout = window.setTimeout(resolve, 2500);
    window.addEventListener(
      "load",
      () => {
        window.clearTimeout(timeout);
        resolve();
      },
      { once: true }
    );
  });
}

/**
 * Initializes and orchestrates the splash screen
 */
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
    document.documentElement.classList.add("cards-animate");
    html.removeAttribute(SPLASH_ATTRIBUTE);
    html.style.overflow = "";
    if (root && root.parentNode) root.remove();
  };

  // If GSAP is missing, release failsafe gracefully
  if (typeof gsap === "undefined") {
    finish();
    return;
  }

  playSplash(gsap, root, () => cancelled, finish);

  window.addEventListener("pagehide", () => {
    cancelled = true;
    finish();
  });
}

function playSplash(gsap, root, isCancelled, finish) {
  const all = (selector) => gsap.utils.toArray(selector, root);
  const one = (selector) => root.querySelector(selector);

  const bird = one("[data-bird]");
  const backdrop = one("[data-backdrop]");
  const fill = one("[data-fill]");
  const shine = one("[data-shine]");
  const strokeGroups = all("[data-core]");
  const logo = document.querySelector("header [data-site-logo]");

  // Wordmark stays hidden until bird lands
  if (logo) {
    gsap.set(logo, { opacity: 0, clipPath: "inset(0 0 0 25.5%)" });
  }

  // Tail starts beyond top-right corner of screen
  const rect = bird.getBoundingClientRect();
  const unit = rect.width / BIRD_VIEWBOX.width;
  const tail = buildTail(
    (window.innerWidth + 80 - rect.left) / unit,
    (-80 - rect.top) / unit
  );
  all('[data-thread="tail"]').forEach((el) => el.setAttribute("d", tail));

  // pathLength=1 drives dashoffset consistently across all threads
  all("[data-thread]").forEach((el) => {
    el.setAttribute("stroke-dasharray", "1 2");
    el.setAttribute("stroke-dashoffset", "1");
  });
  gsap.set(shine, { x: -30, skewX: -20 });

  const draw = (tl, id, at, duration, ease) => {
    const strokes = all(`[data-thread="${id}"]`);
    const progress = { p: 0 };
    tl.to(
      progress,
      {
        p: 1,
        duration,
        ease,
        onUpdate: () => {
          const offset = String(1 - progress.p);
          strokes.forEach((el) => el.setAttribute("stroke-dashoffset", offset));
        },
      },
      at
    );
  };

  const fly = () => {
    if (isCancelled()) return;

    // Calculate exact target position and scale for the bird within the centered header logo
    const from = bird.getBoundingClientRect();
    let dx = 0;
    let dy = 0;
    let scale = 0.2;

    if (logo) {
      const lr = logo.getBoundingClientRect();
      const s = Math.min(lr.width / LOGO_VIEWBOX.width, lr.height / LOGO_VIEWBOX.height);
      const w = BIRD_VIEWBOX.width * s;
      const h = BIRD_VIEWBOX.height * s;
      const cx = lr.left + (lr.width - LOGO_VIEWBOX.width * s) / 2 + w / 2;
      const cy = lr.top + (lr.height - LOGO_VIEWBOX.height * s) / 2 + h / 2;
      dx = cx - (from.left + from.width / 2);
      dy = cy - (from.top + from.height / 2);
      scale = w / from.width;
    }

    const tl = gsap.timeline({ onComplete: finish });
    tl.addLabel("go");

    // Flight: bird glides from viewport center to centered header logo; backdrop dissolves
    const flight = 1.0;
    tl.to(bird, { x: dx, y: dy, scale, duration: flight, ease: "power3.inOut" }, "go");
    tl.to(backdrop, { opacity: 0, duration: flight, ease: "power3.inOut" }, "go");

    // Seamless color transformation: bird transitions from white to Electric Blue (#425EF9)
    if (fill) {
      tl.to(fill, { fill: "#425EF9", duration: flight * 0.75, ease: "power2.inOut" }, "go+=0.15");
    }

    // Centered header logo reveals smoothly at touchdown
    if (logo) {
      tl.to(logo, { opacity: 1, duration: 0.35, ease: "power1.out" }, `go+=${flight - 0.25}`);
      tl.set(logo, { clipPath: "none" }, `go+=${flight}`);
    }
    tl.to(bird, { opacity: 0, duration: 0.2, ease: "none" }, `go+=${flight}`);

    // Trigger staggered entrance animations for cards and footer
    tl.add(() => {
      document.documentElement.classList.add("cards-animate");
    }, `go+=${flight}`);
  };

  const intro = gsap.timeline({
    onComplete: () => {
      whenPageReady().then(fly);
    },
  });

  // White thread stitching choreography on Electric Blue backdrop
  draw(intro, "tail", 0.45, 0.85, "power2.inOut");
  draw(intro, "outline", 1.25, 1.4, "sine.inOut");
  draw(intro, "wing", 2.55, 0.5, "power2.inOut");
  draw(intro, "crest", 2.55, 0.6, "power2.inOut");

  // Retract tail thread
  intro.to(
    all('[data-thread="tail"]'),
    { attr: { "stroke-dashoffset": -1 }, duration: 0.55, ease: "power2.in" },
    2.65
  );

  // Fill lights up in solid pure white (#FFFFFF)
  const solid = 3.15;
  intro.to(fill, { opacity: 1, duration: 0.7, ease: "power1.inOut" }, solid);
  intro.to(strokeGroups, { opacity: 0, duration: 0.6, ease: "power1.out" }, solid + 0.25);

  // White shine sweeps across the bird silhouette
  const shineAt = solid + 0.5;
  intro.set(shine, { opacity: 1 }, shineAt);
  intro.to(shine, { x: 105, duration: 0.85, ease: "power2.inOut" }, shineAt);

  // Hold beat on completed mark before flight
  intro.to({}, { duration: 0.30 }, shineAt + 0.85);
}

// Kick off splash animation
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSplashScreen);
} else {
  initSplashScreen();
}

/* ==========================================================================
   Page Interactive Features & Bubble Micro-Interactions
   ========================================================================== */

// Toast notification function
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#425EF9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

document.addEventListener('DOMContentLoaded', () => {
  // Address click feedback
  const addressLink = document.querySelector('.footer-address-link');
  if (addressLink) {
    addressLink.addEventListener('click', () => {
      showToast('Opening Ahmedabad HQ in Maps...');
    });
  }

  // Card hover performance optimizations & interactive touch spotlight
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const updateTouch = (clientX, clientY) => {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      card.style.setProperty('--touch-x', `${x.toFixed(1)}px`);
      card.style.setProperty('--touch-y', `${y.toFixed(1)}px`);
    };

    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform, box-shadow';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = 'auto';
      card.classList.remove('is-touching');
    });

    card.addEventListener('pointerdown', (e) => {
      card.classList.add('is-touching');
      updateTouch(e.clientX, e.clientY);
    }, { passive: true });

    card.addEventListener('pointermove', (e) => {
      updateTouch(e.clientX, e.clientY);
    }, { passive: true });

    card.addEventListener('pointerup', () => {
      card.classList.remove('is-touching');
    }, { passive: true });

    card.addEventListener('pointercancel', () => {
      card.classList.remove('is-touching');
    }, { passive: true });
  });

  // Initialize Touch & Scrape Contrast Animation Engine
  initTouchContrastEngine();
});

/* ==========================================================================
   Interactive Touch & Scrape Contrast Animation Engine
   Contrasting Colors:
   - Upper White Canvas: Vibrant Electric Blue (#425EF9) fluid glow & ripples
   - Blue Footer Section: Crisp Pure White (#FFFFFF) wave glow & flares
   ========================================================================== */
function initTouchContrastEngine() {
  const canvas = document.getElementById('touch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  let width = 0;
  let height = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const particles = [];
  const ripples = [];
  let isRunning = false;
  let isTouching = false;
  let lastPos = null;

  const footerSection = document.querySelector('.footer-wave-section');

  function isOverFooter(y) {
    if (!footerSection) return false;
    const rect = footerSection.getBoundingClientRect();
    return y >= rect.top;
  }

  function addContrastEffect(x, y, isScraping = false) {
    const onFooter = isOverFooter(y);

    // Dynamic contrast colors:
    // White in blue footer, Electric blue in white body
    const color = onFooter
      ? { r: 255, g: 255, b: 255 }      // White on Blue
      : { r: 66, g: 94, b: 249 };        // Electric Blue on White

    // Add ripple
    ripples.push({
      x,
      y,
      radius: isScraping ? 6 : 12,
      maxRadius: isScraping ? (onFooter ? 34 : 40) : (onFooter ? 52 : 60),
      alpha: onFooter ? 0.85 : 0.65,
      decay: isScraping ? 0.042 : 0.026,
      lineWidth: onFooter ? 2.5 : 2.0,
      color,
    });

    // Add fluid scrape particles
    const count = isScraping ? 2 : 4;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isScraping ? 2.2 : 3.4) + 0.5;
      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * (isScraping ? 3.0 : 4.5) + 2.0,
        alpha: onFooter ? 0.9 : 0.75,
        decay: Math.random() * 0.025 + 0.02,
        color,
        glow: onFooter ? 10 : 8,
      });
    }

    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(render);
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += (r.maxRadius - r.radius) * 0.12;
      r.alpha -= r.decay;

      if (r.alpha <= 0) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, ${r.alpha})`;
      ctx.lineWidth = r.lineWidth;
      ctx.shadowColor = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, ${r.alpha * 0.7})`;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.restore();
    }

    // Update & draw fluid particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
      ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
      ctx.shadowBlur = p.glow;
      ctx.fill();
      ctx.restore();
    }

    if (ripples.length > 0 || particles.length > 0) {
      requestAnimationFrame(render);
    } else {
      isRunning = false;
    }
  }

  // Pointer event listeners (desktops & touchscreens)
  window.addEventListener('pointerdown', (e) => {
    isTouching = true;
    lastPos = { x: e.clientX, y: e.clientY };
    addContrastEffect(e.clientX, e.clientY, false);
  }, { passive: true });

  window.addEventListener('pointermove', (e) => {
    if (isTouching) {
      if (!lastPos || Math.hypot(e.clientX - lastPos.x, e.clientY - lastPos.y) > 6) {
        lastPos = { x: e.clientX, y: e.clientY };
        addContrastEffect(e.clientX, e.clientY, true);
      }
    }
  }, { passive: true });

  window.addEventListener('pointerup', () => {
    isTouching = false;
    lastPos = null;
  }, { passive: true });

  window.addEventListener('pointercancel', () => {
    isTouching = false;
    lastPos = null;
  }, { passive: true });

  // Touch scrape support for mobile devices
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const t = e.touches[0];
      if (!lastPos || Math.hypot(t.clientX - lastPos.x, t.clientY - lastPos.y) > 6) {
        lastPos = { x: t.clientX, y: t.clientY };
        addContrastEffect(t.clientX, t.clientY, true);
      }
    }
  }, { passive: true });
}
