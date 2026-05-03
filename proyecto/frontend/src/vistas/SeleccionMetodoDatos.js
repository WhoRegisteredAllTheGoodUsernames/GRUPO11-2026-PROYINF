import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./navbar";

export default function SeleccionMetodoDatos() {
  const { idSimulacion } = useParams();
  const navigate = useNavigate();

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
      {/* Navbar */}
      <Navbar />

      {/* Contenido */}
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
          <h2
            style={{
              color: "#1C142E",
              marginBottom: "30px",
            }}
          >
            ¿Cómo deseas ingresar los datos?
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <button
              onClick={() => navigate(`/solicitud/${idSimulacion}/datos/manual`)}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#5b608cff")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "#312F55")
              }
            >
              Ingresar manualmente
            </button>

            <button
              onClick={() => navigate(`/solicitud/${idSimulacion}/datos/pdf`)}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#5b608cff")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "#312F55")
              }
            >
              Subir PDF
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
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



// import { useParams, useNavigate } from "react-router-dom";

// export default function SeleccionMetodoDatos() {
//   const { idSimulacion } = useParams();
//   const navigate = useNavigate();

//   return (
//     <div style={{ textAlign: "center", marginTop: "20vh" }}>
//       <h2>¿Cómo deseas ingresar los datos?</h2>

//       <button onClick={() => navigate(`/solicitud/${idSimulacion}/datos/manual`)}>
//         Ingresar manualmente
//       </button>

//       <br /><br />

//       <button onClick={() => navigate(`/solicitud/${idSimulacion}/datos/pdf`)}>
//         Subir PDF
//       </button>
//     </div>
//   );
// }