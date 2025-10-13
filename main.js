const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupAccent();
  setupHeaderScroll();
  setupMobileNav();
  setupScrollSpy();
  setupRevealIO();            // lekki reveal bez GSAP
  setupTypedLazy();           // leniwe ładowanie Typed
  setupConstellation();       // wyłączone na mobile/PRM
  setupTiltLazy();            // leniwe ładowanie Tilt
  setupIconifyLazy();         // leniwe ładowanie Iconify
  setupMagneticButtons();
  setupToTopFab();
  setupContactForm();
  setupSW();
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
});

/* Helpers */
function loadWhenIdle(src){
  return new Promise((res, rej) => {
    const load = () => {
      const s = document.createElement('script');
      s.src = src; s.defer = true; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    };
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 2000 });
    else setTimeout(load, 800);
  });
}

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

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 });
  sections.forEach(sec => io.observe(sec));

  function setActive(id){
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  }
}

/* Reveal bez GSAP */
function setupRevealIO(){
  const els = [...$$('.reveal-y'), ...$$('.reveal-pop')];
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in');
        if (e.target.tagName === 'H2') e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

/* Typed.js — leniwie, tylko jeśli #typed istnieje */
async function setupTypedLazy(){
  const el = $('#typed');
  if (!el) return;
  try {
    await loadWhenIdle('https://cdn.jsdelivr.net/npm/typed.js@2.0.12');
    if (!window.Typed) return;
    const strings = [
      'IT Specialist','Windows Server / Active Directory','VMware & Proxmox',
      'Office 365','Network Security','Automatyzacje: Python / Bash'
    ];
    new Typed('#typed', { strings, typeSpeed: 28, backSpeed: 16, backDelay: 1100, loop: true, smartBackspace: true, showCursor: true, cursorChar: '▌' });
  } catch {}
}

/* Iconify — leniwie po bezczynności, tylko jeśli są ikony */
async function setupIconifyLazy(){
  if (!document.querySelector('.iconify')) return;
  try { await loadWhenIdle('https://code.iconify.design/3/3.1.1/iconify.min.js'); } catch {}
}

/* Tilt — leniwie (desktop, brak PRM) */
async function setupTiltLazy(){
  const anyTilt = document.querySelector('[data-tilt]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(pointer:coarse)').matches;
  if (!anyTilt || reduce || isTouch) return;
  try {
    await loadWhenIdle('https://cdn.jsdelivr.net/npm/vanilla-tilt@1.8.1/dist/vanilla-tilt.min.js');
    if (window.VanillaTilt) window.VanillaTilt.init(document.querySelectorAll('[data-tilt]'), { max: 6, speed: 400, glare: false, scale: 1.01 });
  } catch {}
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

/* Formularz -> Formspree */
function setupContactForm(){
  const form = $('#contactForm');
  const status = $('#formStatus');
  const btn = $('#sendBtn');
  if (!form) return;

  function validate(){
    let ok = true;
    // Honeypots (_gotcha dla Formspree + własny 'website')
    const hp1 = form.querySelector('input[name="website"]');
    const hp2 = form.querySelector('input[name="_gotcha"]');
    if ((hp1 && hp1.value.trim() !== '') || (hp2 && hp2.value.trim() !== '')) return false; // bot
    form.querySelectorAll('label').forEach(label => {
      const input = label.querySelector('input, textarea');
      const err = label.querySelector('.error');
      if (!input.checkValidity()){
        ok = false; if (err) err.textContent = input.validationMessage;
      } else { if (err) err.textContent = ''; }
    });
    return ok;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (status) status.textContent = 'Wysyłanie...';
    if (btn) { btn.disabled = true; btn.setAttribute('aria-disabled', 'true'); }

    try {
      const data = new FormData(form);
      const resp = await fetch(form.action || 'https://formspree.io/f/xqaygbbl', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (resp.ok) {
        if (status) status.textContent = 'Dziękuję! Wiadomość została wysłana.';
        form.reset();
      } else {
        let msg = 'Wystąpił problem z wysyłką. Spróbuj ponownie.';
        try {
          const payload = await resp.json();
          if (payload && payload.errors) {
            msg = payload.errors.map(e => e.message).join(', ');
          }
        } catch {}
        if (status) status.textContent = msg;
      }
    } catch (err) {
      if (status) status.textContent = 'Brak połączenia. Spróbuj ponownie.';
    } finally {
      if (btn) { setTimeout(()=>{ btn.disabled = false; btn.removeAttribute('aria-disabled'); }, 1200); }
    }
  });
}

/* Konstelacja — off na mobile/PRM; ~28 FPS desktop */
function setupConstellation(){
  const canvas = document.getElementById('constellation');
  if (!canvas) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = window.innerWidth < 992;
  if (reduce || isSmall) { canvas.remove(); return; }

  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize(){
    canvas.width = canvas.clientWidth * DPR;
    canvas.height = canvas.clientHeight * DPR;
  }
  resize(); window.addEventListener('resize', resize, { passive: true });

  const COUNT = 60;
  const ps = Array.from({ length: COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.clientHeight,
    vx: (Math.random() - .5) * .18 * DPR,
    vy: (Math.random() - .5) * .18 * DPR,
    r: Math.random() * 2 * DPR
  }));

  const FRAME_MS = 1000 / 28;
  let last = 0;

  function step(ts){
    if (ts - last < FRAME_MS) { requestAnimationFrame(step); return; }
    last = ts;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let i=0;i<COUNT;i++){
      for (let j=i+1;j<COUNT;j++){
        const a = ps[i], b = ps[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx*dx + dy*dy;
        const max = (140*DPR)*(140*DPR);
        if (d2 < max) {
          const alpha = 1 - d2 / max;
          ctx.strokeStyle = `rgba(96,165,250,${alpha * .18})`;
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
  requestAnimationFrame(step);
}

/* Service Worker */
function setupSW(){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(()=>{});
    });
  }
}
