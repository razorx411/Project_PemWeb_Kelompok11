/**
 * register-page.js — AksaraLoka
 * Client-side validation & UX yang diperkuat.
 *
 * CATATAN KEAMANAN:
 * Validasi di sini hanya lapisan PERTAMA. Validasi sesungguhnya
 * HARUS dilakukan di server (backend). Jangan simpan data sensitif
 * di localStorage tanpa enkripsi di production.
 */

'use strict';

/* ─── Konstanta ─────────────────────────────────────── */
const STRENGTH_CONFIG = [
  { label: 'Sangat Lemah', color: '#ef4444', bars: 1 },
  { label: 'Lemah',        color: '#f97316', bars: 2 },
  { label: 'Sedang',       color: '#eab308', bars: 3 },
  { label: 'Kuat',         color: '#22c55e', bars: 4 },
];

const RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 60_000, // 1 menit
  attempts: [],
};

/* ─── Elemen DOM ─────────────────────────────────────── */
const form        = document.getElementById('registrationForm');
const namaInput   = document.getElementById('nama');
const emailInput  = document.getElementById('email');
const passInput   = document.getElementById('password');
const confirmInput= document.getElementById('confirmPassword');
const eyeBtn      = document.getElementById('eyeBtn');
const eyeIcon     = document.getElementById('eyeIcon');
const eyeBtn2     = document.getElementById('eyeBtn2');
const eyeIcon2    = document.getElementById('eyeIcon2');
const namaErr     = document.getElementById('namaErr');
const passErr     = document.getElementById('passErr');
const confirmErr  = document.getElementById('confirmErr');
const strengthLabel = document.getElementById('strengthLabel');
const notif       = document.getElementById('notif');
const submitBtn   = document.querySelector('[type="submit"]');

/* ─── Utilitas ───────────────────────────────────────── */

/** Sanitize input — hapus karakter berbahaya */
function sanitize(str) {
  return str.replace(/[<>"'`&]/g, '').trim();
}

/** Validasi email lebih ketat */
function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email)
    && email.length <= 254;
}

/** Hitung skor kekuatan password */
function getPasswordScore(val) {
  let score = 0;
  if (val.length >= 8)           score++;
  if (val.length >= 12)          score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val))  score++;
  // Normalisasi ke 0-3
  return Math.min(Math.floor(score / 5 * 4), 3);
}

/** Tampilkan / sembunyikan error */
function setError(el, msg) {
  if (!el) return;
  if (msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

/** Set state loading tombol submit */
function setLoading(loading) {
  if (loading) {
    submitBtn.disabled = true;
    submitBtn.dataset.original = submitBtn.textContent;
    submitBtn.textContent = 'Memproses…';
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtn.dataset.original || 'Buat Akun';
    submitBtn.style.opacity = '';
    submitBtn.style.cursor = '';
  }
}

/** Rate limiting sederhana (client-side, bukan pengganti server-side) */
function isRateLimited() {
  const now = Date.now();
  RATE_LIMIT.attempts = RATE_LIMIT.attempts.filter(t => now - t < RATE_LIMIT.windowMs);
  if (RATE_LIMIT.attempts.length >= RATE_LIMIT.maxAttempts) return true;
  RATE_LIMIT.attempts.push(now);
  return false;
}

/* ─── Toggle Password ────────────────────────────────── */
function togglePassword(inputEl, iconEl) {
  const isHidden = inputEl.type === 'password';
  inputEl.type = isHidden ? 'text' : 'password';
  iconEl.textContent = isHidden ? '👁️' : '🙈';
}

eyeBtn?.addEventListener('click', () => togglePassword(passInput, eyeIcon));
eyeBtn2?.addEventListener('click', () => togglePassword(confirmInput, eyeIcon2));

/* ─── Strength Meter ─────────────────────────────────── */
passInput?.addEventListener('input', function () {
  const val = this.value;
  const bars = document.querySelectorAll('.bar');

  if (!val) {
    bars.forEach(b => { b.style.background = ''; });
    setError(strengthLabel, null);
    setError(passErr, null);
    return;
  }

  const score  = getPasswordScore(val);
  const config = STRENGTH_CONFIG[score];

  bars.forEach((bar, i) => {
    bar.style.background = i < config.bars ? config.color : '#e5e7eb';
    bar.style.transition = 'background 0.3s';
  });

  strengthLabel.classList.remove('hidden');
  strengthLabel.textContent = `Kekuatan: ${config.label}`;
  strengthLabel.style.color = config.color;

  setError(passErr, val.length < 8 ? 'Minimal 8 karakter.' : null);

  // Validasi ulang konfirmasi jika sudah diisi
  if (confirmInput?.value) validateConfirm();
});

/* ─── Validasi Real-time ─────────────────────────────── */
namaInput?.addEventListener('input', function () {
  const val = sanitize(this.value);
  const ok  = /^[a-zA-Z' ]{2,50}$/.test(val);
  setError(namaErr, ok || !val ? null : 'Nama hanya boleh huruf (2-50 karakter).');
});

emailInput?.addEventListener('blur', function () {
  const val = sanitize(this.value);
  // Beri feedback visual langsung
  if (val && !isValidEmail(val)) {
    emailInput.style.borderColor = '#ef4444';
  } else {
    emailInput.style.borderColor = '';
  }
});

function validateConfirm() {
  const match = passInput.value === confirmInput.value;
  setError(confirmErr, match ? null : 'Kata sandi tidak cocok.');
  return match;
}

confirmInput?.addEventListener('input', validateConfirm);

/* ─── Submit Handler ─────────────────────────────────── */
form?.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Rate limiting
  if (isRateLimited()) {
    showNotif('⚠️ Terlalu banyak percobaan. Tunggu 1 menit.', 'error');
    return;
  }

  // Ambil & sanitasi nilai
  const nama     = sanitize(namaInput.value);
  const email    = sanitize(emailInput.value.toLowerCase());
  const password = passInput.value; // password jangan di-sanitasi agar karakter khusus boleh
  const confirm  = confirmInput?.value;

  // ── Validasi ──────────────────────────────────────────
  let hasError = false;

  if (!/^[a-zA-Z' ]{2,50}$/.test(nama)) {
    setError(namaErr, 'Nama hanya boleh huruf (2-50 karakter).');
    namaInput.focus();
    hasError = true;
  }

  if (!isValidEmail(email)) {
    emailInput.style.borderColor = '#ef4444';
    emailInput.focus();
    hasError = true;
  }

  if (password.length < 8) {
    setError(passErr, 'Minimal 8 karakter.');
    if (!hasError) passInput.focus();
    hasError = true;
  }

  if (confirm !== undefined && password !== confirm) {
    setError(confirmErr, 'Kata sandi tidak cocok.');
    hasError = true;
  }

  if (getPasswordScore(password) < 1) {
    setError(passErr, 'Password terlalu lemah. Tambah huruf besar, angka, atau simbol.');
    hasError = true;
  }

  if (hasError) return;

  // ── Kirim ke server / simulasi ────────────────────────
  setLoading(true);

  try {
    await submitRegistration({ nama, email, password });
    showNotif('🎉 Registrasi berhasil! Mengalihkan…', 'success');
    form.reset();
    document.querySelectorAll('.bar').forEach(b => b.style.background = '');
    setError(strengthLabel, null);

    setTimeout(() => {
      window.location.href = 'home.html';
    }, 2000);

  } catch (err) {
    showNotif(`❌ ${err.message}`, 'error');
  } finally {
    setLoading(false);
  }
});

/* ─── Submit ke Server ───────────────────────────────── */
/**
 * Ganti fungsi ini dengan fetch() ke API backend-mu.
 *
 * Contoh integrasi real (uncomment jika pakai backend):
 *
 * async function submitRegistration(data) {
 *   const res = await fetch('/api/register', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(data),
 *   });
 *   if (!res.ok) {
 *     const json = await res.json();
 *     throw new Error(json.message || 'Registrasi gagal.');
 *   }
 *   return res.json();
 * }
 *
 * Untuk kirim email verifikasi, gunakan:
 * - Firebase Auth: firebase.auth().createUserWithEmailAndPassword(email, password)
 *   lalu user.sendEmailVerification()
 * - Supabase: supabase.auth.signUp({ email, password })
 *   (otomatis kirim email konfirmasi)
 * - Backend custom: nodemailer / SendGrid / Mailgun dari server
 */
async function submitRegistration(data) {
  // SIMULASI — hapus ini dan ganti dengan fetch() ke backend
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulasi email sudah terdaftar
      if (data.email === 'test@test.com') {
        reject(new Error('Email sudah terdaftar.'));
      } else {
        console.log('Data registrasi (simulasi):', {
          nama: data.nama,
          email: data.email,
          // JANGAN pernah log password di production!
        });
        resolve({ success: true });
      }
    }, 1200);
  });
}

/* ─── Notifikasi ─────────────────────────────────────── */
function showNotif(msg, type = 'success') {
  notif.textContent = msg;
  notif.classList.remove('hidden');
  notif.style.background = type === 'success' ? '#ecfdf5' : '#fef2f2';
  notif.style.color       = type === 'success' ? '#166534' : '#991b1b';
  notif.style.border      = `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`;

  if (type !== 'error') {
    setTimeout(() => notif.classList.add('hidden'), 4000);
  }
}