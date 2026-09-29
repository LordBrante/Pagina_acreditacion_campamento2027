// Preguntas que muestran un campo adicional al responder Sí
const preguntasCondicionales = [
    {
        selectId: "tiene-alergias",
        campoId: "campo-detalle-alergias",
        inputId: "detalle-alergias"
    },
    {
        selectId: "tiene-enfermedad",
        campoId: "campo-detalle-enfermedad",
        inputId: "detalle-enfermedad"
    },
    {
        selectId: "toma-medicamentos",
        campoId: "campo-detalle-medicamentos",
        inputId: "detalle-medicamentos"
    },
    {
        selectId: "restriccion-alimentaria",
        campoId: "campo-detalle-alimentacion",
        inputId: "detalle-alimentacion"
    }
];

preguntasCondicionales.forEach((pregunta) => {
    const seleccion = document.getElementById(
        pregunta.selectId
    );

    const campoDetalle = document.getElementById(
        pregunta.campoId
    );

    const entradaDetalle = document.getElementById(
        pregunta.inputId
    );

    if (
        !seleccion ||
        !campoDetalle ||
        !entradaDetalle
    ) {
        return;
    }

    function actualizarCampo() {
        const respondioSi =
            seleccion.value === "si";

        campoDetalle.hidden = !respondioSi;
        entradaDetalle.required = respondioSi;

        if (!respondioSi) {
            entradaDetalle.value = "";
        }
    }

    seleccion.addEventListener(
        "change",
        actualizarCampo
    );

    actualizarCampo();
});

// Muestra el mensaje relacionado con los acompañantes
const seleccionAcompanantes = document.getElementById(
    "tiene-acompanantes"
);

const seccionAcompanantes = document.getElementById(
    "seccion-acompanantes"
);

function actualizarSeccionAcompanantes() {
    const agregaraAcompanantes =
        seleccionAcompanantes.value === "si";

    seccionAcompanantes.hidden =
        !agregaraAcompanantes;
}

if (
    seleccionAcompanantes &&
    seccionAcompanantes
) {
    seleccionAcompanantes.addEventListener(
        "change",
        actualizarSeccionAcompanantes
    );

    actualizarSeccionAcompanantes();
}

// Calcula el valor de la acreditación principal
const entradaFechaNacimiento = document.getElementById(
    "fecha-nacimiento"
);

const salidaValorAcreditacion = document.getElementById(
    "valor-acreditacion"
);

const fechaInicioCampamento = new Date(2027, 0, 8);

function actualizarValorAcreditacion() {
    if (!entradaFechaNacimiento.value) {
        salidaValorAcreditacion.textContent =
            "Seleccione la fecha de nacimiento";

        salidaValorAcreditacion.dataset.valor = "0";
        return;
    }

    const partesFecha = entradaFechaNacimiento.value
        .split("-")
        .map(Number);

    const nacimiento = new Date(
        partesFecha[0],
        partesFecha[1] - 1,
        partesFecha[2]
    );

    if (nacimiento > fechaInicioCampamento) {
        salidaValorAcreditacion.textContent =
            "Fecha de nacimiento no válida";

        salidaValorAcreditacion.dataset.valor = "0";
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

    const valor =
        edad <= 9 ? 10000 : 20000;

    salidaValorAcreditacion.textContent =
        `$${valor.toLocaleString("es-CL")} (${edad} años)`;

    salidaValorAcreditacion.dataset.valor =
        String(valor);
}

if (
    entradaFechaNacimiento &&
    salidaValorAcreditacion
) {
    entradaFechaNacimiento.addEventListener(
        "change",
        actualizarValorAcreditacion
    );

    actualizarValorAcreditacion();
}
// Guarda el perfil y decide el siguiente paso
const formularioAcreditacion = document.getElementById(
    "formulario-acreditacion"
);

if (formularioAcreditacion) {
    formularioAcreditacion.addEventListener(
        "submit",
        (evento) => {
            evento.preventDefault();

            const valorAcreditacion = Number(
                salidaValorAcreditacion.dataset.valor
            );

            if (valorAcreditacion === 0) {
                alert(
                    "Selecciona una fecha de nacimiento válida."
                );

                return;
            }

            const datosFormulario = new FormData(
                formularioAcreditacion
            );

            const datosPersonaPrincipal =
                Object.fromEntries(
                    datosFormulario.entries()
                );

            // La contraseña no se guarda en el navegador
            delete datosPersonaPrincipal.contrasena;

            datosPersonaPrincipal.valorAcreditacion =
                valorAcreditacion;

            sessionStorage.setItem(
                "personaPrincipalCampamento",
                JSON.stringify(datosPersonaPrincipal)
            );

            if (
                datosPersonaPrincipal.tieneAcompanantes ===
                "si"
            ) {
                window.location.href =
                    "acompanantes.html";

                return;
            }

            sessionStorage.removeItem(
                "acompanantesCampamento"
            );

            window.location.href =
                "resumen.html";
        }
    );
}