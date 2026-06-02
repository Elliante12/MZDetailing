// ── VEHICLE MODELS ───────────────────────────────────────
// Swap these .glb paths for your actual model files
const vehicleModels = {
  Sedan:   "./2020_bmw_m340i_xdrive.glb",
  SUV:     "./2016_bmw_x5_m.glb",
  Minivan: "./2023_toyota_granvia_2.5l_189hp_l4_e-cvt_hybrid.glb",
  Truck:   "./2021_ram_1500_trx.glb",
  Other:   "./models/other.glb",
};

// ── PRICING ───────────────────────────────────────────────
const pricing = {
  Sedan:   {exterior: 50,  interior: 150, full: 200},
  SUV:     {exterior: 70,  interior: 180, full: 230},
  Minivan: {exterior: 80,  interior: 200, full: 300},
  Truck:   {exterior: 80,  interior: 200, full: 300},
  Other:   {exterior: 60,  interior: 160, full: 210},
};

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

    const px = ((x / rect.width) * 100);
    const py = ((y / rect.height) * 100);
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

// Touch support for slider
slider?.addEventListener("touchstart", (e) => { dragging = true; updateSlider(e.touches[0].clientX); });
window.addEventListener("touchmove",   (e) => { if (dragging) updateSlider(e.touches[0].clientX); });
window.addEventListener("touchend",    ()  => { dragging = false; });

function animateSlider() {
  sliderCurrent += (sliderTarget - sliderCurrent) * 0.15;
  if (after)  after.style.clipPath  = `inset(0 ${100 - sliderCurrent}% 0 0)`;
  if (handle) handle.style.left     = `${sliderCurrent}%`;
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
  if (!src) return;

  // Fade out
  viewer.style.opacity = "0";

  setTimeout(() => {
    viewer.src = src;

    // Fade back in once model is loaded, or after fallback delay
    const onLoad = () => {
      viewer.style.opacity = "1";
      viewer.removeEventListener("load", onLoad);
    };
    viewer.addEventListener("load", onLoad);

    // Fallback in case load event doesn't fire
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