import { back_dir } from "../backend";
import { useState } from "react";
import Navbar from "./navbar";

export default function GuestModeSimulacion() {
  const [tasa, setTasa] = useState(1.32);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimular = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const datos = {
      monto: Number(formData.get("monto")),
      cuotas: Number(formData.get("cuotas")),
      tasa: Number(tasa) / 100,
      seguro: formData.get("seguro"),
    };

    try {
      const res = await fetch(`${back_dir}/guestMode/simulacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(datos),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al simular");
      }

      setResultado(data);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#CCCDD2",
            padding: "30px",
            borderRadius: "18px",
            width: "min(90%, 700px)",
          }}
        >
          <h1 style={{ textAlign: "center", color: "#1C142E" }}>
            Simulación Guest Mode
          </h1>

          {!resultado && (
            <form onSubmit={handleSimular}>
              <p><strong>Monto</strong></p>
              <input required name="monto" type="number" style={inputStyle} />

              <p><strong>Cuotas</strong></p>
              <input required name="cuotas" type="number" style={inputStyle} />

              <p><strong>Seguro</strong></p>

              <div style={{ marginBottom: "10px" }}>
                <input type="radio" name="seguro" value="Desgravamen" defaultChecked />
                <span style={{ marginLeft: "10px" }}>Desgravamen</span>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <input type="radio" name="seguro" value="Nada" />
                <span style={{ marginLeft: "10px" }}>Nada</span>
              </div>

              <p><strong>Tasa de interés</strong></p>

              <input
                type="range"
                min="1"
                max="20"
                step="0.01"
                value={tasa}
                onChange={(e) => setTasa(e.target.value)}
                style={{ width: "100%" }}
              />

              <p style={{ fontWeight: "bold" }}>{tasa}%</p>

              <button type="submit" disabled={loading} style={buttonStyle}>
                {loading ? "Procesando..." : "Simular"}
              </button>
            </form>
          )}

          {resultado && (
            <div style={{ marginTop: "25px", textAlign: "center" }}>
              <h2>
                {resultado.estado === "Aprobado"
                    ? "Si creas una cuenta con nosotros, este crédito tendría alta probabilidad de aprobación."
                    : "Actualmente este crédito requeriría una evaluación adicional al crear una cuenta con nosotros."}
                </h2>
              <p><strong>Scoring cliente:</strong> {resultado.scoringCliente}</p>
              <p><strong>Scoring requerido:</strong> {resultado.scoringRequerido}</p>

            <button
            onClick={() => window.location.href = "/"}
            style={buttonStyle}
            >
            Volver al inicio
            </button>
            </div>
          )}
        </div>
      </main>

      <footer
        style={{
          backgroundColor: "#272D48",
          color: "white",
          textAlign: "center",
          padding: "20px 0",
        }}
      >
        © 2025 Préstamos de Consumo Digital
      </footer>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #ddd",
  borderRadius: "4px",
};

const buttonStyle = {
  marginTop: "20px",
  width: "100%",
  padding: "12px",
  backgroundColor: "#312F55",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};