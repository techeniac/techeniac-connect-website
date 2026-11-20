import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const BIRD_VIEWBOX = { width: 76.1, height: 60 };
const LOGO_VIEWBOX = { width: 300, height: 60 };
const TAIL_END = { x: 76.0968, y: 0.575995 };

function buildTail(startX: number, startY: number): string {
  const dx = TAIL_END.x - startX;
  const dy = TAIL_END.y - startY;
  const midX = startX + dx * 0.58;
  const midY = startY + dy * 0.3;
  const f = (n: number) => n.toFixed(2);
  return `M${f(startX)} ${f(startY)}C${f(startX + dx * 0.22)} ${f(startY - dy * 0.04)} ${f(midX + dx * 0.16)} ${f(midY - dy * 0.2)} ${f(midX)} ${f(midY)}S${f(TAIL_END.x + 30)} ${f(TAIL_END.y - dy * 0.32)} ${TAIL_END.x} ${TAIL_END.y}`;
}

export const SplashScreen: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;
    if (!root) return;

    const q = window.location.search;
    const isSplashDisabled =
      /[?&]splash=0(&|$)/.test(q) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finish = () => {
      html.classList.add('cards-animate');
      html.removeAttribute('data-splash');
      html.style.overflow = '';
      setIsActive(false);
      onFinish?.();
    };

    if (isSplashDisabled) {
      finish();
      return;
    }

    window.scrollTo(0, 0);
    html.style.overflow = 'hidden';

    let cancelled = false;

    const all = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, root);
    const bird = root.querySelector<HTMLElement>('[data-bird]');
    const backdrop = root.querySelector<HTMLElement>('[data-backdrop]');
    const fill = root.querySelector<HTMLElement>('[data-fill]');
    const shine = root.querySelector<HTMLElement>('[data-shine]');
    const strokeGroups = all('[data-core]');
    const logo = document.querySelector<HTMLElement>('header [data-site-logo]');

    if (logo) gsap.set(logo, { opacity: 0, clipPath: 'inset(0 0 0 25.5%)' });

    if (!bird) {
      finish();
      return;
    }

    const rect = bird.getBoundingClientRect();
    const unit = rect.width / BIRD_VIEWBOX.width;
    const tail = buildTail((window.innerWidth + 80 - rect.left) / unit, (-80 - rect.top) / unit);
    all('[data-thread="tail"]').forEach((el) => el.setAttribute('d', tail));

    all('[data-thread]').forEach((el) => {
      el.setAttribute('stroke-dasharray', '1 2');
      el.setAttribute('stroke-dashoffset', '1');
    });

    if (shine) gsap.set(shine, { x: -30, skewX: -20 });

    const fly = () => {
      if (cancelled) return;

      let dx = 0;
      let dy = 0;
      let scale = 0.2;
      if (logo) {
        const lr = logo.getBoundingClientRect();
        const s = Math.min(lr.width / LOGO_VIEWBOX.width, lr.height / LOGO_VIEWBOX.height);
        const w = BIRD_VIEWBOX.width * s;
        const h = BIRD_VIEWBOX.height * s;
        dx = lr.left + (lr.width - LOGO_VIEWBOX.width * s) / 2 + w / 2 - (rect.left + rect.width / 2);
        dy = lr.top + (lr.height - LOGO_VIEWBOX.height * s) / 2 + h / 2 - (rect.top + rect.height / 2);
        scale = w / rect.width;
      }

      const tl = gsap.timeline({ onComplete: finish });
      const flight = 1.0;
      tl.to(bird, { x: dx, y: dy, scale, duration: flight, ease: 'power3.inOut' }, 'go');
      if (backdrop) tl.to(backdrop, { opacity: 0, duration: flight, ease: 'power3.inOut' }, 'go');
      if (fill) tl.to(fill, { fill: '#425EF9', duration: flight * 0.75, ease: 'power2.inOut' }, 'go+=0.15');
      if (logo) {
        tl.to(logo, { opacity: 1, duration: 0.35, ease: 'power1.out' }, `go+=${flight - 0.25}`);
        tl.set(logo, { clipPath: 'none' }, `go+=${flight}`);
      }
      tl.to(bird, { opacity: 0, duration: 0.2, ease: 'none' }, `go+=${flight}`);
      tl.add(() => document.documentElement.classList.add('cards-animate'), `go+=${flight}`);
    };

    const intro = gsap.timeline({ onComplete: () => fly() });
    intro.timeScale(1.65);

    const draw = (id: string, at: number, duration: number, ease: string) => {
      intro.to(all(`[data-thread="${id}"]`), { attr: { 'stroke-dashoffset': 0 }, duration, ease }, at);
    };

    draw('tail', 0.45, 0.85, 'power2.inOut');
    draw('outline', 1.25, 1.4, 'sine.inOut');
    draw('wing', 2.55, 0.5, 'power2.inOut');
    draw('crest', 2.55, 0.6, 'power2.inOut');

    intro.to(all('[data-thread="tail"]'), { attr: { 'stroke-dashoffset': -1 }, duration: 0.55, ease: 'power2.in' }, 2.65);

    const solid = 3.15;
    if (fill) intro.to(fill, { opacity: 1, duration: 0.7, ease: 'power1.inOut' }, solid);
    intro.to(strokeGroups, { opacity: 0, duration: 0.6, ease: 'power1.out' }, solid + 0.25);

    const shineAt = solid + 0.5;
    if (shine) {
      intro.set(shine, { opacity: 1 }, shineAt);
      intro.to(shine, { x: 105, duration: 0.85, ease: 'power2.inOut' }, shineAt);
    }
    intro.to({}, { duration: 0.3 }, shineAt + 0.85);

    const onPageHide = () => {
      cancelled = true;
      finish();
    };
    window.addEventListener('pagehide', onPageHide, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('pagehide', onPageHide);
      intro.kill();
    };
  }, [onFinish]);

  if (!isActive) return null;

  return (
    <div ref={rootRef} id="splash" aria-hidden="true">
      <div data-backdrop className="splash-backdrop"></div>
      <div data-bird className="splash-bird-container">
        <svg viewBox="0 0 76.1 60" className="splash-bird-svg" fill="none">
          <defs>
            <clipPath id="splash-bird-clip">
              <use href="#splash-bird-fill" />
            </clipPath>
            <linearGradient id="splash-shine" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Splash Bird Fill in Pure White */}
          <path
            id="splash-bird-fill"
            data-fill
            d="M39.9017 59.9812C37.5378 59.9436 35.1929 59.4736 33.0182 58.5901C30.8434 57.7065 28.8767 56.4282 27.2315 54.8302C25.5862 53.2323 24.2814 51.3336 23.4115 49.2657C22.5416 47.1978 22.1067 44.9795 22.1634 42.7424C21.2368 42.1972 20.3669 41.5769 19.5348 40.9377C6.10817 30.4854 7.73449 19.4127 8.60439 13.4722C8.83132 12.4382 8.90696 11.3667 8.85023 10.3139C8.24508 8.998 4.23601 8.13324 1.059 7.90765C0.718608 7.90765 0.359304 7.88885 0 7.85125L0.189107 4.91859C0.416036 4.91859 0.77534 4.93739 1.2292 4.97499C4.65204 5.03139 6.92133 3.77184 9.36082 2.45591C12.0461 0.951977 14.8449 -0.551952 18.7784 0.200012C24.8676 1.36556 26.7398 8.07684 27.2882 11.3667C30.6732 10.6147 38.0673 9.61837 44.3268 13.3782C53.4228 8.07684 63.2375 4.01623 73.525 1.29036L76.0968 0.575995L75.4917 3.03868C75.3593 3.56505 72.7496 13.6414 61.8192 23.2477L70.9342 19.9015L69.4402 23.1349C69.1377 23.7741 62.084 38.6442 48.2602 40.0353L47.9198 37.1215C56.146 36.2943 61.8003 29.6018 64.5802 25.3908L52.7231 29.7522L51.3237 27.1579C60.4198 21.9882 67.5113 14.2054 71.5582 4.97499C39.4289 14.5813 26.6263 29.7522 25.3782 41.1069C41.2254 49.0025 63.5212 37.9486 63.767 37.8358L68.0598 35.6739L65.9039 39.791C65.7716 40.0353 55.087 60 39.9017 60V59.9812ZM25.3404 44.3779C25.5295 46.7654 26.3805 49.0401 27.8177 51.014C29.2549 52.9879 31.2216 54.5483 33.5098 55.5822C45.7451 61.2031 56.1082 49.0589 60.6468 42.4228C53.1581 45.3555 37.9349 49.8485 25.3404 44.3779ZM8.20726 6.34732C9.70121 6.8173 10.9493 7.83245 11.6868 9.12959C12.1974 10.2387 11.9705 11.7615 11.6868 13.8482C10.8359 19.6007 9.41755 29.2634 21.5015 38.663C21.823 38.9074 22.1445 39.1518 22.466 39.3774C23.8275 31.8765 29.5953 23.0973 41.4523 15.2017C34.6445 11.9683 26.5696 14.6001 26.475 14.6189L24.5083 15.2769L24.3949 13.3218C24.3949 13.3218 23.7519 4.11023 18.1543 3.05748C15.3744 2.5311 13.4077 3.60265 10.9115 4.95619C10.0605 5.40737 9.17171 5.89614 8.20726 6.32852V6.34732Z"
            fill="#FFFFFF"
            opacity="0"
          />

          {/* Stitched Thread Paths in White */}
          <g data-core stroke="#FFFFFF" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round">
            <path data-thread="tail" pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" />
            <path
              data-thread="outline"
              d="M76.0968 0.575995L75.4917 3.03868C75.3593 3.56505 72.7496 13.6414 61.8192 23.2477L70.9342 19.9015L69.4402 23.1349C69.1377 23.7741 62.084 38.6442 48.2602 40.0353L47.9198 37.1215C56.146 36.2943 61.8003 29.6018 64.5802 25.3908L52.7231 29.7522L51.3237 27.1579C60.4198 21.9882 67.5113 14.2054 71.5582 4.97499C39.4289 14.5813 26.6263 29.7522 25.3782 41.1069C41.2254 49.0025 63.5212 37.9486 63.767 37.8358L68.0598 35.6739L65.9039 39.791C65.7716 40.0353 55.087 60 39.9017 60V59.9812L39.9017 59.9812C37.5378 59.9436 35.1929 59.4736 33.0182 58.5901C30.8434 57.7065 28.8767 56.4282 27.2315 54.8302C25.5862 53.2323 24.2814 51.3336 23.4115 49.2657C22.5416 47.1978 22.1067 44.9795 22.1634 42.7424C21.2368 42.1972 20.3669 41.5769 19.5348 40.9377C6.10817 30.4854 7.73449 19.4127 8.60439 13.4722C8.83132 12.4382 8.90696 11.3667 8.85023 10.3139C8.24508 8.998 4.23601 8.13324 1.059 7.90765C0.718608 7.90765 0.359304 7.88885 0 7.85125L0.189107 4.91859C0.416036 4.91859 0.77534 4.93739 1.2292 4.97499C4.65204 5.03139 6.92133 3.77184 9.36082 2.45591C12.0461 0.951977 14.8449 -0.551952 18.7784 0.200012C24.8676 1.36556 26.7398 8.07684 27.2882 11.3667C30.6732 10.6147 38.0673 9.61837 44.3268 13.3782C53.4228 8.07684 63.2375 4.01623 73.525 1.29036L76.0968 0.575995Z"
              pathLength="1"
              strokeDasharray="1 2"
              strokeDashoffset="1"
            />
            <path
              data-thread="wing"
              d="M61.8192 23.2477L70.9342 19.9015L69.4402 23.1349C69.1377 23.7741 62.084 38.6442 48.2602 40.0353L47.9198 37.1215C56.146 36.2943 61.8003 29.6018 64.5802 25.3908L52.7231 29.7522L51.3237 27.1579C60.4198 21.9882 67.5113 14.2054 71.5582 4.97499C39.4289 14.5813 26.6263 29.7522 25.3782 41.1069C41.2254 49.0025 63.5212 37.9486 63.767 37.8358L68.0598 35.6739L65.9039 39.791C65.7716 40.0353 55.087 60 39.9017 60"
              pathLength="1"
              strokeDasharray="1 2"
              strokeDashoffset="1"
            />
            <path
              data-thread="crest"
              d="M25.3404 44.3779C25.5295 46.7654 26.3805 49.0401 27.8177 51.014C29.2549 52.9879 31.2216 54.5483 33.5098 55.5822C45.7451 61.2031 56.1082 49.0589 60.6468 42.4228C53.1581 45.3555 37.9349 49.8485 25.3404 44.3779Z"
              pathLength="1"
              strokeDasharray="1 2"
              strokeDashoffset="1"
            />
          </g>

          {/* Shimmer / Gloss Sweep */}
          <g clipPath="url(#splash-bird-clip)">
            <rect data-shine x="0" y="0" width="18" height="60" fill="url(#splash-shine)" opacity="0" />
          </g>
        </svg>
      </div>
    </div>
  );
};
