import streamlit as st

def show_dashboards():
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
