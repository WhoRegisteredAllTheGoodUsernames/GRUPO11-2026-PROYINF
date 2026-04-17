// src/controllers/resultadoSimulacion.js
// src/controllers/resultadoSimulacion.js
const pool = require("../db/db");
const sql = require("../db/crearSimulacion");

async function resultadoSimulacion(req, res) {
  try {
    // Verificar login
    if (!req.session.user) {
      return res.status(401).send("Debes iniciar sesión para ver esta página");
    }

    // Obtener simulación desde sesión
    let resultado = req.session.simulacion || req.session.simulacionPendiente;

    if (!resultado) {
      console.log("⚠️ No hay simulación disponible en la sesión");
      return res.status(404).send("No hay resultados de simulación disponibles");
    }

    // 🔹 Guardar en la BD si aún no tiene ID
    if (!resultado.id) {
      const rut_cliente = req.session.user.rut;
      const functScoring = { id: 1 }; // temporal, ajusta si usas tabla real

      console.log("💾 Guardando simulación en la base de datos...");
      const insert = await pool.query(
        sql["crearSimulacion"],
        [
          resultado.fecha,
          resultado.monto,
          resultado.numero_cuotas,
          resultado.tasa_interes,
          resultado.scoring_requerido,
          rut_cliente,
          functScoring.id,
          resultado.seguro,
        ]
      );

      const idSimulacion = insert.rows[0].id;
      resultado.id = idSimulacion;

      // Actualizar la sesión para futuras vistas
      req.session.simulacion = resultado;
      delete req.session.simulacionPendiente;

      console.log(`✅ Simulación guardada correctamente con ID ${idSimulacion}`);
    }

    // Enviar al frontend
    console.log("📤 Enviando resultados de simulación al frontend");
    return res.json({
      success: true,
      resultado,
      idSimulacion: resultado.id || null
    });

  } catch (error) {
    console.error("❌ Error al obtener resultado de simulación:", error);
    return res.status(500).send("Error al obtener resultado de simulación");
  }
}

module.exports = resultadoSimulacion;
