import streamlit as st

# Configuración de la página
st.set_page_config(
    page_title="VizProo Wiki",
    page_icon="🌟",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personalizado para estilo wiki
st.markdown("""
<style>
    /* Sidebar styling */
    [data-testid="stSidebar"] {
        background-color: #f6f8fa;
    }

    /* Main content styling */
    .main-title {
        color: #0969da;
        font-size: 2.5em;
        font-weight: 700;
        margin-bottom: 0.5em;
    }

    .subtitle {
        color: #656d76;
        font-size: 1.2em;
        margin-bottom: 2em;
    }

    .feature-card {
        background: #ffffff;
        padding: 1.5em;
        border-radius: 8px;
        border: 1px solid #d0d7de;
        margin-bottom: 1em;
    }

    .feature-icon {
        font-size: 1.5em;
        margin-right: 0.5em;
    }

    .code-block {
        background: #f6f8fa;
        padding: 1em;
        border-radius: 6px;
        border-left: 3px solid #0969da;
        font-family: monospace;
    }

    .next-steps {
        background: #ddf4ff;
        padding: 1.5em;
        border-radius: 8px;
        border-left: 4px solid #0969da;
        margin-top: 2em;
    }

    .warning-box {
        background: #fff8c5;
        padding: 1em;
        border-radius: 6px;
        border-left: 4px solid #d29922;
        margin: 1em 0;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar con navegación
with st.sidebar:
    st.markdown("# 🌟 VizProo")
    st.markdown("---")

    # Menú de navegación
    page = st.radio(
        "Navegación",
        ["🏠 Home", "📥 Instalación", "🧪 Uso Básico", "🧩 Custom Charts", "🧪 Desarrollo", "📊 Dashboards", "📈 Ejemplos"],
        label_visibility="collapsed"
    )

    st.markdown("---")
    st.markdown("### 📚 Recursos")
    st.markdown("[GitHub](https://github.com/MatiasMaravi/vizproo)")
    st.markdown("[Reportar Issue](https://github.com/MatiasMaravi/vizproo/issues)")

    st.markdown("---")
    st.caption("VizProo v0.1.0")

# Contenido principal según la página seleccionada
if page == "🏠 Home":
    st.markdown('<h1 class="main-title">🌟 VizProo</h1>', unsafe_allow_html=True)
    st.markdown('<p class="subtitle">¡Bienvenido a la documentación oficial de VizProo!</p>', unsafe_allow_html=True)

    st.markdown("""
    **VizProo** es una biblioteca de visualización de datos en Python diseñada para facilitar la creación de gráficos 
    interactivos, personalizables y estéticamente atractivos. Con VizProo podrás transformar tus datos en 
    visualizaciones poderosas con muy pocas líneas de código.

    Basado en **ipywidgets** y **D3.js**, VizProo ofrece una experiencia fluida e interactiva dentro de entornos Jupyter.
    """)

    st.markdown("## 🚀 ¿Por qué usar VizProo?")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("""
        <div class="feature-card">
            <h3><span class="feature-icon">✨</span>Interactividad real</h3>
            <p>A diferencia de muchas librerías que generan gráficos estáticos, VizProo permite explorar datos 
            dinámicamente mediante zoom, filtros y otros controles interactivos.</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="feature-card">
            <h3><span class="feature-icon">📓</span>Optimizado para Jupyter</h3>
            <p>Funciona perfectamente en Jupyter Notebook y JupyterLab, ideal para análisis exploratorio, 
            docencia y proyectos de ciencia de datos.</p>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div class="feature-card">
            <h3><span class="feature-icon">🧩</span>Simplicidad primero</h3>
            <p>Su sintaxis es clara e intuitiva, pensada para que puedas crear gráficos complejos sin necesidad 
            de dominar D3.js o técnicas avanzadas de front-end.</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="feature-card">
            <h3><span class="feature-icon">📊</span>Dashboards integrados</h3>
            <p>Combina fácilmente varios gráficos interactivos en un mismo dashboard, permitiendo análisis 
            completos y presentaciones más efectivas.</p>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("""
    <div class="next-steps">
        <h2>📘 Próximos pasos</h2>
        <p>Para comenzar a usar VizProo:</p>
        <ul>
            <li>📥 Sigue la guía de <strong>Instalación</strong> para configurar la biblioteca en tu entorno.</li>
            <li>🧪 Revisa <strong>Uso Básico</strong> y aprende a crear tus primeras visualizaciones.</li>
            <li>🛠️ ¿Quieres usar tus propios gráficos en D3.js? Explora <strong>Custom Charts</strong>.</li>
            <li>🤝 Si te interesa contribuir, consulta la guía de <strong>Desarrollo</strong> y únete a la mejora continua de VizProo.</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")
    st.success(
        "¡Gracias por elegir VizProo! 🙌 Tu apoyo impulsa el desarrollo de herramientas abiertas y accesibles para la comunidad de visualización de datos.")

elif page == "📥 Instalación":
    st.markdown("# 📥 Instalación")
    st.markdown(
        "VizProo es una herramienta para la visualización de datos en Python. Aquí se muestran las dos formas recomendadas de instalación.")

    tab1, tab2 = st.tabs(["📦 Instalación vía pip", "🛠 Instalación desde código fuente"])

    with tab1:
        st.markdown("### La forma más sencilla")
        st.markdown("Usando pip (asegúrese de tener Python 3.11+):")

        st.code("pip install vizproo", language="bash")

        st.success("✅ Esto instalará la última versión estable junto con sus dependencias (pandas, anywidget).")

    with tab2:
        st.markdown("### Ideal para desarrollo y contribuciones")
        st.markdown("Si desea contribuir, depurar o modificar el paquete.")

        st.markdown("#### 🔍 Requisitos previos")
        st.markdown("""
        - Python 3.11 o superior 🐍
        - **Opcional** para tareas de desarrollo frontend:
          - Node.js v20.x.x
          - npm 9.x.x o superior
          - yarn 1.22.x o superior
        """)

        st.markdown("#### 🚧 Pasos")

        st.markdown("**1. Clonar el repositorio:**")
        st.code("git clone https://github.com/MatiasMaravi/vizproo.git", language="bash")

        st.markdown("**2. Entrar al directorio:**")
        st.code("cd vizproo", language="bash")

        st.markdown("**3. Crear y activar entorno virtual (recomendado) ⚠️**")

        col1, col2 = st.columns(2)
        with col1:
            st.markdown("**Windows:**")
            st.code("""python -m venv venv
.\\venv\\Scripts\\activate""", language="bash")

        with col2:
            st.markdown("**macOS / Linux:**")
            st.code("""python3 -m venv venv
source venv/bin/activate""", language="bash")

        st.markdown("**4. Instalar dependencias de Python:**")
        st.code("""pip install -r requirements.txt
jlpm install""", language="bash")

        st.markdown("**5. Instalación en modo editable + build:**")
        st.code("""pip install -e .
npm run build""", language="bash")

        st.info("Si no modificará la parte frontend, puede omitir `npm run build`.")

        st.success("✅ Listo: VizProo queda disponible en su entorno y podrá importarlo en sus scripts o notebooks.")

    st.markdown("---")
    st.markdown("""
    <div class="next-steps">
        <h3>📚 Próximos pasos</h3>
        <ul>
            <li>Revise la página de <strong>Uso Básico</strong> para comenzar.</li>
            <li>Si desea contribuir o extender la librería, consulte la sección de <strong>Desarrollo</strong>. 🧪</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="warning-box">
        ✨ <strong>Sugerencia:</strong> Mantenga su entorno aislado para evitar conflictos de versiones.
    </div>
    """, unsafe_allow_html=True)

elif page == "🧪 Uso Básico":
    st.markdown("# 🧪 Uso Básico")
    st.markdown("## Inicio Rápido de VizProo ⚡")

    st.markdown("""
    VizProo es una herramienta para la visualización interactiva de datos en Python. 
    Aquí verás cómo dar tus primeros pasos rápidamente.
    """)

    st.info("Primero asegúrese de tener VizProo instalado. Si no lo ha hecho, revise la guía de **Instalación** 🛠")

    st.markdown("## Requisitos Previos 📋")
    st.markdown("**Actualmente soportado:**")
    st.markdown("""
    - ✅ Jupyter Notebook / JupyterLab
    - ✅ Notebooks de Visual Studio Code
    - 🧪 Próximamente: Google Colab y otros entornos
    """)

    st.markdown("## Uso Básico 🧪")

    st.markdown("### 1. Abra el notebook de introducción")
    st.markdown("Navegue a la carpeta `examples` y abra el notebook `introduction`.")

    st.markdown("### 2. Importe la librería y cargue datos")
    st.code("""from vizproo import Chart
import pandas as pd

# Cargar sus datos
df = pd.read_csv('your_data.csv')""", language="python")

    st.markdown("### 3. Genere su primer gráfico")
    st.code("""# Crear gráfico
chart = Chart(df)
chart.show()""", language="python")

    st.markdown("## 📊 ¿Qué incluye el notebook?")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("""
        <div class="feature-card">
            <h4>🎯 Primer gráfico</h4>
            <p>Cómo crear visualizaciones básicas</p>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div class="feature-card">
            <h4>🖱️ Interactividad</h4>
            <p>Selección de puntos y controles</p>
        </div>
        """, unsafe_allow_html=True)

    with col3:
        st.markdown("""
        <div class="feature-card">
            <h4>📊 Recuperar datos</h4>
            <p>Análisis de selecciones</p>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("""
    <div class="next-steps">
        <h3>🚀 Próximos Pasos</h3>
        <p>Explora funcionalidades avanzadas:</p>
        <ul>
            <li><strong>Custom Charts 🧩:</strong> Integrar gráficos personalizados con D3.js</li>
            <li><strong>Dashboards 🗂️:</strong> Componer vistas interactivas con múltiples gráficos</li>
            <li><strong>Desarrollo 🧪:</strong> Guía para contribuir y extender VizProo</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="warning-box">
        💡 <strong>Consejo:</strong> Usa entornos virtuales para aislar dependencias.
    </div>
    """, unsafe_allow_html=True)

elif page == "🧩 Custom Charts":
    st.markdown("# 🧩 Custom Charts")
    st.markdown(
        "Puedes integrar gráficos personalizados hechos con D3.js para cubrir casos donde las visualizaciones estándar no son suficientes.")

    st.markdown("## 🌟 ¿Por qué usar gráficos personalizados?")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("""
        - ✅ Soporte para diseños altamente específicos
        - 🔧 Extensión de la librería sin esperar nuevas versiones
        - ♻️ Reutilización de código existente en D3
        """)

    with col2:
        st.markdown("""
        - 🎮 Mayor control sobre interacción y estilos
        - 🚀 Implementación de visualizaciones únicas
        - 🎨 Personalización completa del aspecto
        """)

    st.markdown("## ⚡ Uso rápido")

    st.markdown("### 1. Abre el notebook de ejemplo")
    st.code("examples/custom_charts.ipynb", language="text")

    st.markdown("### 2. Estructura mínima requerida")
    st.code("""from vizproo import CustomChart

class MyCustomChart(CustomChart):
    def __init__(self, data, **kwargs):
        super().__init__(data, **kwargs)

    def render(self):
        # Tu código D3.js aquí
        pass""", language="python")

    st.markdown("### 3. Implementa tu función de renderizado D3")
    st.code("""// JavaScript/D3.js
function render(data, element) {
    const svg = d3.select(element)
        .append('svg')
        .attr('width', 800)
        .attr('height', 600);

    // Tu lógica de visualización
}""", language="javascript")

    st.markdown("### 4. Conecta datos desde VizProo")
    st.code("""chart = MyCustomChart(df)
chart.show()""", language="python")

    st.markdown("## ✅ Recomendaciones")

    st.markdown("""
    <div class="feature-card">
        <h4>📊 Normaliza datos</h4>
        <p>Prepara y valida los datos antes de pasarlos al gráfico para evitar errores en tiempo de ejecución.</p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="feature-card">
        <h4>⚡ Optimiza rendimiento</h4>
        <p>Evita operaciones pesadas en cada frame. Usa técnicas como debouncing y throttling.</p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="feature-card">
        <h4>🎨 Aísla estilos</h4>
        <p>Usa clases o prefijos únicos para evitar colisiones de estilos CSS con otros componentes.</p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="feature-card">
        <h4>📝 Documenta</h4>
        <p>Documenta todos los parámetros esperados, tipos de datos y comportamientos especiales.</p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")
    st.success(
        "🧪 **El límite es tu imaginación** - Crea visualizaciones únicas que se adapten perfectamente a tus necesidades.")

elif page == "🧪 Desarrollo":
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

elif page == "📊 Dashboards":
    st.markdown("# 📊 Dashboards")
    st.markdown("""
    Los dashboards en VizProo permiten combinar múltiples visualizaciones interactivas en una sola vista 
    para comparar, explorar y descubrir patrones más rápido.
    """)

    st.markdown("## 🌟 ¿Qué ofrecen?")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("""
        <div class="feature-card">
            <h4>🎯 Integración múltiple</h4>
            <p>Combina varios gráficos en un layout coherente y organizado.</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="feature-card">
            <h4>⚡ Ahorro de tiempo</h4>
            <p>Acelera el análisis exploratorio con visualizaciones coordinadas.</p>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div class="feature-card">
            <h4>🔗 Interactividad sincronizada</h4>
            <p>Filtros, selecciones y estados compartidos entre gráficos.</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="feature-card">
            <h4>📢 Mejor comunicación</h4>
            <p>Presenta hallazgos de forma clara y profesional.</p>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("## ⚡ Uso rápido")

    st.markdown("### 1. Abre el notebook de dashboards")
    st.code("examples/dashboards.ipynb", language="text")

    st.markdown("### 2. Crea tu primer dashboard")
    st.code("""from vizproo import Dashboard, Chart

# Crear gráficos individuales
chart1 = Chart(df1, title="Ventas por Región")
chart2 = Chart(df2, title="Tendencia Temporal")
chart3 = Chart(df3, title="Distribución de Productos")

# Combinar en un dashboard
dashboard = Dashboard([chart1, chart2, chart3], 
                     layout='grid',
                     columns=2)
dashboard.show()""", language="python")

    st.markdown("### 3. Configura el layout")
    st.markdown("""
    - **Grid**: Distribución automática en cuadrícula
    - **Vertical**: Apilamiento vertical
    - **Horizontal**: Disposición horizontal
    - **Custom**: Layout personalizado con coordenadas
    """)

    st.markdown("### 4. Sincroniza interacciones")
    st.code("""# Compartir selecciones entre gráficos
dashboard.link_selection([chart1, chart2])

# Compartir filtros
dashboard.link_filters([chart2, chart3])""", language="python")

    st.markdown("## 📊 Ejemplo completo")

    st.code("""import pandas as pd
from vizproo import Dashboard, ScatterPlot, LineChart, BarChart

# Cargar datos
df = pd.read_csv('data.csv')

# Crear visualizaciones
scatter = ScatterPlot(df, x='price', y='sales', color='category')
line = LineChart(df, x='date', y='revenue')
bar = BarChart(df, x='category', y='quantity')

# Configurar dashboard
dashboard = Dashboard(
    charts=[scatter, line, bar],
    layout='grid',
    columns=2,
    title='Análisis de Ventas 2024',
    theme='modern'
)

# Vincular interacciones
dashboard.link_selection([scatter, bar])

# Mostrar
dashboard.show()""", language="python")

    st.markdown("---")
    st.success("📈 **Listo para empezar:** abre el notebook y crea tu primer dashboard hoy.")

    st.markdown("""
    <div class="warning-box">
        💡 <strong>Tip:</strong> Los dashboards se pueden exportar a HTML estático para compartir sin necesidad de Python.
    </div>
    """, unsafe_allow_html=True)

elif page == "📈 Ejemplos":
    st.markdown("# 📈 Ejemplos")
    st.markdown("Colección de ejemplos estilo Matplotlib para explorar lo que puedes hacer con VizProo.")

    # Tabs para los plots
    tab_barplot, tab_scatter = st.tabs(["BarPlot", "ScatterPlot"])

    with tab_barplot:
        st.markdown("## BarPlot")
        st.markdown("""
        Este ejemplo utiliza el dataset Iris de Seaborn para mostrar un gráfico de barras
        donde el eje X corresponde a una categoría y el eje Y a un valor agregado.
        """)

        # Imagen de resultado (reemplaza la ruta con la correcta en tu entorno)
        st.image("../vizproo/docs/images/barplot.png", caption="Ejemplo de BarPlot con Iris", width=True)

        st.markdown("### Código de ejemplo")
        st.code("""
from vizproo import BarPlot
import seaborn as sns

# Cargar dataset de ejemplo (Iris)
iris = sns.load_dataset('iris')

# Crear gráfico de barras
barplot = BarPlot(data=iris, x='sepal_width', y='sepal_length')

# Mostrar el gráfico en el notebook
barplot
""", language="python")

        st.markdown("""
        <div class="feature-card">
            <h4>Notas</h4>
            <ul>
                <li>Asegúrate de tener instalado <code>seaborn</code> para cargar el dataset Iris.</li>
                <li>Puedes cambiar las columnas para adaptar el ejemplo a tus datos.</li>
                <li>La selección de barras se sincroniza con Python si registras un callback.</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with tab_scatter:
        st.markdown("## ScatterPlot")
        st.markdown("""
        Este ejemplo utiliza el dataset Iris de Seaborn para mostrar un gráfico de dispersión
        donde el eje X e Y corresponden a columnas numéricas, y 'hue' colorea por especie.
        """)
        # Imagen de resultado (ajusta la ruta según tu entorno)
        st.image("../vizproo/docs/images/scatterplot.png", caption="Ejemplo de ScatterPlot con Iris", width=True)

        st.markdown("### Código de ejemplo")
        st.code("""
from vizproo import ScatterPlot
import seaborn as sns

# Cargar dataset de ejemplo (Iris)
iris = sns.load_dataset('iris')

# Crear gráfico de dispersión
scatterplot = ScatterPlot(data=iris, x='sepal_width', y='sepal_length', hue='species')

# Mostrar el gráfico en el notebook
scatterplot
""", language="python")

        st.markdown("""
        <div class="feature-card">
            <h4>Notas</h4>
            <ul>
                <li>Asegúrate de tener instalado <code>seaborn</code> para cargar el dataset Iris.</li>
                <li>Puedes ajustar <code>pointSize</code> y <code>opacity</code> para mejorar la visualización.</li>
                <li>La selección de puntos se sincroniza con Python si registras un callback.</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #656d76; padding: 2em 0;'>
    <p>Desarrollado con ❤️ por la comunidad VizProo</p>
    <p>
        <a href="https://github.com/MatiasMaravi/vizproo" style='color: #0969da; text-decoration: none;'>GitHub</a> • 
        <a href="https://github.com/MatiasMaravi/vizproo/issues" style='color: #0969da; text-decoration: none;'>Issues</a> • 
        <a href="#" style='color: #0969da; text-decoration: none;'>Documentación</a>
    </p>
</div>
""", unsafe_allow_html=True)