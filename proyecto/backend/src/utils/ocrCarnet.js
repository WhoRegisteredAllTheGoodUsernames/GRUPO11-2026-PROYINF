// USAREMOS TESSERACT PARA EL OCR
const Tesseract = require("tesseract.js");

async function leerCarnet(pathImagen) {

    const resultado = await Tesseract.recognize(
        pathImagen,
        "spa"
    );

    const text = resultado.data.text;

    console.log("\n--- TEXTO OCR ---\n");
    console.log(text);

    // -----------------------------------
    // LIMPIAR LÍNEAS
    // -----------------------------------
    const lineas = text
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

    console.log("\n--- LÍNEAS ---\n");
    console.log(lineas);

    // -----------------------------------
    // RUT
    // -----------------------------------
    const rutMatch = text.match(
        /\d{1,2}\.\d{3}\.\d{3}-[\dkK]/
    );

    const rut = rutMatch
        ? rutMatch[0]
        : null;

    // -----------------------------------
    // FILTRAR POSIBLES NOMBRES
    // -----------------------------------
    const ignorar = [
        "REPUBLICA DE CHILE",
        "REPÚBLICA DE CHILE",
        "RUN",
        "NUMERO DOCUMENTO",
        "DOCUMENTO",
        "FECHA",
        "NACIONALIDAD",
        "CHILENA",
        "FIRMA",
        "TITULAR",
        "APELLIDOS",
        "NOMBRES",
    ];

    const posiblesNombres = lineas.filter(linea => {

        // Debe tener letras
        if (!/[A-ZÁÉÍÓÚÑ]/i.test(linea)) {
            return false;
        }

        // Ignorar labels conocidos
        if (
            ignorar.some(p =>
                linea.toUpperCase().includes(p)
            )
        ) {
            return false;
        }

        // Ignorar líneas con muchos números
        if ((linea.match(/\d/g) || []).length > 3) {
            return false;
        }

        return true;
    });

    console.log("\n--- POSIBLES NOMBRES ---\n");
    console.log(posiblesNombres);

    // -----------------------------------
    // NOMBRE
    // -----------------------------------
    const nombreCompleto = posiblesNombres
        .slice(0, 3)
        .join(" ")
        .replace(/[^A-ZÁÉÍÓÚÑ\s]/gi, "")
        .replace(/\s+/g, " ")
        .trim();

    // -----------------------------------
    // GÉNERO
    // -----------------------------------
    let genero = null;

    // Caso explícito
    if (/SEXO\s*F/i.test(text)) {
        genero = "F";
    }

    else if (/SEXO\s*M/i.test(text)) {
        genero = "M";
    }

    // Texto completo
    else if (/FEMENINO/i.test(text)) {
        genero = "F";
    }

    else if (/MASCULINO/i.test(text)) {
        genero = "M";
    }

    // Fallback OCR flexible
    else {

        const generoMatch = text.match(
            /\b([MF])\b/
        );

        if (generoMatch) {
            genero = generoMatch[1];
        }
    }

    // -----------------------------------
    // RESULTADO FINAL
    // -----------------------------------
    const datos = {
        nombre: nombreCompleto || null,
        rut,
        genero,
    };

    console.log("\n--- DATOS EXTRAÍDOS ---\n");
    console.log(datos);

    return datos;
}

module.exports = { leerCarnet };
