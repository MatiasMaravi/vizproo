# Desarrollo 🛠
Si quieres contribuir a VizProo, aquí tienes una guía concisa para comprender la arquitectura y crear nuevos gráficos.

## Requisitos Previos 📋
Obligatorio:
- Python 3.11+ 🐍
- Node.js v20.x.x ▶️
- npm 9.x.x+
- yarn 1.22.x+

## Arquitectura 🧱
VizProo se distribuye en dos paquetes:
- Python (paquete vizproo): integra con Jupyter (ipywidgets) y expone la API al usuario.
- TypeScript (paquete vizproo-js): renderiza gráficos y widgets usando D3.js.

Estructura principal:

Backend (TypeScript, carpeta src):
- src/base/: Clases base (Plot, Model, View).
- src/const/: Constantes globales.
- src/graphs/: Implementaciones de gráficos.
- src/widgets/: Widgets genéricos.
- src/layouts/: Dashboards.
- src/extension.ts: Conexión ipywidgets ↔ D3.js.
- src/index.ts: Punto de exportación.
- src/plugin.ts: Activación de la extensión.
- src/version.ts: Versión del paquete JS.
- css/: Estilos.

Frontend (Python, carpeta vizproo):
- vizproo/graphs_/: Gráficos en Python.
- vizproo/base_widget.py: Clase base.
- vizproo/graphs.py: Re-exportación de gráficos.
- vizproo/layouts.py: Dashboards en Python.
- vizproo/widgets.py: Widgets en Python.
- vizproo/custom.py: Gráficos personalizados D3.
- vizproo/_frontend.py / _version.py / __init__.py: Metadatos y registro.

## Añadir un nuevo gráfico ➕
Requiere nociones de D3.js, TypeScript y POO en Python.

### 1. Lado TypeScript 🧩
1. Crear archivo en src/graphs/, ej: my_graph.ts.
2. Definir tres clases obligatorias:
   - export class MyGraph extends BasePlot
   - export class MyGraphModel extends BaseModel
   - export class MyGraphView extends BaseView
3. Recibir datos y opciones vía atributos del Model.
4. Registrar exportaciones en src/index.ts si aplica.

Ejemplo mínimo:
```ts
// src/graphs/my_graph.ts
export class MyGraph extends BasePlot { /* lógica de rendering */ }
export class MyGraphModel extends BaseModel { /* estado y sync */ }
export class MyGraphView extends BaseView { /* DOM + eventos */ }
```

### 2. Lado Python 🐍
1. Crear archivo vizproo/graphs_/my_graph.py.
2. Heredar de BaseWidget y registrar el widget:
```python
# vizproo/graphs_/my_graph.py
from vizproo.base_widget import BaseWidget
from ipywidgets import register

@register
class MyGraph(BaseWidget):
    _model_name = "MyGraphModel"
    _view_name = "MyGraphView"
    _model_module = "vizproo-js"
    _view_module = "vizproo-js"
    _model_module_version = "^0.1.0"
    _view_module_version = "^0.1.0"
    # def __init__(self, data=None, **kwargs):
    #     super().__init__(data=data, **kwargs)
```
3. Importar en vizproo/graphs.py y opcionalmente exponer en __init__.py.
4. Probar en Jupyter: instanciar y verificar sincronización.

### 3. Pruebas ✅
- Cargar un DataFrame y pasar al widget.
- Validar eventos (selección / actualización).
- Revisar consola del navegador ante errores.

## Consejos 🔧
- Mantén nombres de atributos consistentes entre Python y TypeScript.
- Usa entornos virtuales para aislar dependencias.
- Ejecuta npm run build tras cambios en TypeScript.
- Añade ejemplos en examples/ para facilitar revisión.

## Próximo Paso 🚀
Cuando tu gráfico funcione: abre un issue o PR describiendo objetivo, API y capturas. 