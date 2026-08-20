<?php

require_once __DIR__ . "/../config/config.php";

session_start();

if (!isset($_SESSION["cedula"])) {
    $mensaje = "Acceso Denegado: Sesión no iniciada";
    header("Location: login.php?error=" . urlencode($mensaje));
    exit;
}

if (!($_SESSION["administrador"] ?? false)) {
    $mensaje = "Acceso Denegado: Rol incorrecto";
    header("Location: login.php?error=" . urlencode($mensaje));
    exit;
}

//Verifica la existencia del token
if (!isset($_SESSION["csrfToken"])) {
    /**
     * Si el usuario no posee los permisos de acceso correctos por falta
     * de un token, devuelve el estado 403 que es forbidden.
     * 
     * Estados HTTP: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#client_error_responses
     */
    http_response_code(403);
    exit("Solicitud Rechazada..." . $_SESSION["csrfToken"]);
}

require_once RUTA_CONTROLADOR . "/cargarAdministrador.php";