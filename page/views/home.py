import streamlit as st

def show_home():
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
