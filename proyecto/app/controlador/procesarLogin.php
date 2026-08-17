<?php

/**
 * AVISO: Falta implementación de control de sesiones con el atributo
 * sesionActiva dentro de la tabla USUARIO.
 * 
 * Para hacer: Implementarlo en un futuro, afecta el método autenticar(),
 * esto tambien afecta cerrarSesion, implicando crear un archivo de procesamiento
 * que realice una consulta a la base de datos y actualice su estado.
 */

require_once RUTA_MODELO . "/ConectorPDO.php";
require_once RUTA_MODELO . "/AccesoDatosUsuario.php";
require_once RUTA_MODELO . "/Usuario.php";
require_once RUTA_MODELO . "/Login.php";

//Recupera las credenciales provenientes del formulario
$cedula = trim($_POST["cedula"] ?? "");
$clave = $_POST["clave"] ?? "";

$conectorPDO = new ConectorPDO($_ENV['DB_HOST'] . ":" . $_ENV['DB_PUERTO'], $_ENV['DB_USUARIO'], $_ENV['DB_CLAVE'], $_ENV['DB_NOMBRE']);
$conexion = $conectorPDO->establecerConexion();

    if ($conexion === null) {
        $mensaje = "Acceso Denegado: Problemas con la conexión.";
        header("Location: login.php?error=" . urlencode($mensaje));
        exit;
    }

    $accesoDatosUsuario = new AccesoDatosUsuario($conexion);
    $login = new Login($accesoDatosUsuario);
    $usuario = $login->autenticar($cedula, $clave);

$conectorPDO->desconectar();

//Si las credenciales no coinciden, muestra el error y detiene el proceso
if ($usuario === null) {
    $mensaje = "Acceso Denegado: La cédula o la contraseña son incorrectas.";
    header("Location: login.php?error=" . urlencode($mensaje));
    exit;
}

//Solo se encuentra implementado el rol administrador
if (!$usuario->esAdministrador()) {
    $mensaje = "Acceso Denegado: El usuario no tiene acceso al panel de administración.";
    header("Location: login.php?error=" . urlencode($mensaje));
    exit;
}

session_start();
session_regenerate_id(true);

$_SESSION["cedula"] = $usuario->getCedula();
$_SESSION["administrador"] = $usuario->esAdministrador();
$_SESSION["logistica"] = $usuario->esLogistica();

/**
 * Generación de tokens para CSRF
 * 
 * Cross-Site Request Forgery ~ Falsificación de solicitudes entre sitios
 * 
 * Teniendo una sesión iniciada, ayuda a prevenir peticiones dirigdas al servidor coninformación manipulada.
 * El token es una palabra aleatoria de 32 caracteres binarios (random_bytes()) que se la pasa a hexadecimal (bin2hex()).
 * El token puede generarse con el algoritmo y formato preferido siempre y cuando sea con métodos seguros.
 * El token deberá verificarse siempre que se manipule información sensible que cambie el estado del sistema (ABML).
 */
if (!isset($_SESSION["csrfToken"])) {
    $_SESSION["csrfToken"] = bin2hex( random_bytes(32) ); 
}

if ($_SESSION["administrador"] && $_SESSION["logistica"]) {
    header("Location: panelRoles.php");
} elseif ($_SESSION["logistica"]) { //No implementado panel de logística, es una muestra de ejemplo con fines didácticos
    header("Location: logistica.php");
} elseif ($_SESSION["administrador"]) {
    header("Location: administrador.php");
}

exit;
