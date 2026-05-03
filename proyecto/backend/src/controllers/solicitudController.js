// src/controllers/solicitudController.js
const pool = require('../db/db');
const scoring = require('./aplicarScoring');
const modeloScoring = require('../models/scoring');
const { parsePDF } = require('../utils/pdfParser');

/**
 * Controlador para mostrar los datos de una simulación y permitir iniciar la solicitud.
 * Ruta asociada: GET /solicitud/:idSimulacion
 */
const verSimulacion = async (req, res) => {
  try {
    // Verificar que el usuario haya iniciado sesión
    if (!req.session.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const idSimulacion = req.params.idSimulacion;
    const rutCliente = req.session.user.rut;

    // Buscar la simulación en la base de datos
    const result = await pool.query(
      'SELECT * FROM "simulacion-prestamo" WHERE id = $1 AND "rut-cliente" = $2',
      [idSimulacion, rutCliente]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Simulación no encontrada o no pertenece al usuario' });
    }

    // Enviar los datos al frontend
    const simulacion = result.rows[0];
    res.status(200).json({
      message: 'Simulación encontrada',
      simulacion,
    });

  } catch (error) {
    console.error('Error en verSimulacion:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const subirPDFCliente = async (req, res) => {
  try {
    // 1️⃣ Verificar sesión
    if (!req.session.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // 2️⃣ Verificar archivo
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo PDF' });
    }

    // 3️⃣ Procesar PDF
    const datos = await parsePDF(req.file.buffer);

    // 4️⃣ Retornar datos extraídos
    res.status(200).json({
      message: 'PDF procesado correctamente',
      datos
    });

  } catch (error) {
    console.error('Error en subirPDFCliente:', error);
    res.status(500).json({ error: 'Error al procesar el PDF' });
  }
};




/*
Este controlador es para ver y actualizar ciertos datos del cliente y poder re calcular el scoring personal.
precarga todos los datos para un forms donde puede o no modificarlos el user antes de seguir
*/
const verDatosCliente = async (req, res) => {
  try {
    // 1️⃣ Verificar sesión activa
    if (!req.session.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const rutCliente = req.session.user.rut;

    // 2️⃣ Consultar datos actuales del cliente
    const result = await pool.query(
      'SELECT rut, salario, rubro, genero, email, telefono, scoring FROM cliente WHERE rut = $1',
      [rutCliente]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const cliente = result.rows[0];

    // 3️⃣ Retornar los datos al frontend (para rellenar formulario)
    res.status(200).json({
      message: 'Datos del cliente obtenidos correctamente',
      cliente
    });

  } catch (error) {
    console.error('Error en verDatosCliente:', error);
    res.status(500).json({ error: 'Error interno al obtener los datos del cliente' });
  }
};

/*
Este controlador es para ver y actualizar ciertos datos del cliente y poder re calcular el scoring personal.
precarga todos los datos para un forms donde puede o no modificarlos el user antes de seguir
*/
const actualizarDatosYScoring = async (req, res) => {
  try {
    // 1️⃣ Verificar que el usuario esté autenticado
    if (!req.session.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const rutCliente = req.session.user.rut;
    const idSimulacion = req.params.idSimulacion;

    // 2️⃣ Obtener los datos enviados desde el formulario
    const { salario, rubro, genero, email, telefono } = req.body;

    // 3️⃣ Actualizar los campos modificados del cliente
    await pool.query(
      `UPDATE cliente
       SET salario = $1,
           rubro = $2,
           genero = $3,
           email = $4,
           telefono = $5
       WHERE rut = $6`,
      [salario, rubro, genero, email, telefono, rutCliente]
    );

    // 4️⃣ Recalcular el scoring del cliente usando el método ya existente
    //⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
    //const nuevoScoring = await aplicarScoring(rutCliente);
    //⚠️⚠️⚠️⚠️OJOOOOO QUEDÓ COMENTADA MIENTRAS SE IMPLEMENTA LA FUNCÍON. POR AHORA ES VALOR FIJO⚠️⚠️⚠️
	  const nuevoScoring = scoring.aplicarScoringCliente({
		  "salario": Number(salario),
		  "rubro": rubro,
		  "genero": genero,
		  //"monto": monto,
		  //"seguro": seguro,
	  });

    console.log("🧩 Datos recibidos para recalcular scoring:", {
      salario,
      rubro,
      genero,
      rutCliente,
    });
    console.log("🧮 Scoring calculado:", nuevoScoring);
    // 5️⃣ Guardar el nuevo scoring en la tabla cliente
    await pool.query(
      'UPDATE cliente SET scoring = $1 WHERE rut = $2',
      [nuevoScoring, rutCliente]
    );

    console.log(`Nuevo scoring calculado para ${rutCliente}: ${nuevoScoring}`);

    // 6️⃣ Redirigir a la siguiente etapa (confirmar solicitud)
    res.redirect(`/solicitud/${idSimulacion}/confirmar`);

  } catch (error) {
    console.error('Error en actualizarDatosYScoring:', error);
    res.status(500).json({ error: 'Error interno al actualizar datos y recalcular scoring' });
  }
};

/**
 * Muestra los datos de la simulación junto con el scoring actual del cliente.
 * Permite confirmar o cancelar la solicitud.
 */
const confirmarSolicitud = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const idSimulacion = req.params.idSimulacion;
    const rutCliente = req.session.user.rut;

    // 1️⃣ Obtener datos de la simulación
    const simulacionResult = await pool.query(
      'SELECT * FROM "simulacion-prestamo" WHERE id = $1 AND "rut-cliente" = $2',
      [idSimulacion, rutCliente]
    );

    if (simulacionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Simulación no encontrada o no pertenece al usuario' });
    }

    const simulacion = simulacionResult.rows[0];

    // 2️⃣ Obtener el scoring actual del cliente
    const clienteResult = await pool.query(
      'SELECT scoring FROM cliente WHERE rut = $1',
      [rutCliente]
    );

    const scoringCliente = clienteResult.rows[0]?.scoring ?? null;

    // 3️⃣ Enviar datos al frontend
    res.status(200).json({
      message: 'Datos listos para confirmar solicitud',
      simulacion,
      scoringCliente
    });

  } catch (error) {
    console.error('Error en confirmarSolicitud:', error);
    res.status(500).json({ error: 'Error al preparar confirmación de solicitud' });
  }
};


/*
Este controlador procesa la confirmación de la solicitud de crédito.
Compara el scoring del cliente con el requerido y guarda el resultado en la tabla prestamo.
*/
const procesarConfirmacion = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const rutCliente = req.session.user.rut;
    const idSimulacion = req.params.idSimulacion;

    console.log(`📩 Procesando confirmación de solicitud para cliente RUT: ${rutCliente}, simulación ID: ${idSimulacion}`);

    // 1️⃣ Obtener datos de simulación y scoring del cliente
    const sim = await pool.query(
      'SELECT * FROM "simulacion-prestamo" WHERE id = $1 AND "rut-cliente" = $2',
      [idSimulacion, rutCliente]
    );

    if (sim.rows.length === 0) {
      console.warn(`⚠️ No se encontró la simulación con ID ${idSimulacion} para el cliente ${rutCliente}`);
      return res.status(404).json({ error: 'Simulación no encontrada o no pertenece al usuario' });
    }

    const simulacion = sim.rows[0];
    
    //---------- bloque para obtener los datos del cliente cuando se confirme el prestamo por scoring-------------------------
    //        necesarios para pasar a la firma virtual
    const clienteData = await pool.query(
      `SELECT 
          c.scoring, 
          c.email, 
          u."primer-nombre", 
          u."apellido-paterno"
      FROM cliente c
      INNER JOIN "user" u ON c.rut = u.rut 
      WHERE c.rut = $1`, 
      [rutCliente]
    );
    if (clienteData.rows.length === 0){
      return res.status(404).json({error : 'Datos del cliente no encontrados'} );
    }
    const datosCliente = clienteData.rows[0];
    // -------------------------------------------------------------------------------------------------------
    
    // 🧩 Normalizar valores cualitativos (seguro, rubro, etc.) usando el mismo diccionario global
    const valoresCualitativos = modeloScoring.valoresCualitativos;

    // 🔹 Normalizar seguro
    console.log("Simulación cargada desde BD:", simulacion);
    let seguroNormalizado = simulacion.seguro;
    const dicSeguro = valoresCualitativos["seguro"];

    if (dicSeguro && dicSeguro[seguroNormalizado] === undefined) {
      console.warn(`⚠️ Valor de seguro no reconocido ("${seguroNormalizado}"), se guardará como "Nada".`);
      if (dicSeguro["Nada"] !== undefined) seguroNormalizado = "Nada";
    }

    const cliente = await pool.query('SELECT scoring FROM cliente WHERE rut = $1', [rutCliente]);
    const scoringCliente = cliente.rows[0].scoring;
    const scoringRequerido = simulacion['scoring-requerido'];

    console.log(`📊 Scoring cliente: ${scoringCliente} | Scoring requerido: ${scoringRequerido}`);

    // 2️⃣ Comparar scoring y decidir estado
    const aprobado = scoringCliente >= scoringRequerido;
    const estadoAprobacion = aprobado ? 'Aprobado' : 'Rechazado';

    console.log(
      aprobado
        ? `✅ Solicitud aprobada (scoring ${scoringCliente} >= ${scoringRequerido})`
        : `❌ Solicitud rechazada (scoring ${scoringCliente} < ${scoringRequerido})`
    );

    // 3️⃣ Insertar nuevo registro en la tabla prestamo
    const insertResult = await pool.query(
      `INSERT INTO prestamo (
          fecha, monto, "numero-cuotas", "tasa-interes",
          "scoring-requerido", "scoring-cliente", "estado-aprobacion",
          "estado-pago", "rut-cliente", 
          /* "id-cuenta-destino", */ 
          "id-funcion-crediticia", seguro
      )
      VALUES (NOW(), $1, $2, $3, $4, $5, $6, 'Pendiente', $7, 
              /* 1, */ 
              $8, $9)
      RETURNING *`, // 👈 esta línea es esencial
      [
        simulacion.monto,
        simulacion['numero-cuotas'],
        simulacion['tasa-interes'],
        scoringRequerido,
        scoringCliente,
        estadoAprobacion,
        rutCliente,
        /* valor eliminado: id de cuenta destino (antes era 1), */
        simulacion['id-funcion-crediticia'],
        seguroNormalizado
      ]
    );

    const nuevoPrestamo = insertResult.rows[0];


// DEJE ESTE BLOQUE COMENTADO PARA PODER AGREGAR TAMBIEN LOS DATOS DEL CLIENTE
// SON NECESARIOS EN LA FIRMA VIRTUAL
/*

    console.log(`💾 Registro insertado en tabla 'prestamo' con estado: ${estadoAprobacion}`);

    // 4️⃣ Devolver resultado desde la tabla prestamo
    res.status(200).json({
      message: `Solicitud procesada: ${estadoAprobacion}`,
      prestamo: nuevoPrestamo
    });

  } catch (error) {
        console.error('❌ Error en procesarConfirmacion:', error);
        res.status(500).json({
            error: 'Error al procesar la confirmación de solicitud',
            detalle: error.message,       // 👈 muestra el mensaje real del error
            stack: error.stack            // 👈 opcional: muestra la traza completa
        });
    }


*/
// Bloque para obtener los datos desde la tabla prestamo y los datos del cliente asociado
    const prestamoConDatosCliente = {
      ...nuevoPrestamo,
      nombre_cliente :`${datosCliente['primer-nombre']} ${datosCliente['apellido-paterno']}`, 
      email_cliente : datosCliente.email
    };
    console.log("Registro insertado, enviando respuesta con datos de cliente")
    res.status(200).json({
      message: `Solicitud procesada: ${estadoAprobacion}`,
      prestamo: prestamoConDatosCliente
    });
  }catch {
    console.error("Erroe en procesarConfirmacion", error);
    res.status(500).json({
      error: 'error al procesar la confirmacion',
      detalle: error.message
    });
  }

};






module.exports = {
  verSimulacion,
  verDatosCliente,
  actualizarDatosYScoring,
  confirmarSolicitud,
  procesarConfirmacion,
  subirPDFCliente
};
