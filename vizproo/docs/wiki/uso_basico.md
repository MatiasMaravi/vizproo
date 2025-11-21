# Inicio Rápido de VizProo ⚡
VizProo es una herramienta para la visualización interactiva de datos en Python. Aquí verás cómo dar tus primeros pasos rápidamente.  
Primero asegúrese de tener VizProo instalado. Si no lo ha hecho, revise la guía de [Instalación](./instalación.md) 🛠.

## Requisitos Previos 📋
Actualmente soportado:
- Jupyter Notebook / JupyterLab
- Notebooks de Visual Studio Code

Próximamente (🧪): Google Colab y otros entornos.

## Uso Básico 🧪
1. Abra el notebook [introduction](../../examples/introduction.ipynb) dentro de la carpeta examples.
2. Importe la librería y cargue datos (por ejemplo con pandas).
3. Genere su primer gráfico.

    ```python
    from vizproo import Chart  # Ejemplo simplificado
    # df = ... (DataFrame)
    chart = Chart(df)  # API ilustrativa
    chart.show()
    ```

Ese notebook incluye ejemplos sobre:
- Crear tu primer gráfico 🎯
- Interacciones y selección de puntos 🖱️
- Recuperar datos seleccionados para análisis posterior 📊

## Próximos Pasos 🚀
Explora funcionalidades avanzadas:
- [Custom Charts](./custom_charts.md) 🧩: Integrar gráficos personalizados con D3.js.
- [Dashboards](./dashboards.md) 🗂️: Componer vistas interactivas con múltiples gráficos.
- [Desarrollo](./desarrollo.md) 🧪: Guía para contribuir y extender VizProo.

Consejo 💡: Usa entornos virtuales para aislar dependencias.