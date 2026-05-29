/* =============================================
   AniBlend - JavaScript Interactions & Animations
   ============================================= */

// ============ LOADER ============
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loader-bar');
  const percent = document.getElementById('loader-percent');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initCounters();
      }, 400);
    }
    bar.style.width = progress + '%';
    percent.textContent = Math.floor(progress) + '%';
  }, 60);

  document.body.style.overflow = 'hidden';
})();

// ============ CUSTOM CURSOR ============
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor effects on interactive elements
const interactives = document.querySelectorAll('a, button, .service-card, .work-item, .filter-btn, input, textarea, select');
interactives.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    follower.style.borderColor = 'rgba(168,85,247,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.borderColor = 'rgba(168,85,247,0.6)';
  });
});

// ============ NAVBAR ============
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 150) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinksEl.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => s.style = '');
  });
});

// ============ HERO CANVAS PARTICLES ============
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = ['168, 85, 247', '6, 182, 212', '236, 72, 153', '16, 185, 129'][Math.floor(Math.random() * 4)];
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life >= this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    const fadeIn = Math.min(this.life / 30, 1);
    const fadeOut = Math.min((this.maxLife - this.life) / 30, 1);
    const a = this.alpha * Math.min(fadeIn, fadeOut);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${a})`;
    ctx.fill();
  }
}

// Create particles
for (let i = 0; i < 120; i++) {
  const p = new Particle();
  p.life = Math.random() * p.maxLife; // Stagger
  particles.push(p);
}

// Draw connections
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const a = (1 - dist / 120) * 0.08;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(168, 85, 247, ${a})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// Mouse repel particles
document.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  particles.forEach(p => {
    const dx = p.x - mx;
    const dy = p.y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      p.vx += dx / dist * 0.3;
      p.vy += dy / dist * 0.3;
    }
  });
});

// ============ STAT COUNTERS ============
function initCounters() {
  const statEls = document.querySelectorAll('.stat-number');
  statEls.forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(interval);
    }, 16);
  });
}

// ============ SCROLL REVEAL ============
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

// Apply reveal classes and observe
function setupReveal() {
  // About section
  const aboutVisual = document.querySelector('.about-visual');
  const aboutContent = document.querySelector('.about-content');
  if (aboutVisual) { aboutVisual.classList.add('reveal-left'); revealObserver.observe(aboutVisual); }
  if (aboutContent) { aboutContent.classList.add('reveal-right'); revealObserver.observe(aboutContent); }

  // Service cards
  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(card);
  });

  // Work items
  document.querySelectorAll('.work-item').forEach((item, i) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${i * 0.08}s`;
    revealObserver.observe(item);
  });

  // Process steps
  document.querySelectorAll('.process-step').forEach((step, i) => {
    step.style.transitionDelay = `${i * 0.15}s`;
    revealObserver.observe(step);
  });

  // Testimonials
  const testimonialSection = document.querySelector('.testimonials');
  if (testimonialSection) {
    testimonialSection.querySelector('.section-header')?.classList.add('reveal');
    revealObserver.observe(testimonialSection.querySelector('.section-header'));
  }

  // Contact
  const contactInfo = document.querySelector('.contact-info');
  const contactForm = document.querySelector('.contact-form-wrapper');
  if (contactInfo) { contactInfo.classList.add('reveal-left'); revealObserver.observe(contactInfo); }
  if (contactForm) { contactForm.classList.add('reveal-right'); revealObserver.observe(contactForm); }

  // Section headers
  document.querySelectorAll('.section-header').forEach(h => {
    h.classList.add('reveal');
    revealObserver.observe(h);
  });
}
setupReveal();

// ============ WORK FILTER ============
const filterBtns = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    workItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
        item.style.animation = 'fadeInScale 0.4s ease forwards';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Add keyframe for work filter animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(styleSheet);

// ============ TESTIMONIALS SLIDER ============
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index));
  });
});

// Auto slide
setInterval(() => goToSlide(currentSlide + 1), 5000);

// ============ CONTACT FORM ============
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const span = submitBtn.querySelector('span');
  const originalText = span.textContent;
  span.textContent = 'Sending...';
  submitBtn.style.opacity = '0.7';
  submitBtn.disabled = true;

  setTimeout(() => {
    span.textContent = '✓ Message Sent!';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
    submitBtn.style.opacity = '1';

    setTimeout(() => {
      span.textContent = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      contactForm.reset();
    }, 3000);
  }, 1800);
});

// Form input focus effects
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.querySelector('label').style.color = '#a855f7';
  });
  input.addEventListener('blur', () => {
    input.parentElement.querySelector('label').style.color = '';
  });
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============ PARALLAX HERO ============
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroBg = document.querySelector('.hero-bg-image');
  const heroContent = document.querySelector('.hero-content');
  if (heroBg && scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
    heroContent.style.opacity = `${1 - scrollY / (window.innerHeight * 0.7)}`;
  }
});

// ============ NAV LINKS SMOOTH CLOSE ON MOBILE ============
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinksEl.classList.contains('open')) {
      navLinksEl.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
});

// ============ TILT EFFECT ON SERVICE CARDS ============
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / centerY * -8;
    const tiltY = (x - centerX) / centerX * 8;
    card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============ WORK ITEM TILT ============
document.querySelectorAll('.work-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / centerY * -5;
    const tiltY = (x - centerX) / centerX * 5;
    item.style.transform = `scale(1.02) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// ============ MAGNETIC BUTTON EFFECT ============
document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ============ GLITCH EFFECT ON LOGO ============
const logoText = document.querySelector('.nav-logo .logo-text');
if (logoText) {
  logoText.addEventListener('mouseenter', () => {
    logoText.style.animation = 'glitch 0.3s infinite';
  });
  logoText.addEventListener('mouseleave', () => {
    logoText.style.animation = '';
  });
}

const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
  @keyframes glitch {
    0% { text-shadow: none; }
    20% { text-shadow: -2px 0 #ec4899; }
    40% { text-shadow: 2px 0 #06b6d4; }
    60% { text-shadow: -2px 0 #a855f7; }
    80% { text-shadow: 2px 0 #10b981; }
    100% { text-shadow: none; }
  }
`;
document.head.appendChild(glitchStyle);

console.log('%c✨ AniBlend - Where Animation Meets Imagination', 
  'background: linear-gradient(135deg, #a855f7, #06b6d4); color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: bold;');
