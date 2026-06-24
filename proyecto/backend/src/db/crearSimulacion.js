// sql = {
//   "crearSimulacion": `
//     INSERT INTO "simulacion-prestamo"
//     (fecha, monto, "numero-cuotas", "tasa-interes", "scoring-requerido", "rut-cliente", "id-funcion-crediticia", seguro)
//     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//     RETURNING id;
//   `,
// };

// module.exports = sql;


const sql = {
  "crearSimulacion": `
    INSERT INTO "simulacion-prestamo"
    (fecha, monto, "numero-cuotas", "tasa-interes", "scoring-requerido", "rut-cliente", "id-funcion-crediticia", seguro)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id;
  `,
};

module.exports = sql;

