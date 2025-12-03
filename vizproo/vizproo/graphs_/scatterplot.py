from traitlets import  List, Unicode, Float

from vizproo.base_widget import BaseWidget, widgets, pd

#Scatter
@widgets.register
class ScatterPlot(BaseWidget):
    """Gráfico de dispersión interactivo con tamaño y opacidad configurables.

    Sincroniza datos, selección y parámetros visuales con el frontend mediante traits.

    Attributes:
        dataRecords (List): Registros de datos (lista de dicts), sincronizados con el frontend.
        x (Unicode): Variable para el eje X.
        y (Unicode): Variable para el eje Y.
        hue (Unicode): Variable para color/categoría.
        size (Unicode): Variable para tamaño por punto (opcional).
        pointSize (Float): Tamaño base de los puntos.
        opacity (Float): Opacidad de los puntos (0 a 1).
        selectedValuesRecords (List): Registros seleccionados por el usuario.
    """
    _view_name = Unicode("ScatterPlotView").tag(sync=True)
    _model_name = Unicode("ScatterPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
    size = Unicode().tag(sync=True)
    pointSize = Float(5.0).tag(sync=True)
    opacity = Float(0.7).tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(self, data, point_size = 5.0, opacity = 0.7, **kwargs):
        """Inicializa el gráfico con datos y parámetros visuales.

        Args:
            data (pd.DataFrame): Datos fuente para el gráfico.
            point_size (float, optional): Tamaño base de los puntos. Por defecto 5.0.
            opacity (float, optional): Opacidad de los puntos (0-1). Por defecto 0.7.
            **kwargs: Argumentos adicionales propagados a BaseWidget.
        """
        self.data = data
        self.pointSize = point_size
        self.opacity = opacity
        self.selectedValues = pd.DataFrame()
        super().__init__(**kwargs)

    @property
    def data(self):
        """Retorna los datos como DataFrame.

        Returns:
            pd.DataFrame: DataFrame construido desde `dataRecords`.
        """
        return pd.DataFrame.from_records(self.dataRecords)
    
    @data.setter
    def data(self, val):
        """Establece los datos del gráfico desde un DataFrame.

        Args:
            val (pd.DataFrame): DataFrame a convertir a lista de registros dict.
        """
        self.dataRecords = val.to_dict(orient="records")

    @property
    def selectedValues(self):
        """Retorna los valores actualmente seleccionados.

        Returns:
            pd.DataFrame: Selección del usuario como DataFrame.
        """
        return pd.DataFrame.from_records(self.selectedValuesRecords)
    
    @selectedValues.setter
    def selectedValues(self, val):
        """Actualiza la selección de valores.

        Args:
            val (pd.DataFrame): Selección a convertir y sincronizar con el frontend.
        """
        self.selectedValuesRecords = val.to_dict(orient="records")
        
    def on_select_values(self, callback):
        """Registra un callback para cambios en la selección de valores.

        Args:
            callback (Callable): Función que recibe el cambio del trait `selectedValuesRecords`.
        """
        self.observe(callback, names=["selectedValuesRecords"])
