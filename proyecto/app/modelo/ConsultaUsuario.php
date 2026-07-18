<?php

/**
 * Clase que simula una recuperación de credenciales correspondientes a la base de datos.
 */
class ConsultaUsuario {
    /**
     * Simula la recuperación de un usuario desde una base de datos.
     *
     * Más adelante, el contenido de esta función será reemplazado
     * por una consulta mediante PDO.
     */
    public function buscarUsuario(string $cedula): ?Usuario {
        $datos = [
            "cedula" => "11111111",
            "claveHash" => password_hash("clave1234567", PASSWORD_DEFAULT),
            "activo" => false,
            "administrador" => true,
            "logistica" => false
        ];

        if ($cedula !== $datos["cedula"]) {
            return null;
        }

        return new Usuario (
            $datos["cedula"],
            $datos["claveHash"],
            $datos["activo"],
            $datos["administrador"],
            $datos["logistica"]
        );
    }
}

?>