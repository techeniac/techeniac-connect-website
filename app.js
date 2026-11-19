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

  // Card hover performance optimizations
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.willChange = 'transform, box-shadow';
    });
    card.addEventListener('mouseleave', () => {
      card.style.willChange = 'auto';
    });
  });
});
