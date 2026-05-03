// npm install pdf-parse@1.1.1

const pdf = require("pdf-parse");
const fs = require("fs");

async function parsePDF(buffer) {
    const data = await pdf(buffer);
    const text = data.text;

    const get = (label) => {
        const regex = new RegExp(`${label}\\s*([^\\n]+)`);
        const match = text.match(regex);
        return match ? match[1].trim() : null;
    };

    const getNumber = (label) => {
        const value = get(label);
        return value ? parseInt(value.replace(/[^\d]/g, ""), 10) : null;
    };

    return {
        nombre: get("NOMBRE"),
        rut: get("RUT"),
        genero: get("GENERO"),
        profesion: get("PROFESION"),
        salario: getNumber("SALARIO"),
        antiguedad: getNumber("ANTIGUEDAD"),
        deuda: getNumber("MONTO_DEUDAS"),
        telefono: get("TELEFONO"),
        correo: get("CORREO"),
        dir: get("DIRECCION"),
        ciudad: get("CIUDAD"),

        clasificacion: get("CLASIFICACION_REFERENCIAL"),
    };
}

// --- TEST ---
(async () => {
    const buffer = fs.readFileSync(
        "C:/Users/nncc2/OneDrive/Documentos/Proyecto INGESOF/proyecto/Test_PDFS/Documentos/Informe_216520459.pdf"
    );

    const resultado = await parsePDF(buffer);
    console.log(resultado);
})();