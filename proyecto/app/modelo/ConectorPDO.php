<?php
//Instalación del driver https://www.php.net/manual/en/pdo.installation.php
//LEER ATENTAMENTE CÓMO SE CONFIGURA TANTO EN LINUX COMO EN WINDOWS
//Especificar en php.ini el extension_dir (debe apuntar a ext) y la extension pdo_mysql para este caso
class ConectorPDO {
    private string $servername;
    private string $username;
    private string $password;
    private string $dbname;
    private ?PDO $conexion;

    public function __construct(string $servername, string $username, string $password, string $dbname) {
        $this->servername = $servername;
        $this->username = $username;
        $this->password = $password;
        $this->dbname = $dbname;
        $this->conexion = null;
    }

    public function establecerConexion(): ?PDO {
        try {
            $this->conexion = new PDO("mysql:host=$this->servername;dbname=$this->dbname", $this->username, $this->password);
            // set the PDO error mode to exception
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            //echo "Error al conectar..." . $e->getMessage();
            return null;
        }
        return $this->conexion;
    }

    public function desconectar() {
        $this->conexion = null;
    }
}

//Código para depuración
//require_once __DIR__ . "/../../config/config.php";
//$conectorPDO = new ConectorPDO ($_ENV['DB_HOST'] . ":" . $_ENV['DB_PUERTO'], $_ENV['DB_USUARIO'], $_ENV['DB_CLAVE'], $_ENV['DB_NOMBRE']);
//$ConectorPDO->establecerConexion();