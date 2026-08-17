/**
 * CONSTANTES Y VARIABLES NECESARIAS
 */

//Constantes para el cuadro de diálogo
const btnAltaEmpleado = document.getElementById("btnAltaEmpleado");
const btnCerrarGestionarEmpleado = document.getElementById("btnCerrarGestionarEmpleado");
const dialogGestionarEmpleado = document.querySelector(".dialogGestionarEmpleado");

//Constante para trabajar con la tabla de empleados
const cuerpoTablaEmpleados = document.getElementById("cuerpoTablaEmpleados");

//Constante para manipular el formulario, especialmente limpiarlo
const formularioGestionarEmpleado = document.getElementById("formularioGestionarEmpleado");

//Campos del formulario
const entradaCedula = document.getElementById("cedula");
const entradaNombre = document.getElementById("nombre");
const entradaApellido = document.getElementById("apellido");
const entradaClave = document.getElementById("clave");
const entradaConfirmarClave = document.getElementById("confirmarClave");
const entradaRol = document.getElementById("rol");

//Estado para saber si se está modificando o dando de alta
let modoFormulario = "";

//Recupera a través del DOM todos los botones de cada fila. Retorna la colección de elementos.
const formularios = document.querySelectorAll(".formularioEliminarEmpleado");


/**
 * GESTION DEL ESTADO DEL FORMULARIO/MODAL
 */

//Limpia todos los campos y configuraciones seleccionadas del formulario
function limpiarEstadoGestionarEmpleado() {
    modoFormulario = "";
    entradaCedula.readOnly = false;
    formularioGestionarEmpleado.reset();
}

function abrirAltaEmpleado() {
    entradaCedula.readOnly = false;
    formularioGestionarEmpleado.reset();
    modoFormulario = "alta";

    //Muestra el cuadro de diálogo o "modal"
    dialogGestionarEmpleado.showModal();
}

function cerrarGestionarEmpleado() {
    entradaCedula.readOnly = false;
    formularioGestionarEmpleado.reset();
    modoFormulario = "";
    //Cierra el modal
    dialogGestionarEmpleado.close();
}

function confirmarEliminación (eventoEliminar) {
    //Mensaje de confirmación, se puede reemplazar por cuadros de diálogo (IMPLEMENTAR EN UN FUTURO)
    const confirmacion = confirm("¿Está seguro de eliminar usuario?");

    if (!confirmacion) {
        eventoEliminar.preventDefault();
    }
}

//Función que escucha los clicks de la tabla, si es proveniente del botón empleado abre el modal
function abrirModificarEmpleado(eventoModificar) {
    //Captura el valor del botón "Modificar"
    const btnModificar = eventoModificar.target.closest(".btnModificar");

    //Si el botón no se presionó, se sale de la función
    if (btnModificar === null) {
        return;
    }

    //Captura la fila en la que se encuentra el botón
    const fila = btnModificar.closest("tr");

    entradaCedula.readOnly = true;
    formularioGestionarEmpleado.reset();
    modoFormulario = "modificar";

    //Escribe los datos del empleado provenientes de la fila en el formulario
    entradaCedula.value = fila.cells[0].textContent.trim();
    entradaNombre.value = fila.cells[1].textContent.trim();
    entradaApellido.value = fila.cells[2].textContent.trim();
    entradaRol.value = fila.cells[3].textContent.trim();

    //Muestra el cuadro de diálogo o "modal"
    dialogGestionarEmpleado.showModal();
}

function gestionarEmpleado (evento) {
    if (modoFormulario === "alta") {
        formularioGestionarEmpleado.action = "procesarAltaUsuario.php";
    } else if (modoFormulario === "modificar") {
        formularioGestionarEmpleado.action = "procesarModificarUsuario.php";
    } else {
        evento.preventDefault();
    }
}

//Apertura y cierre del modal
btnAltaEmpleado.addEventListener("click", abrirAltaEmpleado);
cuerpoTablaEmpleados.addEventListener("click", abrirModificarEmpleado);

btnCerrarGestionarEmpleado.addEventListener("click", cerrarGestionarEmpleado);

//Para hacer que al apretar escape tambien se eliminen los cambios del formulario, se puede usar el evento 'cancel'
dialogGestionarEmpleado.addEventListener("cancel", limpiarEstadoGestionarEmpleado);

formularioGestionarEmpleado.addEventListener("submit", gestionarEmpleado);

//Agrega a cada botón eliminar el evento
for (const formulario of formularios) {
    formulario.addEventListener("submit", confirmarEliminación);
}