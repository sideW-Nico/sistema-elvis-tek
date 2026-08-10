<?php

require_once RUTA_MODELO . "/ConectorPDO.php";
require_once RUTA_MODELO . "/AccesoDatosUsuario.php";

$conectorPDO = new ConectorPDO ("localhost:3306", "leandro", "123", "test");
$conexion = $conectorPDO->establecerConexion();

    $accesoDatosUsuario = new AccesoDatosUsuario($conexion);
    $usuarios = $accesoDatosUsuario->listarUsuarios();

$conectorPDO->desconectar();

//A diferencia de otros casos, acá se utiliza require_once en vez de header porque se le incluye la lista de usuarios
require_once __DIR__ . "/../vista/administrador.php";
