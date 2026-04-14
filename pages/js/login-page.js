// ============================================
//  Pages/js/login-page.js (FIXED)
// ============================================

const form    = document.getElementById('loginForm');
const emailEl = document.getElementById('email');
const passEl  = document.getElementById('password');
const notifEl = document.getElementById('notif');
const emailErr = document.getElementById('emailErr');
const passErr  = document.getElementById('passErr');

// ── Toggle password ──────────────────────────
document.getElementById('eyeBtn').addEventListener('click', () => {
  const isHidden = passEl.type === 'password';
  passEl.type = isHidden ? 'text' : 'password';
  document.getElementById('eyeIcon').src = isHidden 
    ? '../assets/icons/icon_view.png' 
    : '../assets/icons/icon_hidden.png';
});

// ── Helper ───────────────────────────────────
function showErr(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
}
function clearErr(el) {
  el.textContent = '';
  el.classList.add('hidden');
}
function showNotif(msg, isSuccess = true) {
  notifEl.textContent = msg;
  notifEl.className = 'notif ' + (isSuccess
    ? 'bg-green-50 text-green-700 border border-green-200'
    : 'bg-red-50 text-red-700 border border-red-200');
  notifEl.classList.remove('hidden');
}

// ── Validasi client ──────────────────────────
function validateClient() {
  clearErr(emailErr);
  clearErr(passErr);
  let valid = true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
    showErr(emailErr, 'Format email tidak valid.');
    valid = false;
  }
  if (passEl.value === '') {
    showErr(passErr, 'Kata sandi wajib diisi.');
    valid = false;
  }

  return valid;
}

// ── Submit ───────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  notifEl.classList.add('hidden');

  if (!validateClient()) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Memproses…';

  try {
    const response = await fetch('/Project_PemWeb_Kelompok11/api/login.php', {
      method: 'POST',
      credentials: 'include', // 🔥 WAJIB biar session tersimpan
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailEl.value.trim(),
        password: passEl.value,
      }),
    });

    const data = await response.json();

    console.log("LOGIN RESPONSE:", data); // DEBUG

    if (data.success) {
      // simpan untuk tampilan frontend (opsional)
      localStorage.setItem('user', JSON.stringify(data.user));

      showNotif(data.message, true);

      setTimeout(() => {
        window.location.href = 'home-page.html';
      }, 1500);

    } else if (data.errors) {
      if (data.errors.email)    showErr(emailErr, data.errors.email);
      if (data.errors.password) showErr(passErr,  data.errors.password);
    } else {
      showNotif(data.message || 'Terjadi kesalahan. Coba lagi.', false);
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    showNotif('Tidak dapat terhubung ke server. Periksa koneksi kamu.', false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Masuk';
  }
});