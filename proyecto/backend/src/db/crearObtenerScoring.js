const sql = {
	"crearScoring": `
		INSERT INTO "funcion-crediticia"
		(funcion, "fecha-modificacion", "rut-bancario-modificador")
		VALUES ($1, $2, $3)
	`,
	"obtenerScoring": `
		SELECT id, funcion, "rut-bancario-modificador", "fecha-modificacion"
		FROM "funcion-crediticia" ORDER BY "fecha-modificacion" DESC LIMIT 1
	`,
};

module.exports = sql;
