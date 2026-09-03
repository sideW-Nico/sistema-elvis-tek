<?php

/**
 * Clase que unifica todas las operaciones de acceso a datos
 * relacionadas con la entidad Usuario (buscar, listar, alta, baja, modificación).
 */
class AccesoDatosUsuario {
    private PDO $conexion;

    public function __construct(PDO $conexion) {
        $this->conexion = $conexion;
    }

    public function buscarUsuario(string $cedula): ?Usuario {
        $sql = "
            SELECT
                u.cedula,
                u.claveHash,
                u.sesionActiva,

                CASE
                    WHEN a.cedula IS NOT NULL THEN TRUE
                    ELSE FALSE
                END AS administrador,

                CASE
                    WHEN l.cedula IS NOT NULL THEN TRUE
                    ELSE FALSE
                END AS logistica

            FROM USUARIO AS u

            LEFT JOIN ADMINISTRADOR AS a
                ON a.cedula = u.cedula

            LEFT JOIN LOGISTICA AS l
                ON l.cedula = u.cedula

            WHERE u.cedula = :cedula
        ";

        $consulta = $this->conexion->prepare($sql);

        $consulta->execute(["cedula" => $cedula]);

        $usuario = $consulta->fetch(PDO::FETCH_ASSOC);

        //Una vez usada la consulta, desconectar el objeto PDOStatement. https://www.php.net/manual/en/pdo.connections.php
        $consulta = null;

        if ($usuario === false) {
            return null;
        }

        return new Usuario(
            $usuario["cedula"],
            $usuario["claveHash"],
            (bool) $usuario["sesionActiva"],
            (bool) $usuario["administrador"],
            (bool) $usuario["logistica"]
        );
    }

    public function listarUsuarios(): array {
        $sql = "
            SELECT
                u.cedula,
                u.nombre,
                u.apellido,

                CASE
                    WHEN a.cedula IS NOT NULL THEN TRUE
                    ELSE FALSE
                END AS administrador,

                CASE
                    WHEN l.cedula IS NOT NULL THEN TRUE
                    ELSE FALSE
                END AS logistica

            FROM USUARIO AS u

            LEFT JOIN ADMINISTRADOR AS a
                ON a.cedula = u.cedula

            LEFT JOIN LOGISTICA AS l
                ON l.cedula = u.cedula";

        $consulta = $this->conexion->query($sql);

        $usuarios = $consulta->fetchAll(PDO::FETCH_ASSOC);

        $consulta = null;

        return $usuarios;
    }

    public function registrarUsuario(string $cedula, string $nombre, string $apellido, string $claveHash, string $rol): bool {

        try {
            //Método que ejecuta de forma agrupada todas las instrucciones dirigidas a la base de datos
            //Si una instrucción falla, retorna excepción con la posibilidad de deshacer cambios con rollBack()
            $this->conexion->beginTransaction();

            $sqlUsuario = "INSERT INTO USUARIO (cedula, nombre, apellido, claveHash) VALUES (:cedula, :nombre, :apellido, :claveHash)";

            $consultaUsuario = $this->conexion->prepare($sqlUsuario);

            $consultaUsuario->execute(["cedula" => $cedula, "nombre" => $nombre, "apellido" => $apellido, "claveHash" => $claveHash]);

            switch ($rol) {
                case "Administrador":
                    $sqlRol = "INSERT INTO ADMINISTRADOR (cedula) VALUES (:cedula)";
                    break;
                case "Logística":
                    $sqlRol = "INSERT INTO LOGISTICA (cedula) VALUES (:cedula)";
                    break;
                default:
                    $this->conexion->rollBack();
                    return false;
            }
            
            $consultaRol = $this->conexion->prepare($sqlRol);

            $consultaRol->execute(["cedula" => $cedula]);

            //Confirma todas las operaciones realizadas.
            $this->conexion->commit();

            return true;

        } catch (PDOException $error) {

            //Verifica si se encuentra en una transacción
            if ($this->conexion->inTransaction()) {
                //Deshace los cambios causados por la excepción
                $this->conexion->rollBack();
            }

            return false;
        }
    }

    public function modificarUsuario(string $cedula, string $nombre, string $apellido, string $claveHash, string $rol): bool {
        try {
            $this->conexion->beginTransaction();

            $sqlUsuario = "UPDATE USUARIO SET nombre = :nombre, apellido = :apellido, claveHash = :claveHash WHERE cedula = :cedula";
            $consultaUsuario = $this->conexion->prepare($sqlUsuario);
            $consultaUsuario->execute(["nombre" => $nombre, "apellido" => $apellido, "claveHash" => $claveHash, "cedula" => $cedula]);

            switch ($rol) {
                case "Administrador":
                    //Si anteriormente era Logística, primero se eliminan sus cargos porque CARGO depende de LOGISTICA
                    $sqlCargo = "DELETE FROM CARGO WHERE cedula = :cedula";
                    $consultaCargo = $this->conexion->prepare($sqlCargo);
                    $consultaCargo->execute(["cedula" => $cedula]);

                    //Elimina el posible rol Logística
                    $sqlLogistica = "DELETE FROM LOGISTICA WHERE cedula = :cedula";
                    $consultaLogistica = $this->conexion->prepare($sqlLogistica);
                    $consultaLogistica->execute(["cedula" => $cedula]);

                    //Comprueba si ya es Administrador
                    $sqlBuscarAdministrador = "SELECT cedula FROM ADMINISTRADOR WHERE cedula = :cedula";
                    $consultaBuscarAdministrador = $this->conexion->prepare($sqlBuscarAdministrador);
                    $consultaBuscarAdministrador->execute(["cedula" => $cedula]);
                    $administrador = $consultaBuscarAdministrador->fetch(PDO::FETCH_ASSOC);

                    //Si todavía no era Administrador, registra el nuevo rol
                    if ($administrador === false) {
                        $sqlAdministrador = " INSERT INTO ADMINISTRADOR (cedula) VALUES (:cedula)";
                        $consultaAdministrador = $this->conexion->prepare($sqlAdministrador);
                        $consultaAdministrador->execute(["cedula" => $cedula]);
                    }
                    break;
                case "Logística":
                    //Elimina el posible rol Administrador
                    $sqlAdministrador = "DELETE FROM ADMINISTRADOR WHERE cedula = :cedula";
                    $consultaAdministrador = $this->conexion->prepare($sqlAdministrador);
                    $consultaAdministrador->execute(["cedula" => $cedula]);

                    //Comprueba si ya pertenece a Logística
                    $sqlBuscarLogistica = "SELECT cedula FROM LOGISTICA WHERE cedula = :cedula";
                    $consultaBuscarLogistica = $this->conexion->prepare($sqlBuscarLogistica);
                    $consultaBuscarLogistica->execute(["cedula" => $cedula]);
                    $logistica = $consultaBuscarLogistica->fetch(PDO::FETCH_ASSOC);

                    //Si todavía no era Logística, registra el nuevo rol
                    if ($logistica === false) {
                        $sqlLogistica = "INSERT INTO LOGISTICA (cedula) VALUES (:cedula)";
                        $consultaLogistica = $this->conexion->prepare($sqlLogistica);
                        $consultaLogistica->execute(["cedula" => $cedula]);
                    }

                    break;
                default:
                    $this->conexion->rollBack();
                    return false;
            }

            $this->conexion->commit();
            return true;

        } catch (PDOException $error) {
            if ($this->conexion->inTransaction()) {
                $this->conexion->rollBack();
            }

            return false;
        }
    }
}