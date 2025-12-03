import streamlit as st

def show_basic_usage():
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
