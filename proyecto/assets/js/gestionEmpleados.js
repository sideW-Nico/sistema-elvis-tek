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
const entradaCargo = document.getElementById("cargo");

//Auxiliar para guardar datos vinculados la modificacion de un empleado
let filaEmpleadoEnEdicion = null;


/**
 * GESTION DEL ESTADO DEL FORMULARIO/MODAL
 */

//Limpia todos los campos y configuraciones seleccionadas del formulario
function limpiarEstadoGestionarEmpleado() {
    filaEmpleadoEnEdicion = null;
    entradaCedula.readOnly = false;
    formularioGestionarEmpleado.reset();
}

function abrirAltaEmpleado() {
    limpiarEstadoGestionarEmpleado();

    //Muestra el cuadro de diálogo o "modal"
    dialogGestionarEmpleado.showModal();
}

function cerrarGestionarEmpleado() {
    limpiarEstadoGestionarEmpleado();

    //Cierra el modal
    dialogGestionarEmpleado.close();
}

function abrirModificarEmpleado(empleado) {
    entradaCedula.value = empleado.cedula;
    entradaNombre.value = empleado.nombre;
    entradaApellido.value = empleado.apellido;
    entradaCargo.value = empleado.cargo;

    //Deshabilita la posibildad de modificar la cedula de identidad
    entradaCedula.readOnly = true;

    dialogGestionarEmpleado.showModal();
}

/**
 * OBTENCION Y RECUPERACION DE DATOS
 */

//Función que captura los datos del formulario de gestión de empleado. Guarda los valores en un objeto literal y retorna su resultado.
function obtenerDatosEmpleado() {
    const cedula = entradaCedula.value;
    const nombre = entradaNombre.value;
    const apellido = entradaApellido.value;
    const cargo = entradaCargo.value;

    const empleado = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        cargo: cargo
    };

    return empleado;
}

function recuperarDatosFilaEmpleado(filaEmpleado) {
    const cedula = filaEmpleado.cells[0].textContent;
    const nombre = filaEmpleado.cells[1].textContent;
    const apellido = filaEmpleado.cells[2].textContent;
    const cargo = filaEmpleado.cells[3].textContent;

    const empleado = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        cargo: cargo
    };

    return empleado;
}

/**
 * GESTION DE FILAS DE LA TABLA
 */

//Función dedicada a crear el nodo de la fila y sus hijos (Los datos)
function agregarFilaEmpleado(empleado) {
    const fila = document.createElement("tr");

    const campoCedula = document.createElement("td");
    campoCedula.textContent = empleado.cedula;

    const campoNombre = document.createElement("td");
    campoNombre.textContent = empleado.nombre;

    const campoApellido = document.createElement("td");
    campoApellido.textContent = empleado.apellido;

    const campoCargo = document.createElement("td");
    campoCargo.textContent = empleado.cargo;

    //Espacio para colocar los botones
    const campoOperaciones = document.createElement("td");

    const cajaOperaciones = document.createElement("div");
    cajaOperaciones.classList.add("cajaOperaciones");

    const btnModificar = document.createElement("button");
    btnModificar.type = "button";
    btnModificar.textContent = "Modificar";
    btnModificar.classList.add("btnOperacion");
    
    //Se agrega el evento para modificar la fila correspondiente
    btnModificar.addEventListener("click", modificarFilaEmpleado);


    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btnOperacion");

    //Se agrega el evento para eliminar la fila correspondiente
    btnEliminar.addEventListener("click", eliminarFilaEmpleado);

    //Agregar botones a la caja de operaciones
    cajaOperaciones.appendChild(btnModificar);
    cajaOperaciones.appendChild(btnEliminar);

    campoOperaciones.appendChild(cajaOperaciones);

    //Cargar todos los datos (td) a la fila (tr)
    fila.appendChild(campoCedula);
    fila.appendChild(campoNombre);
    fila.appendChild(campoApellido);
    fila.appendChild(campoCargo);
    fila.appendChild(campoOperaciones);

    cuerpoTablaEmpleados.appendChild(fila);
}

function eliminarFilaEmpleado(eventoBajaEmpleado) {
    //Referencia directamente al boton presionado
    const botonPresionado = eventoBajaEmpleado.currentTarget;

    //Trata de buscar la fila mas cercana, captura su fila por estar anidada en ella
    const filaEmpleado = botonPresionado.closest('tr');

    //Elimina el nodo del DOM.
    filaEmpleado.remove();
}

function modificarFilaEmpleado(eventoModificarEmpleado) {
    //Referencia directamente al boton presionado
    const botonPresionado = eventoModificarEmpleado.currentTarget;

    //Trata de buscar la fila mas cercana, captura su fila por estar anidada en ella
    const filaEmpleado = botonPresionado.closest('tr');

    //Guarda la fila del empleado con los datos originales
    filaEmpleadoEnEdicion = filaEmpleado;

    //Recupera los datos de la fila
    const empleado = recuperarDatosFilaEmpleado(filaEmpleado);

    //Abre el modal con el formulario enviando los datos del empleado
    abrirModificarEmpleado(empleado);
}

//En caso de ser una modificacion, actualiza la fila de la tabla en base al objeto literal 'empleado'
function actualizarFilaEmpleado(filaEmpleado, empleado) {
    filaEmpleado.cells[0].textContent = empleado.cedula;
    filaEmpleado.cells[1].textContent = empleado.nombre;
    filaEmpleado.cells[2].textContent = empleado.apellido;
    filaEmpleado.cells[3].textContent = empleado.cargo;
}

/**
 * FUNCIONALIDADES PRINCIPALES
 */

//Función centralizadora, se dedica a conectar las funcionalidades en cadena.
function ingresarEmpleado(eventoFormulario) {
    eventoFormulario.preventDefault();

    const empleado = obtenerDatosEmpleado();

    /**
     * Si filaEmpleadoEnEdicion es null, el formulario está en modo alta.
     * Si contiene una fila, el formulario está en modo modificación.
     */
    if (filaEmpleadoEnEdicion === null) {
        agregarFilaEmpleado(empleado);
    } else {
        actualizarFilaEmpleado(filaEmpleadoEnEdicion, empleado);
    }

    cerrarGestionarEmpleado();
}

/**
 * EVENTOS
 */

//Actualización de la tabla de Empleados al completar el formulario que se encuentra en el modal
formularioGestionarEmpleado.addEventListener("submit", ingresarEmpleado);

//Apertura y cierre del modal
btnAltaEmpleado.addEventListener("click", abrirAltaEmpleado);

btnCerrarGestionarEmpleado.addEventListener("click", cerrarGestionarEmpleado);

//Para hacer que al apretar escape tambien se eliminen los cambios del formulario, se puede usar el evento 'cancel'
dialogGestionarEmpleado.addEventListener("cancel", limpiarEstadoGestionarEmpleado);

