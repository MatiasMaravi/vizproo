import streamlit as st

def show_installation():
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
