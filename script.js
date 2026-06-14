/* AniBlend - Neon Cyberpunk JS */

// ── PAYOUT CALCULATOR ─────────────────────────
(function initCalculator() {
  const BASE_RATE = 4000; // ₹ per minute

  // State
  let typeMult  = 1;
  let typeLabel = '2D Animation';
  let qualMult  = 1;
  let qualLabel = 'Standard';
  let durSecs   = 60;
  let revisions = 2;

  // Elements
  const priceNum    = document.getElementById('price-num');
  const gstTotal    = document.getElementById('gst-total');
  const durBadge    = document.getElementById('dur-badge');
  const revBadge    = document.getElementById('rev-badge');
  const resDur      = document.getElementById('res-dur');
  const resType     = document.getElementById('res-type');
  const resQuality  = document.getElementById('res-quality');
  const resRev      = document.getElementById('res-rev');
  const delivNote   = document.getElementById('delivery-note');
  const durSlider   = document.getElementById('dur-slider');
  const revSlider   = document.getElementById('rev-slider');

  if (!priceNum) return; // calculator not on page

  // Animated number counter
  let currentDisplayed = 4000;
  let rafId = null;
  function animateTo(target) {
    if (rafId) cancelAnimationFrame(rafId);
    priceNum.classList.add('updating');
    setTimeout(() => priceNum.classList.remove('updating'), 200);
    const start = currentDisplayed;
    const diff  = target - start;
    const dur   = 500;
    const t0    = performance.now();
    function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(start + diff * ease);
      currentDisplayed = val;
      priceNum.textContent = val.toLocaleString('en-IN');
      if (p < 1) rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
  }

  function calcDelivery(secs, qMult) {
    const mins = secs / 60;
    let base = Math.ceil(mins * 3); // ~3 days per minute base
    base = Math.max(3, Math.min(base, 30));
    if (qMult >= 1.7) base = Math.ceil(base * 1.6);
    else if (qMult >= 1.3) base = Math.ceil(base * 1.25);
    return `Delivery in ${base}–${base + 5} business days`;
  }

  function update() {
    const mins  = durSecs / 60;
    const raw   = mins * BASE_RATE * typeMult * qualMult;
    const total = Math.round(raw / 100) * 100; // round to nearest 100
    const gst   = Math.round(total * 1.18);

    // Format duration label
    const m = Math.floor(durSecs / 60);
    const s = durSecs % 60;
    const durLabel = m > 0 ? (s > 0 ? `${m} min ${s} sec` : `${m} min`) : `${s} sec`;

    // Update badges
    durBadge.textContent  = durSecs >= 60 ? `${m} min${s ? ' ' + s + 's' : ''}` : `${durSecs} sec`;
    revBadge.textContent  = revisions === 0 ? 'No revisions' : revisions === 1 ? '1 revision' : `${revisions} revisions`;

    // Update breakdown
    resDur.textContent     = durLabel;
    resType.textContent    = typeLabel;
    resQuality.textContent = qualLabel;
    resRev.textContent     = revisions === 0 ? 'None' : `${revisions} included`;
    delivNote.textContent  = calcDelivery(durSecs, qualMult);

    // Animate price
    animateTo(total);
    gstTotal.textContent = '₹' + gst.toLocaleString('en-IN');

    // Update slider fill
    updateSliderFill(durSlider, 'dur-fill');
    updateSliderFill(revSlider, 'rev-fill');
  }

  function updateSliderFill(slider, fillId) {
    const fill = document.getElementById(fillId);
    if (!fill || !slider) return;
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(90deg, #9d00ff ${pct}%, rgba(255,255,255,0.08) ${pct}%)`;
  }

  // Type buttons
  document.querySelectorAll('.calc-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.calc-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      typeMult  = parseFloat(btn.dataset.mult);
      typeLabel = btn.dataset.type;
      update();
    });
  });

  // Quality buttons
  document.querySelectorAll('.qual-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.qual-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      qualMult  = parseFloat(btn.dataset.qmult);
      qualLabel = btn.dataset.qlabel;
      update();
    });
  });

  // Duration slider
  if (durSlider) {
    durSlider.addEventListener('input', () => {
      durSecs = parseInt(durSlider.value);
      update();
    });
  }

  // Revisions slider
  if (revSlider) {
    revSlider.addEventListener('input', () => {
      revisions = parseInt(revSlider.value);
      update();
    });
  }

  // Init
  update();
})();

// ── FAQ ACCORDION ──────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const ans = item.querySelector('.faq-a');
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq-a').classList.remove('open');
      el.querySelector('.faq-q').setAttribute('aria-expanded','false');
    });
    if (!open) {
      item.classList.add('open');
      ans.classList.add('open');
      btn.setAttribute('aria-expanded','true');
    }
  });
});

// ── LOADER ────────────────────────────────────
(function() {
  const loader = document.getElementById('loader');
  const bar    = document.querySelector('.loader-bar');
  const pct    = document.getElementById('loader-pct');
  let p = 0;
  document.body.style.overflow = 'hidden';
  const iv = setInterval(() => {
    p += Math.random() * 14 + 2;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      setTimeout(() => {
        loader.classList.add('out');
        document.body.style.overflow = '';
        startCounters();
      }, 350);
    }
    bar.style.setProperty('--w', p + '%');
    bar.style.width = p + '%';
    if (bar.querySelector) {
      const fill = bar.querySelector('::after');
    }
    // direct inline approach for the fill
    bar.style.background = `linear-gradient(90deg,#9d00ff,#00f5ff)`;
    bar.style.width = p + '%';
    // Use parent bar-wrap approach
    const bWrap = document.querySelector('.loader-bar');
    if(bWrap) {
      bWrap.style.background = `linear-gradient(90deg,#9d00ff ${p}%,rgba(255,255,255,0.08) ${p}%)`;
    }
    pct.textContent = Math.floor(p) + '%';
  }, 55);
})();

// ── CUSTOM CURSOR ──────────────────────────────
const cur = document.getElementById('cursor');
const curF = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});
(function raf() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  curF.style.left = fx + 'px';
  curF.style.top  = fy + 'px';
  requestAnimationFrame(raf);
})();
document.querySelectorAll('a,button,.srv-card,.wk-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cur.style.background = 'var(--neon-cyan)';
    curF.style.transform = 'translate(-50%,-50%) scale(1.5)';
    curF.style.borderColor = 'rgba(0,245,255,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(1)';
    cur.style.background = 'var(--neon-purple)';
    curF.style.transform = 'translate(-50%,-50%) scale(1)';
    curF.style.borderColor = 'rgba(157,0,255,0.5)';
  });
});

// ── NAVBAR ────────────────────────────────────
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 70);
  // active link
  document.querySelectorAll('section[id]').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) {
      document.querySelectorAll('.nav-item').forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-item[href="#${sec.id}"]`);
      if(a) a.classList.add('active');
    }
  });
});
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
  const lines = navToggle.querySelectorAll('.toggle-line');
  if(navMenu.classList.contains('open')) {
    lines[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    lines[1].style.opacity = '0';
    lines[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    lines.forEach(l => { l.style.transform = ''; l.style.opacity = ''; });
  }
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navMenu.classList.remove('open');
  navToggle.querySelectorAll('.toggle-line').forEach(l => { l.style.transform=''; l.style.opacity=''; });
}));

// ── HERO CANVAS PARTICLES ─────────────────────
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
resize();
window.addEventListener('resize', resize);

const COLORS = ['157,0,255','0,245,255','255,0,110','57,255,20'];
const pts = Array.from({length:140}, () => {
  const p = {
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    vx:(Math.random()-.5)*.5,
    vy:(Math.random()-.5)*.5,
    r: Math.random()*1.8+.4,
    a: Math.random()*.5+.1,
    col: COLORS[Math.floor(Math.random()*COLORS.length)],
    life:0, maxLife:Math.random()*220+80
  };
  p.life = Math.random()*p.maxLife;
  return p;
});
let hmx=0,hmy=0;
document.addEventListener('mousemove',e=>{hmx=e.clientX;hmy=e.clientY;});
function drawCanvas() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pts.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.life++;
    // repel
    const dx=p.x-hmx, dy=p.y-hmy, d=Math.sqrt(dx*dx+dy*dy);
    if(d<90){p.vx+=dx/d*.25;p.vy+=dy/d*.25;}
    // damp
    p.vx*=0.99; p.vy*=0.99;
    if(p.life>=p.maxLife||p.x<0||p.x>canvas.width||p.y<0||p.y>canvas.height){
      Object.assign(p,{x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,life:0,maxLife:Math.random()*220+80});
    }
    const fade=Math.min(Math.min(p.life/40,1),(p.maxLife-p.life)/40,1);
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(${p.col},${p.a*fade})`;
    ctx.fill();
  });
  // connections
  for(let i=0;i<pts.length;i++){
    for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<110){
        ctx.beginPath();
        ctx.moveTo(pts[i].x,pts[i].y);
        ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=`rgba(157,0,255,${(1-d/110)*.06})`;
        ctx.lineWidth=.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// ── COUNTERS ──────────────────────────────────
function startCounters() {
  document.querySelectorAll('.count').forEach(el => {
    const to = +el.dataset.to;
    let cur = 0;
    const step = to / (2000/16);
    const iv = setInterval(() => {
      cur = Math.min(cur+step, to);
      el.textContent = Math.floor(cur);
      if(cur>=to) clearInterval(iv);
    }, 16);
  });
}

// ── SCROLL REVEAL ─────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });

document.querySelectorAll('.about-media,.about-text,.contact-left,.contact-right').forEach(el => observer.observe(el));
document.querySelectorAll('.srv-card').forEach((el,i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = i*0.08+'s';
  observer.observe(el);
});
document.querySelectorAll('.wk-item').forEach((el,i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = i*0.07+'s';
  observer.observe(el);
});
document.querySelectorAll('.proc-step').forEach((el,i) => {
  el.style.transitionDelay = i*0.15+'s';
  observer.observe(el);
});
document.querySelectorAll('.sec-head,.faq-list').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ── PORTFOLIO FILTER ──────────────────────────
document.querySelectorAll('.wf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.wf-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.wk-item').forEach(item => {
      const show = cat==='all' || item.dataset.cat===cat;
      item.style.display = show?'':'none';
      if(show) item.style.animation='wkFadeIn .4s ease forwards';
    });
  });
});
const wkStyle = document.createElement('style');
wkStyle.textContent = '@keyframes wkFadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}';
document.head.appendChild(wkStyle);

// ── TESTIMONIAL SLIDER ────────────────────────
let curSlide = 0;
const slides = document.querySelectorAll('.testi-card');
const dots   = document.querySelectorAll('.tdot');
function goSlide(n) {
  slides[curSlide].classList.remove('active');
  dots[curSlide].classList.remove('active');
  curSlide = (n+slides.length)%slides.length;
  slides[curSlide].classList.add('active');
  dots[curSlide].classList.add('active');
}
dots.forEach(d => d.addEventListener('click', () => goSlide(+d.dataset.i)));
setInterval(() => goSlide(curSlide+1), 5000);

// ── CONTACT FORM ──────────────────────────────
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  const txt = document.getElementById('btn-text');
  txt.textContent = 'Sending...';
  btn.disabled = true; btn.style.opacity = '.7';
  setTimeout(() => {
    txt.textContent = '✓ Message Sent! We\'ll call you soon.';
    btn.style.background = 'linear-gradient(135deg,#39ff14,#00f5ff)';
    btn.style.opacity = '1';
    setTimeout(() => {
      txt.textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
      e.target.reset();
    }, 4000);
  }, 1800);
});

// ── SMOOTH SCROLL ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if(t){ e.preventDefault(); window.scrollTo({top:t.offsetTop-80,behavior:'smooth'}); }
  });
});

// ── PARALLAX HERO ─────────────────────────────
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const bg = document.querySelector('.hero-bg');
  const body = document.querySelector('.hero-body');
  if(bg && y < window.innerHeight){
    bg.style.transform = `translateY(${y*.35}px)`;
    body.style.transform = `translateY(${y*.12}px)`;
    body.style.opacity = `${1-y/(window.innerHeight*.7)}`;
  }
});

// ── 3D CARD TILT ──────────────────────────────
document.querySelectorAll('.srv-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const tx = ((e.clientY-r.top)/r.height-.5)*-10;
    const ty = ((e.clientX-r.left)/r.width-.5)*10;
    card.style.transform = `translateY(-10px) rotateX(${tx}deg) rotateY(${ty}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform=''; });
});

// ── WORK TILT ─────────────────────────────────
document.querySelectorAll('.wk-item').forEach(item => {
  item.addEventListener('mousemove', e => {
    const r = item.getBoundingClientRect();
    const tx = ((e.clientY-r.top)/r.height-.5)*-6;
    const ty = ((e.clientX-r.left)/r.width-.5)*6;
    item.style.transform = `scale(1.02) rotateX(${tx}deg) rotateY(${ty}deg)`;
  });
  item.addEventListener('mouseleave', () => { item.style.transform=''; });
});

// ── MAGNETIC BUTTONS ──────────────────────────
document.querySelectorAll('.cta-primary,.nav-phone').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX-r.left-r.width/2)*.2;
    const y = (e.clientY-r.top-r.height/2)*.2;
    btn.style.transform = `translate(${x}px,${y}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform=''; });
});

// ── SERVICE CARDS CLICK → CONTACT ────────────
document.querySelectorAll('.srv-cta').forEach(el => {
  el.addEventListener('click', () => {
    const contact = document.getElementById('contact');
    if(contact) window.scrollTo({top:contact.offsetTop-80,behavior:'smooth'});
  });
});

console.log('%c⚡ AniBlend — Delhi\'s Boldest Animation Studio', 'background:linear-gradient(135deg,#9d00ff,#00f5ff);color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:bold;');
