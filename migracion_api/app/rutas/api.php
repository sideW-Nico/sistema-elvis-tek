<?php
require_once RUTA_CONTROLADOR . "/LoginController.php";
require_once RUTA_CONTROLADOR . "/UsuarioController.php";

// Separa la URI en fragmentos. trim quita / de los extremos. explode separa en arreglos en base a los / que se encuentran en el medio
$segmentos = explode("/", trim($ruta, "/"));
$recurso = $segmentos[0];

$cantidadSegmentos = count($segmentos);

/**
 * $cantidadSegmentos > 2: Delimita la cantidad de segmentos definida por la URI, en este caso son hasta 2 (/recurso/identificador)
 * in_array...: Verifica si el recurso es uno de los que no poseen identificador
 */
if ( (in_array($recurso, ["login", "logout"], true) && $cantidadSegmentos !== 1) || $cantidadSegmentos > 2) {
    RespuestaJson::error("Ruta no encontrada", 404);
}

// Captura el identificador en caso de existir para casos donde se requiera
$identificador = trim($segmentos[1] ?? "");

// Espacio donde se encuentran los endpoints que establecen la comunicación con el controlador
switch ($recurso) {
    case "login":
        $controlador = new LoginController();
        $controlador->autenticar($metodo);
        break;
    case "logout":
        $controlador = new LoginController();
        $controlador->cerrarSesion($metodo);
        break;
    case "usuarios":
        $controlador = new UsuarioController();
        $controlador->gestionar($metodo, $identificador);
        break;
    default:
        RespuestaJson::error("Ruta no encontrada", 404);
}
