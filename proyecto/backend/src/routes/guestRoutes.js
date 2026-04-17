const express = require('express');
const router = express.Router();

const guestController = require('../controllers/guestController');

router.post('/datos-personales', guestController.guardarDatosPersonales);

router.post('/simulacion', guestController.simularCredito);

module.exports = router;