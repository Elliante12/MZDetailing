// ── PAGE LOADER ───────────────────────────────────────────
// To use a logo PNG instead of text:
//   set LOADER_USE_IMAGE = true
//   set LOADER_IMAGE_SRC to your file e.g. "images/logo.png"
// To use text: keep LOADER_USE_IMAGE = false

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
  const loader   = document.getElementById("siteLoader");
  const barFill  = loader.querySelector(".loader-bar-fill");

  // Drive bar to 100%
  barFill.style.transform = "scaleX(1)";

  // Hold at full, then trigger wipe
  setTimeout(() => {
    loader.classList.add("wipe");
    setTimeout(() => {
      loader.remove();
      document.body.style.overflow = "";
    }, 900);
  }, 800);
});

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
  SUV:     { exterior: 70,  interior: 150, "full vehicle": 200 },
  Minivan: { exterior: 80,  interior: 180, "full vehicle": 220 },
  Truck:   { exterior: 80,  interior: 150, "full vehicle": 250 },
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
      <a href="mailto:info@mzdetailing.com" class="other-popup-btn secondary">
        <span class="other-popup-btn-label">EMAIL US</span>
        <span class="other-popup-btn-sub">info@mzdetailing.com</span>
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

// ── BOOK NOW BUTTON ───────────────────────────────────────
const bookBtnHTML = `
<button class="book-now" id="bookNow" aria-label="Book Now">
  <span class="book-now-text">BOOK NOW</span>
  <span class="book-now-arrow">→</span>
</button>
`;

document.body.insertAdjacentHTML("beforeend", bookBtnHTML);

const bookBtn = document.getElementById("bookNow");

// Show after scrolling past hero
window.addEventListener("scroll", () => {
  if (window.scrollY > window.innerHeight * 0.6) {
    bookBtn.classList.add("visible");
  } else {
    bookBtn.classList.remove("visible");
  }
});

bookBtn.addEventListener("click", () => {
  openBooking(selectedVehicle);
});

// ── GALLERY ───────────────────────────────────────────────
// Drop your image paths in here — add as many as you want
const galleryImages = [
  "gallery/img1.jpg",
  "gallery/img2.jpg",
  "gallery/img3.jpg",
  "gallery/img4.jpg",
  "gallery/img5.jpg",
  "gallery/img6.jpg",
  "gallery/img7.jpg",
  "gallery/img8.jpg",
];

// Shuffle
const shuffled = [...galleryImages].sort(() => Math.random() - 0.5);

// Duplicate for seamless infinite scroll
const allImgs = [...shuffled, ...shuffled];

const galleryHTML = `
<section class="gallery" id="gallery">
  <div class="gallery-header">
    <span class="gallery-eyebrow">OUR WORK</span>
    <h2 class="gallery-title">Results<br><em>speak.</em></h2>
  </div>
  <div class="gallery-track-wrap">
    <div class="gallery-track" id="galleryTrack">
      ${allImgs.map((src, i) => `
        <div class="gallery-item">
          <img src="${src}" alt="Detailing work ${i + 1}" loading="lazy" />
        </div>
      `).join("")}
    </div>
  </div>
  <div class="gallery-fade-left"></div>
  <div class="gallery-fade-right"></div>
</section>
`;

// Insert before contact section
document.querySelector(".contact").insertAdjacentHTML("beforebegin", galleryHTML);

// ── GALLERY DRAG SCROLL ───────────────────────────────────
const track = document.getElementById("galleryTrack");
let isDown = false;
let startX, scrollLeft;
let velocity = 0;
let lastX = 0;
let autoScroll = true;
let animFrameId;

function lerp(a, b, t) { return a + (b - a) * t; }

// Auto-scroll + momentum loop
function tick() {
  if (autoScroll) {
    track.scrollLeft += 0.8;
  } else {
    track.scrollLeft += velocity;
    velocity *= 0.92;
    if (Math.abs(velocity) < 0.1) {
      velocity = 0;
      autoScroll = true;
    }
  }

  // Seamless loop — when we hit halfway, reset
  const half = track.scrollWidth / 2;
  if (track.scrollLeft >= half) track.scrollLeft -= half;
  if (track.scrollLeft < 0)    track.scrollLeft += half;

  animFrameId = requestAnimationFrame(tick);
}

tick();

// Mouse drag
track.addEventListener("mousedown", (e) => {
  isDown = true;
  autoScroll = false;
  velocity = 0;
  startX = e.pageX - track.offsetLeft;
  scrollLeft = track.scrollLeft;
  lastX = e.pageX;
  track.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  isDown = false;
  track.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  const x = e.pageX - track.offsetLeft;
  const walk = (x - startX);
  velocity = (e.pageX - lastX) * -1;
  lastX = e.pageX;
  track.scrollLeft = scrollLeft - walk;
});

// Touch drag
track.addEventListener("touchstart", (e) => {
  isDown = true;
  autoScroll = false;
  velocity = 0;
  startX = e.touches[0].pageX - track.offsetLeft;
  scrollLeft = track.scrollLeft;
  lastX = e.touches[0].pageX;
});

track.addEventListener("touchend", () => { isDown = false; });

track.addEventListener("touchmove", (e) => {
  if (!isDown) return;
  const x = e.touches[0].pageX - track.offsetLeft;
  velocity = (e.touches[0].pageX - lastX) * -1;
  lastX = e.touches[0].pageX;
  track.scrollLeft = scrollLeft - (x - startX);
});

// ── BOOKING OVERLAY ───────────────────────────────────────
const bookingHTML = `
<div class="booking-overlay" id="bookingOverlay" aria-modal="true" role="dialog">
  <div class="booking-backdrop" id="bookingBackdrop"></div>

  <div class="booking-panel">
    <button class="booking-close" id="bookingClose" aria-label="Close">✕</button>

    <div class="booking-left">
      <div class="booking-eyebrow">GET STARTED</div>
      <h2 class="booking-title">Book a<br><em>Detail.</em></h2>
      <p class="booking-sub">
        Fill out the form and we'll confirm your appointment within 24 hours.
      </p>
      <div class="booking-contact-hint">
        <span>Prefer to call?</span>
        <a href="tel:+16472341780">+1 647 234 1780</a>
      </div>
    </div>

    <div class="booking-right">
      <form class="booking-form" id="bookingForm" onsubmit="return false;">

        <div class="booking-row">
          <div class="booking-field">
            <label for="bName">Full Name</label>
            <input type="text" id="bName" placeholder="John Smith" autocomplete="name" required />
          </div>
          <div class="booking-field">
            <label for="bEmail">Email Address</label>
            <input type="email" id="bEmail" placeholder="john@example.com" autocomplete="email" required />
          </div>
        </div>

        <div class="booking-row">
          <div class="booking-field">
            <label for="bPhone">Phone Number</label>
            <input type="tel" id="bPhone" placeholder="+1 (647) 000-0000" autocomplete="tel" required />
          </div>
          <div class="booking-field">
            <label for="bDate">Preferred Date</label>
            <input type="date" id="bDate" required />
          </div>
        </div>

        <div class="booking-row">
          <div class="booking-field">
            <label for="bTime">Preferred Time</label>
            <select id="bTime" required>
              <option value="" disabled selected>Select a time</option>
              <option>8:00 AM</option>
              <option>9:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>12:00 PM</option>
              <option>1:00 PM</option>
              <option>2:00 PM</option>
              <option>3:00 PM</option>
              <option>4:00 PM</option>
            </select>
          </div>
        </div>

        <div class="booking-row">
          <div class="booking-field">
            <label for="bVehicle">Vehicle Type</label>
            <select id="bVehicle" required>
              <option value="" disabled selected>Select vehicle</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Minivan</option>
              <option>Truck</option>
              <option>Other</option>
            </select>
          </div>
          <div class="booking-field">
            <label for="bService">Service</label>
            <select id="bService" required>
              <option value="" disabled selected>Select service</option>
              <option>Exterior</option>
              <option>Interior</option>
              <option>Full Vehicle</option>
            </select>
          </div>
        </div>

        <div class="booking-field booking-field--full">
          <label for="bAddress">Service Address</label>
          <input type="text" id="bAddress" placeholder="123 Main St, Richmond Hill, ON" autocomplete="street-address" required />
        </div>

        <div class="booking-field booking-field--full">
          <label for="bNotes">Additional Notes <span class="optional">(optional)</span></label>
          <textarea id="bNotes" placeholder="Pet hair, stains, specific concerns..." rows="3"></textarea>
        </div>

        <button type="submit" class="booking-submit" id="bookingSubmit">
          <span class="booking-submit-text">SEND REQUEST</span>
          <span class="booking-submit-arrow">→</span>
        </button>

      </form>

      <div class="booking-success" id="bookingSuccess">
        <div class="booking-success-icon">✓</div>
        <h3>Request Sent</h3>
        <p>We'll reach out to confirm your appointment shortly.</p>
      </div>
    </div>

  </div>
</div>
`;

document.body.insertAdjacentHTML("beforeend", bookingHTML);

// ── BOOKING LOGIC ─────────────────────────────────────────
const bookingOverlay = document.getElementById("bookingOverlay");
const bookingBackdrop = document.getElementById("bookingBackdrop");
const bookingClose   = document.getElementById("bookingClose");
const bookingForm    = document.getElementById("bookingForm");
const bookingSuccess = document.getElementById("bookingSuccess");
const bookingSubmit  = document.getElementById("bookingSubmit");
const bVehicle       = document.getElementById("bVehicle");
const bService       = document.getElementById("bService");

function openBooking(vehicle = "", service = "") {
  bookingOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
  bookingSuccess.classList.remove("active");
  bookingForm.style.display = "";

  // Pre-fill if called with context
  if (vehicle && bVehicle) bVehicle.value = vehicle;
  if (service && bService) bService.value = service;

  // Set min date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("bDate").min = today;
}

function closeBooking() {
  bookingOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

bookingBackdrop?.addEventListener("click", closeBooking);
bookingClose?.addEventListener("click", closeBooking);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeBooking();
});

// Submit — shows success state (wire up to your backend/email here)
bookingForm?.addEventListener("submit", () => {
  bookingSubmit.classList.add("loading");

  const templateParams = {
    name:    document.getElementById("bName").value,
    email:   document.getElementById("bEmail").value,
    phone:   document.getElementById("bPhone").value,
    date:    document.getElementById("bDate").value,
    time:    document.getElementById("bTime").value,
    vehicle: document.getElementById("bVehicle").value,
    service: document.getElementById("bService").value,
    address: document.getElementById("bAddress").value,
    notes:   document.getElementById("bNotes").value,
  };

  emailjs.send("service_xa70num", "template_ii0r0ri", templateParams)
    .then(() => {
      bookingForm.style.display = "none";
      bookingSuccess.classList.add("active");
      bookingSubmit.classList.remove("loading");
    })
    .catch((err) => {
      console.error("EmailJS error:", err);
      bookingSubmit.classList.remove("loading");
      alert("Something went wrong. Please call us directly.");
    });
});

// Clicking a pricing card opens booking with service pre-filled
cards.forEach(card => {
  card.addEventListener("click", () => {
    const service = card.querySelector(".label")?.textContent?.trim() || "";
    openBooking(selectedVehicle, service);
  });
});

// Book Now button opens blank booking
document.getElementById("bookNow")?.addEventListener("click", (e) => {
  e.stopPropagation();
  openBooking(selectedVehicle);
  // Remove the scroll-to-contact behaviour — booking overlay takes over
});