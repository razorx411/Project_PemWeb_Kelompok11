// Toggle password
document.getElementById('eyeBtn').onclick = function () {
  const pw = document.getElementById('password');
  const icon = document.getElementById('eyeIcon');

  if (pw.type === 'password') {
    pw.type = 'text';
    icon.textContent = '👁️';
  } else {
    pw.type = 'password';
    icon.textContent = '🙈';
  }
};

// Strength checker
document.getElementById('password').addEventListener('input', function () {
  const val = this.value;
  let score = 0;

  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  console.log("Password strength:", score);
});

// Submit
document.getElementById('registrationForm').onsubmit = function (e) {
  e.preventDefault();

  const nama = document.getElementById('nama').value;
  const password = document.getElementById('password').value;

  if (!/^[a-zA-Z' ]+$/.test(nama)) {
    alert("Nama tidak valid");
    return;
  }

  if (password.length < 8) {
    alert("Password terlalu pendek");
    return;
  }

  document.getElementById('notif').classList.remove('hidden');

  setTimeout(() => {
    window.location.href = 'home.html';
  }, 1500);
};