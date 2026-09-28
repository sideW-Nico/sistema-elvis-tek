/**
 * CONSTANTES Y VARIABLES NECESARIAS
 */

//Ruta base de la API
//CUIDADO = La ruta es relativa al lugar donde se cargó el HTML
const API_USUARIOS = "./api/usuarios.php";

//Constantes para el cuadro de diálogo
const btnAltaUsuario = document.getElementById("btnAltaUsuario");
const btnCerrarGestionarUsuario = document.getElementById("btnCerrarGestionarUsuario");
const dialogGestionarUsuario = document.querySelector(".dialogGestionarUsuario");

//Constante para trabajar con la tabla de usuarios
const cuerpoTablaUsuarios = document.getElementById("cuerpoTablaUsuarios");

//Constante para manipular el formulario
const formularioGestionarUsuario = document.getElementById("formularioGestionarUsuario");

//Campos del formulario
const entradaCedula = document.getElementById("cedula");
const entradaNombre = document.getElementById("nombre");
const entradaApellido = document.getElementById("apellido");
const entradaCargo = document.getElementById("cargo");

//Auxiliar para saber si se está agregando o modificando un usuario
let usuarioEnEdicion = false;


/**
 * GESTIÓN DEL ESTADO DEL FORMULARIO / MODAL
 */

//Limpia todos los campos y configuraciones seleccionadas del formulario
function limpiarEstadoGestionarUsuario() {
    usuarioEnEdicion = false;
    entradaCedula.readOnly = false;
    formularioGestionarUsuario.reset();
}

//Abre el modal para dar de alta un nuevo usuario
function abrirAltaUsuario() {
    limpiarEstadoGestionarUsuario();

    dialogGestionarUsuario.showModal();
}

//Cierra el modal
function cerrarGestionarUsuario() {
    limpiarEstadoGestionarUsuario();

    dialogGestionarUsuario.close();
}


/**
 * OBTENCIÓN DE DATOS DEL FORMULARIO
 */

//Captura los datos ingresados en el formulario
function obtenerDatosFormularioUsuario() {
    const cedula = entradaCedula.value.trim();
    const nombre = entradaNombre.value.trim();
    const apellido = entradaApellido.value.trim();
    const cargo = entradaCargo.value;

    const usuario = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        cargo: cargo
    };

    return usuario;
}


/**
 * OPERACIONES CON LA API
 */


/**
 * GET - Obtiene todos los usuarios.
 */
async function obtenerUsuarios() {

    const respuesta = await fetch(API_USUARIOS);

    if (!respuesta.ok) {
        console.error("No se pudieron obtener los usuarios");
        return [];
    }

    const usuarios = await respuesta.json();

    return usuarios;
}



/**
 * GET - Obtiene un usuario específico mediante su cédula.
 */
async function obtenerUsuario(cedula) {

    const respuesta = await fetch(`${API_USUARIOS}?cedula=${encodeURIComponent(cedula)}`);

    if (!respuesta.ok) {
        console.error("No se pudo obtener el usuario");
        return null;
    }

    const usuario = await respuesta.json();

    return usuario;
}


/**
 * POST -Envía un nuevo usuario a la API.
 */
async function guardarUsuario(usuario) {

    const respuesta = await fetch(API_USUARIOS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    });

    if (!respuesta.ok) {
        console.error("No se pudo guardar el usuario");
        return false;
    }

    return true;
}


/**
 * PUT- Modifica los datos de un usuario existente.
 */
async function modificarUsuario(usuario) {

    const respuesta = await fetch(
        `${API_USUARIOS}?cedula=${encodeURIComponent(cedula)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        }
    );

    if (!respuesta.ok) {
        console.error("No se pudo modificar el usuario");
        return false;
    }

    return true;
}


/**
 * DELETE - Elimina un usuario según su cédula.
 */
async function eliminarUsuario(cedula) {

    const respuesta = await fetch(
        `${API_USUARIOS}?cedula=${encodeURIComponent(cedula)}`,
        {
            method: "DELETE"
        }
    );

    if (!respuesta.ok) {
        console.error("No se pudo eliminar el usuario");
        return;
    }

    //Una vez eliminado, vuelve a consultar los datos al servidor
    actualizarTabla();
}

/**
 * GESTIÓN DE FILAS DE LA TABLA
 */

//Crea una fila de la tabla a partir de un usuario
function agregarFilaUsuario(usuario) {
    const fila = document.createElement("tr");

    const campoCedula = document.createElement("td");
    campoCedula.textContent = usuario.cedula;
    const campoNombre = document.createElement("td");
    campoNombre.textContent = usuario.nombre;
    const campoApellido = document.createElement("td");
    campoApellido.textContent = usuario.apellido;
    const campoCargo = document.createElement("td");
    campoCargo.textContent = usuario.cargo;


    const campoOperaciones = document.createElement("td");
    const cajaOperaciones = document.createElement("div");
    cajaOperaciones.classList.add("cajaOperaciones");


    const btnModificar = document.createElement("button");
    btnModificar.type = "button";
    btnModificar.textContent = "Modificar";
    btnModificar.classList.add("btnOperacion");

    btnModificar.addEventListener("click", () => abrirModificarUsuario(usuario.cedula));

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btnOperacion");

    btnEliminar.addEventListener("click", () => eliminarUsuario(usuario.cedula));

    cajaOperaciones.appendChild(btnModificar);
    cajaOperaciones.appendChild(btnEliminar);
    campoOperaciones.appendChild(cajaOperaciones);

    fila.appendChild(campoCedula);
    fila.appendChild(campoNombre);
    fila.appendChild(campoApellido);
    fila.appendChild(campoCargo);
    fila.appendChild(campoOperaciones);

    cuerpoTablaUsuarios.appendChild(fila);
}


/**
 * Solicita los usuarios nuevamente a la API y genera las filas.
 */
async function actualizarTabla() {
    //Elimina todas las filas actuales
    cuerpoTablaUsuarios.replaceChildren();

    // GET /api/usuarios
    const usuarios = await obtenerUsuarios();

    //Genera una fila por usuario
    for (const usuario of usuarios) {
        agregarFilaUsuario(usuario);
    }
}

async function abrirModificarUsuario(cedula) {

    usuarioEnEdicion = true;

    // GET /api/usuarios/{cedula}
    const usuarioAModificar = await obtenerUsuario(cedula);

    //Si el usuario no existe o hubo un error
    if (usuarioAModificar === null) {
        return;
    }

    //Se cargan en el formulario los datos recibidos desde la API.
    entradaCedula.value = usuarioAModificar.cedula;
    entradaNombre.value = usuarioAModificar.nombre;
    entradaApellido.value = usuarioAModificar.apellido;
    entradaCargo.value = usuarioAModificar.cargo;
    entradaCedula.readOnly = true;

    dialogGestionarUsuario.showModal();
}


/**
 * Decide si debe realizarse un POST o un PUT dependiendo del estado del formulario.
 */
async function gestionarUsuario(eventoFormulario) {
    eventoFormulario.preventDefault();
    const usuario = obtenerDatosFormularioUsuario();

    if (!usuarioEnEdicion) { // POST /api/usuarios
        const guardadoCorrectamente = await guardarUsuario(usuario);
        if (!guardadoCorrectamente) {
            return;
        }
    }
    else { //PUT /api/usuarios/{cedula}
        const modificadoCorrectamente = await modificarUsuario(usuario);
        if (!modificadoCorrectamente) {
            return;
        }
    }
    cerrarGestionarUsuario();
    await actualizarTabla();
}


/**
 * EVENTOS
 */

//Alta o modificación de usuarios
formularioGestionarUsuario.addEventListener("submit", gestionarUsuario);

//Abrir modal de alta
btnAltaUsuario.addEventListener("click", abrirAltaUsuario);

//Cerrar modal
btnCerrarGestionarUsuario.addEventListener("click", cerrarGestionarUsuario);

//Al presionar Escape se limpia el estado del formulario
dialogGestionarUsuario.addEventListener("cancel", limpiarEstadoGestionarUsuario);

// GET /api/usuarios
actualizarTabla();

/**
 * 1. Se invoca al método actualizar tabla
 * 2. actualizarTabla retorna una promesa instantaneamente en estado pending
 * 3. Se sigue ejecutando el código. En este caso no hace más nada.
 * 4. En actualizarTabla, se invoca el método obtenerUsuarios que retorna una promesa en estado pending.
 * 5. El código se detiene por el await.
 * 6. En obtenerUsuarios() se realiza un fetch, retornando una promesa en estado pending.
 * 7. El código se detiene por el await del fetch.
 * 8. Se recibe una respuesta del fetch y cambia su estado a fulfilled.
 * 9. Asumiendo que ok === true, solicita la respuesta en formato json.
 * 10. El código se detiene por el await del response.json().
 * 11. Asumiendo que la promesa devuelve el estado fullfiled, se almacena en la variable usuarios y es retornado.
 * 12. En actualizarTabla() se almacena la promesa resultante de obtenerUsuarios().
 * 13. Se cargan individualmente los datos que se encuentran dentro de la promesa.
 * 14. La función asincrónica actualizarTabla finaliza.
 */