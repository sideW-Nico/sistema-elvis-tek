<?php
require_once __DIR__ . "/../../config/config.php";
require_once RUTA_CONTROLADOR . "/LoginController.php";

session_start();

$controlador = new LoginController();
$controlador->autenticar($_SERVER["REQUEST_METHOD"]);