<?php
function getPDO(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        $envPath = __DIR__ . '/../.env';
        $env = [];

        if (file_exists($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (str_starts_with(trim($line), '#')) continue;
                if (!str_contains($line, '=')) continue;
                [$key, $value] = array_map('trim', explode('=', $line, 2));
                if ($key !== '') $env[$key] = $value;
            }
        }

        $host    = $env['DB_HOST']    ?? 'localhost';
        $dbname  = $env['DB_NAME']    ?? 'aksaraloka';
        $user    = $env['DB_USER']    ?? 'root';
        $pass    = $env['DB_PASS']    ?? '';
        $charset = $env['DB_CHARSET'] ?? 'utf8mb4';

        $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Koneksi database gagal: ' . $e->getMessage()
            ]);
            exit;
        }
    }

    return $pdo;
}