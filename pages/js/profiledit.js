// ambil data user saat halaman dibuka
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/Project_PemWeb_Kelompok11/api/get_profil.php", {
      credentials: "include"
    });
    const data = await res.json();

    console.log("DATA:", data); // DEBUG

    if (data.success) {
      document.querySelector('[name="nama"]').value = data.user.nama;
      document.querySelector('[name="email"]').value = data.user.email;
    } else {
      alert(data.message || "Gagal ambil data");
    }
  } catch (err) {
    console.error("ERROR:", err);
  }
});

















