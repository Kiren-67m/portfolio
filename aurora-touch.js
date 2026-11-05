/* Pointer interaction is isolated from the original portfolio UI. */
(() => {
  'use strict';
  const field = document.querySelector('.site-aurora');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!field || reducedMotion.matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'aurora-touch';
  canvas.setAttribute('aria-hidden', 'true');
  field.after(canvas);
  const context = canvas.getContext('2d');
  if (!context) return;

  const colors = [[7,141,112],[38,206,170],[152,232,193],[255,255,255],[123,173,226],[80,73,204],[61,26,120]];
  const strengths = [.14,.22,.32,.5,.32,.15,.1];
  const particles = [];
  let width = 0, height = 0, ratio = 1;
  let frame = 0, lastFrame = 0, lastBurst = 0;
  let mouseX = 0, mouseY = 0, smoothX = 0, smoothY = 0;
  let target = 0, pressure = 0, firstMove = true;
  let burstNumber = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function burst(x, y, time) {
    const phase = burstNumber++ * .41;
    for (let i = 0; i < colors.length; i++) {
      const angle = i * Math.PI * 2 / colors.length + phase;
      particles.push({
        x: x + Math.cos(angle) * 12,
        y: y + Math.sin(angle) * 12,
        vx: Math.cos(angle) * (115 + i % 3 * 19),
        vy: Math.sin(angle) * (115 + i % 3 * 19),
        age: 0, life: 1.25 + i % 3 * .12,
        color: colors[i], strength: strengths[i]
      });
    }
    if (particles.length > 70) particles.splice(0, particles.length - 70);
    lastBurst = time;
  }

  function schedule() {
    if (!frame) {
      lastFrame = performance.now();
      frame = requestAnimationFrame(draw);
    }
  }

  function draw(time) {
    frame = 0;
    const dt = Math.min((time - lastFrame) / 1000, .04);
    lastFrame = time;
    const easing = 1 - Math.exp(-dt * 10);
    pressure += (target - pressure) * easing;
    smoothX += (mouseX - smoothX) * Math.min(1, easing * 1.65);
    smoothY += (mouseY - smoothY) * Math.min(1, easing * 1.65);

    field.style.setProperty('--touch-x', `${smoothX}px`);
    field.style.setProperty('--touch-y', `${smoothY + window.scrollY}px`);
    field.style.setProperty('--touch-radius', `${Math.max(.1, 165 * pressure)}px`);
    field.classList.toggle('is-touched', pressure > .006);

    context.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      if (p.age >= p.life) {
        particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.exp(-dt * .8);
      p.vy *= Math.exp(-dt * .8);
      const progress = p.age / p.life;
      const radius = 42 + progress * 84;
      const opacity = p.strength * Math.pow(1 - progress, 1.6);
      const [r, g, b] = p.color;
      const glow = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      glow.addColorStop(0, `rgba(${r},${g},${b},${opacity})`);
      glow.addColorStop(.4, `rgba(${r},${g},${b},${opacity * .55})`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      context.fillStyle = glow;
      context.fillRect(p.x - radius, p.y - radius, radius * 2, radius * 2);
    }
    const settling = Math.abs(target - pressure) > .002 || Math.hypot(mouseX - smoothX, mouseY - smoothY) > .1;
    if (settling || particles.length) frame = requestAnimationFrame(draw);
    else if (!target) {
      field.classList.remove('is-touched');
      firstMove = true;
    }
  }

  function release() {
    target = 0;
    schedule();
  }

  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    if (event.target.closest('.navbar, .chat-panel, .chat-overlay.active')) {
      release();
      return;
    }
    const distance = Math.hypot(event.clientX - mouseX, event.clientY - mouseY);
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (firstMove) {
      smoothX = mouseX;
      smoothY = mouseY;
      firstMove = false;
    }
    target = 1;
    const now = performance.now();
    if (now - lastBurst > 85 && distance > 7) burst(mouseX, mouseY, now);
    schedule();
  }, {passive: true});

  document.addEventListener('pointerleave', release);
  window.addEventListener('blur', release);
  window.addEventListener('scroll', release, {passive: true});
  window.addEventListener('resize', resize, {passive: true});
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    cancelAnimationFrame(frame);
    frame = 0;
    particles.length = 0;
    pressure = target = 0;
    firstMove = true;
    field.classList.remove('is-touched');
    context.clearRect(0, 0, width, height);
  });
  reducedMotion.addEventListener('change', () => {
    release();
    canvas.hidden = reducedMotion.matches;
  });
  resize();
})();
