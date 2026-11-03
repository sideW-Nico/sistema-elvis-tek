<?php

require_once __DIR__ . "/../config/config.php";
require_once RUTA_VISTA . "/RespuestaJson.php";

// Conserva la página de inicio actual.
if (!isset($_GET["ruta"])) {
    header("Location: ./index.html");
    exit;
}

try {
    // Captura los datos que vienen luego de ? en la URL
    $ruta = $_GET["ruta"];
    $metodo = $_SERVER["REQUEST_METHOD"];

    if (!is_string($ruta) || trim($ruta) === "") {
        RespuestaJson::error("La ruta es inválida", 400);
    }

    session_start();

    require RUTA_APP . "/rutas/api.php";
} catch (Throwable $error) {
    error_log((string) $error);
    RespuestaJson::error("Error interno del servidor", 500);
}




