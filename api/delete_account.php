<?php
// ============================================
//  api/delete_akun.php  —  Endpoint Hapus Akun
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

// ── 1. Ambil password konfirmasi ──────────────────────────────────────────
$password = $body['password'] ?? '';

if ($password === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Kata sandi wajib diisi untuk konfirmasi.']);
    exit;
}

// ── 2. Verifikasi password ────────────────────────────────────────────────
require_once __DIR__ . '/../config/db.php';
$pdo     = getPDO();
$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ? LIMIT 1');
$stmt->execute([$user_id]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Kata sandi salah. Akun tidak dihapus.']);
    exit;
}

// ── 3. Hapus user dari database ───────────────────────────────────────────
// Jika ada tabel terkait (progress, dll), hapus dulu sebelum users
// Contoh: $pdo->prepare('DELETE FROM user_progress WHERE user_id = ?')->execute([$user_id]);

$del = $pdo->prepare('DELETE FROM users WHERE id = ?');
$del->execute([$user_id]);

// ── 4. Hancurkan session ──────────────────────────────────────────────────
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}
session_destroy();

// ── 5. Berhasil ───────────────────────────────────────────────────────────
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Akun berhasil dihapus.'
]);