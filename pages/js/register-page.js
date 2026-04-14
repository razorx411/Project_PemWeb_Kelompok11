// ============================================
//  Pages/js/register-page.js
//  Terhubung ke api/register.php
// ============================================

// ── Elemen ────────────────────────────────────────────────────────────────
const form     = document.getElementById('registrationForm');
const namaEl   = document.getElementById('nama');
const emailEl  = document.getElementById('email');
const passEl   = document.getElementById('password');
const confEl   = document.getElementById('confirmPassword');
const notifEl  = document.getElementById('notif');

// Error paragraphs
const namaErr  = document.getElementById('namaErr');
const emailErr = document.getElementById('emailErr');
const passErr  = document.getElementById('passErr');
const confErr  = document.getElementById('confirmErr');

// Password strength bars
const bars = [
  document.getElementById('bar1'),
  document.getElementById('bar2'),
  document.getElementById('bar3'),
  document.getElementById('bar4'),
];
const strengthLabel = document.getElementById('strengthLabel');

// ── Toggle password visibility ─────────────────────────────────────────────
function setupEye(btnId, iconId, inputEl) {
  document.getElementById(btnId).addEventListener('click', () => {
    const isHidden = inputEl.type === 'password';
    inputEl.type = isHidden ? 'text' : 'password';
    document.getElementById(iconId).src = isHidden ? '../assets/icons/icon_view.png' : '../assets/icons/icon_hidden.png';
  });
}
setupEye('eyeBtn',  'eyeIcon',  passEl);
setupEye('eyeBtn2', 'eyeIcon2', confEl);

// ── Password strength ──────────────────────────────────────────────────────
const STRENGTH_CONFIG = [
  { label: 'Sangat Lemah', color: '#ef4444' },
  { label: 'Lemah',        color: '#f97316' },
  { label: 'Cukup',        color: '#eab308' },
  { label: 'Kuat',         color: '#22c55e' },
];

function calcStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))           score++;
  if (/[0-9]/.test(pwd))           score++;
  if (/[^A-Za-z0-9]/.test(pwd))   score++;
  return score; // 0–4
}

passEl.addEventListener('input', () => {
  const score = calcStrength(passEl.value);
  const filled = score === 0 && passEl.value.length === 0 ? 0 : Math.max(score, 1);

  bars.forEach((bar, i) => {
    bar.style.background = i < filled
      ? STRENGTH_CONFIG[Math.min(score - 1, 3)]?.color ?? '#e5e7eb'
      : '#e5e7eb';
  });

  if (passEl.value.length > 0) {
    strengthLabel.classList.remove('hidden');
    strengthLabel.textContent = STRENGTH_CONFIG[Math.min(score - 1, 3)]?.label ?? '';
    strengthLabel.style.color = STRENGTH_CONFIG[Math.min(score - 1, 3)]?.color ?? '';
  } else {
    strengthLabel.classList.add('hidden');
  }
});

// ── Helper: tampil / sembunyikan error ─────────────────────────────────────
function showErr(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
}
function clearErr(el) {
  el.textContent = '';
  el.classList.add('hidden');
}
function clearAllErrors() {
  [namaErr, emailErr, passErr, confErr].forEach(clearErr);
}

// ── Helper: notifikasi ────────────────────────────────────────────────────
function showNotif(msg, isSuccess = true) {
  notifEl.textContent = msg;
  notifEl.className = 'notif ' + (isSuccess
    ? 'bg-green-50 text-green-700 border border-green-200'
    : 'bg-red-50 text-red-700 border border-red-200');
  notifEl.classList.remove('hidden');
  notifEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Validasi sisi client ───────────────────────────────────────────────────
function validateClient() {
  clearAllErrors();
  let valid = true;

  if (!namaEl.value.trim()) {
    showErr(namaErr, 'Nama pengguna wajib diisi.');
    valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
    showErr(emailErr, 'Format email tidak valid.');
    valid = false;
  }
  if (passEl.value.length < 8) {
    showErr(passErr, 'Kata sandi minimal 8 karakter.');
    valid = false;
  }
  if (passEl.value !== confEl.value) {
    showErr(confErr, 'Konfirmasi kata sandi tidak cocok.');
    valid = false;
  }

  return valid;
}

// ── Submit ─────────────────────────────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  notifEl.classList.add('hidden');

  if (!validateClient()) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Memproses…';

  try {
    const response = await fetch('../api/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama:            namaEl.value.trim(),
        email:           emailEl.value.trim(),
        password:        passEl.value,
        confirmPassword: confEl.value,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // ✅ Berhasil
      showNotif(data.message, true);
      form.reset();
      bars.forEach(b => b.style.background = '#e5e7eb');
      strengthLabel.classList.add('hidden');

      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        window.location.href = 'home-page.html';
      }, 2000);

    } else if (data.errors) {
      // ❌ Error validasi dari server
      if (data.errors.nama)            showErr(namaErr,  data.errors.nama);
      if (data.errors.email)           showErr(emailErr, data.errors.email);
      if (data.errors.password)        showErr(passErr,  data.errors.password);
      if (data.errors.confirmPassword) showErr(confErr,  data.errors.confirmPassword);

    } else {
      showNotif(data.message || 'Terjadi kesalahan. Coba lagi.', false);
    }

  } catch (err) {
    console.error(err);
    showNotif('Tidak dapat terhubung ke server. Periksa koneksi kamu.', false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Buat Akun';
  }
});