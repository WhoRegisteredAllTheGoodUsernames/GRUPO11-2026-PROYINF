import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { back_dir } from "../backend";
import Navbar from "./navbar";

export default function PdfDatosCliente() {
    const { idSimulacion } = useParams();
    const [archivo, setArchivo] = useState(null);
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
        };

    const handleDragLeave = () => {
        setDragActive(false);
        };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);

        const file = e.dataTransfer.files[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Solo se permiten PDFs");
            return;
        }

        setArchivo(file);
    };
    const handleUpload = async () => {
    if (!archivo) {
      alert("Selecciona un PDF");
      return;
    }



    setCargando(true);

    try {
      const formData = new FormData();
      formData.append("pdf", archivo);

      const res = await fetch(`${back_dir}/solicitud/${idSimulacion}/pdf`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        alert("Error al procesar el PDF.");
        navigate(`/solicitud/${idSimulacion}/datos`);
        return;
      }

      const data = await res.json();

      // 🔴 VALIDACIÓN DE LECTURA
      if (
        !data.datos ||
        data.datos.salario == null ||
        data.datos.profesion == null ||
        data.datos.genero == null ||
        data.datos.rut == null
      ) {
        alert("No se pudo leer correctamente el PDF. Intenta nuevamente o ingresa los datos manualmente.");
        navigate(`/solicitud/${idSimulacion}/datos`);
        return;
      }

      const payload = {
        salario: data.datos.salario,
        rubro: data.datos.profesion,
        genero: data.datos.genero,
        email: data.datos.correo,
        telefono: data.datos.telefono,
      };

      const resDatos = await fetch(`${back_dir}/solicitud/${idSimulacion}/datos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!resDatos.ok) throw new Error("Error al guardar datos");

      navigate(`/solicitud/${idSimulacion}/confirmar`);

    } catch (err) {
      console.error(err);
      alert("Error al leer el PDF.");
      navigate(`/solicitud/${idSimulacion}/datos`);
    } finally {
      setCargando(false);
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
          backgroundColor: "#F4F4F4",
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
            padding: "40px",
            borderRadius: "18px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
            width: "min(90%, 500px)",
          }}
        >
          <h2 style={{ color: "#1C142E", marginBottom: "25px" }}>
            Subir PDF del cliente
          </h2>

          {/* Dropzone */}
            <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                display: "block",
                border: "2px dashed #312F55",
                borderRadius: "12px",
                padding: "40px 20px",
                cursor: "pointer",
                backgroundColor: dragActive
                ? "#dcdff5"
                : archivo
                ? "#e8e9f3"
                : "#f8f8fb",
                transition: "all 0.2s",
                marginBottom: "20px",
            }}
            >
            <input
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) => setArchivo(e.target.files[0])}
            />

            <p style={{ margin: 0, fontWeight: "bold", color: "#1C142E" }}>
              {archivo ? archivo.name : "Haz click para seleccionar un PDF"}
            </p>

            <p style={{ fontSize: "14px", color: "#555", marginTop: "8px" }}>
              Formato permitido: PDF
            </p>
          </label>

          {/* Botón */}
          <button
            onClick={handleUpload}
            disabled={cargando}
            style={buttonStyle}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "#5b608cff")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "#312F55")
            }
          >
            {cargando ? "Procesando..." : "Procesar PDF"}
          </button>
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

const buttonStyle = {
  backgroundColor: "#312F55",
  color: "white",
  border: "none",
  borderRadius: "30px",
  padding: "14px 25px",
  fontWeight: "bold",
  fontSize: "16px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

