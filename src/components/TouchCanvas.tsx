import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
  lineWidth: number;
  rgb: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  rgb: string;
  glow: number;
}

export const TouchCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    let isRunning = false;
    let isTouching = false;
    let lastPos: { x: number; y: number } | null = null;

    const isOverFooter = (y: number) => {
      const footer = document.querySelector('.footer-wave-section');
      return Boolean(footer && y >= footer.getBoundingClientRect().top);
    };

    function addScrapeEffect(x: number, y: number) {
      const onFooter = isOverFooter(y);
      const rgb = onFooter ? '255, 255, 255' : '66, 94, 249';

      ripples.push({
        x,
        y,
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
      if (!ctx) return;
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

    const handleScrapeMove = (x: number, y: number) => {
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

    const onPointerDown = (e: PointerEvent) => {
      isTouching = true;
      lastPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isTouching) handleScrapeMove(e.clientX, e.clientY);
    };

    const endTouch = () => {
      isTouching = false;
      lastPos = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        handleScrapeMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    let lastScrollY = window.scrollY || 0;
    let lastScrollTime = 0;
    const onScroll = () => {
      const now = performance.now();
      if (now - lastScrollTime < 32) return;
      lastScrollTime = now;
      const appWrapper = document.querySelector('.app-wrapper');
      const currentY = window.scrollY || (appWrapper ? appWrapper.scrollTop : 0);
      const diff = Math.abs(currentY - lastScrollY);
      lastScrollY = currentY;
      if (diff > 2) {
        const sx = lastPos ? lastPos.x : width * 0.5 + (Math.random() - 0.5) * 80;
        const sy = lastPos ? lastPos.y : height * 0.5 + (Math.random() - 0.5) * 60;
        addScrapeEffect(sx, sy);
      }
    };

    const onWheel = (e: WheelEvent) => {
      handleScrapeMove(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', endTouch, { passive: true });
    window.addEventListener('pointercancel', endTouch, { passive: true });
    window.addEventListener('touchend', endTouch, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });

    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper) {
      appWrapper.addEventListener('scroll', onScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endTouch);
      window.removeEventListener('pointercancel', endTouch);
      window.removeEventListener('touchend', endTouch);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      if (appWrapper) {
        appWrapper.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

  return <canvas ref={canvasRef} id="touch-canvas" className="touch-canvas" aria-hidden="true" />;
};
