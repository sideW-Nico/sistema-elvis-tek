<?php

require_once __DIR__ . "/../config/config.php";

/*
    Captura los datos del URI mediante la superglobal y normaliza los datos
    REQUEST_URI                         ->      Parseado a PHP_URL_PATH
    /usuarios                           ->      /usuarios
    /usuarios/12345678?detalle=true     ->      /usuarios/12345678
    /index.php                          ->      /index.php
*/
$ruta = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

//  Redirige a la página de inicio en el caso de estar ingresando a index.php
if ($ruta === "/" || $ruta === "/index.php") {
    header("Location: ./index.html");
    exit;
}

try {
    $metodo = $_SERVER["REQUEST_METHOD"];

    if (!is_string($ruta) || trim($ruta) === "") {
        http_response_code(400);
        header("Content-Type: application/json");
        echo json_encode(["mensaje" => "La ruta es inválida"]);
        exit;
    }

    session_start();
    
    require RUTA_APP . "/rutas/api.php";
} catch (Throwable $error) {
    error_log((string) $error);
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode(["mensaje" => "Error interno del servidor"]);
    exit;
}
