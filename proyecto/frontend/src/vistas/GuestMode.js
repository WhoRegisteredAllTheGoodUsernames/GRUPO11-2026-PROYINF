import { back_dir } from "../backend";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

export default function GuestMode() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    remuneracionNetaMensual: "",
    antiguedadLaboral: "",
    deudaActualTotal: "",
    profesion: "",
    genero: "masculino",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinuar = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${back_dir}/guestMode/datos-personales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar datos");
      }

      navigate("/guestModeSimulacion");
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#CCCDD2",
            padding: "30px",
            borderRadius: "18px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            width: "min(90%, 700px)",
          }}
        >
          <h1
            style={{
              color: "#1C142E",
              textAlign: "center",
              marginBottom: "25px",
            }}
          >
            Guest Mode
          </h1>

          <form onSubmit={handleContinuar}>
            <p><strong>Remuneración neta mensual</strong></p>
            <input
              required
              type="number"
              name="remuneracionNetaMensual"
              value={formData.remuneracionNetaMensual}
              onChange={handleChange}
              style={inputStyle}
            />

            <p><strong>Antigüedad laboral (meses)</strong></p>
            <input
              required
              type="number"
              name="antiguedadLaboral"
              value={formData.antiguedadLaboral}
              onChange={handleChange}
              style={inputStyle}
            />

            <p><strong>Deuda actual total</strong></p>
            <input
              required
              type="number"
              name="deudaActualTotal"
              value={formData.deudaActualTotal}
              onChange={handleChange}
              style={inputStyle}
            />

            <p><strong>Profesión</strong></p>
            <input
              required
              type="text"
              name="profesion"
              value={formData.profesion}
              onChange={handleChange}
              style={inputStyle}
            />

            <p><strong>Género</strong></p>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "25px",
                width: "100%",
                padding: "12px",
                backgroundColor: "#312F55",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {loading ? "Cargando..." : "Continuar"}
            </button>
          </form>
        </div>
      </main>

      <footer
        style={{
          backgroundColor: "#272D48",
          color: "white",
          textAlign: "center",
          padding: "20px 0",
          fontSize: "14px",
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
  marginBottom: "10px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "16px",
};