/**
 * i18n.js — Sistem multi-bahasa AksaraLoka
 * Mendukung: Bahasa Indonesia (id), English (en), Basa Jawa (jw)
 *
 * Cara kerja:
 *  1. Setiap elemen HTML yang ingin diterjemahkan diberi atribut  data-i18n="kunci"
 *  2. Fungsi applyLang(kode) mencari semua elemen itu lalu mengganti teksnya
 *  3. Pilihan bahasa disimpan di localStorage agar bertahan setelah refresh
 */

// ─── Kamus terjemahan ────────────────────────────────────────────────────────
const translations = {

  id: {
    /* Navbar */
    nav_home        : "Beranda",
    nav_courses     : "Kursus",
    nav_practice    : "Latihan",
    nav_leaderboard : "Peringkat",
    nav_community   : "Komunitas",

    /* Hero */
    hero_greeting   : "Selamat Pagi",
    hero_welcome    : "Selamat Datang Kembali, Hafid!",
    hero_tagline    : "Semangat Belajar Bahasa Daerah!",
    hero_streak     : "12 Hari Berturut",
    hero_xp_title   : "XP menuju Level 6",
    hero_cta        : "▶ Lanjut Belajar",

    /* Kartu: Lanjut Belajar */
    card_continue_title  : "Lanjut Belajar",
    card_continue_badge  : "Sedang Berjalan",
    card_course_name     : "Bahasa Jawa Dasar",
    card_course_unit     : "Unit 2 · Aksara Jawa",
    card_progress_label  : "Progress",
    card_progress_count  : "12 / 20 pelajaran selesai",
    card_difficulty      : "Tingkat:",
    card_continue_btn    : "▶ Lanjutkan",

    /* Kartu: Tantangan Harian */
    card_challenge_title  : "Tantangan Harian",
    card_challenge_reset  : "Reset 8j lagi",
    task1_label           : "Selesaikan 1 Pelajaran",
    task1_status          : "Selesai!",
    task2_label           : "Kumpulkan 20 XP",
    task2_status          : "15/20",
    task3_label           : "Ulang 5 Kosakata",
    task3_status          : "0/5",
    card_challenge_bonus  : "Selesaikan semua →",
    card_challenge_xp     : "+50 XP Bonus!",

    /* Coming Soon */
    coming_title    : "Bahasa Lainnya",
    coming_badge    : "Segera Hadir",
    coming_desc     : "Saat ini hanya tersedia Bahasa Jawa. Bahasa lain akan segera hadir!",
    coming_soon     : "Segera hadir",

    /* Footer */
    footer_desc     : "Platform belajar bahasa daerah Indonesia secara gratis, seru, dan efektif.",
    footer_platform : "Platform",
    footer_about    : "Tentang Kami",
    footer_courses  : "Kursus",
    footer_blog     : "Blog",
    footer_support  : "Bantuan",
    footer_help     : "Pusat Bantuan",
    footer_privacy  : "Kebijakan Privasi",
    footer_terms    : "Syarat & Ketentuan",
    footer_contact  : "Hubungi Kami",
    footer_lang     : "Bahasa Situs",
    footer_team     : "Kelompok 11",
    footer_mentor   : "Pembimbing:",
    footer_slogan   : "Ayo Lestarikan Bahasa Daerah!",
    footer_copy     : "© 2026 AksaraLoka · Kelompok 11 · MPSI & PemWeb",
  },

  en: {
    /* Navbar */
    nav_home        : "Home",
    nav_courses     : "Courses",
    nav_practice    : "Practice",
    nav_leaderboard : "Leaderboard",
    nav_community   : "Community",

    /* Hero */
    hero_greeting   : "Good Morning",
    hero_welcome    : "Welcome Back, Hafid!",
    hero_tagline    : "Keep Learning Regional Languages!",
    hero_streak     : "12-Day Streak",
    hero_xp_title   : "XP to Level 6",
    hero_cta        : "▶ Continue Learning",

    /* Kartu: Lanjut Belajar */
    card_continue_title  : "Continue Learning",
    card_continue_badge  : "In Progress",
    card_course_name     : "Basic Javanese",
    card_course_unit     : "Unit 2 · Javanese Script",
    card_progress_label  : "Progress",
    card_progress_count  : "12 / 20 lessons done",
    card_difficulty      : "Level:",
    card_continue_btn    : "▶ Continue",

    /* Kartu: Tantangan Harian */
    card_challenge_title  : "Daily Challenges",
    card_challenge_reset  : "Resets in 8h",
    task1_label           : "Complete 1 Lesson",
    task1_status          : "Done!",
    task2_label           : "Earn 20 XP",
    task2_status          : "15/20",
    task3_label           : "Review 5 Vocabulary",
    task3_status          : "0/5",
    card_challenge_bonus  : "Complete all →",
    card_challenge_xp     : "+50 XP Bonus!",

    /* Coming Soon */
    coming_title    : "Other Languages",
    coming_badge    : "Coming Soon",
    coming_desc     : "Only Javanese is available now. More languages coming soon!",
    coming_soon     : "Coming soon",

    /* Footer */
    footer_desc     : "A free, fun, and effective platform to learn Indonesian regional languages.",
    footer_platform : "Platform",
    footer_about    : "About Us",
    footer_courses  : "Courses",
    footer_blog     : "Blog",
    footer_support  : "Support",
    footer_help     : "Help Center",
    footer_privacy  : "Privacy Policy",
    footer_terms    : "Terms & Conditions",
    footer_contact  : "Contact Us",
    footer_lang     : "Site Language",
    footer_team     : "Group 11",
    footer_mentor   : "Advisor:",
    footer_slogan   : "Preserve Regional Languages!",
    footer_copy     : "© 2026 AksaraLoka · Group 11 · MPSI & PemWeb",
  },

  jw: {
    /* Navbar */
    nav_home        : "Ngarep",
    nav_courses     : "Kursus",
    nav_practice    : "Gladhen",
    nav_leaderboard : "Peringkat",
    nav_community   : "Komunitas",

    /* Hero */
    hero_greeting   : "Sugeng Enjing",
    hero_welcome    : "Sugeng Kondur, Hafid!",
    hero_tagline    : "Tetep Sinau Basa Dhaerah!",
    hero_streak     : "12 Dina Berturut",
    hero_xp_title   : "XP menyang Level 6",
    hero_cta        : "▶ Nerusake Sinau",

    /* Kartu */
    card_continue_title  : "Nerusake Sinau",
    card_continue_badge  : "Lagi Mlaku",
    card_course_name     : "Basa Jawa Dhasar",
    card_course_unit     : "Unit 2 · Aksara Jawa",
    card_progress_label  : "Kemajuan",
    card_progress_count  : "12 / 20 piwulang rampung",
    card_difficulty      : "Tingkat:",
    card_continue_btn    : "▶ Nerusake",

    card_challenge_title  : "Tantangan Saben Dina",
    card_challenge_reset  : "Reset 8j maneh",
    task1_label           : "Rampungne 1 Piwulang",
    task1_status          : "Rampung!",
    task2_label           : "Klumpukne 20 XP",
    task2_status          : "15/20",
    task3_label           : "Mbaleni 5 Tembung",
    task3_status          : "0/5",
    card_challenge_bonus  : "Rampungne kabeh →",
    card_challenge_xp     : "+50 XP Bonus!",

    /* Coming Soon */
    coming_title    : "Basa Liyane",
    coming_badge    : "Enggal Teka",
    coming_desc     : "Saiki mung ana Basa Jawa. Basa liyane bakal enggal teka!",
    coming_soon     : "Enggal teka",

    /* Footer */
    footer_desc     : "Platform sinau basa dhaerah Indonesia kanthi gratis, seru, lan efektif.",
    footer_platform : "Platform",
    footer_about    : "Bab Kita",
    footer_courses  : "Kursus",
    footer_blog     : "Blog",
    footer_support  : "Pitulung",
    footer_help     : "Pusat Pitulung",
    footer_privacy  : "Kabijakan Privasi",
    footer_terms    : "Syarat & Ketentuan",
    footer_contact  : "Hubungi Kita",
    footer_lang     : "Basa Situs",
    footer_team     : "Kelompok 11",
    footer_mentor   : "Pembimbing:",
    footer_slogan   : "Ayo Lestarikake Basa Dhaerah!",
    footer_copy     : "© 2026 AksaraLoka · Kelompok 11 · MPSI & PemWeb",
  },
};

// ─── Fungsi utama ─────────────────────────────────────────────────────────────

/**
 * Terapkan bahasa ke seluruh halaman.
 * @param {string} lang - kode bahasa: "id" | "en" | "jw"
 */
function applyLang(lang) {
  // Fallback ke Indonesia jika kode tidak dikenal
  const dict = translations[lang] || translations["id"];

  // Ganti semua elemen yang punya atribut data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  // Simpan pilihan ke localStorage supaya bertahan setelah refresh
  localStorage.setItem("aksaraloka_lang", lang);

  // Tandai <html> dengan atribut lang (aksesibilitas & SEO)
  document.documentElement.lang = lang === "jw" ? "jv" : lang;
}

/**
 * Inisialisasi bahasa saat halaman pertama dibuka.
 * Urutan prioritas: localStorage → default "id"
 */
function initLang() {
  const saved = localStorage.getItem("aksaraloka_lang") || "id";
  applyLang(saved);

  // Sinkronkan dropdown <select> di footer supaya nilainya sesuai
  const select = document.getElementById("lang-select");
  if (select) select.value = saved;
}

// Jalankan saat DOM siap
document.addEventListener("DOMContentLoaded", initLang);
