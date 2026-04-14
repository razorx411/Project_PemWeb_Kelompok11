<?php
// ============================================
//  api/update_profil.php  —  Endpoint Update Profil
// ============================================

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

session_start();

// Cek login
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Belum login.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan.']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Request tidak valid.']);
    exit;
}

// ── 1. Ambil input ────────────────────────────────────────────────────────
$nama     = trim($body['nama']     ?? '');
$email    = trim($body['email']    ?? '');
$password = $body['password']      ?? '';

// ── 2. Validasi ───────────────────────────────────────────────────────────
$errors = [];

if ($nama === '' || mb_strlen($nama) > 100) {
    $errors['nama'] = 'Nama pengguna wajib diisi (maks. 100 karakter).';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Format email tidak valid.';
}
if ($password !== '' && mb_strlen($password) < 8) {
    $errors['password'] = 'Kata sandi minimal 8 karakter.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// ── 3. Update ke database ─────────────────────────────────────────────────
require_once __DIR__ . '/../config/db.php';
$pdo     = getPDO();
$user_id = $_SESSION['user_id'];

// Cek apakah email sudah dipakai user lain
$stmtCheck = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1');
$stmtCheck->execute([$email, $user_id]);
if ($stmtCheck->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Email sudah digunakan akun lain.']);
    exit;
}

// Jika password diisi, hash dan update sekalian
if ($password !== '') {
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $stmt = $pdo->prepare('UPDATE users SET nama = ?, email = ?, password_hash = ? WHERE id = ?');
    $stmt->execute([$nama, $email, $hash, $user_id]);
} else {
    $stmt = $pdo->prepare('UPDATE users SET nama = ?, email = ? WHERE id = ?');
    $stmt->execute([$nama, $email, $user_id]);
}

// ── 4. Update session ─────────────────────────────────────────────────────
$_SESSION['user_nama']  = $nama;
$_SESSION['user_email'] = $email;

// ── 5. Berhasil ───────────────────────────────────────────────────────────
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Profil berhasil diperbarui.',
    'user'    => ['nama' => $nama, 'email' => $email]
]);