<?php

require_once __DIR__ . "/../config/config.php";

//Comprueba que el formulario haya sido enviado mediante POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $mensaje = "Acceso Denegado: Petición incorrecta";

    //urlencode es un método que toma un string y lo retorna con un formato funcional para ser enviado a través de una URL
    header("Location: login.php?error=" . urlencode($mensaje));
    exit;
}

require_once RUTA_CONTROLADOR . "/procesarLogin.php";