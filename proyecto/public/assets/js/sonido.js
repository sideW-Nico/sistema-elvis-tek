
const pato = document.getElementById("patoAudio");
const halloween = document.getElementById("halloweenAudio");

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function sonido() {
    if (getRandomInt(10) = 3) {
        pato.play();
    } else { halloween.play(); }
}

document.addEventListener("click", sonido);

