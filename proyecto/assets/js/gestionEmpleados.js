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
let empleadoEnEdicion = false;


/**
 * GESTION DEL ESTADO DEL FORMULARIO/MODAL
 */

//Limpia todos los campos y configuraciones seleccionadas del formulario
function limpiarEstadoGestionarEmpleado() {
    empleadoEnEdicion = false;
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

function abrirModificarEmpleado(cedula) {
    //Cambia el estado de la variable para indicar que el formulario es para modificar un empleado existente
    empleadoEnEdicion = true;

    const empleados = cargarEmpleadosGuardadosLocal();

    //Busca y retorna el primer empleado que coincida con la cedula
    const empleadoAModificar = empleados.find(empleado => { return empleado.cedula === cedula });

    //Si el empleado no existe por x razones, sale de la función evitando usar el modal
    if (empleadoAModificar === undefined) {
        //Esta sección se puede complementar con la apertura de un modal indicando un mensaje de error al usuario
        return;
    }

    entradaCedula.value = empleadoAModificar.cedula;
    entradaNombre.value = empleadoAModificar.nombre;
    entradaApellido.value = empleadoAModificar.apellido;
    entradaCargo.value = empleadoAModificar.cargo;

    //Deshabilita la posibildad de modificar la cedula de identidad
    entradaCedula.readOnly = true;

    dialogGestionarEmpleado.showModal();
}

/**
 * OBTENCION Y RECUPERACION DE DATOS
 */

//Carga los empleados guardados en el local storage
function cargarEmpleadosGuardadosLocal () {
    //Captura los empleados en formato string, la estructura se encuentra en JSON
    const empleadosGuardados = localStorage.getItem("empleados");

    //Si retorna null implica que el almacenamiento local está vacío o no existe ninguna llave con ese nombre
    if (empleadosGuardados === null) return [];

    /*
        Convierte los elementos en string que se encuentran en formato JSON a un objeto literal.
        El objeto literal "empleadosGuardados" almacena otros objetos literales, donde cada
        uno representa a un empleado.
    */
    return JSON.parse(empleadosGuardados);
}


//Función que captura los datos del formulario de gestión de empleado. Guarda los valores en un objeto literal y retorna su resultado.
function obtenerDatosFormularioEmpleado() {
    //La función trim recorta y quita espacios vacíos de un string
    const cedula = entradaCedula.value.trim();
    const nombre = entradaNombre.value.trim();
    const apellido = entradaApellido.value.trim();
    const cargo = entradaCargo.value;

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
    btnModificar.addEventListener("click", abrirModificarEmpleado(empleado.cedula));


    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btnOperacion");

    //Se agrega el evento para eliminar la fila correspondiente
    btnEliminar.addEventListener("click", eliminarEmpleadoLocal(empleado.cedula));

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

//Función que actualiza la tabla, se la utilizará siempre que se haga ABM
function actualizarTabla () {
    //Elimina todos los hijos que se encuentran dentro de la tabla
    cuerpoTablaEmpleados.replaceChildren();

    //Carga los empleados ubicados en localStorage como un array de objetos literales
    const empleados = cargarEmpleadosGuardadosLocal();

    //Recorre el array de empleados y crea una fila por cada empleado
    for (const empleado of empleados) {
        agregarFilaEmpleado(empleado);
    }

}

function eliminarEmpleadoLocal(cedula) {
    const empleados = cargarEmpleadosGuardadosLocal();

    //Crea un nuevo array donde sólo están los empleados que no coinciden con la cédula especificada
    const empleadosActualizados = empleados.filter(empleado => { return empleado.cedula !== cedula });

    //Guarda el nuevo array en el localStorage
    actualizarEmpleadosLocal(empleadosActualizados);
    actualizarTabla();
}

function modificarEmpleadoLocal (empleadoEnFormulario) {
    const empleados = cargarEmpleadosGuardadosLocal();

    const empleadoAModificar = empleados.find(empleado => { return empleado.cedula === empleadoEnFormulario.cedula });

    //Si el empleado no existe por x razones, deteniendo el proceso
    if (empleadoAModificar === undefined) {
        //Esta sección se puede complementar con la apertura de un modal indicando un mensaje de error al usuario
        return;
    }

    empleadoAModificar.nombre = empleadoEnFormulario.nombre;
    empleadoAModificar.apellido = empleadoEnFormulario.apellido;
    empleadoAModificar.cargo = empleadoEnFormulario.cargo;
    
    //Guarda el nuevo array en el localStorage
    actualizarEmpleadosLocal(empleados);
}

/**
 * FUNCIONALIDADES PRINCIPALES
 */

function actualizarEmpleadosLocal(empleados) {
    localStorage.setItem("empleados", JSON.stringify(empleados));
}

function guardarEmpleadoLocal(empleado) {
    const empleados = cargarEmpleadosGuardadosLocal();

    const cedulaExistente = empleados.some((empleadoGuardado) => { return empleadoGuardado.cedula === empleado.cedula });

    //Sale de la función si la cedula ya existe
    if (cedulaExistente) {
        //Esta sección se puede complementar con la apertura de un modal indicando un mensaje de error al usuario
        return;
    }

    //Agrega un objeto literal a la colección de empleados
    empleados.push(empleado);

    actualizarEmpleadosLocal(empleados);
}

//Función centralizadora, se dedica a conectar las funcionalidades en cadena.
function gestionarEmpleado(eventoFormulario) {
    eventoFormulario.preventDefault();

    const empleado = obtenerDatosFormularioEmpleado();

    /**
     * Si empleadoEnEdicion es false, el formulario está en modo alta.
     * Si es true, el formulario está en modo modificación.
     */
    if (!empleadoEnEdicion) {
        guardarEmpleadoLocal(empleado);
    } else {
        modificarEmpleadoLocal(empleado);
    }

    cerrarGestionarEmpleado();
    actualizarTabla();
}

/**
 * EVENTOS
 */

//Actualización de la tabla de Empleados al completar el formulario que se encuentra en el modal
formularioGestionarEmpleado.addEventListener("submit", gestionarEmpleado);

//Apertura y cierre del modal
btnAltaEmpleado.addEventListener("click", abrirAltaEmpleado);

btnCerrarGestionarEmpleado.addEventListener("click", cerrarGestionarEmpleado);

//Para hacer que al apretar escape tambien se eliminen los cambios del formulario, se puede usar el evento 'cancel'
dialogGestionarEmpleado.addEventListener("cancel", limpiarEstadoGestionarEmpleado);

actualizarTabla();