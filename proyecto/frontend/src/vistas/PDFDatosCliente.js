import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { back_dir } from "../backend";
import Navbar from "./navbar";

export default function PdfDatosCliente() {

  const { idSimulacion } = useParams();
  const navigate = useNavigate();

  const [cargando, setCargando] = useState(false);

  const [carnet, setCarnet] = useState(null);
  const [liquidacion, setLiquidacion] = useState(null);
  const [antiguedad, setAntiguedad] = useState(null);

  const handleUpload = async () => {

    if (!carnet || !liquidacion || !antiguedad) {
      alert("Debes subir los 3 documentos requeridos.");
      return;
    }

    setCargando(true);

    try {

      const formData = new FormData();

      formData.append("carnet", carnet);
      formData.append("liquidacion", liquidacion);
      formData.append("antiguedad", antiguedad);

      const res = await fetch(
        `${back_dir}/solicitud/${idSimulacion}/pdf`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {

        console.error(data);

        alert(
          data.error ||
          "Error al procesar documentos."
        );

        navigate(`/solicitud/${idSimulacion}/datos`);
        return;
      }

      // VALIDACIÓN
      const camposRequeridos = [
        data.datos.nombre,
        data.datos.rut,
        data.datos.genero,
        data.datos.salario,
        data.datos.profesion,
        data.datos.antiguedadMeses,
      ];

      const camposLeidos = camposRequeridos.filter(
        campo =>
          campo !== null &&
          campo !== undefined &&
          campo !== ""
      ).length;

      const porcentajeLeido =
        camposLeidos / camposRequeridos.length;

      if (porcentajeLeido < 0.7) {

        alert(
          "No se pudieron leer correctamente los documentos.\n\n" +
          "Verifica que:\n" +
          "- Los archivos correspondan al tipo solicitado.\n" +
          "- Los documentos sean legibles.\n" +
          "- Las imágenes no estén borrosas o cortadas.\n\n" +
          `Porcentaje de lectura detectado: ${Math.round(porcentajeLeido * 100)}%\n\n` +
          "Puedes intentar nuevamente con otros documentos o ingresar los datos manualmente."
        );

        navigate(`/solicitud/${idSimulacion}/datos`);

        return;
      }

      // ADVERTENCIA GÉNERO
      if (data.advertencia) {
        alert(data.advertencia);
      }

      alert(
        JSON.stringify(
          data.datos,
          null,
          2
        )
      );

      const payload = {

        salario: data.datos.salario,

        rubro: data.datos.profesion,

        genero: data.datos.genero,

        email: "correo@temporal.cl",

        telefono: "000000000",
      };

      const resDatos = await fetch(
        `${back_dir}/solicitud/${idSimulacion}/datos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!resDatos.ok) {
        throw new Error(
          "Error al guardar datos"
        );
      }

      navigate(
        `/solicitud/${idSimulacion}/confirmar`
      );

    } catch (err) {

      console.error(err);

      alert(
        "Error al leer los documentos."
      );

      navigate(`/solicitud/${idSimulacion}/datos`);

    } finally {

      setCargando(false);
    }
  };

  const renderDropzone = (
    titulo,
    archivo,
    setArchivo,
    accept
  ) => (

    <label
      style={{
        display: "block",
        border: "2px dashed #312F55",
        borderRadius: "12px",
        padding: "25px",
        cursor: "pointer",
        backgroundColor: archivo
          ? "#e8e9f3"
          : "#f8f8fb",
        transition: "all 0.2s",
        marginBottom: "20px",
      }}
    >

      <input
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) =>
          setArchivo(e.target.files[0])
        }
      />

      <p
        style={{
          margin: 0,
          fontWeight: "bold",
          color: "#1C142E",
          fontSize: "16px",
        }}
      >
        {titulo}
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "#555",
          marginTop: "10px",
        }}
      >
        {
          archivo
            ? archivo.name
            : "Haz click para seleccionar archivo"
        }
      </p>

    </label>
  );

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
            boxShadow:
              "0px 2px 6px rgba(0,0,0,0.1)",
            width: "min(95%, 650px)",
          }}
        >

          <h2
            style={{
              color: "#1C142E",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Subir documentos del cliente
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#444",
              marginBottom: "30px",
            }}
          >
            Debes subir:
            carnet,
            liquidación
            y certificado de antigüedad laboral.
          </p>

          {renderDropzone(
            "Carnet (imagen)",
            carnet,
            setCarnet,
            "image/*"
          )}

          {renderDropzone(
            "Liquidación de sueldo (PDF)",
            liquidacion,
            setLiquidacion,
            "application/pdf"
          )}

          {renderDropzone(
            "Certificado de antigüedad laboral (PDF)",
            antiguedad,
            setAntiguedad,
            "application/pdf"
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: "10px",
            }}
          >

            <button
              onClick={handleUpload}
              disabled={cargando}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (
                  e.target.style.backgroundColor =
                  "#5b608cff"
                )
              }
              onMouseLeave={(e) =>
                (
                  e.target.style.backgroundColor =
                  "#312F55"
                )
              }
            >
              {
                cargando
                  ? "Procesando..."
                  : "Procesar documentos"
              }
            </button>

          </div>

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