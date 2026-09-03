// app/controlador/UsuarioController.php
<?php
require_once RUTA_MODELO . "/ConectorPDO.php";
require_once RUTA_MODELO . "/UsuarioDAO.php";
require_once RUTA_VISTA . "/RespuestaJson.php";

class UsuarioController
{

    public function gestionar(string $metodo): void
    {
        if (!isset($_SESSION["cedula"])) {
            RespuestaJson::error("Acceso denegado: sesión no iniciada", 401);
        }
        if (!($_SESSION["administrador"] ?? false)) {
            RespuestaJson::error("Acceso denegado: rol incorrecto", 403);
        }

        //https://www.w3schools.com/php/php_match.asp
        match ($metodo) {
            "GET" => $this->listar(),
            "POST" => $this->alta(),
            //PONER PUT
            "PATCH" => $this->modificar(),
            "DELETE" => $this->baja(),
            default => RespuestaJson::error("Método no permitido", 405),
        };
    }

    private function listar(): void
    {
        $conexion = $this->conectar();
        $dao = new UsuarioDAO($conexion);
        RespuestaJson::exito($dao->listarUsuarios());
    }

    private function alta(): void
    {
        $this->verificarCsrf();

        $datos = json_decode(file_get_contents("php://input"), true) ?? [];

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

        $conexion = $this->conectar();
        $dao = new UsuarioDAO($conexion);
        $resultado = $dao->registrarUsuario($cedula, $nombre, $apellido, $claveHash, $rol);

        if (!$resultado) {
            RespuestaJson::error("No se pudo registrar el empleado", 400);
        }

        RespuestaJson::exito(["mensaje" => "Empleado ingresado exitosamente"], 201);
    }

    private function modificar(): void
    {
        $this->verificarCsrf();

        $datos = json_decode(file_get_contents("php://input"), true) ?? [];

        $cedula = trim($datos["cedula"] ?? "");
        $nombre = trim($datos["nombre"] ?? "");
        $apellido = trim($datos["apellido"] ?? "");
        $clave = $datos["clave"] ?? "";
        $rol = trim($datos["rol"] ?? "");

        if ($cedula === "" || $nombre === "" || $apellido === "" || $rol === "") {
            RespuestaJson::error("Existen campos vacíos", 422);
        }

        $claveHash = password_hash($clave, PASSWORD_DEFAULT);

        $conexion = $this->conectar();
        $dao = new UsuarioDAO($conexion);
        $resultado = $dao->modificarUsuario($cedula, $nombre, $apellido, $claveHash, $rol);

        if (!$resultado) {
            RespuestaJson::error("No se pudo modificar el empleado", 400);
        }

        RespuestaJson::exito(["mensaje" => "Empleado modificado exitosamente"]);
    }

    private function baja(): void
    {
        $this->verificarCsrf();

        $datos = json_decode(file_get_contents("php://input"), true) ?? [];
        $cedula = trim($datos["cedula"] ?? "");

        if ($cedula === "") {
            RespuestaJson::error("Falta la cédula del empleado", 422);
        }

        $conexion = $this->conectar();
        $dao = new UsuarioDAO($conexion);
        $resultado = $dao->eliminarUsuario($cedula);

        if (!$resultado) {
            RespuestaJson::error("No se pudo eliminar el empleado", 400);
        }

        RespuestaJson::exito(["mensaje" => "Empleado eliminado exitosamente"]);
    }

    private function verificarCsrf(): void
    {
        $token = $_SERVER["HTTP_X_CSRF_TOKEN"] ?? "";
        if (!isset($_SESSION["csrfToken"]) || !hash_equals($_SESSION["csrfToken"], $token)) {
            RespuestaJson::error("Solicitud rechazada", 403);
        }
    }

    private function conectar(): PDO
    {
        $conector = new ConectorPDO($_ENV["DB_HOST"] . ":" . $_ENV["DB_PUERTO"], $_ENV["DB_USUARIO"], $_ENV["DB_CLAVE"], $_ENV["DB_NOMBRE"]);
        $conexion = $conector->establecerConexion();
        if ($conexion === null) {
            RespuestaJson::error("Error de conexión con la base de datos", 500);
        }
        return $conexion;
    }
}