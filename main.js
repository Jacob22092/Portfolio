const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupAccent();
  setupHeaderScroll();
  setupMobileNav();
  setupScrollSpy();
  setupGSAP();
  setupTyped();
  setupCounters();
  // Removed skills bars (no % indicators)
  setupConstellation();
  setupTilt();
  setupMagneticButtons();
  setupToTopFab();
  setupContactForm();
  setupSW();
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
});

/* Motyw */
function setupTheme(){
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const nextTheme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', nextTheme);

  const btn = $('#themeToggle');
  const icon = $('#themeIcon');
  if (!btn) return;
  const sync = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-pressed', String(dark));
    if (icon) icon.dataset.icon = dark ? 'solar:moon-stars-bold-duotone' : 'solar:sun-2-bold-duotone';
  };
  sync();
  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    sync();
  });
}

/* Akcent */
function setupAccent(){
  const picker = $('#accentPicker');
  const saved = localStorage.getItem('accent');
  if (saved) { document.documentElement.style.setProperty('--accent', saved); if (picker) picker.value = saved; }
  picker?.addEventListener('input', (e) => {
    const val = e.target.value;
    document.documentElement.style.setProperty('--accent', val);
    localStorage.setItem('accent', val);
  });
}

/* Header i progress */
function setupHeaderScroll(){
  const header = $('#siteHeader');
  const bar = $('#scrollBar');
  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (bar) bar.style.width = `${p}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Mobile nav */
function setupMobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const list = document.querySelector('.nav-list');
  if (!toggle || !list) return;
  toggle.addEventListener('click', () => {
    const open = list.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  list.addEventListener('click', (e) => {
    if (e.target.closest('.nav-link')) list.classList.remove('open');
  });
}

/* Scroll spy */
function setupScrollSpy(){
  const links = $$('.nav-link');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    links.forEach(l => l.classList.remove('active'));
    sections.forEach(sec => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive(sec.id),
        onEnterBack: () => setActive(sec.id)
      });
    });
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 });
    sections.forEach(sec => io.observe(sec));
  }

  function setActive(id){
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  }
}

/* GSAP animacje — lekkie */
function setupGSAP(){
  if (!window.gsap) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  $$('.reveal-y').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 80%' },
      opacity: 1, y: 0, duration: .6, ease: 'power2.out'
    });
  });
  $$('.reveal-pop').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.5)'
    });
  });

  $$('h2.reveal-y').forEach((el) => {
    window.ScrollTrigger && ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('revealed')
    });
  });

  gsap.to('.blob.b1', { y: -16, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.blob.b2', { y: 16, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.blob.b3', { y: -12, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
}

/* Typed */
function setupTyped(){
  const el = $('#typed');
  if (!el || !window.Typed) return;
  const strings = [
    'IT Specialist',
    'Windows Server / Active Directory',
    'VMware & Proxmox',
    'Office 365',
    'Network Security',
    'Automatyzacje: Python / Bash'
  ];
  new Typed('#typed', {
    strings, typeSpeed: 32, backSpeed: 16, backDelay: 1100, loop: true, smartBackspace: true, showCursor: true, cursorChar: '▌'
  });
}

/* Liczniki (zostawione na przyszłość — brak wskaźników w Tech) */
function setupCounters(){
  const nums = $$('.stat-num');
  if (!nums.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target, Number(e.target.dataset.count)); io.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  nums.forEach(n => io.observe(n));
}
function animateCount(el, to){
  let n = 0; const step = Math.max(1, Math.floor(to / 36));
  const t = setInterval(() => { n += step; if (n >= to) { n = to; clearInterval(t); } el.textContent = String(n); }, 22);
}

/* Tilt */
function setupTilt(){
  if (!window.VanillaTilt) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max: 6, speed: 400, glare: false, scale: 1.01
  });
}

/* Magnetic buttons (desktop only) */
function setupMagneticButtons(){
  const isTouch = matchMedia('(pointer:coarse)').matches;
  if (isTouch) return;
  const mag = 6;
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('mousemove', (e)=>{
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width/2)) / (r.width/2);
      const y = (e.clientY - (r.top + r.height/2)) / (r.height/2);
      btn.style.transform = `translate(${x*mag}px, ${y*mag}px)`;
    });
    btn.addEventListener('mouseleave', ()=>{ btn.style.transform = ''; });
  });
}

/* To Top FAB */
function setupToTopFab(){
  const btn = $('#toTopFab');
  if (!btn) return;

  const onScroll = () => {
    if (window.scrollY > 140) btn.classList.add('show');
    else btn.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Formularz */
function setupContactForm(){
  const form = $('#contactForm');
  const status = $('#formStatus');
  const btn = $('#sendBtn');
  if (!form) return;

  function validate(){
    let ok = true;
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== '') return false; // bot
    form.querySelectorAll('label').forEach(label => {
      const input = label.querySelector('input, textarea');
      const err = label.querySelector('.error');
      if (!input.checkValidity()){
        ok = false;
        err.textContent = input.validationMessage;
      } else {
        err.textContent = '';
      }
    });
    return ok;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (status) status.textContent = 'Wysyłanie...';
    if (btn) { btn.disabled = true; btn.setAttribute('aria-disabled', 'true'); }
    setTimeout(() => {
      if (status) status.textContent = 'Dziękuję! Wiadomość została wysłana.';
      if (btn) { setTimeout(()=>{ btn.disabled = false; btn.removeAttribute('aria-disabled'); }, 5000); }
      form.reset();
    }, 800);
  });
}

/* Konstelacja */
function setupConstellation(){
  const canvas = document.getElementById('constellation');
  if (!canvas) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;

  function resize(){
    canvas.width = canvas.clientWidth * DPR;
    canvas.height = canvas.clientHeight * DPR;
  }
  resize(); window.addEventListener('resize', resize);

  const isSmall = window.innerWidth < 800;
  const COUNT = reduce ? 0 : (isSmall ? 42 : 68);
  const ps = Array.from({ length: COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .22 * DPR,
    vy: (Math.random() - .5) * .22 * DPR,
    r: Math.random() * 2 * DPR
  }));

  function step(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let i=0;i<COUNT;i++){
      for (let j=i+1;j<COUNT;j++){
        const a = ps[i], b = ps[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx*dx + dy*dy;
        const max = (140*DPR)*(140*DPR);
        if (d2 < max) {
          const alpha = 1 - d2 / max;
          ctx.strokeStyle = `rgba(96,165,250,${alpha * .22})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    ps.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.fillStyle = 'rgba(139,92,246,.85)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(step);
  }
  step();
}

/* Service Worker */
function setupSW(){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(()=>{});
    });
  }
}