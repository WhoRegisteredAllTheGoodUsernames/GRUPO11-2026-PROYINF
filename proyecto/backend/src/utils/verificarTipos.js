const scoring = require("../models/scoring");

function esString(x){
	if (typeof x === "string" || x instanceof String) return true;
	return false;
}

function esCualitativa(variable){
	return scoring.valoresCualitativos[variable] !== undefined;
}

function admiteValorNada(variable){
	return esCualitativa(variable) && scoring.valoresCualitativos[variable]["Nada"] !== undefined;
}

// Lo dejo como lista por si se quieren agregar más métodos
module.exports = {
	"esString": esString,
	"esCualitativa": esCualitativa,
	"admiteValorNada": admiteValorNada
}
