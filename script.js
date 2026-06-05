// ── VEHICLE MODELS ───────────────────────────────────────
const vehicleModels = {
  Sedan:   "models/2020_bmw_m340i_xdrive.glb",
  SUV:     "models/2016_bmw_x5_m.glb",
  Minivan: "models/2023_toyota_granvia_2.5l_189hp_l4_e-cvt_hybrid.glb",
  Truck:   "models/2021_ram_1500_trx.glb",
  Other:   null,
};

// ── PRICING ───────────────────────────────────────────────
const pricing = {
  Sedan:   { exterior: 50,  interior: 150, "full vehicle": 200 },
  SUV:     { exterior: 70,  interior: 180, "full vehicle": 250 },
  Minivan: { exterior: 80,  interior: 200, "full vehicle": 300 },
  Truck:   { exterior: 80,  interior: 200, "full vehicle": 300 },
};

// ── INJECT POPUP HTML ─────────────────────────────────────
const popupHTML = `
<div class="other-popup" id="otherPopup" aria-modal="true" role="dialog">
  <div class="other-popup-backdrop" id="popupBackdrop"></div>
  <div class="other-popup-box">
    <button class="other-popup-close" id="popupClose" aria-label="Close">✕</button>

    <div class="other-popup-eyebrow">CUSTOM VEHICLE</div>
    <h2 class="other-popup-title">Something<br><em>different?</em></h2>
    <p class="other-popup-body">
      Not every vehicle fits a category — and that's fine.
      Reach out and we'll put together a custom quote for your specific ride.
    </p>

    <div class="other-popup-actions">
      <a href="tel:+16472341780" class="other-popup-btn primary">
        <span class="other-popup-btn-label">CALL US</span>
        <span class="other-popup-btn-sub">+1 647 234 1780</span>
      </a>
      <a href="sms:+16472341780" class="other-popup-btn secondary">
        <span class="other-popup-btn-label">TEXT US</span>
        <span class="other-popup-btn-sub">+1 647 234 1780</span>
      </a>
      <a href="mailto:mzdetail7@gmail.com" class="other-popup-btn secondary">
        <span class="other-popup-btn-label">EMAIL US</span>
        <span class="other-popup-btn-sub">mzdetail7@gmail.com</span>
      </a>
    </div>
  </div>
</div>
`;

document.body.insertAdjacentHTML("beforeend", popupHTML);

// ── POPUP LOGIC ───────────────────────────────────────────
const popup   = document.getElementById("otherPopup");
const backdrop = document.getElementById("popupBackdrop");
const closeBtn = document.getElementById("popupClose");

function openPopup() {
  popup.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePopup() {
  popup.classList.remove("active");
  document.body.style.overflow = "";
}

backdrop?.addEventListener("click", closePopup);
closeBtn?.addEventListener("click", closePopup);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePopup();
});

// ── CARD SCROLL REVEAL ────────────────────────────────────
const cards = document.querySelectorAll(".card");

window.addEventListener("scroll", () => {
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) card.classList.add("show");
  });
});

// ── CARD 3D TILT ─────────────────────────────────────────
cards.forEach(card => {
  const strength = 10;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * strength;
    const rotateX = ((centerY - y) / centerY) * strength;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
      scale(1.03)
    `;

    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    card.style.setProperty("--mx", `${px}%`);
    card.style.setProperty("--my", `${py}%`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "none";
  });
});

// ── NAV HIDE ON SCROLL ────────────────────────────────────
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  nav.style.transform = window.scrollY > lastScroll ? "translateY(-100%)" : "translateY(0)";
  lastScroll = window.scrollY;
});

// ── NAV BUTTONS ───────────────────────────────────────────
document.getElementById("EXPERIENCE")?.addEventListener("click", () => {
  document.querySelector(".statement")?.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("BRAND")?.addEventListener("click", () => {
  document.querySelector(".contact")?.scrollIntoView({ behavior: "smooth" });
});

// ── COUNTER ───────────────────────────────────────────────
document.querySelectorAll(".counter").forEach(counter => {
  const target = +counter.dataset.target;
  let current = 0;
  const update = () => {
    current += target / 200;
    if (current < target) {
      counter.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  };
  update();
});

// ── BEFORE / AFTER SLIDER ────────────────────────────────
const slider = document.getElementById("baSlider");
const after  = slider?.querySelector(".after");
const handle = slider?.querySelector(".handle");

let sliderCurrent = 50;
let sliderTarget  = 50;
let dragging = false;

function updateSlider(x) {
  const rect = slider.getBoundingClientRect();
  let percent = ((x - rect.left) / rect.width) * 100;
  sliderTarget = Math.max(0, Math.min(100, percent));
}

slider?.addEventListener("mousedown", (e) => { dragging = true; updateSlider(e.clientX); });
window.addEventListener("mousemove",  (e) => { if (dragging) updateSlider(e.clientX); });
window.addEventListener("mouseup",    ()  => { dragging = false; });

slider?.addEventListener("touchstart", (e) => { dragging = true; updateSlider(e.touches[0].clientX); });
window.addEventListener("touchmove",   (e) => { if (dragging) updateSlider(e.touches[0].clientX); });
window.addEventListener("touchend",    ()  => { dragging = false; });

function animateSlider() {
  sliderCurrent += (sliderTarget - sliderCurrent) * 0.15;
  if (after)  after.style.clipPath = `inset(0 ${100 - sliderCurrent}% 0 0)`;
  if (handle) handle.style.left    = `${sliderCurrent}%`;
  requestAnimationFrame(animateSlider);
}
animateSlider();

// ── VEHICLE SELECTOR ─────────────────────────────────────
const menu    = document.querySelector(".vehicle-menu");
const buttons = document.querySelectorAll(".vehicle-menu button");
const viewer  = document.querySelector("model-viewer");

let selectedVehicle = "Sedan";

function moveHighlight(btn) {
  if (!menu || !btn) return;
  buttons.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function updatePricing() {
  const prices = pricing[selectedVehicle];
  if (!prices) return;
  document.querySelectorAll(".price").forEach(el => {
    const service = el.dataset.service?.toLowerCase();
    if (service && prices[service] !== undefined) {
      el.textContent = `$${prices[service]}`;
    }
  });
}

function swapModel(vehicle) {
  if (!viewer) return;

  const src = vehicleModels[vehicle];

  // No model for this type — show popup instead
  if (!src) {
    openPopup();
    return;
  }

  viewer.style.opacity = "0";

  setTimeout(() => {
    viewer.src = src;

    const onLoad = () => {
      viewer.style.opacity = "1";
      viewer.removeEventListener("load", onLoad);
    };
    viewer.addEventListener("load", onLoad);

    setTimeout(() => { viewer.style.opacity = "1"; }, 1500);
  }, 300);
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedVehicle = btn.textContent.trim();
    moveHighlight(btn);
    updatePricing();
    swapModel(selectedVehicle);
  });
});

// Init
const initial = document.querySelector(".vehicle-menu button.active")
             || document.querySelector(".vehicle-menu button");

if (initial) {
  selectedVehicle = initial.textContent.trim();
  moveHighlight(initial);
  updatePricing();
  swapModel(selectedVehicle);
}