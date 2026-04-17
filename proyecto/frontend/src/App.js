import Registro from './vistas/Registro';
import Index from './vistas/Index';
import Login from './vistas/Login';	
import Simulacion from './vistas/Simulacion';
import ModScoring from './vistas/ModScoring';
import ResultadoSimulacion from './vistas/resultadoSimulacion';
import Solicitud from './vistas/solicitud';
import DatosClienteSolicitud from "./vistas/DatosClienteSolicitud";
import ConfirmarSolicitud from "./vistas/ConfirmarSolicitud";
import IniciarFirma from './vistas/iniciarFirma';
import HistorialSimulaciones from './vistas/HistorialSimulaciones';
import HistorialPrestamos from './vistas/HistorialPrestamos';
//Nuevo para ingesof
import GuestMode from './vistas/GuestMode';
import GuestModeSimulacion from './vistas/GuestModeSimulacion';


//import logo from './logo.svg';
import './App.css';
import {
	BrowserRouter as Router,
	Routes,
	Route} from "react-router-dom";

function App() {
  return (
	  <	Router>
			<Routes>
				<Route exact path="/" element={<Index />} />
				<Route path="/registro" element={<Registro />} />
				<Route path="/login" element={<Login />} />
				<Route path="/simulacion" element={<Simulacion />} />
				<Route path="/mod_scoring" element={<ModScoring />} />
				<Route path="/resultadoSimulacion" element={<ResultadoSimulacion />} />
				<Route path="/solicitud/:idSimulacion" element={<Solicitud />} />
				<Route path="/solicitud/:idSimulacion/datos" element={<DatosClienteSolicitud />} />
				<Route path="/solicitud/:idSimulacion/confirmar" element={<ConfirmarSolicitud />} />
				<Route path="/iniciar-firma" element={<IniciarFirma/>}/>
				<Route path="/historialSimulaciones" element={<HistorialSimulaciones />} />
				<Route path="/historialPrestamos" element={<HistorialPrestamos />} />
				<Route path="/guestMode" element={<GuestMode />} />
				<Route path="/guestModeSimulacion" element={<GuestModeSimulacion />} />

			</Routes>
	  </Router>
  );
}

export default App;
