// ==============================
// AksaraLoka Coming Soon Script
// ==============================

// ====== 1. SET TANGGAL LAUNCH ======
const launchDate = new Date("2026-06-01T00:00:00").getTime();

// ====== 2. COUNTDOWN FUNCTION ======
function updateCountdown() {
  const now = new Date().getTime();
  const distance = launchDate - now;

  if (distance <= 0) {
    document.getElementById("countdown").innerHTML = "🚀 Sudah Launch!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("countdown").innerHTML =
    `${days} Hari ${hours} Jam ${minutes} Menit ${seconds} Detik`;
}

// Update tiap 1 detik
setInterval(updateCountdown, 1000);


// ====== 3. TYPING EFFECT ======
const text = "Platform belajar bahasa daerah yang modern dan interaktif.";
let index = 0;

function typingEffect() {
  if (index < text.length) {
    document.getElementById("typing").innerHTML += text.charAt(index);
    index++;
    setTimeout(typingEffect, 40);
  }
}

// ====== 4. FADE-IN EFFECT ======
function fadeIn() {
  const el = document.getElementById("mainContent");
  el.style.opacity = 0;

  let opacity = 0;
  const interval = setInterval(() => {
    if (opacity >= 1) clearInterval(interval);
    opacity += 0.05;
    el.style.opacity = opacity;
  }, 30);
}


// ====== 5. INIT ======
window.onload = () => {
  updateCountdown();
  typingEffect();
  fadeIn();
};