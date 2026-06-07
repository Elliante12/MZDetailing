// ── PAGE LOADER ───────────────────────────────────────────
const LOADER_USE_IMAGE = false;
const LOADER_IMAGE_SRC = "images/logo.png";
const LOADER_TEXT      = "MZ";

const loaderHTML = `
<div class="loader" id="siteLoader">
  <div class="loader-inner">
    ${LOADER_USE_IMAGE
      ? `<img class="loader-logo-img" src="${LOADER_IMAGE_SRC}" alt="MZ Detailing" />`
      : `<div class="loader-logo-text">${LOADER_TEXT}</div>`
    }
    <div class="loader-bar"><div class="loader-bar-fill"></div></div>
  </div>
  <div class="loader-wipe"></div>
</div>
`;

document.body.insertAdjacentHTML("afterbegin", loaderHTML);
document.body.style.overflow = "hidden";

window.addEventListener("load", () => {
  const loader  = document.getElementById("siteLoader");
  const barFill = loader.querySelector(".loader-bar-fill");
  barFill.style.transform = "scaleX(1)";
  setTimeout(() => {
    loader.classList.add("wipe");
    setTimeout(() => {
      loader.remove();
      document.body.style.overflow = "";
    }, 900);
  }, 800);
});

// ── SCROLL PROGRESS BAR ───────────────────────────────────
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleY(${scrolled / total})`;
});

// ── NAV HIDE ON SCROLL ────────────────────────────────────
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  nav.style.transform = window.scrollY > lastScroll ? "translateY(-100%)" : "translateY(0)";
  lastScroll = window.scrollY;
});

// ── CURSOR TRAIL ──────────────────────────────────────────
const cursor = document.createElement("div");
cursor.className = "cursor-trail";
document.body.appendChild(cursor);

let cursorX = 0, cursorY = 0;
let trailX  = 0, trailY  = 0;
let cursorVisible = false;

document.addEventListener("mousemove", (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  if (!cursorVisible) {
    cursor.style.opacity = "1";
    cursorVisible = true;
  }
});

document.addEventListener("mouseleave", () => {
  cursor.style.opacity = "0";
  cursorVisible = false;
});

// Interactive elements make cursor grow
const interactiveEls = document.querySelectorAll("a, button, .about-value-card");
interactiveEls.forEach(el => {
  el.addEventListener("mouseenter", () => cursor.classList.add("cursor-large"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-large"));
});

function animateCursor() {
  trailX += (cursorX - trailX) * 0.1;
  trailY += (cursorY - trailY) * 0.1;
  cursor.style.transform = `translate(${trailX - 6}px, ${trailY - 6}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ── PARALLAX HERO ─────────────────────────────────────────
const heroNumber = document.querySelector(".about-hero-number");
const heroTitle  = document.querySelector(".about-hero-text h1");
const heroEyebrow = document.querySelector(".about-eyebrow");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (heroNumber) heroNumber.style.transform = `translateY(${y * 0.18}px)`;
  if (heroTitle)  heroTitle.style.transform  = `translateY(${y * 0.07}px)`;
  if (heroEyebrow) heroEyebrow.style.transform = `translateY(${y * 0.04}px)`;
});

// ── VALUE CARD HOVER — ghost number rise ──────────────────
document.querySelectorAll(".about-value-card").forEach(card => {
  const ghost = card.querySelector(".about-value-number");

  card.addEventListener("mouseenter", () => {
    if (ghost) ghost.style.transform = "translateY(-12px) scale(1.05)";
    card.style.background = "linear-gradient(135deg, var(--panel) 60%, rgba(200,119,58,0.06) 100%)";
  });

  card.addEventListener("mouseleave", () => {
    if (ghost) ghost.style.transform = "translateY(0) scale(1)";
    card.style.background = "";
  });
});

// ── STATS — progress bars ─────────────────────────────────
// Inject progress bar under each stat
document.querySelectorAll(".about-stat").forEach(stat => {
  const bar = document.createElement("div");
  bar.className = "about-stat-bar";
  bar.innerHTML = `<div class="about-stat-bar-fill"></div>`;
  stat.appendChild(bar);
});

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const fill = entry.target.querySelector(".about-stat-bar-fill");
    if (fill) {
      setTimeout(() => { fill.style.transform = "scaleX(1)"; }, 200);
    }

    // Counter
    const numEl = entry.target.querySelector(".about-stat-number[data-target]");
    if (numEl) {
      const target = +numEl.dataset.target;
      let current = 0;
      const update = () => {
        current += target / 160;
        if (current < target) {
          numEl.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          numEl.textContent = target;
        }
      };
      update();
    }

    statObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll(".about-stat").forEach(el => statObserver.observe(el));

// ── PROCESS STEPS — sequential activation ────────────────
const steps = document.querySelectorAll(".about-step");

steps.forEach((step, i) => {
  step.style.opacity    = "0";
  step.style.transform  = "translateX(-24px)";
  step.style.transition = `opacity 0.6s var(--ease-out) ${i * 0.15}s,
                            transform 0.6s var(--ease-out) ${i * 0.15}s`;
});

const processObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const step = entry.target;
    step.style.opacity   = "1";
    step.style.transform = "translateX(0)";
    step.classList.add("active");

    // Activate dot glow
    const dot = step.querySelector(".about-step-dot");
    if (dot) dot.classList.add("active");

    processObserver.unobserve(step);
  });
}, { threshold: 0.35 });

steps.forEach(el => processObserver.observe(el));

// ── VALUE CARDS — scroll reveal ───────────────────────────
document.querySelectorAll(".about-value-card").forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".about-value-card").forEach(el => cardObserver.observe(el));

// ── CTA — drifting background text ───────────────────────
const ctaBg = document.querySelector(".about-cta-bg");
let ctaDrift = 0;

function driftCta() {
  ctaDrift += 0.25;
  if (ctaBg) ctaBg.style.transform = `translateX(${-ctaDrift % 200}px)`;
  requestAnimationFrame(driftCta);
}
driftCta();

// CTA button pulse ring
const ctaBtn = document.getElementById("aboutBookBtn");
if (ctaBtn) {
  setInterval(() => {
    ctaBtn.classList.add("pulse");
    setTimeout(() => ctaBtn.classList.remove("pulse"), 1000);
  }, 3500);
}

// ── BOOK NOW NAV ──────────────────────────────────────────
document.getElementById("bookNowNav")?.addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("aboutBookBtn")?.addEventListener("click", () => {
  window.location.href = "index.html";
});