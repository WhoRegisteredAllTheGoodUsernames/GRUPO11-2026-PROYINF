const sql = {
	"crearUser": "INSERT INTO public.user (rut, pass, \"primer-nombre\", \"segundo-nombre\", \"apellido-paterno\", \"apellido-materno\", tipo, \"fecha-nacimiento\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
	"crearCliente": "INSERT INTO public.cliente (rut) VALUES ($1)",
	"crearBancario": "INSERT INTO public.bancario (rut, cargo) VALUES ($1, $2)",
	"obtenerDatosCliente": `
		SELECT salario, rubro, genero, email, telefono, scoring
		FROM cliente
		WHERE rut = $1
	`,
};

module.exports = sql;
