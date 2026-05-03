import { back_dir } from "../backend";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

export default function Simulacion() {
  const [tasa, setTasa] = useState(1.32);
  const navigate = useNavigate();

  const handleSimular = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const datosSimulacion = {
      monto: Number(formData.get("monto")),
      cuotas: Number(formData.get("cuotas")),
      tasa: Number(tasa) / 100,
      seguro: formData.get("seguro"),
    };

    try {
      const res = await fetch(`${back_dir}/simulacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosSimulacion),
        credentials: "include",
      });

      // Siempre navegamos al resultado, sin importar si estaba logeado o no
      navigate("/resultadoSimulacion");
    } catch (error) {
      console.error("❌ Error al simular:", error);
      alert("Error al procesar la simulación"); 
    }
  };

  return (
    <div
      id="simulacion"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/*necesario para que funcione la barra*/}
      <Navbar />

      <div
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
            padding: "clamp(20px, 4vw, 30px)",
            borderRadius: "18px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            marginBottom: "clamp(20px, 5vw, 40px)",
            textAlign: "top",
            width: "min(90%, 1000px)",
            marginTop: "clamp(-30px, -15vw, -160px)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(40px, 8vw, 80px)",
              margin: "0",
              color: "#1C142E",
              fontWeight: "bold",
              lineHeight: "1.1",
            }}
          >
            Simula <span style={{ fontSize: "clamp(20px, 4vw, 35px)" }}>tu</span>
          </h1>
          <h2
            style={{
              fontSize: "clamp(24px, 5vw, 50px)",
              margin: "clamp(5px, 1vw, 10px) 0 0",
              color: "#1C142E",
              fontWeight: "normal",
              lineHeight: "1.2",
            }}
          >
            <strong>Crédito Aquí</strong>
          </h2>
        </div>

        <div
          id="simulacion"
          style={{
            maxWidth: "600px",
            //margin: "0 auto 0 25%",
            margin: 0,
            marginRight: "5%",
            padding: "10px 30px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <form onSubmit={handleSimular}>
            <div
              style={{
                backgroundColor: "#CCCDD2",
                borderRadius: "8px",
                marginBottom: "20px",
                width: "100%",
                maxWidth: "400px",
                padding: "clamp(20px, 5vw, 40px) clamp(150px, 3vw, 100px)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1C142E",
                  marginBottom: "15px",
                }}
              >
                Monto
              </h2>
              <input
                required
                name="monto"
                type="number"
                placeholder="Ingresar monto"
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: "375px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "15px",
                  fontSize: "16px",
                }}
              />

              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1C142E",
                  marginBottom: "15px",
                }}
              >
                Número de cuotas
              </h2>
              <input
                required
                name="cuotas"
                type="number"
                placeholder="Número de cuotas"
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: "375px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "16px",
                }}
              />

              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1C142E",
                  marginBottom: "15px",
                }}
              >
                Tipo de seguro
              </h2>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="radio"
                  name="seguro"
                  value="Desgravamen"
                  style={{ marginRight: "10px" }}
                />
                <span style={{ fontSize: "16px" }}>Desgravamen</span>
              </div>
              <div>
                <input
                  type="radio"
                  name="seguro"
                  value="Nada"
                  style={{ marginRight: "10px" }}
                />
                <span style={{ fontSize: "16px" }}>Nada</span>
              </div>

              <div
                style={{
                  backgroundColor: "#CCCDD2",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "30px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#1C142E",
                    marginBottom: "15px",
                  }}
                >
                  Tasa de interés
                </h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <input
                    type="range"
                    name="tasa"
                    min="1"
                    max="20"
                    step="0.01"
                    value={tasa}
                    onChange={(e) => setTasa(e.target.value)}
                    style={{
                      flex: "1",
                      height: "6px",
                      borderRadius: "3px",
                      background: "#d8d9dfff",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#1C142E",
                      minWidth: "50px",
                    }}
                  >
                    {tasa}%
                  </span>
                </div>
              </div>

              <input
                type="submit"
                value="Simular"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#312F55",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              />
            </div>
          </form>
        </div>
      </div>

      <footer
        style={{
          backgroundColor: "#272D48",
          color: "white",
          textAlign: "center",
          padding: "clamp(15px, 3vw, 25px) 0",
          fontSize: "clamp(12px, 2vw, 14px)",
        }}
      >
        © 2025 Préstamos de Consumo Digital
      </footer>
    </div>
  );
}
