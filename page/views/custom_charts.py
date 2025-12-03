import streamlit as st

def show_custom_charts():
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
