<?php
require_once RUTA_MODELO . "/ConectorPDO.php";
require_once RUTA_MODELO . "/UsuarioDAO.php";
require_once RUTA_VISTA . "/RespuestaJson.php";

require_once RUTA_NUCLEO . "/Conexion.php";
require_once RUTA_NUCLEO . "/Token.php";
require_once RUTA_NUCLEO . "/Sesion.php";

class LoginController
{
    public function autenticar(string $metodo): void
    {
        if ($metodo !== "POST") {
            RespuestaJson::error("Método no permitido", 405);
        }

        $datos = json_decode(file_get_contents("php://input"), true);

        if (!is_array($datos)) {
            RespuestaJson::error("JSON inválido", 400);
        }

        $cedula = trim($datos["cedula"] ?? "");
        $clave = $datos["clave"] ?? "";

        if ($cedula === "" || $clave === "") {
            RespuestaJson::error("Cédula y contraseña son obligatorias", 422);
        }

        $conexion = Conexion::conectar();
        $dao = new UsuarioDAO($conexion);
        $usuario = $dao->buscarUsuario($cedula);
        Conexion::desconectar();

        if ($usuario === null || !password_verify($clave, $usuario->getClaveHash())) {
            RespuestaJson::error("Usuario o credenciales incorrectas", 401);
        }

        Sesion::iniciar($usuario);
        Token::generarTokenCSRF();

        RespuestaJson::exito([
            "mensaje" => "Sesión iniciada correctamente",
            "csrfToken" => $_SESSION["csrfToken"]
        ]);
    }

    public function cerrarSesion(string $metodo): void
    {
        if ($metodo !== "POST") {
            RespuestaJson::error("Método no permitido", 405);
        }

        Token::verificarCSRF();
        Sesion::cerrar();

        RespuestaJson::exito(["mensaje" => "Sesión cerrada correctamente"]);
    }

    
}

