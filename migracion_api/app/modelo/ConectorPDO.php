<?php
//Instalación del driver https://www.php.net/manual/en/pdo.installation.php
//LEER ATENTAMENTE CÓMO SE CONFIGURA TANTO EN LINUX COMO EN WINDOWS
//Especificar en php.ini el extension_dir (debe apuntar a ext) y la extension pdo_mysql para este caso

class ConectorPDO {
    private string $servername;
    private int $port;
    private string $username;
    private string $password;
    private string $dbname;
    private ?PDO $conexion = null;

    //Atributo donde se almacenará la instancia única de la clase
    //?self = ?ConectorPDO
    private static ?self $instancia = null;

    //El constructor pasa a ser privado y nunca referenciado directamente, puede usar protected para casos de herencia/polimorfismo.
    private function __construct(string $servername, int $port, string $username, string $password, string $dbname) {
        $this->servername = $servername;
        $this->port = $port;
        $this->username = $username;
        $this->password = $password;
        $this->dbname = $dbname;
        $this->conexion = null;
    }

    /**
     * Espacio donde se previene la serialización del objeto debido a que la deserialización genera una copia sobre una nueva instancia.
     * https://www.php.net/manual/en/function.serialize.php
     */

    //Por convención se restringe la posibilidad de clonar el objeto mediante convenciones semi despreciadas
    private function __clone(): void {}

    //Se previene la manipulación del objeto para que no pueda ser deserializado mediante convenciones semi despreciadas
    public function __wakeup(): void
    {
        throw new Exception("No se puede deserializar un Singleton.");
    }

    //Se evita la posibilidad de serializar un objeto
    public function __serialize(): array
    {
        throw new LogicException(
            "El objeto no puede serializarse."
        );
    }

    //Se evita la posibilidad de deserializar un objeto
    public function __unserialize(array $data): void
    {
        throw new LogicException(
            "El objeto no puede deserializarse."
        );
    }

    public static function obtenerInstancia(string $servername, int $port, string $username, string $password, string $dbname): ConectorPDO
    {
        if (self::$instancia === null) {
            self::$instancia = new self ($servername, $port, $username, $password, $dbname);
        }

        return self::$instancia;
    }

    public function establecerConexion(): PDO
    {
        //Si la conexión está funcionando, se la retorna directamente
        if ($this->conexion !== null) {
            return $this->conexion;
        }

        // Siguiendo la documentación y los parámetros definidos por el constructor de PDO, se crea la variable dsn
        // Como buena práctica se define el formato charset=utf8mb4 para evitar problemas con caracteres especiales o letras que ocupen un tamaño de más de un byte, ejemplo #3: https://www.php.net/manual/en/mysqlinfo.concepts.charset.php
        $dsn = "mysql:" . "host={$this->servername};" . "port={$this->port};" . "dbname={$this->dbname};" . "charset=utf8mb4";

        //Se sigue la estructura paramétrica definida por el constructor según la documentación
        $this->conexion = new PDO($dsn, $this->username, $this->password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

        return $this->conexion;
    }

    public function desconectar(): void
    {
        $this->conexion = null;
    }
}

//Código para depuración
//Si retorna código de error 500, cambiar DB_HOST="localhost" a DB_HOST="127.0.0.1"
/*
require_once __DIR__ . "/../../config/config.php";
$conectorPDO = ConectorPDO::obtenerInstancia($_ENV['DB_HOST'], (int) $_ENV['DB_PUERTO'], $_ENV['DB_USUARIO'], $_ENV['DB_CLAVE'], $_ENV['DB_NOMBRE']);
$conexion = $conectorPDO->establecerConexion(); 
echo $_ENV['DB_HOST'], (int) $_ENV['DB_PUERTO'], $_ENV['DB_USUARIO'], $_ENV['DB_CLAVE'], $_ENV['DB_NOMBRE'];
if (isset($conexion)) echo " Exito";
*/