const scoring = require('./aplicarScoring');

exports.guardarDatosPersonales = (req, res) => {
    const {
        remuneracionNetaMensual,
        antiguedadLaboral,
        deudaActualTotal,
        profesion,
        genero
    } = req.body;

    if (!remuneracionNetaMensual || Number(remuneracionNetaMensual) <= 0) {
        return res.status(400).json({ error: 'Remuneración inválida' });
    }

    if (antiguedadLaboral === undefined || Number(antiguedadLaboral) < 0) {
        return res.status(400).json({ error: 'Antigüedad laboral inválida' });
    }

    if (deudaActualTotal === undefined || Number(deudaActualTotal) < 0) {
        return res.status(400).json({ error: 'Deuda actual inválida' });
    }

    if (!profesion || profesion.trim() === '') {
        return res.status(400).json({ error: 'Profesión requerida' });
    }

    if (!['masculino', 'femenino', 'otro'].includes(genero.toLowerCase())) {
        return res.status(400).json({ error: 'Género inválido' });
    }

    req.session.guestData = req.body;

    return res.status(200).json({
        mensaje: 'Datos personales guardados'
    });
};


exports.simularCredito = async (req, res) => {
    try {
        const datosPersonales = req.session.guestData;

        if (!datosPersonales) {
            return res.status(400).json({
                error: 'Primero debes completar los datos personales'
            });
        }

        const { monto, cuotas, tasa, seguro } = req.body;

        if (!monto || !cuotas || !tasa) {
            return res.status(400).json({
                error: 'Faltan datos para la simulación'
            });
        }

        const montoNum = Number(monto);
        const cuotasNum = Number(cuotas);
        const tasaNum = Number(tasa);

        let genero = datosPersonales.genero;
        if (genero === 'masculino') genero = 'M';
        if (genero === 'femenino') genero = 'F';
        if (genero === 'otro') genero = 'X';

        let seguroFinal = seguro || 'Nada';
        if (seguroFinal === 'Sin seguro') seguroFinal = 'Nada';

        const scoringCliente = scoring.aplicarScoringCliente({
            salario: Number(datosPersonales.remuneracionNetaMensual),
            antiguedadLaboral: Number(datosPersonales.antiguedadLaboral),
            deudaActualTotal: Number(datosPersonales.deudaActualTotal),
            rubro: datosPersonales.profesion,
            genero: genero
        });

        const scoringRequerido = scoring.aplicarScoring(
            "20monto+seguro",
            {
                monto: montoNum,
                "numero-cuotas": cuotasNum,
                "tasa-interes": tasaNum,
                seguro: seguroFinal
            }
        );

        const aprobado = scoringCliente >= scoringRequerido;

        return res.status(200).json({
            scoringCliente,
            scoringRequerido,
            estado: aprobado ? "Aprobado" : "Rechazado"
        });

    } catch (error) {
        return res.status(500).json({
            error: String(error)
        });
    }
};