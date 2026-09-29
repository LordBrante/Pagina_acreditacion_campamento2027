//Activa los campos adicionales de la informacion de salud
const preguntasSalud = document.querySelectorAll(
    ".pregunta-salud-acompanante"
);
preguntasSalud.forEach((pregunta) => {
    const campoDetalle = document.getElementById(
        pregunta.dataset.campo
    );

    const entradaDetalle = document.getElementById(
        pregunta.dataset.entrada
    );

    function actualizarCampoSalud() {
        const respondioSi = pregunta.value === "si";

        campoDetalle.hidden = !respondioSi;
        entradaDetalle.required = respondioSi;

        if (!respondioSi) {
            entradaDetalle.value = "";
        }
    }

    pregunta.addEventListener(
        "change",
        actualizarCampoSalud
    );

    actualizarCampoSalud();
});

// Calcula el valor según la edad al comenzar el campamento
const entradaFechaAcompanante = document.getElementById(
    "fecha-acompanante"
);

const salidaValorAcompanante = document.getElementById(
    "valor-acompanante"
);

const fechaInicioCampamento = new Date(2027, 0, 8);

function actualizarValorAcompanante() {
    if (!entradaFechaAcompanante.value) {
        salidaValorAcompanante.textContent =
            "Seleccione la fecha de nacimiento";

        salidaValorAcompanante.dataset.valor = "0";
        return;
    }

    const partesFecha = entradaFechaAcompanante.value
        .split("-")
        .map(Number);

    const nacimiento = new Date(
        partesFecha[0],
        partesFecha[1] - 1,
        partesFecha[2]
    );

    if (nacimiento > fechaInicioCampamento) {
        salidaValorAcompanante.textContent =
            "Fecha de nacimiento no válida";

        salidaValorAcompanante.dataset.valor = "0";
        return;
    }

    let edad =
        fechaInicioCampamento.getFullYear() -
        nacimiento.getFullYear();

    const aunNoCumple =
        fechaInicioCampamento.getMonth() <
            nacimiento.getMonth() ||
        (
            fechaInicioCampamento.getMonth() ===
                nacimiento.getMonth() &&
            fechaInicioCampamento.getDate() <
                nacimiento.getDate()
        );

    if (aunNoCumple) {
        edad--;
    }

    const valor = edad <= 9 ? 10000 : 20000;

    salidaValorAcompanante.textContent =
        `$${valor.toLocaleString("es-CL")} (${edad} años)`;

    salidaValorAcompanante.dataset.valor = String(valor);
}

if (
    entradaFechaAcompanante &&
    salidaValorAcompanante
) {
    entradaFechaAcompanante.addEventListener(
        "change",
        actualizarValorAcompanante
    );

    actualizarValorAcompanante();
}