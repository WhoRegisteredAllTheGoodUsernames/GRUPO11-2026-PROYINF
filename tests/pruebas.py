import unittest
import requests

class TestHU8IngresoAgil(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """
        Set up para los tests de la HU8 (Ingreso Ágil de datos).
        Se define la URL base y cabeceras comunes.
        """
        print("Preparando contexto para HU8: Ingreso ágil de datos...")
        cls.base_url = "http://localhost:3000/guestMode" 
        cls.headers = {"Content-Type": "application/json"}

    @classmethod
    def tearDownClass(cls):
        print("Limpiando contexto de HU8...")

    def setUp(self):
        """
        Se ejecuta ANTES de cada test individual.
        Instanciamos una Session() de requests. Esto es vital para la HU8, 
        ya que permite guardar la cookie de sesión entre la petición de 
        datos personales y la de simulación, imitando a un navegador real.
        """
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def test_flujo_completo_valido_hu8(self):
        """
        Prueba HU8: Clase de equivalencia válida (Flujo Completo).
        Simula un usuario invitado que primero ingresa sus datos correctamente 
        y luego solicita la simulación inteligente.
        """
        # Paso 1: Ingreso ágil de datos
        datos_personales = {
            "remuneracionNetaMensual": 1500000,
            "antiguedadLaboral": 24,
            "deudaActualTotal": 0,
            "profesion": "Ingeniero",
            "genero": "masculino"
        }
        res_datos = self.session.post(f"{self.base_url}/datos-personales", json=datos_personales)
        self.assertEqual(res_datos.status_code, 200, "El servidor debería guardar los datos personales")

        # Paso 2: Simulación del crédito usando la misma sesión
        datos_simulacion = {
            "monto": 5000000,
            "cuotas": 24,
            "tasa": 1.2,
            "seguro": "Desgravamen"
        }
        res_sim = self.session.post(f"{self.base_url}/simulacion", json=datos_simulacion)
        
        # Evaluar que la simulación procesó el scoring y devolvió un estado (Aprobado/Rechazado)
        self.assertEqual(res_sim.status_code, 200)
        self.assertIn("estado", res_sim.json(), "La respuesta debe contener el estado de aprobación")

    def test_frontera_remuneracion_invalida_hu8(self):
        """
        Prueba HU8: Valor frontera en datos personales.
        Se intenta guardar datos con remuneración 0 (evaluando el límite inferior estricto).
        """
        datos_personales = {
            "remuneracionNetaMensual": 0, # Valor frontera inválido
            "antiguedadLaboral": 12,
            "deudaActualTotal": 100000,
            "profesion": "Técnico",
            "genero": "femenino"
        }
        res_datos = self.session.post(f"{self.base_url}/datos-personales", json=datos_personales)
        
        # El validador (Number(remuneracionNetaMensual) <= 0) debe atrapar este caso
        self.assertEqual(res_datos.status_code, 400)
        self.assertEqual(res_datos.json().get("error"), "Remuneración inválida")

class TestHU1SimulacionCredito(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """
        Set up para los tests de la HU1 (Simulación de crédito personal).
        Apunta al endpoint principal de registro de simulación.
        """
        print("Preparando contexto para HU1: Simulación de crédito personal...")
        cls.base_url = "http://localhost:3000/simulacion"
        cls.headers = {"Content-Type": "application/json"}

    @classmethod
    def tearDownClass(cls):
        print("Limpiando contexto de HU1...")

    def test_escenario_valido_hu1(self):
        """
        Prueba HU1: Clase de equivalencia válida.
        Se envían datos de simulación estándar. El sistema debe procesarlos, 
        guardarlos en sesión y redirigir a la pantalla de resultados.
        """
        payload = {
            "monto": 10000000,
            "cuotas": 48,
            "tasa": 1.4,
            "seguro": "Desgravamen"
        }
        # allow_redirects=False evita que Python intente cargar la página protegida
        # y nos permite evaluar la respuesta original del servidor
        response = requests.post(self.base_url, json=payload, headers=self.headers, allow_redirects=False)
        
        # El comportamiento esperado de éxito en este endpoint es una redirección (Status 302)
        self.assertEqual(response.status_code, 302)
        # Verificar que efectivaente intente redirigir a la ruta correcta
        self.assertEqual(response.headers.get('Location'), '/resultadoSimulacion')

    def test_frontera_hu1_cuotas_invalidas(self):
        """
        Prueba HU1: Valor frontera.
        Se evalúa el límite inferior estricto de meses para pagar (0 cuotas).
        """
        payload = {
            "monto": 5000000,
            "cuotas": 0,       # Valor frontera inválido
            "tasa": 1.4
        }
        response = requests.post(self.base_url, json=payload, headers=self.headers)
        
        # El sistema debe rechazar (Status 400) una simulación a cero cuotas
        self.assertEqual(response.status_code, 400)
        # Validar que arroje el mensaje de error exacto programado en el backend
        self.assertEqual(response.text, "Faltan datos para la simulación")

if __name__ == '__main__':
    unittest.main()