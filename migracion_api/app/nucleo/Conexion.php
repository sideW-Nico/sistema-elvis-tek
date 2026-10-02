<?php

class Conexion {
    public static function conectar(): PDO
    {
        $conectorPDO = ConectorPDO::obtenerInstancia($_ENV['DB_HOST'], (int) $_ENV['DB_PUERTO'], $_ENV['DB_USUARIO'], $_ENV['DB_CLAVE'], $_ENV['DB_NOMBRE']);
        $conexion = $conectorPDO->establecerConexion();
        if ($conexion === null) {
            RespuestaJson::error("Error de conexión con la base de datos", 500);
        }
        return $conexion;
    }

    public static function desconectar(): void
    {
        $conectorPDO = ConectorPDO::obtenerInstancia($_ENV['DB_HOST'], (int) $_ENV['DB_PUERTO'], $_ENV['DB_USUARIO'], $_ENV['DB_CLAVE'], $_ENV['DB_NOMBRE']);
        $conectorPDO->desconectar();
    }
}