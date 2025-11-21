# Instalación de VizProo 🚀
VizProo es una herramienta para la visualización de datos en Python. Aquí se muestran las dos formas recomendadas de instalación. Elija la que mejor se adapte a su caso.

## 📦 Instalación vía pip
La forma más sencilla es usando pip (asegúrese de tener Python 3.11+):
```bash
pip install vizproo
```
Esto instalará la última versión estable junto con sus dependencias (pandas, anywidget). ✅

## 🛠 Instalación desde el código fuente
Ideal si desea contribuir, depurar o modificar el paquete.

### 🔍 Requisitos previos
- Python 3.11 o superior 🐍

Opcional para tareas de desarrollo frontend:
- Node.js v20.x.x
- npm 9.x.x o superior
- yarn 1.22.x o superior

### 🚧 Pasos
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/MatiasMaravi/vizproo.git
   ```
2. Entrar al directorio:
   ```bash
   cd vizproo
   ```
3. Crear y activar entorno virtual (recomendado) ⚠️  
   Windows:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
   macOS / Linux:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
4. Instalar dependencias de Python (y las de frontend si aplica):
   ```bash
   pip install -r requirements.txt
   jlpm install
   ```
5. Instalación en modo editable + build:
   ```bash
   pip install -e .
   npm run build
   ```
   (Si no modificará la parte frontend, puede omitir npm run build.)

✅ Listo: VizProo queda disponible en su entorno y podrá importarlo en sus scripts o notebooks.

## 📚 Próximos pasos
Revise la página de [Uso Básico](./uso_basico.md) para comenzar.  
Si desea contribuir o extender la librería, consulte la sección de [Desarrollo](./desarrollo.md). 🧪

✨ Sugerencia: Mantenga su entorno aislado para evitar conflictos de versiones.