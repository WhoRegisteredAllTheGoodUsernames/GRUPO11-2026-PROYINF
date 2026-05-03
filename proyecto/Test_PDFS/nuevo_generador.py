import random
from pathlib import Path
#from xhtml2pdf import pisa
from datetime import datetime
from weasyprint import HTML


fecha = datetime.now().strftime("%d/%m/%Y")
import random

def pedir_opcion():
    opcion = input("Modo (R = random / M = manual): ").strip().upper()
    while opcion not in ["R", "M"]:
        opcion = input("Inválido. Ingrese R o M: ").strip().upper()
    return opcion

def pedir_entero(msg):
    while True:
        try:
            return int(input(msg).strip())
        except:
            print("Ingrese un número válido")


# Catálogos discretos y constantes
profesiones = [
    "Abogado",
    "Doctor",
    "Ingeniero",
    "Arquitecto",
    "Contador",
    "Profesor",
    "Enfermero",
    "Tecnico",
    "Programador",
    "Analista",
    "Administrador",
    "Comerciante",
    "Vendedor",
    "Chofer",
    "Conductor",
    "Obrero",
    "Construccion",
    "Mecanico",
    "Electricista",
    "Gasfiter",
    "Carpintero",
    "Agricultor",
    "Pescador",
    "Minero",
    "Independiente",
    "Freelancer",
    "Dueño de negocio",
    "Empresario",
    "Gerente",
    "Ejecutivo",
    "Desempleado",
    "Estudiante",
    "Jubilado"
]

salarios = [500000, 800000, 1200000, 1800000, 2500000]
antiguedad = [1, 2, 5, 10, 15, 20, 60, 120] 
deudas = [0, 250000, 500000, 1000000, 2500000, 5000000]

TELEFONO = '+56 9 1234 5678'
CORREO = 'correo@dominio.cl'
DIRECCION = 'Calle 123'
CIUDAD = 'Ciudad'


def obtener_datos():
    modo = pedir_opcion()

    if modo == "R":
        profesion =  random.choice(profesiones)
        salario = random.choice(salarios)
        antig = random.choice(antiguedad)
        deuda = random.choice(deudas)
        tel = TELEFONO
        correo = CORREO
        dir = DIRECCION
        ciudad = CIUDAD
        

    else:
        # Manual (input libre)
        profesion = input("Profesión: ").strip()
        salario = pedir_entero("Salario (sin puntos): ")
        antig = pedir_entero("Antigüedad (meses): ")
        deuda = pedir_entero("Monto de deudas: ")
        tel = input("Telefono: ")
        correo = input("Correo: ")
        dir = input("Dirección: ")
        ciudad = input("Ciudad: ")


        
    return profesion, salario, antig, deuda, tel, correo, dir, ciudad

def generar_informe():
    # Inputs
    nombre = input("Nombre: ")

    generos_validos = ["M", "F", "Otro"]
    genero = input("Género (M/F/Otro): ").strip()

    while genero not in generos_validos:
        genero = input("Inválido. Ingrese M, F u Otro: ").strip()

    rut = input("RUT: ")

    clean_rut = rut.replace(".", "").replace("-", "").replace(" ", "")


    profesion, salario, antig, deuda, tel, correo, dir, ciudad = obtener_datos()


    # HTML con tags para regex
    html = f"""
    <html>
    <head>
        <style>
            @page {{ size: A4; margin: 20mm; }}

            body {{
                font-family: Helvetica, Arial, sans-serif;
                font-size: 10pt;
                color: #2c2c2c;
            }}

            .header {{
                text-align: center;
                margin-bottom: 25px;
            }}

            .title {{
                font-size: 18pt;
                font-weight: bold;
                color: #1f3a5f;
            }}

            .subtitle {{
                font-size: 9pt;
                color: #666;
                margin-top: 5px;
            }}

            .section-title {{
                background-color: #1f3a5f;
                color: white;
                padding: 6px;
                font-size: 11pt;
                margin-top: 20px;
            }}

            table {{
                width: 100%;
                border-collapse: collapse;
                margin-top: 5px;
            }}

            td {{
                padding: 6px;
                border-bottom: 1px solid #ddd;
            }}

            .label {{
                font-weight: bold;
                width: 40%;
                color: #444;
            }}

            .value {{
                text-align: right;
                font-weight: bold;
            }}

            .highlight {{
                background-color: #f4f6f9;
            }}

            .footer {{
                margin-top: 30px;
                font-size: 9pt;
                color: #555;
                line-height: 1.5;
            }}
        </style>
    </head>

    <body>

        <div class="header">
            <div class="title">RESUMEN FINANCIERO DEL SOLICITANTE</div>
            <div class="subtitle">
                Fecha de emisión: {fecha} &nbsp;&nbsp;|&nbsp;&nbsp; Documento válido sólo por 15 días desde su emisión
            </div>
        </div>

        <div class="section-title">DATOS PERSONALES</div>
        <table>
            <tr><td class="label">NOMBRE</td><td class="value"> {nombre}</td></tr>
            <tr class="highlight"><td class="label">RUT</td><td class="value">{rut}</td></tr>
            <tr><td class="label">GENERO</td><td class="value">{genero}</td></tr>
            <tr class="highlight"><td class="label">TELEFONO</td><td class="value">{tel}</td></tr>
            <tr><td class="label">CORREO</td><td class="value">{correo}</td></tr>
            <tr class="highlight"><td class="label">DIRECCION</td><td class="value">{dir}</td></tr>
            <tr><td class="label">CIUDAD</td><td class="value">{ciudad}</td></tr>

        </table>

        <div class="section-title">PERFIL LABORAL</div>
        <table>
            <tr><td class="label">PROFESION</td><td class="value">{profesion}</td></tr>
            <tr class="highlight"><td class="label">ANTIGUEDAD</td><td class="value">{antig} meses</td></tr>
        </table>

        <div class="section-title">SITUACION FINANCIERA</div>
        <table>
            <tr><td class="label">SALARIO</td><td class="value">{salario}</td></tr>
            <tr class="highlight"><td class="label">MONTO_DEUDAS</td><td class="value">{deuda}</td></tr>
        </table>

        <div class="footer">
            <b>DECLARACION:</b> La información contenida en este documento ha sido proporcionada por el solicitante y tiene carácter referencial.
            <br><br>
            <b>VALIDACION:</b> La institución financiera correspondiente será responsable de verificar los antecedentes y determinar la aprobación o rechazo de cualquier solicitud de crédito.
        </div>

        <table style="width:100%; border-collapse:collapse; margin-top:20px;">
            <tr>
                <td style="height:15px; background-color:#1f3a5f; border-bottom:none;">
                    &nbsp;
                </td>
            </tr>
        </table>

        
        <div style="margin-top:50px; text-align:center;">

            <div style="width:300px; margin:0 auto; border-top:1px solid #000; padding-top:5px;">
                            <br><br><br><br><br>
                __________________________________
                <br>
                Firma {nombre}
            </div>
        </div>

    </body>
    </html>
    """

    # Ruta salida
    base = Path(__file__).resolve().parent
    dir_path = base / "Documentos"
    dir_path.mkdir(parents=True, exist_ok=True)

    file_path = dir_path / f"Informe_{clean_rut}.pdf"

    # Generación PDF
    # with open(file_path, "wb") as f:
    #     pisa.CreatePDF(html, dest=f)
    HTML(string=html).write_pdf(file_path)
    print(f"Archivo generado: {file_path}")


if __name__ == "__main__":
    generar_informe()