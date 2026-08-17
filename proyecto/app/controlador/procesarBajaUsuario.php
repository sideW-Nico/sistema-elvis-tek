<?php

require_once RUTA_MODELO . "/ConectorPDO.php";
require_once RUTA_MODELO . "/BajaDatosUsuario.php";

$cedula = trim($_POST["cedula"] ?? "");

if (!preg_match("/^[1-9][0-9]{7}$/", $cedula)) {
    $mensaje = "No se pudo eliminar el empleado: Cédula incorrecta o usuario inexistente.";
    header("Location: administrador.php?error=" . urlencode($mensaje));
    exit;
}

$conectorPDO = new ConectorPDO($_ENV['DB_HOST'] . ":" . $_ENV['DB_PUERTO'], $_ENV['DB_USUARIO'], $_ENV['DB_CLAVE'], $_ENV['DB_NOMBRE']);
$conexion = $conectorPDO->establecerConexion();

    if ($conexion === null) {
        $mensaje = "No se pudo establecer conexión con la base de datos.";
        header("Location: administrador.php?error=" . urlencode($mensaje));
        exit;
    }

    $bajaDatosUsuario = new BajaDatosUsuario($conexion);
    $resultado = $bajaDatosUsuario->eliminarUsuario($cedula);

$conectorPDO->desconectar();

if (!$resultado) {
    $mensaje = "No se pudo eliminar el empleado.";
    header("Location: administrador.php?error=" . urlencode($mensaje));
    exit;
}

$mensaje = "Empleado eliminado exitosamente.";
header("Location: administrador.php?resultado=" . urlencode($mensaje));
exit;