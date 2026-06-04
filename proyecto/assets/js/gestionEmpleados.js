//Constantes para el cuadro de diálogo
const btnAltaEmpleado = document.getElementById("btnAltaEmpleado");
const btnCerrarAltaEmpleado = document.getElementById("btnCerrarAltaEmpleado");
const dialogAltaEmpleado = document.querySelector(".dialogAltaEmpleado");

//Constante para trabajar con la tabla de empleados
const cuerpoTablaEmpleados = document.getElementById("cuerpoTablaEmpleados");

//Constante para manipular el formulario, especialmente limpiarlo
const formularioAltaEmpleado = document.getElementById("formularioAltaEmpleado");

function abrirAltaEmpleado () {
    //Muestra el cuadro de diálogo o "modal"
    dialogAltaEmpleado.showModal();
}

//Limpia todos los campos y configuracione seleccionadas del formulario
function limpiarFormularioAltaEmpleado() {
    formularioAltaEmpleado.reset();
}

function cerrarAltaEmpleado () {
    limpiarFormularioAltaEmpleado();
    //Cierra el modal
    dialogAltaEmpleado.close();
}

//Función que captura los datos del formulario de alta empleado. Guarda los valores en un objeto literal y retorna su resultado.
function obtenerDatosEmpleado() {
    const cedula = document.getElementById("cedula").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const cargo = document.getElementById("cargo").value;

    const empleado = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        cargo: cargo
    };

    return empleado;
}

//Función dedidcada a crear el nodo de la fila y sus hijos (Los datos)
function agregarFilaEmpleado (empleado) {
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

    const btnModificar = document.createElement("button");
    btnModificar.type = "button";
    btnModificar.textContent = "Modificar";
    btnModificar.classList.add("botonOperacion")

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("botonOperacion")

    //Agregar botones al campo de operaciones
    campoOperaciones.appendChild(btnModificar);
    campoOperaciones.appendChild(btnEliminar);

    //Cargar todos los datos (td) a la fila (tr)
    fila.appendChild(campoCedula);
    fila.appendChild(campoNombre);
    fila.appendChild(campoApellido);
    fila.appendChild(campoCargo);
    fila.appendChild(campoOperaciones);

    cuerpoTablaEmpleados.appendChild(fila);
}

//Función centralizadora, se dedica a conectar las funcionalidades en cadena.
function ingresarEmpleado (eventoFormulario) {
    eventoFormulario.preventDefault();

    const empleado = obtenerDatosEmpleado();

    agregarFilaEmpleado(empleado);

    cerrarAltaEmpleado ();
}

//Apertura y cierre del modal
btnAltaEmpleado.addEventListener("click", abrirAltaEmpleado);
btnCerrarAltaEmpleado.addEventListener("click", cerrarAltaEmpleado);
//Para hacer que al apretar escape tambien se eliminen los cambios del formulario, se puede usar el evento 'cancel'
dialogAltaEmpleado.addEventListener("cancel", limpiarFormularioAltaEmpleado);

//Actualización de la tabla de Empleados al completar el formulario que se encuentra en el modal
formularioAltaEmpleado.addEventListener("submit", ingresarEmpleado);

