import streamlit as st

def show_examples():
    st.markdown("# 📈 Ejemplos")
    st.markdown("Colección de ejemplos estilo Matplotlib para explorar lo que puedes hacer con VizProo.")

    # Tabs para los plots
    tab_barplot, tab_scatter, tab_radviz, tab_starcoordinates = st.tabs(["BarPlot", "ScatterPlot","RadViz","StarCoordinates"])

    with tab_barplot:
        st.markdown("## BarPlot")
        st.markdown("""
        Este ejemplo utiliza el dataset Iris de Seaborn para mostrar un gráfico de barras
        donde el eje X corresponde a una categoría y el eje Y a un valor agregado.
        """)

        # Imagen de resultado (reemplaza la ruta con la correcta en tu entorno)
        st.image("../vizproo/docs/images/barplot.png", caption="Ejemplo de BarPlot con Iris", width="content")

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
        st.image("../vizproo/docs/images/scatterplot.png", caption="Ejemplo de ScatterPlot con Iris", width="content")

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
    with tab_radviz:
        st.markdown("## RadViz")
        st.markdown("""
                    Este ejemplo utiliza el dataset Iris de Seaborn para mostrar un gráfico multidimensional
                    en formato RadViz, permitiendo visualizar múltiples dimensiones en un espacio 2D.
                    """)
        st.image("../vizproo/docs/images/radviz.png", caption="Ejemplo de RadViz con Iris", width="content")
        st.code("""
from vizproo import RadViz
radviz = RadViz(data=iris, dimensions=['sepal_length','sepal_width','petal_width','petal_length'], hue='species')
radviz
""", language="python")
        st.markdown("""
        <div class="feature-card">
            <h4>Notas</h4>
            <ul>
                <li>Asegúrate de tener instalado <code>seaborn</code> para cargar el dataset Iris.</li>
                <li>RadViz es útil para visualizar relaciones en datos multidimensionales.</li>
                <li>La selección de puntos se sincroniza con Python si registras un callback.</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
    with tab_starcoordinates:
        st.markdown("## StarCoordinates")
        st.markdown("""
                    Este ejemplo utiliza el dataset Iris de Seaborn para mostrar un gráfico multidimensional
                    en formato StarCoordinates, permitiendo visualizar múltiples dimensiones en un espacio 2D y poder interactuar
                    con las dimensiones como si fueran anclas.
                    """)
        st.image("../vizproo/docs/images/starcoordinates.PNG", caption="Ejemplo de StarCoordinates con Iris", width="content")
        st.code("""from vizproo import StarCoordinates
starcoords = StarCoordinates(data=iris, dimensions=['sepal_length','sepal_width','petal_width','petal_length'], hue='species')
starcoords
""", language="python")
        st.markdown("""
        <div class="feature-card">
            <h4>Notas</h4>
            <ul>
                <li>Asegúrate de tener instalado <code>seaborn</code> para cargar el dataset Iris.</li>
                <li>StarCoordinates es útil para visualizar relaciones en datos multidimensionales.</li>
                <li>La selección de puntos se sincroniza con Python si registras un callback.</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
        