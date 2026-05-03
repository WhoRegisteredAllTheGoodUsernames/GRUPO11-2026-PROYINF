import unittest
import requests

class TestEndpointUno(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """
        Set up para los tests del primer endpoint.
        """
        print("Preparando contexto para Endpoint 1...")
        cls.base_url = "http://localhost:3001/api/endpoint_uno"
        cls.headers = {"Content-Type": "application/json"}

    @classmethod
    def tearDownClass(cls):
        """
        Limpieza para el primer endpoint.
        """
        print("Limpiando contexto de Endpoint 1...")


    def test_escenario_valido_endpoint_uno(self):
        """
        Prueba HU-X (Post-it Y): Caso de prueba funcional con clase de equivalencia válida.
        """
        # Preparar
        # payload = {"dato": ""}

        # Ejecutar
        response = requests.get(f"", headers=self.headers)

        # Assert
        # self.assertEqual()


    def test_frontera_endpoint_uno(self):
        """
        Prueba HU-X (Post-it Y): Resultado excepcional esperado por valor frontera o input inválido.
        """
        # Preparar
        # payload = {"dato": ""}

        # Ejecutar
        response = requests.get(f"", headers=self.headers)

        # Assert
        # self.assertEqual(response.status_code, 400)
        # self.assertIn("Error de validación", response.json().get("message"))


class TestEndpointDos(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """
        Set up para los tests del segundo endpoint.
        """
        print("Preparando contexto para Endpoint 2...")
        cls.base_url = "http://localhost:3001/api/endpoint_dos"
        cls.headers = {"Content-Type": "application/json"}

    @classmethod
    def tearDownClass(cls):
        """
        Limpieza para el segundo endpoint.
        """
        print("Limpiando contexto de Endpoint 2...")

    def test_escenario_valido_endpoint_dos(self):
        """
        Prueba HU-X (Post-it Y): Caso de prueba funcional con clase de equivalencia válida.
        """
        # Preparar
        # payload = {"dato": ""}

        # Ejecutar
        response = requests.get(f"", headers=self.headers)

        # Assert
        # self.assertEqual()

    def test_frontera_endpoint_dos(self):
        """
        Prueba HU-X (Post-it Y): Resultado excepcional esperado por valor frontera o input inválido.
        """
        # Preparar
        # payload = {"dato": ""}

        # Ejecutar
        response = requests.get(f"", headers=self.headers)

        # Assert
        # self.assertEqual(response.status_code, 400)
        # self.assertIn("Error de validación", response.json().get("message"))


if __name__ == '__main__':
    unittest.main()
