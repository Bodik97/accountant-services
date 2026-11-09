import * as THREE from 'three';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => innerWidth < 768;
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

/* =========================================================
   3D-сцена: частинки, що перетворюються «від хаосу до порядку»
   0 хаос → 1 лінії книги обліку → 2 стовпчики → 3 лінія зростання
   ========================================================= */
function shapeChaos(n) {
  const a = new Float32Array(n * 3);
  for (let k = 0; k < n; k++) {
    const r = 3.4 * Math.cbrt(Math.random());
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    a[k * 3] = r * Math.sin(ph) * Math.cos(th) * 1.35;
    a[k * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.95;
    a[k * 3 + 2] = r * Math.cos(ph);
  }
  return a;
}

function shapeLedger(n) {
  const a = new Float32Array(n * 3);
  const rows = 13, perRow = Math.ceil(n / rows), tilt = -0.45;
  for (let k = 0; k < n; k++) {
    let x, y;
    if (k % 19 === 0) { // вертикальна лінія поля, як у бухгалтерській книзі
      x = -2.2; y = -3 + Math.random() * 6;
    } else {
      const row = k % rows;
      x = -3.2 + (Math.floor(k / rows) / perRow) * 6.4;
      y = 3 - row * (6 / (rows - 1));
    }
    a[k * 3] = x;
    a[k * 3 + 1] = y * Math.cos(tilt);
    a[k * 3 + 2] = y * Math.sin(tilt);
  }
  return a;
}

function shapeBars(n) {
  const a = new Float32Array(n * 3), nb = 8;
  for (let k = 0; k < n; k++) {
    const b = k % nb, h = 0.9 + b * 0.68;
    a[k * 3] = -3.85 + b * 1.1 + (Math.random() - 0.5) * 0.62;
    a[k * 3 + 1] = -2.9 + Math.random() * h;
    a[k * 3 + 2] = (Math.random() - 0.5) * 0.62;
  }
  return a;
}

function shapeGrowth(n) {
  const a = new Float32Array(n * 3);
  for (let k = 0; k < n; k++) {
    const t = Math.random();
    let x, y, z = 0;
    if (k % 7 === 0) { // осі графіка
      if (k % 2) { x = -3.2 + t * 6.4; y = -2.9; } else { x = -3.2; y = -2.9 + t * 5.8; }
    } else {
      const s = 0.13 * Math.sqrt(-2 * Math.log(Math.random() + 1e-6)) * Math.cos(Math.PI * 2 * Math.random());
      x = -3.2 + t * 6.4;
      y = -2.6 + 5.4 * Math.pow(t, 1.9) + s;
      z = s;
    }
    a[k * 3] = x; a[k * 3 + 1] = y; a[k * 3 + 2] = z;
  }
  return a;
}

function initScene() {
  const canvas = document.getElementById('scene');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    canvas.remove();
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const N = isMobile() ? 1600 : 3000;
  const rand = new Float32Array(N).map(() => Math.random());
  const shapes = [shapeChaos(N), shapeLedger(N), shapeBars(N), shapeGrowth(N)];
  const pos = shapes[0].slice();

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPR: { value: 1 },
      uSize: { value: 5.5 },
      uColA: { value: new THREE.Color('#C9A45C') },
      uColB: { value: new THREE.Color('#ECEEE6') },
    },
    vertexShader: /* glsl */`
      attribute float aRand;
      uniform float uTime, uPR, uSize;
      varying float vRand;
      void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.7 + aRand * 6.2831) * 0.035;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPR * (0.55 + aRand * 0.9) * (10.0 / -mv.z);
        vRand = aRand;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uColA, uColB;
      uniform float uTime;
      varying float vRand;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.05, d);
        float twinkle = 0.65 + 0.35 * sin(uTime * 1.3 + vRand * 40.0);
        vec3 c = mix(uColA, uColB, step(0.78, vRand));
        gl_FragColor = vec4(c, alpha * 0.85 * twinkle);
      }`,
  });

  const group = new THREE.Group();
  group.add(new THREE.Points(geo, mat));
  scene.add(group);

  // Зсув і масштаб сцени для кожної форми (на десктопі — праворуч від тексту)
  const offsetX = [2.7, 3.4, 0, 3.7];
  const markers = ['#problem', '#services', '#results'].map((s) => document.querySelector(s));
  const mouse = { x: 0, y: 0 };
  let p = 0;

  if (!reduceMotion) {
    addEventListener('pointermove', (e) => {
      mouse.x = e.clientX / innerWidth - 0.5;
      mouse.y = e.clientY / innerHeight - 0.5;
    }, { passive: true });
  }

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    mat.uniforms.uPR.value = renderer.getPixelRatio();
  }
  addEventListener('resize', resize);
  resize();

  function scrollTarget() {
    let t = 0;
    for (const m of markers) {
      const top = m.getBoundingClientRect().top;
      t += clamp((innerHeight - top) / (innerHeight * 0.85), 0, 1);
    }
    return t;
  }

  const clock = new THREE.Clock();
  function frame() {
    const time = clock.getElapsedTime();
    const target = scrollTarget();
    p = reduceMotion ? target : p + (target - p) * 0.06;

    const i = Math.min(Math.floor(p), 2);
    const f = p - i;
    const A = shapes[i], B = shapes[i + 1];
    for (let k = 0; k < N; k++) {
      let fk = clamp(f * 1.6 - rand[k] * 0.6, 0, 1);
      fk = fk * fk * (3 - 2 * fk);
      const j = k * 3;
      pos[j] = A[j] + (B[j] - A[j]) * fk;
      pos[j + 1] = A[j + 1] + (B[j + 1] - A[j + 1]) * fk;
      pos[j + 2] = A[j + 2] + (B[j + 2] - A[j + 2]) * fk;
    }
    geo.attributes.position.needsUpdate = true;

    const mobile = isMobile();
    const ox = mobile ? 0 : offsetX[i] + (offsetX[i + 1] - offsetX[i]) * f;
    group.position.x += (ox - group.position.x) * 0.08;
    group.scale.setScalar(mobile ? 0.62 : 1);
    const chaosSpin = (1 - clamp(p, 0, 1)) * time * 0.06;
    group.rotation.y += (mouse.x * 0.35 + chaosSpin - group.rotation.y) * 0.05;
    group.rotation.x += (mouse.y * 0.2 - group.rotation.x) * 0.05;

    mat.uniforms.uTime.value = reduceMotion ? 0 : time;
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  frame();
}

/* =========================================================
   GSAP: переходи між блоками і поява контенту
   ========================================================= */
function initMotion() {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return; // без CDN сайт просто статичний
  gsap.registerPlugin(ScrollTrigger);

  // Шапка: фон після скролу, ховається при скролі вниз
  const header = document.querySelector('.site-header');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      header.classList.toggle('is-scrolled', y > 40);
      header.classList.toggle('is-hidden', self.direction === 1 && y > 400);
    },
  });

  // Мобільна кнопка ховається біля форми
  ScrollTrigger.create({
    trigger: '#contact', start: 'top 85%', end: 'max',
    toggleClass: { targets: '.mobile-cta', className: 'is-hidden' },
  });

  // Лічильники
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    if (reduceMotion || to === 0) return;
    const o = { v: 0 };
    el.textContent = '0';
    gsap.to(o, {
      v: to, duration: 1.8, ease: 'power2.out', delay: 0.9,
      onUpdate: () => { el.textContent = Math.round(o.v); },
    });
  });

  if (reduceMotion) return;

  // Hero: заголовок по словах
  const title = document.querySelector('[data-split]');
  title.innerHTML = title.textContent.trim().split(/\s+/)
    .map((w) => `<span class="word"><span>${w}</span></span>`).join(' ');
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from('.hero__title .word > span', { yPercent: 110, duration: 1.2, stagger: 0.07 })
    .from('[data-hero]', { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, '-=0.9')
    .from('.site-header', { opacity: 0, duration: 0.8 }, '-=0.9');

  // Поява елементів пачками
  gsap.set('[data-reveal]', { y: 48, opacity: 0 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });

  const mm = gsap.matchMedia();

  // Десктоп: горизонтальний скрол етапів роботи.
  // Створюється до інших тригерів, щоб вони враховували відступ від закріплення.
  mm.add('(min-width: 768px)', () => {
    const track = document.querySelector('.process__track');
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '#process', start: 'top top', end: () => '+=' + dist(),
        pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set('.process__progress span', { scaleX: self.progress }),
      },
    });
    gsap.from('.step', {
      opacity: 0, x: 120, stagger: 0.12, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '#process', start: 'top 60%' },
    });
  });

  // Блоки «ховаються»: при виході контент зменшується, тьмяніє і відпливає вгору
  gsap.utils.toArray('.panel:not(.panel--paper):not(.contact) > .panel__inner').forEach((inner) => {
    gsap.to(inner, {
      opacity: 0, scale: 0.93, y: -70, ease: 'none',
      scrollTrigger: { trigger: inner.parentElement, start: 'bottom 70%', end: 'bottom 10%', scrub: true },
    });
  });

  // Болі закреслюються одна за одною
  const pains = gsap.utils.toArray('.pain');
  const painTl = gsap.timeline({
    scrollTrigger: { trigger: '.pains', start: 'top 70%', end: 'bottom 35%', scrub: 0.6 },
  });
  pains.forEach((li) => {
    painTl.to(li.querySelector('.pain__line'), {
      scaleX: 1, duration: 1, ease: 'power2.inOut',
      onStart: () => li.classList.add('is-done'),
      onReverseComplete: () => li.classList.remove('is-done'),
    });
  });
  painTl.from('[data-stamp]', { scale: 1.8, opacity: 0, rotate: -14, duration: 0.8, ease: 'back.out(2)' });

  // Світла панель цін розкривається з «картки» на весь екран і закривається на виході
  const paper = document.querySelector('.paper');
  gsap.fromTo(paper,
    { clipPath: 'inset(8% 5% 0% 5% round 48px)' },
    { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
      scrollTrigger: { trigger: paper, start: 'top bottom', end: 'top 10%', scrub: true } });
  gsap.fromTo(paper,
    { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
    { clipPath: 'inset(0% 5% 8% 5% round 48px)', ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: paper, start: 'bottom 90%', end: 'bottom 15%', scrub: true } });

  // Магнітні кнопки
  if (matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn--magnetic').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
}

/* =========================================================
   Форма заявки
   ========================================================= */
function initForm() {
  const form = document.getElementById('lead-form');
  const planSelect = document.getElementById('f-plan');

  document.querySelectorAll('[data-plan]').forEach((a) => {
    a.addEventListener('click', () => { planSelect.value = a.dataset.plan; });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const phoneField = form.phone.closest('.field');
    const digits = form.phone.value.replace(/\D/g, '');
    const phoneOk = digits.length >= 10 && digits.length <= 12;
    phoneField.classList.toggle('is-invalid', !phoneOk);
    phoneField.querySelector('.field__error').textContent = phoneOk ? '' : 'Вкажіть номер телефону повністю';
    if (!form.name.value.trim()) { form.name.focus(); return; }
    if (!phoneOk) { form.phone.focus(); return; }

    // TODO: підключіть відправку заявки (Telegram-бот, CRM або сервіс форм).
    const data = Object.fromEntries(new FormData(form));
    console.info('Нова заявка:', data);
    form.querySelector('.lead-form__success').hidden = false;
  });
}

initForm();
initMotion();
initScene();
