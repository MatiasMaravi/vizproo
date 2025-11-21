# Desarrollo
Si estás interesado en contribuir al desarrollo de VizProo, esta sección te proporcionará la información necesaria para comenzar.

## Requisitos Previos
Antes de comenzar, asegúrate de tener instalados los siguientes requisitos previos en tu sistema:
- Python 3.11 o superior
- Node.js v20.x.x
- npm 9.x.x o superior
- yarn 1.22.x o superior

## Arquitectura del Proyecto
VizProo está estructurado en varios módulos principales que facilitan su desarrollo y mantenimiento. A continuación, se describen brevemente los componentes clave del proyecto.
VizProo se divide en dos partes principales o también llamados paquetes: el frontend (implementado en Python) y el backend (implementado en TypeScript con D3.js). El primero se llama "vizproo" y el segundo "vizproo-js".
Backend(Carpeta src):
Toda la lógica de los gráficos y widgets está implementada en TypeScript utilizando D3.js para la visualización de datos.
- **src/base/**: Contiene el código fuente base para la creación de nuevos gráficos y widgets.
- **src/const/**: Contiene constantes utilizadas en el proyecto.
- **src/graphs/**: Contiene la implementación de los gráficos específicos de VizProo.
- **src/widgets/**: Contiene la implementación de los widgets personalizados de VizProo.
- **src/layouts/**: Contiene la implementación de los Dashboards.
- **src/extension.ts**: Archivo principal de conexión entre el frontend(ipywidgets) y el backend(d3.js).
- **src/index.ts**: Punto donde se exporta todo el código fuente de TypeScript.
- **src/plugin.ts**: Código que activa la extensión del widget.
- **src/version.ts**: Código con información sobre la versión del paquete backend.
- **css/**: Contiene los estilos CSS utilizados en los gráficos y widgets de VizProo.
Frontend(Carpeta vizproo):
Contiene la implementación de los gráficos y widgets para poder ser mostrados en los notebooks mediante ipywidgets.
- **vizproo/graphs_/**: Contiene la implementación de los gráficos específicos de VizProo en Python.
- **vizproo/__init__.py**: Archivo de inicialización del paquete VizProo en Python.
- **vizproo/_frontend.py**: Código con información sobre el paquete frontend de los widgets.
- **vizproo/_version.py**: Código con información sobre la versión del paquete frontend.
- **vizproo/base_widget.py**: Contiene la clase base para la creación de nuevos gráficos y widgets en Python.
- **vizproo/graphs.py**: Contiene los imports de los gráficos en la carpeta graphs_.
- **vizproo/layouts.py**: Contiene la implementación de como mostrar los Dashboards en Python.
- **vizproo/widgets.py**: Contiene la implementación de como mostrar los widgets en Python.
- **vizproo/custom.py**: Contiene la implementación para importar gráficos personalizados de D3.js en Python.
## ¿Cómo agregar un nuevo gráfico?
Para esto es necesario tener conocimientos básicos de D3.js, TypeScript y programación orientada a objetos en Python.

Se puede comenzar a escribir primero el backend (TypeScript) y luego el frontend (Python) o viceversa. A continuación, se describen los pasos generales para agregar un nuevo gráfico a VizProo:

1. **Crear el gráfico en TypeScript**:
   - Navega a la carpeta `src/graphs/` y crea un nuevo archivo para tu gráfico, por ejemplo, `my_graph.ts`.
   - Implementa la lógica de visualización utilizando D3.js y asegúrate de que el gráfico pueda recibir datos y configuraciones desde el frontend (puedes guiarte por los gráficos existentes).
   - Es obligatorio tener estas 3 clases:
   - export class my_graph extends BasePlot (Obligatorio heredar de BasePlot)
   - export class RadVizModel extends BaseModel (Obligatorio heredar de BaseModel)
   - export class RadVizView extends BaseView (Obligatorio heredar de BaseView)
Es obligatorio tener las tres clases porque la primera es la que se encarga de la lógica del gráfico, la segunda es la que maneja el modelo de datos y la tercera es la que maneja la vista del gráfico.

1. **Crear el gráfico en Python**:
   - Navega a la carpeta `vizproo/graphs_` y crea un nuevo archivo para tu gráfico, por ejemplo, `my_graph.py`.
   - Implementa la clase del gráfico en Python, asegurándote de que herede de `BaseWidget` y defina los atributos necesarios para la configuración del gráfico.
    @widgets.register 
    class MyGraph(BaseWidget):
    - Asegurate de que los atributos de la clase coincidan con los definidos en el backend (TypeScript) para que puedan comunicarse correctamente.
    - Exportarlo en el archivo `vizproo/__init__.py`.
    - Importarlo en el archivo `vizproo/graphs.py`.
  
Esos son los pasos generales para agregar un nuevo gráfico a VizProo. Asegúrate de probar tu gráfico en un entorno Jupyter Notebook para verificar que funcione correctamente y que la comunicación entre el frontend y el backend sea exitosa.