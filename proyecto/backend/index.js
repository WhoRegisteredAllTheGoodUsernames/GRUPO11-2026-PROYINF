const express = require('express');
const app = express();
require('dotenv').config();

const port = 3000;

const pool = require('./src/db/db'); // Importar la conexión
const iniciarMiddleware = require('./src/middlewares/iniciarMiddleware')
const crearTablas = require('./src/db/crearTablas')
const iniciarRutas = require('./src/routes/iniciarRutas')
const simulacionSolicitudRoutes = require('./src/routes/simulacion_y_solicitud_routes');
const docusignRutas = require('./src/routes/docusignRutas');
const historialSimRutas = require('./src/routes/historialSimRoutes');
const historialPrestamosRoutes = require("./src/routes/historialPrestamosRoutes");
//Nuevo para INGESOF:
const guestRoutes = require('./src/routes/guestRoutes');


crearTablas(pool);
iniciarMiddleware(express, app);
iniciarRutas(app);

app.use('/', simulacionSolicitudRoutes);
app.use('/historialSimulaciones', historialSimRutas);
app.use("/historialPrestamos", historialPrestamosRoutes);
app.use('/api/docusign', docusignRutas);
//Nuevo para INGESOF:
app.use('/guestMode', guestRoutes);




app.listen(port, () => {
    console.log(`App corriendo en http://localhost:${port}`);
});
