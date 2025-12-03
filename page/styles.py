import streamlit as st

def load_css():
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
