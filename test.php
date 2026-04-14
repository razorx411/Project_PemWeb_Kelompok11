<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'config/koneksi.php';

if ($conn) {
    echo "Koneksi sukses 🚀";
}
?>