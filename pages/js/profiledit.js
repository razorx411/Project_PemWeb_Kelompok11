// ============================================================
//  profiledit.js  —  Load profil, Update, dan Hapus Akun
// ============================================================

// ── 1. Load data profil saat halaman dibuka ─────────────────
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("../api/get_profil.php", {
      credentials: "include"
    });
    const data = await res.json();

    if (data.success && data.user) {
      document.querySelector('[name="nama"]').value  = data.user.nama  || "";
      document.querySelector('[name="email"]').value = data.user.email || "";
      // password_hash tidak ditampilkan, biarkan kosong

      const initial = document.getElementById("avatarInitial");
      if (initial) {
        initial.textContent = (data.user.nama || "?").charAt(0).toUpperCase();
      }
    } else {
      tampilkanPesan("error", data.message || "Gagal mengambil data profil.");
    }
  } catch (err) {
    console.error("Load profil error:", err);
    tampilkanPesan("error", "Terjadi kesalahan saat memuat profil.");
  }
});

// ── 2. Submit form → Update Profil ──────────────────────────
document.getElementById("formProfil").addEventListener("submit", async (e) => {
  e.preventDefault();

  const btnSimpan = document.getElementById("btnSimpan");
  btnSimpan.disabled = true;
  btnSimpan.textContent = "Menyimpan...";

  bersihkanError();

  const nama     = document.querySelector('[name="nama"]').value.trim();
  const email    = document.querySelector('[name="email"]').value.trim();
  const password = document.querySelector('[name="password"]').value;

  try {
    const res = await fetch("../api/update_profil.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, email, password })
    });

    const data = await res.json();

    if (data.success) {
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        u.nama  = data.user.nama;
        u.email = data.user.email;
        localStorage.setItem("user", JSON.stringify(u));
      } catch (_) {}

      tampilkanPesan("success", "Profil berhasil diperbarui!");

      const initial = document.getElementById("avatarInitial");
      if (initial) initial.textContent = (data.user.nama || "?").charAt(0).toUpperCase();

      document.querySelector('[name="password"]').value = "";
    } else {
      if (data.errors) {
        Object.entries(data.errors).forEach(([field, msg]) => {
          tampilkanErrorField(field, msg);
        });
      } else {
        tampilkanPesan("error", data.message || "Gagal memperbarui profil.");
      }
    }
  } catch (err) {
    console.error("Update profil error:", err);
    tampilkanPesan("error", "Terjadi kesalahan jaringan. Coba lagi.");
  } finally {
    btnSimpan.disabled = false;
    btnSimpan.textContent = "Simpan Perubahan";
  }
});

// ── 3. Tombol Hapus Akun ────────────────────────────────────
document.getElementById("btnHapusAkun").addEventListener("click", () => {
  document.getElementById("modalHapus").classList.remove("hidden");
});

document.getElementById("btnBatalHapus").addEventListener("click", () => {
  document.getElementById("modalHapus").classList.add("hidden");
  document.getElementById("inputKonfirmasiPassword").value = "";
  document.getElementById("errorKonfirmasi").textContent = "";
});

document.getElementById("btnKonfirmasiHapus").addEventListener("click", async () => {
  const password      = document.getElementById("inputKonfirmasiPassword").value;
  const errEl         = document.getElementById("errorKonfirmasi");
  const btnKonfirmasi = document.getElementById("btnKonfirmasiHapus");

  if (!password) {
    errEl.textContent = "Masukkan kata sandi untuk konfirmasi.";
    return;
  }

  btnKonfirmasi.disabled = true;
  btnKonfirmasi.textContent = "Menghapus...";
  errEl.textContent = "";

  try {
    const res = await fetch("../api/delete_account.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.clear();
      alert("Akun berhasil dihapus. Sampai jumpa!");
      window.location.href = "../pages/login-page.html";
    } else {
      errEl.textContent = data.message || "Gagal menghapus akun.";
      btnKonfirmasi.disabled = false;
      btnKonfirmasi.textContent = "Ya, Hapus Akun";
    }
  } catch (err) {
    console.error("Delete akun error:", err);
    errEl.textContent = "Terjadi kesalahan jaringan. Coba lagi.";
    btnKonfirmasi.disabled = false;
    btnKonfirmasi.textContent = "Ya, Hapus Akun";
  }
});

// ── Helpers ─────────────────────────────────────────────────
function tampilkanPesan(tipe, pesan) {
  const el = document.getElementById("pesanGlobal");
  el.textContent = pesan;
  el.className = tipe === "success"
    ? "mb-4 p-3 rounded-xl text-sm font-semibold bg-green-100 text-green-700 border border-green-300"
    : "mb-4 p-3 rounded-xl text-sm font-semibold bg-red-100 text-red-700 border border-red-300";
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 4000);
}

function tampilkanErrorField(field, pesan) {
  const el = document.getElementById("error_" + field);
  if (el) { el.textContent = pesan; el.classList.remove("hidden"); }
}

function bersihkanError() {
  document.querySelectorAll("[id^='error_']").forEach(el => {
    el.textContent = ""; el.classList.add("hidden");
  });
  const g = document.getElementById("pesanGlobal");
  if (g) g.classList.add("hidden");
}