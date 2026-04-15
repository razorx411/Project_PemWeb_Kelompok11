// ambil data user saat halaman dibuka
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("../api/get_profil.php", {
      credentials: "include"
    });
    const data = await res.json();

    console.log("DATA:", data); // DEBUG

    if (data.success) {
      document.querySelector('[name="nama"]').value = data.user.nama;
      document.querySelector('[name="email"]').value = data.user.email;
      document.querySelector('[name="password"]').value = data.user.password;

      const initial = document.getElementById("avatarInitial");
        if (initial) initial.textContent = (data.user.nama || "?").charAt(0).toUpperCase(); 
        } else {
          alert(data.message || "Gagal ambil data");
        }
        
  } catch (err) {
    console.error("ERROR:", err);
  }
});

















