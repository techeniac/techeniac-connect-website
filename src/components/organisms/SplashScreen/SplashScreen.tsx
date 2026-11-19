"use client";

import { useEffect, useRef, useState } from "react";

import {
  BIRD_FILL_PATH,
  BIRD_THREADS,
  BIRD_VIEWBOX,
  LOGO_VIEWBOX,
  SPLASH_ATTRIBUTE,
  TAIL_END,
} from "./data";

type Gsap = typeof import("gsap").gsap;

const BRAND = "#FFFFFF";
const THREAD_IDS = ["tail", ...BIRD_THREADS.map((t) => t.id)];

// The loose end of the thread: enters from beyond the top-right corner of the
// viewport and settles onto the wing tip. Built at runtime (in bird units) so it
// always starts off-screen whatever the viewport size.
function buildTail(startX: number, startY: number) {
  const dx = TAIL_END.x - startX;
  const dy = TAIL_END.y - startY;
  const midX = startX + dx * 0.58;
  const midY = startY + dy * 0.3;
  const f = (n: number) => n.toFixed(2);
  return (
    `M${f(startX)} ${f(startY)}` +
    `C${f(startX + dx * 0.22)} ${f(startY - dy * 0.04)} ${f(midX + dx * 0.16)} ${f(midY - dy * 0.2)} ${f(midX)} ${f(midY)}` +
      `S${f(TAIL_END.x + 30)} ${f(TAIL_END.y - dy * 0.32)} ${TAIL_END.x} ${TAIL_END.y}`
  );
}

function whenPageReady() {
  return new Promise<void>((resolve) => {
    if (document.readyState === "complete") return resolve();
    // Never hold the reveal hostage to a slow asset.
    const timeout = window.setTimeout(resolve, 2500);
    window.addEventListener(
      "load",
      () => {
        window.clearTimeout(timeout);
        resolve();
      },
      { once: true },
    );
  });
}

export function SplashScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;
    // The boot script in <head> decides whether this load gets a splash; if it
    // didn't flag <html>, drop the cover from the tree entirely.
    if (!root || !html.hasAttribute(SPLASH_ATTRIBUTE)) {
      setActive(false);
      return;
    }

    window.scrollTo(0, 0);
    html.style.overflow = "hidden";

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    const finish = () => {
      html.removeAttribute(SPLASH_ATTRIBUTE);
      html.style.overflow = "";
      setActive(false);
    };

    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => play(gsap, root, () => cancelled, finish), root);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      html.style.overflow = "";
    };
  }, []);

  if (!active) return null;

  return (
    <div
      id="splash"
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] touch-none"
    >
      <div data-backdrop className="absolute inset-0 bg-[#425EF9]" />
      <div
        data-bird
        className="absolute left-1/2 top-1/2 aspect-[76.1/60] w-[clamp(160px,20vw,240px)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <svg
          viewBox={`0 0 ${BIRD_VIEWBOX.width} ${BIRD_VIEWBOX.height}`}
          className="size-full overflow-visible"
          fill="none"
        >
          <defs>
            <clipPath id="splash-bird-clip">
              <path d={BIRD_FILL_PATH} />
            </clipPath>
            <linearGradient id="splash-shine" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path data-fill d={BIRD_FILL_PATH} fill={BRAND} opacity="0" />

          <g
            data-core
            stroke={BRAND}
            strokeWidth="0.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {THREAD_IDS.map((id) => (
              <path
                key={id}
                data-thread={id}
                d={BIRD_THREADS.find((t) => t.id === id)?.d}
                pathLength={1}
                strokeDasharray="1 2"
                strokeDashoffset={1}
              />
            ))}
          </g>

          <g clipPath="url(#splash-bird-clip)">
            <rect
              data-shine
              x="0"
              y="-20"
              width="20"
              height="100"
              fill="url(#splash-shine)"
              opacity="0"
            />
          </g>

        </svg>
      </div>
    </div>
  );
}

// The whole choreography. Two timelines: `intro` (thread stitches the bird, solid
// fill, shine) then — once the page has loaded — `fly` (bird swoops into the header
// logo while the white cover dissolves into the homepage).
function play(gsap: Gsap, root: HTMLElement, isCancelled: () => boolean, finish: () => void) {
  const all = <T extends Element>(selector: string) => gsap.utils.toArray<T>(selector, root);
  const one = <T extends Element>(selector: string) => root.querySelector<T>(selector)!;

  const bird = one<HTMLElement>("[data-bird]");
  const backdrop = one<HTMLElement>("[data-backdrop]");
  const fill = one<SVGPathElement>("[data-fill]");
  const shine = one<SVGRectElement>("[data-shine]");
  const strokeGroups = all<SVGGElement>("[data-core]");
  const logo = document.querySelector<HTMLElement>("header [data-site-logo]");

  // Wordmark stays hidden until the bird lands (styles/splash.css holds it before
  // hydration; these inline values take over so the attribute can be dropped at the end).
  if (logo) gsap.set(logo, { opacity: 0, clipPath: "inset(0 0 0 25.5%)" });

  // Start the loose thread beyond the top-right corner of the screen.
  const rect = bird.getBoundingClientRect();
  const unit = rect.width / BIRD_VIEWBOX.width;
  const tail = buildTail(
    (window.innerWidth + 80 - rect.left) / unit,
    (-80 - rect.top) / unit,
  );
  all<SVGPathElement>('[data-thread="tail"]').forEach((el) => el.setAttribute("d", tail));

  // pathLength=1 on every thread lets one 0→1 value drive draw-on for any of them.
  all<SVGPathElement>("[data-thread]").forEach((el) => {
    el.setAttribute("stroke-dasharray", "1 2");
    el.setAttribute("stroke-dashoffset", "1");
  });
  gsap.set(shine, { x: -30, skewX: -20 });

  const draw = (
    tl: gsap.core.Timeline,
    id: string,
    at: number,
    duration: number,
    ease: string,
  ) => {
    const strokes = all<SVGPathElement>(`[data-thread="${id}"]`);
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
      at,
    );
  };

  const fly = () => {
    if (isCancelled()) return;

    // Where the bird must land: the bird portion of the header logo image, which
    // letterboxes inside its box (meet) — same maths as the browser's.
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

    // Travel: a plain, smooth glide from the centre into the logo (position and size
    // together, eased in and out) — no tilt, no trail.
    const flight = 1;
    tl.to(bird, { x: dx, y: dy, scale, duration: flight, ease: "power3.inOut" }, "go");

    // The cover dissolves into the page on the same duration and ease as the bird's
    // glide, so the page is fully revealed at the very moment the bird lands.
    tl.to(backdrop, { opacity: 0, duration: flight, ease: "power3.inOut" }, "go");

    // Wordmark fades in, then at touchdown the logo's own bird is un-clipped directly
    // under the flying one and the flying one is retired — a seamless hand-off.
    if (logo) {
      tl.to(logo, { opacity: 1, duration: 0.4, ease: "power1.out" }, `go+=${flight - 0.45}`);
      tl.set(logo, { clipPath: "none" }, `go+=${flight - 0.02}`);
    }
    tl.to(bird, { opacity: 0, duration: 0.2, ease: "none" }, `go+=${flight}`);

    // Trigger home screen card entrance animations at touchdown
    tl.add(() => {
      document.documentElement.classList.add("cards-animate");
    }, `go+=${flight}`);
  };

  const intro = gsap.timeline({
    onComplete: () => {
      whenPageReady().then(fly);
    },
  });

  // Beat of blank white, then the loose thread glides in from the top-right and
  // stitches the outline, followed by the two inner pieces.
  draw(intro, "tail", 0.45, 0.85, "power2.inOut");
  draw(intro, "outline", 1.25, 1.4, "sine.inOut");
  draw(intro, "wing", 2.55, 0.5, "power2.inOut");
  draw(intro, "crest", 2.55, 0.6, "power2.inOut");

  // The slack of the thread is drawn in after it has done its job.
  intro.to(
    all<SVGPathElement>('[data-thread="tail"]'),
    { attr: { "stroke-dashoffset": -1 }, duration: 0.55, ease: "power2.in" },
    2.65,
  );

  // Thread becomes solid; the bird lights up from within.
  const solid = 3.15;
  intro.to(fill, { opacity: 1, duration: 0.7, ease: "power1.inOut" }, solid);
  intro.to(strokeGroups, { opacity: 0, duration: 0.6, ease: "power1.out" }, solid + 0.25);

  // Shine sweeps across the bird.
  const shineAt = solid + 0.5;
  intro.set(shine, { opacity: 1 }, shineAt);
  intro.to(shine, { x: 105, duration: 0.85, ease: "power2.inOut" }, shineAt);
  // Hold a beat on the finished mark before it takes off.
  intro.to({}, { duration: 0.30 }, shineAt + 0.85);
}
