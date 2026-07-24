/*
    Espacio donde se deberán colocar todas las insercciones utilizadas en la primer ejecución del programa para el testeo.
*/

INSERT INTO USUARIO (cedula, claveHash) VALUES ('11111111', '$2y$12$Qx.Sy1xPSYPmoNRiqf8gCO8JDSu7J/Z7rbOVJ6rsBCQRHConc4rdS');

/*
    "clave1234567" ~ "$2y$12$Qx.Sy1xPSYPmoNRiqf8gCO8JDSu7J/Z7rbOVJ6rsBCQRHConc4rdS"

    El hash se recuperó con el siguiente script para crear el primer usuario en el sistema
    Nota: En el futuro se deberían cargar por un usuario administrador

    <?php
        $return = password_hash("clave1234567", PASSWORD_DEFAULT);
        echo($return);
    ?>
*/

