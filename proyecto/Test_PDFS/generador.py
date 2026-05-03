import os
from xhtml2pdf import pisa
from pathlib import Path


def generar_documentos():
    # 1. Crear el directorio si no existe
    os.makedirs("Documentos", exist_ok=True)

    # 2. Solicitar datos por consola
    full_name = input("Ingrese nombre completo: ")
    rut = input("Ingrese RUT (con puntos y guion): ")
    
    # Limpieza de RUT para el nombre del archivo
    clean_rut = rut.replace(".", "").replace("-", "").replace(" ", "")
    
    # Estilos CSS (xhtml2pdf soporta CSS 2.1 básico, ideal para tablas de OCR)
    common_style = """
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10pt; color: #333; }
    table { width: 100%; border: 1px solid #444; margin-bottom: 15px; }
    td { border: 1px solid #444; padding: 4px; }
    .title { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 20px; }
    .gray-bg { background-color: #f2f2f2; font-weight: bold; }
    """

    # --- Estructura de archivos y nombres ---
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

                <div style="width: 100%;">
                    <div style="float: left; width: 49%;">
                        <table>
                            <tr class="gray-bg"><td colspan="2" style="text-align:center;">Detalle de haberes</td></tr>
                            <tr><td>Pensión no contributiva</td><td style="text-align:right;">$178.000</td></tr>
                            <tr><td>Aguinaldo Fiestas Patrias</td><td style="text-align:right;">$20.000</td></tr>
                            <tr class="gray-bg"><td>Total haberes</td><td style="text-align:right;">$198.000</td></tr>
                        </table>
                    </div>
                    <div style="float: right; width: 49%;">
                        <table>
                            <tr class="gray-bg"><td colspan="2" style="text-align:center;">Detalle de descuentos</td></tr>
                            <tr><td>Bonificación Fiscal Salud</td><td style="text-align:right;">-$12.000</td></tr>
                            <tr><td>7% Salud Fonasa</td><td style="text-align:right;">-$10.000</td></tr>
                            <tr><td>Seguro complementario</td><td style="text-align:right;">-$5.000</td></tr>
                            <tr class="gray-bg"><td>Total descuentos</td><td style="text-align:right;">$27.000</td></tr>
                        </table>
                    </div>
                </div>

                <div style="clear: both;"></div>

                <table style="margin-top: 10px;">
                    <tr>
                        <td style="text-align: center; font-size: 14pt; font-weight: bold; padding: 15px;">
                            Total líquido a pagar: $200.000
                        </td>
                    </tr>
                </table>
            </body></html>"""),
        

        ("AntiguedadLaboral", f"""
            <html><head><style>{common_style}</style></head>
            <body>
                <div class="title">CERTIFICADO DE ANTIGÜEDAD LABORAL</div>
                
                <div style="text-align: justify; line-height: 1.6;">
                    <p>La Dirección de Recursos Humanos de la <b>Universidad Santa María</b>, 
                    representada legalmente por don <b>Nicolás Chehade</b>, RUT 11.111.111-1, 
                    en su calidad de Director, certifica que:</p>
                    
                    <p>Él/La Sr(a). <b>{full_name}</b>, Cédula de Identidad <b>{rut}</b>, 
                    registra vínculo laboral con nuestra institución desde el <b>03 de marzo de 2026</b>.</p>
                    
                    <p>Se desempeña actualmente bajo un <b>contrato de carácter indefinido</b>, 
                    cumpliendo funciones en régimen de jornada completa (44 horas semanales).</p>
                </div>

                <table style="margin-top: 30px;">
                    <tr class="gray-bg">
                        <td colspan="2" style="text-align: center;">RESUMEN DE ANTECEDENTES CONTRACTUALES</td>
                    </tr>
                    <tr>
                        <td style="width: 40%;"><b>Cargo Actual:</b></td>
                        <td>Docente de Ingeniería de Software</td>
                    </tr>
                    <tr>
                        <td><b>Remuneración Bruta:</b></td>
                        <td>$1.300.000.- (Un millón trescientos mil pesos)</td>
                    </tr>
                    <tr>
                        <td><b>Vigencia del Certificado:</b></td>
                        <td>30 días a contar de esta fecha.</td>
                    </tr>
                </table>

                <div style="margin-top: 80px; text-align: center;">
                    <div style="width: 250px; margin: 0 auto; border-top: 1px solid #000; padding-top: 5px;">
                        <b>Nicolás Chehade</b><br>
                        Director Regional USM<br>
                        Firma y Timbre
                    </div>
                </div>

                <div style="margin-top: 50px; font-size: 8pt; color: #666; text-align: right;">
                    Santiago, 30 de abril de 2026
                </div>
            </body></html>"""),
            
        ("DeudaTotal", f"""
            <html><head><style>{common_style}</style></head>
            <body>
                <div class="title" style="background-color:#00848a; color:white; padding:10px;">Informe de Deuda</div>
                <p>Titular: {full_name} | RUT: {rut}</p>
                
                <div class="title" style="background-color:#00848a; color:white; font-size:12pt;">DEUDA DIRECTA</div>
                <table>
                    <tr class="gray-bg">
                        <td>Institución Financiera</td>
                        <td>Tipo de Crédito</td>
                        <td>Monto Vigente</td>
                    </tr>
                    <tr><td>Banco BCI</td><td>Otros consumo</td><td>$156.336</td></tr>
                    <tr><td>CMR Falabella</td><td>Tarjeta de crédito</td><td>$196.740</td></tr>
                    <tr>
                        <td colspan="2" class="gray-bg">Monto total:</td>
                        <td class="gray-bg">$353.076</td>
                    </tr>
                </table>

                <div class="title" style="background-color:#00848a; color:white; font-size:12pt;">DEUDA INDIRECTA</div>
                <table>
                    <tr class="gray-bg">
                        <td>Institución Financiera</td>
                        <td>Tipo de Crédito</td>
                        <td>Monto Vigente</td>
                    </tr>
                    <tr>
                        <td colspan="2">No registra información</td>
                        <td>$0</td>
                    </tr>
                    <tr>
                        <td colspan="2" class="gray-bg">Monto total:</td>
                        <td class="gray-bg">$0</td>
                    </tr>
                </table>    
            </body></html>"""),
    ]

    # 3. Generar los archivos PDF
    for nombre_doc, html_content in documentos:
        
        base = Path(__file__).resolve().parent
        dir_path = base / "Documentos_1"

        dir_path.mkdir(parents=True, exist_ok=True)

        file_path = dir_path / f"{nombre_doc}_{clean_rut}.pdf"
        with open(file_path, "wb") as f:
            pisa_status = pisa.CreatePDF(html_content, dest=f)
            
        if pisa_status.err:
            print(f"Error generando {nombre_doc}")
        else:
            print(f"Archivo creado: {file_path}")

if __name__ == "__main__":
    generar_documentos()