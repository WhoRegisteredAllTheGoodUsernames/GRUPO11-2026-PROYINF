const pdf = require("pdf-parse");


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
        genero: (() => {
            const g = get("GENERO");
            if (!g) return null;

            const val = g.toUpperCase();

            if (val.startsWith("M")) return "M";
            if (val.startsWith("F")) return "F";

            return "X";
        })(),
        profesion: get("PROFESION"),
        salario: getNumber("SALARIO"),
        antiguedad: getNumber("ANTIGUEDAD"),
        deuda: getNumber("MONTO_DEUDAS"),
        telefono: get("TELEFONO"),
        correo: get("CORREO"),
        dir: get("DIRECCION"),
        ciudad: get("CIUDAD"),
        //clasificacion: get("CLASIFICACION_REFERENCIAL"),
    };
}

module.exports = { parsePDF };