<?php
// ============================================
//  api/login.php  —  Endpoint Login
// ============================================

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

session_start();

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
$email = trim($body['email'] ?? '');
$pass  = $body['password']   ?? '';

// ── 2. Validasi dasar ─────────────────────────────────────────────────────
$errors = [];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Format email tidak valid.';
}
if ($pass === '') {
    $errors['password'] = 'Kata sandi wajib diisi.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// ── 3. Cek user di database ───────────────────────────────────────────────
require_once __DIR__ . '/../config/db.php';
$pdo = getPDO();

$stmt = $pdo->prepare('SELECT id, nama, email, password_hash FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($pass, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'errors'  => ['email' => 'Email atau kata sandi salah.']
    ]);
    exit;
}

// ── 4. Simpan session ─────────────────────────────────────────────────────
$_SESSION['user_id']    = $user['id'];
$_SESSION['user_nama']  = $user['nama'];
$_SESSION['user_email'] = $user['email'];

// ── 5. Berhasil ───────────────────────────────────────────────────────────
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Selamat datang, ' . $user['nama'] . '! 👋',
    'user'    => [
        'id'    => $user['id'],
        'nama'  => $user['nama'],
        'email' => $user['email'],
    ]
]);