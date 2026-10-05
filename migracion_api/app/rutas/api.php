<?php
require_once RUTA_CONTROLADOR . "/LoginController.php";
require_once RUTA_CONTROLADOR . "/UsuarioController.php";

// Espacio donde se encuentran los endpoints que establecen la comunicación con el controlador
switch ($ruta) {
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
        $controlador->gestionar($metodo);
        break;
    default:
        RespuestaJson::error("Ruta no encontrada", 404);
}
