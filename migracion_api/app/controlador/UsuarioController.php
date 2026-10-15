<?php
require_once RUTA_MODELO . "/ConectorPDO.php";
require_once RUTA_MODELO . "/UsuarioDAO.php";
require_once RUTA_VISTA . "/RespuestaJson.php";

require_once RUTA_NUCLEO . "/Conexion.php";
require_once RUTA_NUCLEO . "/Token.php";
require_once RUTA_NUCLEO . "/Sesion.php";

class UsuarioController
{
    /*
        Contrato URI
        GET         /usuarios
        GET         /usuarios/{cedula}
        POST        /usuarios
        PUT         /usuarios/{cedula}
        DELETE      /usuarios/{cedula}
     */

    public function gestionar(string $metodo, string $cedula): void
    {
        Sesion::verificarRol("administrador");

        //Forma de controlar a través del token las consultas críticas sobre determinados datos
        //Puesto que CSRF es para proteger la manipulación de los datos, se permite operar sobre GET sin token
        if (in_array($metodo, ["POST", "PUT", "DELETE"], true)) {
            Token::verificarCSRF();
        }

        // A partir de si posee una cédula, verifica los métodos permitidos para dicha petición
        $metodosPermitidos = $cedula === "" ? ["GET", "POST"] : ["GET", "PUT", "DELETE"];

        if (!in_array($metodo, $metodosPermitidos, true)) {
            RespuestaJson::error("Método no permitido", 405);
        }


        //https://www.w3schools.com/php/php_match.asp
        match ($metodo) {
            "GET" => $this->listar($cedula),
            "POST" => $this->alta(),
            "PUT" => $this->modificar($cedula),
            "DELETE" => $this->baja($cedula),
            default => RespuestaJson::error("Método no permitido", 405),
        };
    }

    private function listar(string $cedula): void
    {
        if ($cedula !== "") {
            //En caso de recibir datos mediante la superglobal, se busca un usuario específico
            $this->listarUsuario($cedula);
        } else {
            $this->listarUsuarios();
        }

    }

    private function listarUsuario(string $cedula): void
    {
        if ($cedula === "") {
            RespuestaJson::error("La cédula es obligatoria", 400);
        }

        if (!preg_match("/^[1-9][0-9]{7}$/", $cedula)) {
            RespuestaJson::error("Cédula incorrecta", 422);
        }

        $conexion = Conexion::conectar();
        $dao = new UsuarioDAO($conexion);
        $usuario = $dao->listarUsuario($cedula);
        unset($dao, $conexion);
        Conexion::desconectar();

        if ($usuario === null) {
            RespuestaJson::error("El usuario no existe", 404);
        }

        RespuestaJson::exito($usuario);
    }

    private function listarUsuarios(): void
    {
        $conexion = Conexion::conectar();
        $dao = new UsuarioDAO($conexion);
        $usuarios = $dao->listarUsuarios();
        unset($dao, $conexion);
        Conexion::desconectar();
        RespuestaJson::exito($usuarios);
    }

    private function alta(): void
    {
        $datos = json_decode(file_get_contents("php://input"), true);

        if (!is_array($datos)) {
            RespuestaJson::error("JSON inválido", 400);
        }

        $cedula = trim($datos["cedula"] ?? "");
        $nombre = trim($datos["nombre"] ?? "");
        $apellido = trim($datos["apellido"] ?? "");
        $clave = $datos["clave"] ?? "";
        $confirmarClave = $datos["confirmarClave"] ?? "";
        $rol = trim($datos["rol"] ?? "");

        if ($cedula === "" || $nombre === "" || $apellido === "" || $clave === "" || $confirmarClave === "" || $rol === "") {
            RespuestaJson::error("Existen campos vacíos", 422);
        }
        if (!preg_match("/^[1-9][0-9]{7}$/", $cedula)) {
            RespuestaJson::error("Cédula incorrecta", 422);
        }
        if (strlen($clave) < 12) {
            RespuestaJson::error("La contraseña debe contener al menos 12 caracteres", 422);
        }
        if ($clave !== $confirmarClave) {
            RespuestaJson::error("Las contraseñas ingresadas no coinciden", 422);
        }

        $claveHash = password_hash($clave, PASSWORD_DEFAULT);

        $conexion = Conexion::conectar();
        $dao = new UsuarioDAO($conexion);
        $resultado = $dao->registrarUsuario($cedula, $nombre, $apellido, $claveHash, $rol);
        unset($dao, $conexion);
        Conexion::desconectar();

        if (!$resultado) {
            RespuestaJson::error("No se pudo registrar el empleado", 400);
        }

        RespuestaJson::exito(["mensaje" => "Empleado ingresado exitosamente"], 201);
    }

    private function modificar($cedula): void
    {
        $datos = json_decode(file_get_contents("php://input"), true);

        if (!is_array($datos)) {
            RespuestaJson::error("JSON inválido", 400);
        }

        $nombre = trim($datos["nombre"] ?? "");
        $apellido = trim($datos["apellido"] ?? "");
        $clave = $datos["clave"] ?? "";
        $rol = trim($datos["rol"] ?? "");

        if ($cedula === "" || $nombre === "" || $apellido === "" || $clave === "" || $rol === "") {
            RespuestaJson::error("Existen campos vacíos", 422);
        }

        if (!preg_match("/^[1-9][0-9]{7}$/", $cedula)) {
            RespuestaJson::error("Cédula incorrecta", 422);
        }

        $claveHash = password_hash($clave, PASSWORD_DEFAULT);

        $conexion = Conexion::conectar();
        $dao = new UsuarioDAO($conexion);
        $resultado = $dao->modificarUsuario($cedula, $nombre, $apellido, $claveHash, $rol);
        unset($dao, $conexion);
        Conexion::desconectar();

        if (!$resultado) {
            RespuestaJson::error("No se pudo modificar el empleado", 400);
        }

        RespuestaJson::exito(["mensaje" => "Empleado modificado exitosamente"]);
    }

    private function baja($cedula): void
    {
        if ($cedula === "") {
            RespuestaJson::error("Falta la cédula del empleado", 422);
        }

        if (!preg_match("/^[1-9][0-9]{7}$/", $cedula)) {
            RespuestaJson::error("Cédula incorrecta", 422);
        }

        $conexion = Conexion::conectar();
        $dao = new UsuarioDAO($conexion);
        $resultado = $dao->eliminarUsuario($cedula);
        unset($dao, $conexion);
        Conexion::desconectar();

        if (!$resultado) {
            RespuestaJson::error("No se pudo eliminar el empleado", 400);
        }

        RespuestaJson::exito(["mensaje" => "Empleado eliminado exitosamente"]);
    }

}