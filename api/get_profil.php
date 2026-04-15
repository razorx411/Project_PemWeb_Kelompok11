<?php
header('Content-Type: application/json');

session_start();
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Belum login']);
    exit;
}

$pdo = getPDO();
$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT id, nama, email, password_hash FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

echo json_encode([
    'success' => true,
    'user' => $user
]);