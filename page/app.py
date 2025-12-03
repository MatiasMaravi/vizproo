import streamlit as st
from styles import load_css
from views.home import show_home
from views.installation import show_installation
from views.basic_usage import show_basic_usage
from views.custom_charts import show_custom_charts
from views.development import show_development
from views.dashboards import show_dashboards
from views.examples import show_examples

# Configuración de la página
st.set_page_config(
    page_title="VizProo Wiki",
    page_icon="🌟",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Cargar CSS personalizado
load_css()

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
    show_home()
elif page == "📥 Instalación":
    show_installation()
elif page == "🧪 Uso Básico":
    show_basic_usage()
elif page == "🧩 Custom Charts":
    show_custom_charts()
elif page == "🧪 Desarrollo":
    show_development()
elif page == "📊 Dashboards":
    show_dashboards()
elif page == "📈 Ejemplos":
    show_examples()

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
