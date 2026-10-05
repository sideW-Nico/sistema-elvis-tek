/**
 * CONSTANTES Y VARIABLES NECESARIAS
 */

//Ruta base de la API
//CUIDADO = La ruta es relativa al lugar donde se cargó el HTML
const API_USUARIOS = "../index.php/usuarios.php?ruta=usuarios";
const API_LOGOUT = "../index.php/logout.php?ruta=logout";

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
const entradaClave = document.getElementById("clave");
const entradaConfirmarClave = document.getElementById("confirmarClave");
const entradaRol = document.getElementById("rol");

const btnCerrarSesion = document.getElementById("btnCerrarSesion");

//Auxiliar para saber si se está agregando o modificando un usuario
let usuarioEnEdicion = false;

async function cerrarSesion() {
    try {
        btnCerrarSesion.disabled = true;

        const respuesta = await fetch(API_LOGOUT,
            {
            method: "POST",
            headers: {
                "X-CSRF-Token": sessionStorage.getItem("csrfToken") ?? ""
            }
        });

        await leerRespuestaAPI(respuesta);

        // Se elimina el token local
        sessionStorage.removeItem("csrfToken");

        window.location.replace("./login.html");
    } catch (error) {
        window.alert(error.message);
    } finally {
        btnCerrarSesion.disabled = false;
    }
}

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
    const clave = entradaClave.value;
    const confirmarClave = entradaConfirmarClave.value;
    const rol = entradaRol.value;

    const usuario = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        clave: clave,
        confirmarClave: confirmarClave,
        rol: rol
    };

    return usuario;
}


/**
 * OPERACIONES CON LA API
 */


async function leerRespuestaAPI(respuesta) {
    const texto = await respuesta.text();

    //
    if (!texto.trim()) {
        throw new Error(`La API respondió sin cuerpo (HTTP ${respuesta.status}).`);
    }

    let json;
    try {
        json = JSON.parse(texto);
    } catch {
        throw new Error(`HTTP ${respuesta.status}: La API no devolvió JSON.`);
    }
    //

    if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}: ${json.mensaje ?? "La solicitud no se pudo completar."}`);
    }

    //Datos proviene de la estructura de la API en el controlador, donde respuesta JSON siempre envuelve todo bajo la clave "datos"
    return json.datos;
}


/**
 * GET - Obtiene todos los usuarios.
 */
async function obtenerUsuarios() {
    const respuesta = await fetch(API_USUARIOS);

    return await leerRespuestaAPI(respuesta);
}



/**
 * GET - Obtiene un usuario específico mediante su cédula.
 */
async function obtenerUsuario(cedula) {

    const respuesta = await fetch(
        //Se usa ampersand (&) para concatenar más datos al URL actual
        `${API_USUARIOS}&cedula=${encodeURIComponent(cedula)}`
    );

    return await leerRespuestaAPI(respuesta);
}


/**
 * POST -Envía un nuevo usuario a la API.
 */
async function altaUsuario(usuario) {

    const respuesta = await fetch(
        API_USUARIOS,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": sessionStorage.getItem("csrfToken") ?? ""
            },
            body: JSON.stringify(usuario)
        }
    );

    return await leerRespuestaAPI(respuesta);
}


/**
 * PUT- Modifica los datos de un usuario existente.
 */
async function modificarUsuario(usuario) {
    if (usuario.clave !== usuario.confirmarClave) {
        throw new Error("Las contraseñas ingresadas no coinciden");
    }

    const respuesta = await fetch(API_USUARIOS,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": sessionStorage.getItem("csrfToken") ?? ""
            },
            body: JSON.stringify({
                cedula: usuario.cedula,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                clave: usuario.clave,
                rol: usuario.rol
            })
        }
    );

    return await leerRespuestaAPI(respuesta);
}


/**
 * DELETE - Elimina un usuario según su cédula.
 */
async function eliminarUsuario(cedula) {
    if (!window.confirm(`¿Está seguro de eliminar al usuario ${cedula}?`)) {
        return;
    }

    try {
        const respuesta = await fetch(API_USUARIOS,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": sessionStorage.getItem("csrfToken") ?? ""
                },
                body: JSON.stringify({ cedula })
            }
        );

        const resultado = await leerRespuestaAPI(respuesta);

        await actualizarTabla();
        window.alert(`HTTP ${respuesta.status}: ${resultado.mensaje}`);
    } catch (error) {
        window.alert(error.message);
    }

    //Una vez eliminado, vuelve a consultar los datos al servidor

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
    const camporol = document.createElement("td");
    camporol.textContent = usuario.rol;


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
    fila.appendChild(camporol);
    fila.appendChild(campoOperaciones);

    cuerpoTablaUsuarios.appendChild(fila);
}


/**
 * Solicita los usuarios nuevamente a la API y genera las filas.
 */
async function actualizarTabla() {
    //Elimina todas las filas actuales
    cuerpoTablaUsuarios.replaceChildren();

    try {
        // GET /api/usuarios
        const usuarios = await obtenerUsuarios();

        //Genera una fila por usuario
        for (const usuario of usuarios) {
            agregarFilaUsuario(usuario);
        }
    } catch (error) {
        window.alert("No se pudieron cargar los usuarios: " + error);
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
    entradaRol.value = usuarioAModificar.rol;
    entradaCedula.readOnly = true;

    dialogGestionarUsuario.showModal();
}


/**
 * Decide si debe realizarse un POST o un PUT dependiendo del estado del formulario.
 */
async function gestionarUsuario(eventoFormulario) {
    eventoFormulario.preventDefault();

    try {
        const usuario = obtenerDatosFormularioUsuario();

        if (!usuarioEnEdicion) { // POST /api/usuarios
            await altaUsuario(usuario);
        }
        else { //PUT /api/usuarios/{cedula}
            const modificadoCorrectamente = await modificarUsuario(usuario);
            if (!modificadoCorrectamente) {
                return;
            }
        }

        cerrarGestionarUsuario();
        await actualizarTabla();
    } catch (error) {
        window.alert(error.message);
    }
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

btnCerrarSesion.addEventListener("click", cerrarSesion);

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