const fs = require("fs");
const PdfReader = require("pdfreader").PdfReader;


function calcularMesesAntiguedad(fechaTexto) {

    const meses = {
        enero: 0,
        febrero: 1,
        marzo: 2,
        abril: 3,
        mayo: 4,
        junio: 5,
        julio: 6,
        agosto: 7,
        septiembre: 8,
        octubre: 9,
        noviembre: 10,
        diciembre: 11,
    };

    const match = fechaTexto.match(
        /(\d{1,2})\s+de\s+([a-z]+)\s+de\s+(\d{4})/i
    );

    if (!match) {
        return null;
    }

    const dia = parseInt(match[1]);
    const mes = meses[match[2].toLowerCase()];
    const anio = parseInt(match[3]);

    const fechaIngreso = new Date(anio, mes, dia);
    const hoy = new Date();

    const diferenciaMeses =
        (hoy.getFullYear() - fechaIngreso.getFullYear()) * 12 +
        (hoy.getMonth() - fechaIngreso.getMonth());

    return diferenciaMeses;
}

function readPDF(path) {

    return new Promise((resolve, reject) => {

        let text = "";

        new PdfReader().parseFileItems(path, (err, item) => {

            if (err) {
                reject(err);
            }

            else if (!item) {
                resolve(text);
            }

            else if (item.text) {
                text += item.text + "\n";
            }
        });
    });
}

function get(text, regex) {
    const match = text.match(regex);
    return match ? match[1].trim() : null;
}

function getNumber(text, regex) {

    const value = get(text, regex);

    return value
        ? parseInt(value.replace(/[^\d]/g, ""), 10)
        : null;
}

async function parsePDF(path, tipoDocumento) {

    const text = await readPDF(path);



    // -----------------------------------
    // LIQUIDACIÓN
    // -----------------------------------
    if (tipoDocumento === "liquidacion") {

        return {

            salario: getNumber(
                text,
                /Total a pagar:\s*\$?\s*([\d\.\,]+)/i
            ),
        };
    }

    // -----------------------------------
    // ANTIGÜEDAD
    // -----------------------------------
    if (tipoDocumento === "antiguedad") {

        const fechaAntiguedad = get(
            text,
            /desde el\s*([^\n\.]+)/i
        );

        return {

            profesion: get(
                text,
                /Cargo Actual:\s*([^\n]+)/i
            ),

            antiguedadTexto: fechaAntiguedad,

            antiguedadMeses: calcularMesesAntiguedad(
                fechaAntiguedad
            ),
        };
    }

    return null;
}


// --------------------------------------------------
// TESTS
// --------------------------------------------------
(async () => {

    // -----------------------------------
    // LIQUIDACIÓN
    // -----------------------------------
    const resultadoLiquidacion = await parsePDF(
        "C:/Users/nncc2/OneDrive/Documentos/Proyecto INGESOF/proyecto/Test_PDFS/Documentos/Liquidacion_216524509.pdf",
        "liquidacion"
    );

    console.log("\n--- RESULTADO LIQUIDACIÓN ---");
    console.log(resultadoLiquidacion);


    // -----------------------------------
    // ANTIGÜEDAD
    // -----------------------------------
    const resultadoAntiguedad = await parsePDF(
        "C:/Users/nncc2/OneDrive/Documentos/Proyecto INGESOF/proyecto/Test_PDFS/Documentos/AntiguedadLaboral_216524509.pdf",
        "antiguedad"
    );

    console.log("\n--- RESULTADO ANTIGÜEDAD ---");
    console.log(resultadoAntiguedad);

})();