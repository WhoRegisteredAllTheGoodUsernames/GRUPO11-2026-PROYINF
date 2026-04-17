// Separe el header en una navbar aparte para recortar un poco el codigo y simplificarlo importandolo donde se necesite
import Navbar from "./navbar";
import React , { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const dirs = [
  	{ path: "simulacion", label: "Simular préstamo" },
  	{ path: "historialSimulaciones", label: "Historial de simulaciones" },
	{ path: "historialPrestamos", label: "Mis créditos" },
	{ path: "guestMode", label: "Guest Mode" },
];


export default function Index() {
	// Agregado para que detecte que el usuario inicio la sesion, ocupando lo que ya habia que se guardaba en cookies
	// entonces si esta iniciado, en / ya no aparece el boton de iniciar sesion, sino que su nombre y el boton para cerrar la sesion

	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(()=> {
		const userGuardado = localStorage.getItem("usuario_sesion")
		if (userGuardado){
			setUser(JSON.parse(userGuardado))
		}
	}, [])

  	return (
		<div
			id="index"
			style={{
				fontFamily: "Arial, Helvetica, sans-serif",
				backgroundColor: "#ffffff",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
			}}
		>

			{/* barra de arriba */}
			{/* lo siguiente importa la barra de arriba*/ }
			< Navbar />

			{/* cuadro central */} 
			<main
			style={{
				backgroundColor: "#F4F4F4",
				flex: 1,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: "clamp(20px, 5vw, 40px) clamp(15px, 3vw, 20px)",
			}}
			>
				{/* titulo */}
				<div
					style={{
						backgroundColor: "#CCCDD2",
						padding: "clamp(20px, 4vw, 30px)",
						borderRadius: "18px",
						boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
						marginBottom: "clamp(20px, 5vw, 40px)",
						textAlign: "top",
						width: "80%",
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
						Préstamos <span style={{ fontSize:"clamp(20px, 4vw, 35px)"}}>de</span>
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
						<strong>CONSUMO digital</strong>
					</h2>
				</div>

				{/* botones */}
				<div style={{ display: "flex", gap: "clamp(15px, 3vw, 20px)", flexWrap: "wrap", width: "min(90%, 1055px)", justifyContent: "flex-start"}}>
					{dirs.map((item, index) => (
						<a
						key={index}
						href={`/${item.path}`}
						style={{
							backgroundColor: "#312F55",
							color: "white",
							textDecoration: "none",
							padding: "clamp(12px, 2vw, 15px) clamp(20px, 3vw, 30px)",
							borderRadius: "30px",
							fontWeight: "bold",
							fontSize: "clamp(14px, 2vw, 17px)",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							transition: "background-color 0.2s",
							textAlign: "center",
							minWidth: "min(50px, 100%)",
							'@media (max-width: 480px)': { 
								minWidth: "100%",
							},
						}}
						onMouseEnter={(e) => (e.target.style.backgroundColor = "#5b608cff")}
						onMouseLeave={(e) => (e.target.style.backgroundColor = "#312F55")}
						>
						{item.label}
						</a>
					))}
				</div>
			</main>

			{/* barra de abajo */}
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
