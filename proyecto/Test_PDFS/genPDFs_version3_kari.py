import os
import random
from xhtml2pdf import pisa
from pathlib import Path

PROFESIONES = [
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
SUELDOS = [1100000, 1300000, 1550000, 1800000, 2100000]
FECHAS_INGRESO = ["03 de marzo de 2022", "15 de enero de 2021", "01 de agosto de 2023", "10 de noviembre de 2020"]
BONOS = [20000, 30000, 40000, 25000, 35000]
BONIFICACIONSALUD = [12000, 15000, 17000, 19000, 21000]
FONASA = [7000, 8000, 9000]
BANCO = ["BCI", "Estado", "Falabella", "Santander"]
MONTOBANCO = [127318,228213,123524,143234,113241]
MONTOCMR = [165565,131545,184796,255646,199685]

def generar_documentos():
    
    os.makedirs("Documentos", exist_ok=True)

    
    full_name = input("Ingrese nombre completo: ").strip()
    rut = input("Ingrese RUT (con puntos y guion): ").strip()
    
    
    print("\n--- Configuración de Datos Laborales ---")
    modo = input("¿Desea datos Aleatorios o Manuales? (R/M): ").strip().upper()
    
    if modo == "M":
        cargo = input("Ingrese Cargo: ")
        sueldo_valor = int(input("Ingrese Sueldo (solo números): "))
        fecha_ingreso = input("Ingrese Fecha Ingreso (ej: 03 de marzo de 2026): ")
        bonos = int(input("Ingrese monto total de bonos recibidos (solo números): "))
        BonificacionSalud = int(input("Ingrese monto bonificación fiscal salud (solo números): "))
        fonasa = int(input("Ingrese monto fonasa (solo números): "))
        banco = input("Ingrese Institucion bancaria: ")
        montoBancario = int(input("Ingrese monto vigente: "))
        montoCMR = int(input("Ingrese monto CMR Falabella: "))

    else:
        cargo = random.choice(PROFESIONES)
        sueldo_valor = random.choice(SUELDOS)
        fecha_ingreso = random.choice(FECHAS_INGRESO)
        bonos = random.choice(BONOS)
        BonificacionSalud = random.choice(BONIFICACIONSALUD)
        fonasa = random.choice(FONASA)
        banco = random.choice(BANCO)
        montoBancario = random.choice(MONTOBANCO)
        montoCMR = random.choice(MONTOCMR)
    
    sueldo_str = f"${sueldo_valor:,}".replace(",", ".")
    clean_rut = rut.replace(".", "").replace("-", "").replace(" ", "")
    
    
    common_style = """
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10pt; color: #333; }
    table { width: 100%; border: 1px solid #444; margin-bottom: 15px; }
    td { border: 1px solid #444; padding: 4px; }
    .title { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 20px; }
    .gray-bg { background-color: #f2f2f2; font-weight: bold; }
    """

    
    documentos = [
        ("Liquidacion", f"""
            <html><head><style>{common_style}</style></head>
            <body>
                <div class="title">COPIA DE LIQUIDACIÓN DE PAGO</div>
                <table>
                    <tr><td>Servicio Seguro Social</td><td>Los Héroes</td><td>Presencial</td></tr>
                    <tr class="gray-bg"><td>Beneficio</td><td>Entidad pagadora</td><td>Forma de pago</td></tr>
                </table>
                <table>
                    <tr><td>N° 12345-678</td><td>Providencia, RM</td><td>{rut}</td><td>30/04/2026</td></tr>
                    <tr class="gray-bg"><td>N° Documento</td><td>Centro de atención IPS</td><td>RUT del Beneficiario</td><td>Fecha del pago</td></tr>
                </table>
                <table style="margin-bottom: 25px;">
                    <tr><td colspan="2">{full_name}</td><td>Estado: Vigente</td><td>20/05/2026</td></tr>
                    <tr class="gray-bg"><td colspan="2">Nombre del beneficiario</td><td>Vencimiento del beneficio</td><td>Fecha próximo pago</td></tr>
                </table>
                <table style="border:none;">
                    <tr>
                        <td style="border:none; width:49%; vertical-align:top; padding:0;">
                            <table>
                                <tr class="gray-bg"><td colspan="2" style="text-align:center;">Detalle de haberes</td></tr>
                                <tr><td>Sueldo Base (Proporcional)</td><td style="text-align:right;">{sueldo_str}</td></tr>
                                <tr><td>Bonos</td><td style="text-align:right;">${bonos}</td></tr>
                                <tr class="gray-bg"><td>Total haberes</td><td style="text-align:right;">{sueldo_valor + bonos}</td></tr>
                            </table>
                        </td>
                        <td style="border:none; width:2%;"></td>
                        <td style="border:none; width:49%; vertical-align:top; padding:0;">
                            <table>
                                <tr class="gray-bg"><td colspan="2" style="text-align:center;">Detalle de descuentos</td></tr>
                                <tr><td>Bonificación Fiscal Salud</td><td style="text-align:right;">-${BonificacionSalud}</td></tr>
                                <tr><td>Salud Fonasa</td><td style="text-align:right;">-${fonasa}</td></tr>
                                <tr class="gray-bg"><td>Total descuentos</td><td style="text-align:right;">${BonificacionSalud + fonasa}</td></tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <table style="margin-bottom: 25px;">
                    <tr class="gray-bg"><td>Total a pagar: </td><td style="text-align:center;">${sueldo_valor + bonos-BonificacionSalud - fonasa}</td></tr>
                </table>
            </body></html>"""),

        ("AntiguedadLaboral", f"""
            <html><head><style>{common_style}</style></head>
            <body>
                <div class="title">CERTIFICADO DE ANTIGÜEDAD LABORAL</div>
                <div style="text-align: justify; line-height: 1.6;">
                    <p>La Dirección de Recursos Humanos de la <b>Universidad Santa María</b> certifica que:</p>
                    <p>Él/La Sr(a). <b>{full_name}</b>, Cédula de Identidad <b>{rut}</b>, 
                    registra vínculo laboral con nuestra institución desde el <b>{fecha_ingreso}</b>.</p>
                    <p>Se desempeña actualmente bajo un <b>contrato de carácter indefinido</b>.</p>
                </div>
                <table style="margin-top: 30px;">
                    <tr class="gray-bg"><td colspan="2" style="text-align: center;">RESUMEN DE ANTECEDENTES</td></tr>
                    <tr><td style="width: 40%;"><b>Cargo Actual:</b></td><td>{cargo}</td></tr>
                    <tr><td><b>Remuneración Bruta:</b></td><td>{sueldo_str}.-</td></tr>
                </table>
            </body></html>"""),

        ("DeudaTotal", f"""
            <html><head><style>{common_style}</style></head>
            <body>
                <div class="title" style="background-color:#00848a; color:white; padding:10px;">Informe de Deuda</div>
                <p>Titular: {full_name} | RUT: {rut}</p>
                <div class="title" style="background-color:#00848a; color:white; font-size:12pt;">DEUDA DIRECTA</div>
                <table>
                    <tr class="gray-bg"><td>Institución</td><td>Tipo de Crédito</td><td>Monto Vigente</td></tr>
                    <tr><td>Banco {banco}</td><td>Otros consumo</td><td>${montoBancario}</td></tr>
                    <tr><td>CMR Falabella</td><td>Tarjeta de crédito</td><td>${montoCMR}</td></tr>
                    <tr><td colspan="2" class="gray-bg">Monto total:</td><td class="gray-bg">${montoBancario + montoCMR}</td></tr>
                </table>
            </body></html>"""),
    ]

    
    print("\n--- Procesando Documentos ---")
    for nombre_doc, html_content in documentos:
        base = Path(__file__).resolve().parent
        dir_path = base / "Documentos"
        dir_path.mkdir(parents=True, exist_ok=True)

        file_path = dir_path / f"{nombre_doc}_{clean_rut}.pdf"
        
        with open(file_path, "wb") as f:
            pisa_status = pisa.CreatePDF(html_content, dest=f)
            
        if pisa_status.err:
            print(f"❌ Error generando {nombre_doc}")
        else:
            print(f"✅ Archivo creado: {file_path}")

if __name__ == "__main__":
    generar_documentos()