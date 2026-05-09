import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { back_dir } from "../backend";
import Navbar from "./navbar";

export default function DatosClienteSolicitud() {
  const { idSimulacion } = useParams();
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  // Obtener datos del cliente al cargar
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch(`${back_dir}/solicitud/${idSimulacion}/datos`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error("Error al obtener datos del cliente");

        const data = await res.json();
        setCliente(data.cliente);
      } catch (err) {
        console.error("❌ Error cargando datos:", err);
        setError("No se pudieron cargar los datos del cliente.");
      }
    };

    fetchDatos();
  }, [idSimulacion, navigate]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const res = await fetch(`${back_dir}/solicitud/${idSimulacion}/datos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(cliente),
      });

      if (!res.ok) throw new Error("Error al guardar cambios");

      alert("✅ Datos actualizados correctamente");
      navigate(`/solicitud/${idSimulacion}/confirmar`);
    } catch (err) {
      console.error("❌ Error guardando datos:", err);
      alert("Error al guardar los cambios");
    } finally {
      setGuardando(false);
    }
  };

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "25vh", color: "red" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div style={{ textAlign: "center", marginTop: "25vh" }}>
        <h2>Cargando datos...</h2>
      </div>
    );
  }

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
      {/* Header */}
      <Navbar />

      {/* Formulario */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#CCCDD2",
            padding: "30px 40px",
            borderRadius: "12px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            width: "min(90%, 600px)",
          }}
        >
          <h3 style={{ color: "#1C142E", marginBottom: "20px" }}>
            Datos personales
          </h3>
          <label style={labelStyle}>Nombre completo</label>
          <input
            type="text"
            name="nombre"
            value={cliente.nombre || ""}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label style={labelStyle}>RUT</label>
          <input
            type="text"
            name="rut"
            value={cliente.rut || ""}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <label style={labelStyle}>Género</label>
            <select
            name="genero"
            value={cliente.genero || ""}
            onChange={handleChange}
            style={inputStyle}
            required
            >
            <option value="">Seleccione</option>
            <option value="F">Femenino</option>
            <option value="M">Masculino</option>
            <option value="X">Otro / Prefiero no decirlo</option>
            </select>


          {/* <label style={labelStyle}>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={cliente.telefono || ""}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={labelStyle}>Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={cliente.email || ""}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={labelStyle}>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={cliente.direccion || ""}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={labelStyle}>Ciudad</label>
          <input
            type="text"
            name="ciudad"
            value={cliente.ciudad || ""}
            onChange={handleChange}
            style={inputStyle}
          /> */}
            <label style={labelStyle}>Ingresos mensuales</label>
                <input
                type="number"
                name="salario"
                value={cliente.salario || ""}
                onChange={handleChange}
                style={inputStyle}
            />


            <label style={labelStyle}>Profesión</label>
            <input
            type="text"
            name="rubro"                
            value={cliente.rubro || ""} 
            onChange={handleChange}
            style={inputStyle}
            />
            <label style={labelStyle}>Antigüedad laboral (meses)</label>
            <input
              type="number"
              name="antiguedad"
              value={cliente.antiguedad || ""}
              onChange={handleChange}
              style={inputStyle}
            />


          <button
            type="submit"
            disabled={guardando}
            style={{
              marginTop: "25px",
              width: "100%",
              padding: "10px",
              backgroundColor: "#1a1f3c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {guardando ? "Guardando..." : "Guardar y continuar"}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#272D48",
          color: "white",
          textAlign: "center",
          padding: "15px 0",
        }}
      >
        © 2025 Préstamos de Consumo Digital
      </footer>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginTop: "15px",
  fontWeight: "bold",
  color: "#1C142E",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
  marginTop: "5px",
};
