document.getElementById("btnMenu").addEventListener("click", function () {

    document.querySelector(".listaNavegacion").style.display = "flex";
    document.querySelector(".btnCerrarMenu").style.display = "flex";
    document.querySelector(".btnMenu").style.display = "none";
});

document.getElementById("btnCerrarMenu").addEventListener("click", function () {

    document.querySelector(".listaNavegacion").style.display = "none";
    document.querySelector(".btnCerrarMenu").style.display = "none";
    document.querySelector(".btnMenu").style.display = "flex";
});