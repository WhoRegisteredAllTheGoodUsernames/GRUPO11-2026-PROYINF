import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import { back_dir } from "../backend";

// linea de abajo es el import para la barra, para donde se necesite, ademas de simplificar la edicion de esta
// import Navbar from ./navbar/


export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Funciones para el incio de sesion, poder mostrar que el usuario está iniciado y cerrar sesion de forma que funcione
    useEffect(() => {
        const userGuardado = localStorage.getItem("usuario_sesion");
        if (userGuardado){
            setUser(JSON.parse(userGuardado));
        }
    }, []);

    const handleLogout =  async () => {
        try {
            await fetch(`${back_dir}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error){
            console.error("Error cerrando sesion en el servidor: ", error);
        }
		localStorage.removeItem("usuario_sesion");
		setUser(null);
        window.location.reload();
		navigate("/")
	}

    return (
        <header 
            style={{
                backgroundColor: "#1a1f3c",
                color: "white",
                padding: "clamp(15px, 4vw, 25px) clamp(15px, 4vw, 30px)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
                '@media (max-width: 768px)': { 
                    flexDirection: "column",
                    textAlign: "center",
                    },
            }}>
                {/* Logo */}
            <div style={{ fontSize: "25px", fontWeight: "bold" }}> 
                <img 
                    src={logo} 
                    alt="Logo"
                    style={{ width: "auto", height: "clamp(30px, 5vw, 45px)", maxWidth: "120px" }}
                />
            </div>
            
            {/* Enlaces */}
            <div style={{display: "flex", gap: "clamp(15px, 3vw, 20px)", alignItems: "center", flexWrap: "wrap"}}>
                <Link 
                    to="/" 
                    style={{ 
                        color: "white", 
                        textDecoration: "none", 
                        fontSize: "clamp(14px, 2vw, 17px)", 
                        whiteSpace: "nowrap",
                        fontWeight: "bold"
                    }}
                >
                    Inicio
                </Link>
                <Link 
                    to="/mod_scoring"
                    style={{ 
                        color: "white",
                        textDecoration: "none",
                        fontSize: "clamp(14px, 2vw, 17px)",
                        whiteSpace: "nowrap" 
                        }}>
                    Modificar modelo
                </Link>

                {/* Lógica de usuario */}
                {/* el {user ? () : () funciona como if donde se evalua el primer parentesis si es verdadero y el segundo si es falso} */}
                {user ? (
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <span style={{ color: '#aaa', fontSize: "clamp(12px, 2vw, 15px)" }}>
                            Hola, {user.primer_nombre}
                        </span>
                        <button 
                            onClick={handleLogout} 
                            style={{
                                background: 'transparent', 
                                border: '1px solid white', 
                                color: 'white', padding: '5px 10px', 
                                borderRadius: '5px', cursor: 'pointer', 
                                fontWeight: "bold",
                                fontSize: "clamp(14px, 2vw, 17px)"
                            }}>
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <div  style={{display: "flex", gap: "clamp(15px, 3vw, 20px)", alignItems: "center", flexWrap: "wrap"}}> 
                    <Link 
                        to="/login" 
                        style={{ 
                            color: "white", 
                            textDecoration: "none", 
                            fontWeight: "bold", 
                            fontSize: "clamp(14px, 2vw, 17px)", 
                            whiteSpace: "nowrap" 
                        }}
                    >
                        Iniciar sesión
                    </Link>

                    <Link 
                        to="/registro" 
                        style={{ 
                            color: "white", 
                            textDecoration: "none", 
                            fontSize: "clamp(14px, 2vw, 17px)", 
                            whiteSpace: "nowrap" 
                            }}
                    >
                        Registrarse
                    </Link>
                    </div>
                )}
            </div>

        </header>
    );
}