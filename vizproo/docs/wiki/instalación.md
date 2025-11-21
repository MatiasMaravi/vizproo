# Instalación de VizProo
VizProo es una herramienta poderosa para la visualización de datos. A continuación, se detallan los pasos necesarios para instalar VizProo en su sistema.

## Pip install
La forma más sencilla de instalar VizProo es utilizando pip, el gestor de paquetes de Python. Abra su terminal y ejecute el siguiente comando:

```bash
pip install vizproo
```
Esto descargará e instalará la última versión de VizProo desde el repositorio oficial de PyPI. Además como sus dependencias (pandas, anywidget).

## Instalación desde el código fuente
Si prefiere instalar VizProo desde el código fuente, primero verifica que cuentas con los siguientes requisitos previos:
- Python 3.11 o superior

(Opcionalmente para desarrollo o modificacion de la libreria)
- Node.js v20.x.x 
- npm 9.x.x o superior
- yarn 1.22.x o superior

 siga estos pasos:
1. Clone el repositorio de VizProo desde GitHub:
   ```bash
   git clone https://github.com/MatiasMaravi/vizproo.git
    ```
2. Crea un entorno virtual (muy recomendado):
2.1 Windows:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # En Windows use 
   ```
2.2 macOS/Linux:
   ```bash
    python3 -m venv venv
    source venv/bin/activate
   ```
3. Instale las dependencias necesarias:
   ```bash
    pip install -r requirements.txt
    jlpm install
   ```
4. Navegue al directorio del proyecto:
   ```bash
    cd vizproo
   ```
5. Instale VizProo en modo desarrollo:
   ```bash
    pip install -e .
    npm run build
   ```
Esto instalará VizProo y sus dependencias en su entorno virtual. Ahora puede comenzar a usar VizProo en sus proyectos de Python.
Revise la página de [Uso Básico](./uso_basico.md) para aprender cómo empezar a utilizar VizProo.
Si quisiera modificar la librería, revisa la sección de [Desarrollo](./desarrollo.md).