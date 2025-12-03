import streamlit as st

def show_development():
    st.markdown("# 🧪 Desarrollo")
    st.markdown(
        "Si quieres contribuir a VizProo, aquí tienes una guía concisa para comprender la arquitectura y crear nuevos gráficos.")

    st.markdown("## Requisitos Previos 📋")

    st.markdown("### Obligatorio:")
    st.markdown("""
    - Python 3.11+ 🐍
    - Node.js v20.x.x ▶️
    - npm 9.x.x+
    - yarn 1.22.x+
    """)

    st.markdown("## Arquitectura 🧱")

    st.markdown("""
    VizProo se distribuye en dos paquetes:

    1. **Python** (paquete `vizproo`): integra con Jupyter (ipywidgets) y expone la API al usuario.
    2. **TypeScript** (paquete `vizproo-js`): renderiza gráficos y widgets usando D3.js.
    """)

    tab1, tab2 = st.tabs(["Backend (TypeScript)", "Frontend (Python)"])

    with tab1:
        st.markdown("### Estructura del Backend")
        st.code("""src/
├── base/          # Clases base (Plot, Model, View)
├── const/         # Constantes globales
├── graphs/        # Implementaciones de gráficos
├── widgets/       # Widgets genéricos
├── layouts/       # Dashboards
├── extension.ts   # Conexión ipywidgets ↔ D3.js
├── index.ts       # Punto de exportación
├── plugin.ts      # Activación de la extensión
└── version.ts     # Versión del paquete JS

css/               # Estilos""", language="text")

    with tab2:
        st.markdown("### Estructura del Frontend")
        st.code("""vizproo/
├── graphs_/           # Gráficos en Python
├── base_widget.py     # Clase base
├── graphs.py          # Re-exportación de gráficos
├── layouts.py         # Dashboards en Python
├── widgets.py         # Widgets en Python
├── custom.py          # Gráficos personalizados D3
├── _frontend.py       # Metadatos
├── _version.py        # Versión
└── __init__.py        # Registro""", language="text")

    st.markdown("## Añadir un nuevo gráfico ➕")

    st.info("Requiere nociones de D3.js, TypeScript y POO en Python.")

    st.markdown("### 1️⃣ Lado TypeScript 🧩")

    st.markdown("**Crear archivo** en `src/graphs/`, ejemplo: `my_graph.ts`")

    st.code("""// src/graphs/my_graph.ts
import { BasePlot, BaseModel, BaseView } from '../base';

export class MyGraph extends BasePlot {
    // Lógica de rendering
}

export class MyGraphModel extends BaseModel {
    // Estado y sincronización
}

export class MyGraphView extends BaseView {
    // DOM + eventos
}""", language="typescript")

    st.markdown("**Registrar** exportaciones en `src/index.ts`")

    st.markdown("### 2️⃣ Lado Python 🐍")

    st.markdown("**Crear archivo** `vizproo/graphs_/my_graph.py`")

    st.code("""from vizproo.base_widget import BaseWidget
from ipywidgets import register

@register
class MyGraph(BaseWidget):
    _model_name = "MyGraphModel"
    _view_name = "MyGraphView"
    _model_module = "vizproo-js"
    _view_module = "vizproo-js"
    _model_module_version = "^0.1.0"
    _view_module_version = "^0.1.0"

    def __init__(self, data=None, **kwargs):
        super().__init__(data=data, **kwargs)""", language="python")

    st.markdown("**Importar** en `vizproo/graphs.py` y opcionalmente exponer en `__init__.py`")

    st.markdown("### 3️⃣ Pruebas ✅")

    st.markdown("""
    1. Cargar un DataFrame y pasar al widget
    2. Validar eventos (selección / actualización)
    3. Revisar consola del navegador ante errores
    """)

    st.markdown("## Consejos 🔧")

    st.markdown("""
    <div class="feature-card">
        <p>✅ Mantén nombres de atributos consistentes entre Python y TypeScript</p>
        <p>✅ Usa entornos virtuales para aislar dependencias</p>
        <p>✅ Ejecuta <code>npm run build</code> tras cambios en TypeScript</p>
        <p>✅ Añade ejemplos en <code>examples/</code> para facilitar revisión</p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("""
    <div class="next-steps">
        <h3>🚀 Próximo Paso</h3>
        <p>Cuando tu gráfico funcione: abre un <strong>issue</strong> o <strong>PR</strong> describiendo objetivo, API y capturas.</p>
    </div>
    """, unsafe_allow_html=True)
