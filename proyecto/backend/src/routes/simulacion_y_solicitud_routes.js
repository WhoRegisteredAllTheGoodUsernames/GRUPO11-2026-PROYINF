const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({

	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},

	filename: (req, file, cb) => {
		cb(
			null,
			Date.now() + '-' + file.originalname
		);
	}
});

const upload = multer({ storage });


const registrarSimulacion = require('../controllers/registrarSimulacion');
const resultadoSimulacion = require('../controllers/resultadoSimulacion');
const solicitudController = require('../controllers/solicitudController');

// --------------------------
// ETAPA 1: Simulación
// --------------------------
router.post('/simulacion', async (req, res) => {
	try {
		await registrarSimulacion(req, res);
	} catch (error) {
		console.error('Error al registrar simulación:', error);
		res.status(500).send('Error al registrar simulación');
	}
});

router.get('/resultadoSimulacion', resultadoSimulacion);

// --------------------------
// ETAPA 2: Ver simulación y comenzar solicitud
// --------------------------
router.get('/solicitud/:idSimulacion', async (req, res) => {
	try {
		await solicitudController.verSimulacion(req, res);
	} catch (error) {
		console.error('Error al obtener simulación:', error);
		res.status(500).send('Error al obtener simulación');
	}
});

// --------------------------
// ETAPA 3: Datos cliente + cálculo de scoring
// --------------------------
router.get('/solicitud/:idSimulacion/datos', async (req, res) => {
	try {
		await solicitudController.verDatosCliente(req, res);
	} catch (error) {
		console.error('Error al obtener datos del cliente:', error);
		res.status(500).send('Error al obtener datos del cliente');
	}
});

router.post('/solicitud/:idSimulacion/datos', async (req, res) => {
	try {
		await solicitudController.actualizarDatosYScoring(req, res);
	} catch (error) {
		console.error('Error al actualizar datos y scoring:', error);
		res.status(500).send('Error al actualizar datos y scoring');
	}
});
// Lectura de documentos
router.post(
	'/solicitud/:idSimulacion/pdf',

	upload.fields([
		{ name: 'carnet', maxCount: 1 },
		{ name: 'liquidacion', maxCount: 1 },
		{ name: 'antiguedad', maxCount: 1 },
	]),

	async (req, res) => {
		try {

			await solicitudController.subirPDFCliente(req, res);

		} catch (error) {

			console.error('Error al procesar documentos:', error);

			res.status(500).send(
				'Error al procesar documentos'
			);
		}
	}
);

// --------------------------
// ETAPA 4: Confirmar solicitud y evaluar aprobación
// --------------------------
router.get('/solicitud/:idSimulacion/confirmar', async (req, res) => {
	try {
		await solicitudController.confirmarSolicitud(req, res);
	} catch (error) {
		console.error('Error al preparar confirmación de solicitud:', error);
		res.status(500).send('Error al preparar confirmación de solicitud');
	}
});

router.post('/solicitud/:idSimulacion/confirmar', async (req, res) => {
	try {
		await solicitudController.procesarConfirmacion(req, res);
	} catch (error) {
		console.error('Error al procesar confirmación de solicitud:', error);
		res.status(500).send('Error al procesar confirmación de solicitud');
	}
});


module.exports = router;
