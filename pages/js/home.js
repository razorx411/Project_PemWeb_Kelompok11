// ==================== TAILWIND CONFIG ====================
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Cinzel', 'serif']
      },
      colors: {
        brand: {
          DEFAULT: '#6b3f00',
          light: '#8a5200',
          soft: '#fff3e0',
          border: '#e8d0b0',
        }
      }
    }
  }
};

// ==================== GREETING DINAMIS ====================
const greetingText = document.getElementById("greetingText");

const hour = new Date().getHours();
let greeting = "Halo";

if (hour < 12) greeting = "Selamat Pagi ☀️";
else if (hour < 18) greeting = "Selamat Siang 🌤️";
else greeting = "Selamat Malam 🌙";

if (greetingText) {
  greetingText.innerText = greeting + ", Hafid!";
}

// ==================== NOTIF CLICK ====================
const notifBtn = document.getElementById("notifBtn");
const notifDot = document.getElementById("notifDot");

if (notifBtn) {
  notifBtn.addEventListener("click", () => {
    notifDot.style.display = "none";
    alert("Tidak ada notifikasi baru 😄");
  });
}

// ==================== PROGRESS XP DINAMIS ====================
function setXP(percent) {
  const bar = document.querySelector(".xp-fill");
  if (bar) {
    bar.style.width = percent + "%";
  }
}

// contoh
setXP(62);

// ===== XP BAR =====
function animateXpBar(currentXP, maxXP) {
  const bar = document.getElementById('xp-bar');
  const label = document.getElementById('xp-label');

  if (!bar || !label) return;

  const percent = Math.min((currentXP / maxXP) * 100, 100);

  label.textContent = `${currentXP.toLocaleString('id-ID')} / ${maxXP.toLocaleString('id-ID')}`;

  // Small delay so the CSS transition plays visibly on load
  setTimeout(() => {
    bar.style.width = percent + '%';
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  animateXpBar(840, 1200);
});

// ===== XP & LEVEL SYSTEM =====
const XP_CONFIG = {
  baseXP: 1200,     // XP needed for Level 1 → 2
  increment: 200,   // Each level requires 200 more XP
  maxLevel: 45,
  startLevel: 1,
};

// XP needed to go from level N to N+1
function xpRequiredForLevel(level) {
  if (level >= XP_CONFIG.maxLevel) return Infinity;
  // Level 1→2 = 1200, 2→3 = 1400, 3→4 = 1600, etc.
  return XP_CONFIG.baseXP + (level - 1) * XP_CONFIG.increment;
}

// Given total XP, calculate current level and XP within that level
function calculateLevel(totalXP) {
  let level = 1;
  let remaining = totalXP;

  while (level < XP_CONFIG.maxLevel) {
    const needed = xpRequiredForLevel(level);
    if (remaining < needed) break;
    remaining -= needed;
    level++;
  }

  const isMaxLevel = level >= XP_CONFIG.maxLevel;
  const xpForNext  = isMaxLevel ? 0 : xpRequiredForLevel(level);

  return { level, currentXP: remaining, xpForNext, isMaxLevel };
}

// Update all UI
function updateXpUI(totalXP) {
  const { level, currentXP, xpForNext, isMaxLevel } = calculateLevel(totalXP);

  const bar        = document.getElementById('xp-bar');
  const label      = document.getElementById('xp-label');
  const xpText     = document.getElementById('xp-text');
  const levelBadge = document.getElementById('level-badge');
  const xpTitle    = document.getElementById('xp-title');

  if (levelBadge) levelBadge.textContent = `Level ${level}`;
  if (xpText)     xpText.textContent     = `${totalXP.toLocaleString('id-ID')} XP`;

  if (isMaxLevel) {
    if (xpTitle) xpTitle.textContent = '🏆 Level Maksimum Tercapai!';
    if (label)   label.textContent   = 'MAX';
    if (bar)     setTimeout(() => { bar.style.width = '100%'; }, 300);
  } else {
    if (xpTitle) xpTitle.textContent = `XP menuju Level ${level + 1}`;
    if (label)   label.textContent   = `${currentXP.toLocaleString('id-ID')} / ${xpForNext.toLocaleString('id-ID')}`;
    if (bar) {
      const percent = Math.min((currentXP / xpForNext) * 100, 100);
      setTimeout(() => { bar.style.width = percent + '%'; }, 300);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const playerTotalXP = 0; // Start from 0 XP, Level 1
  updateXpUI(playerTotalXP);
});