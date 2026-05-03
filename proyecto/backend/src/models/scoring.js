// Variables:
// - Monto
// - Plazo
// - Tasa de interés
// - Cuota
//
// - Edad
// - Rubro
// - Salario
// - Genero
//
// - Nivel educativo
// - Antiguedad laboral
// - Estado civil
// - Dependientes
// - Tipo de vivienda
// - Tipo de contrato
//
// Fuente: Diseño de un modelo de scoring para el otorgamiento de crédito
// 	de consumo en una compañía de financiamiento colombiana
// Autores: L Arango Duque, D Restrepo Baena
// Url: https://repository.eafit.edu.co/server/api/core/bitstreams/cbbb78b3-7658-4583-b339-cacb72ff1ca4/content
// Nota: Sólo se consideran las variables que afectan a la función del modelo
// 	de scoring y que son recolectadas por el formulario de info del cliente.

// Estructura:
// 	{
// 		"variable1": parametro1,
// 		"variable2": parametro2,
// 		...
// 	}
// 	NOTA: Lo dejaré solo dependiente de los datos del cliente. Esto no afecta
// 		cuando se llama la función que la aplica con más parámetros.
const scoringCliente = {
	"salario": 1,
	"rubro": 1,
	"genero": 1,
	//"monto": 1,
	//"seguro": 1,
};

// Estructura:
// 	{
// 		"variable1": {
// 			"valorCualitativo1": valorCuantitativo1,
// 			"valorCualitativo2": valorCuantitativo2,
// 			...
// 		},
// 		"variable2": {...}
// 		...
// 	}
const valoresCualitativos = {
	"seguro": {
		"Desgravamen": 1,
		"Nada": 2,
	},
	"rubro": {
		"Abogado": 1,
		"Abogada": 1,
		"Doctor": 2,
		"Doctora": 2,
		"Ingeniero": 1,
		"Ingeniera": 1,
		"Arquitecto": 1,
		"Arquitecta": 1,
		"Contador": 2,
		"Contadora": 2,
		"Profesor": 2,
		"Profesora": 2,
		"Enfermero": 2,
		"Enfermera": 2,
		"Tecnico": 3,
		"Tecnica": 3,
		"Programador": 1,
		"Programadora": 1,
		"Analista": 2,
		"Administrador": 2,
		"Administradora": 2,
		"Comerciante": 3,
		"Vendedor": 3,
		"Vendedora": 3,
		"Chofer": 3,
		"Conductor": 3,
		"Conductora": 3,
		"Obrero": 3,
		"Obrera": 3,
		"Construccion": 3,
		"Mecanico": 3,
		"Mecanica": 3,
		"Electricista": 3,
		"Gasfiter": 3,
		"Carpintero": 3,
		"Carpintera": 3,
		"Agricultor": 4,
		"Agricultora": 4,
		"Pescador": 4,
		"Pescadora": 4,
		"Minero": 4,
		"Minera": 4,
		"Independiente": 4,
		"Freelancer": 4,
		"Dueño de negocio": 2,
		"Dueña de negocio": 2,
		"Empresario": 1,
		"Empresaria": 1,
		"Gerente": 1,
		"Ejecutivo": 1,
		"Ejecutiva": 1,
		"Desempleado": 5,
		"Desempleada": 5,
		"Estudiante": 5,
		"Jubilado": 4,
		"Jubilada": 4,
		"Nada": 5
	},
	"genero": {
		"F": 1,
		"M": 2,
		"X": 3,
	}
}

// Se utilizan sólo las llaves, para ver si se soporta la variable
// Se podría agregar una estructura con las descripciones y tipos,
// 	para pasarlas al frontend y mostrar la lista de variables soportadas
// 	dinámicamente. Haría más limpia la expansión
const variablesPrestamo = {
	"monto": 0,
	"numero-cuotas": 0,
	"tasa-interes": 0,
	"seguro": 0,
};

module.exports = {
	"scoringCliente": scoringCliente,
	"valoresCualitativos": valoresCualitativos,
	"variablesPrestamo": variablesPrestamo,
};
