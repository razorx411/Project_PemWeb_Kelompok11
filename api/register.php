<?php
// ============================================
//  api/register.php  —  Endpoint Registrasi
//  Letakkan file ini di: api/register.php
// ============================================



// Izinkan request dari origin yang sama (sesuaikan jika perlu)
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Hanya terima POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan.']);
    exit;
}

// Ambil body JSON dari fetch()
$body = json_decode(file_get_contents('php://input'), true);

if (!$body) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Request tidak valid.']);
    exit;
}

// ── 1. Ambil & sanitasi input ──────────────────────────────────────────────
$nama  = trim($body['nama']  ?? '');
$email = trim($body['email'] ?? '');
$pass  = $body['password']   ?? '';
$conf  = $body['confirmPassword'] ?? '';

// ── 2. Validasi server-side ────────────────────────────────────────────────
$errors = [];

if ($nama === '' || mb_strlen($nama) > 100) {
    $errors['nama'] = 'Nama pengguna wajib diisi (maks. 100 karakter).';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Format email tidak valid.';
}

if (mb_strlen($pass) < 8) {
    $errors['password'] = 'Kata sandi minimal 8 karakter.';
}

if ($pass !== $conf) {
    $errors['confirmPassword'] = 'Konfirmasi kata sandi tidak cocok.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// ── 3. Cek apakah email sudah terdaftar ───────────────────────────────────
require_once __DIR__ . '/../config/db.php';
$pdo = getPDO();

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);

if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode([
        'success' => false,
        'errors'  => ['email' => 'Email sudah terdaftar. Silakan masuk.']
    ]);
    exit;
}

// ── 4. Hash password & simpan ke database ────────────────────────────────
$hash = password_hash($pass, PASSWORD_BCRYPT, ['cost' => 12]);

$insert = $pdo->prepare(
    'INSERT INTO users (nama, email, password_hash) VALUES (?, ?, ?)'
);
$insert->execute([$nama, $email, $hash]);

// ── 5. Berhasil ───────────────────────────────────────────────────────────
http_response_code(201);
echo json_encode([
    'success' => true,
    'message' => 'Akun berhasil dibuat! Selamat belajar Aksara Nusantara 🎉',
]);
