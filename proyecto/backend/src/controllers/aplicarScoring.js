const pool = require("../db/db");
const sql = require("../db/crearObtenerScoring");
const scoring = require("../models/scoring");
const utilsTipos = require("../utils/verificarTipos");

// Sólo soporta funciones lineales

const descFactoresRegEx = new RegExp(/([+-]?)([0-9.]*)([a-zA-Z_]+)?/, "g"); 

function descomponerFuncion(funct){
	const componentes = {};
	// El arreglo es de la forma:
	// ["matcheo1", "grupo1 en matcheo1", "grupo2 en matcheo1", "grupo3 en matcheo1",
	// "matcheo2" ...]
	const factoresGrupos = [...funct.matchAll(descFactoresRegEx)];
	for (const match of factoresGrupos){
		if (match[0] == "") break;

		const signo = match[1],
			paramStr = match[2] ? match[2] : "1",
			variableStr = match[3];
		const param = Number(signo + paramStr);

		// Se asume que sólo hay 1 constante en la fórmula
		if (variableStr == ""){
			componentes["constante"] = param;
		} else {
			const variable = variableStr.replaceAll("_", "-");
			if (scoring.variablesPrestamo[variable] == undefined) throw `La variable ${variable} no está soportada`;

			componentes[variable] = param;
		}
	}

	componentes["constante"] ??= 0;

	return componentes;
}

function handleValorString(variable, valor) {
	if (!utilsTipos.esCualitativa(variable))
		throw `La variable ${variable} no es cualitativa`;

	const cualitativa = scoring.valoresCualitativos[variable];
	let valorMapeado = cualitativa[valor];

	if (valorMapeado === undefined){
		if (utilsTipos.admiteValorNada(variable)){
			console.warn(`⚠️ Valor no reconocido para ${variable} ("${valor}"), se usará "Nada".`);
			return cualitativa["Nada"];
		} else {
			throw `La variable ${variable} no admite el valor ${valor}`;
		}
	}

	return valorMapeado;
}

function obtenerSumaFuncion(funct, valores) {
	let acumulador = 0;

	for (const [variable, param] of Object.entries(funct)) {
		if (variable === "constante") {
			acumulador += param;
			continue;
		}

		let valor = valores[variable];
		if (valor === undefined) throw `Falta el valor para la variable ${variable}`;

		if (utilsTipos.esString(valor)) {
			valor = handleValorString(variable, valor);
		}

		const aporte = param * valor;
		acumulador += aporte;
	}

	return acumulador;
}


async function obtenerUltimoScoring(){
	try {
		const result = await pool.query(sql["obtenerScoring"]);

		if (result.rows.length == 0) return {}

		return result.rows[0];
	} catch (err) {
		console.error(err);
	}
}

function aplicarScoring(funct, valores){
	const functDesc = descomponerFuncion(funct);
	return obtenerSumaFuncion(functDesc, valores);
}

function aplicarScoringCliente(valores){
	return obtenerSumaFuncion(scoring.scoringCliente, valores);
}

async function registrarScoring(data){
	try {
		await pool.query(sql["crearScoring"], data);
	} catch (err) {
		console.error(err);
	}
}

module.exports = {
	"obtenerUltimoScoring": obtenerUltimoScoring,
	"aplicarScoring": aplicarScoring,
	"aplicarScoringCliente": aplicarScoringCliente,
	"registrarScoring": registrarScoring
};
