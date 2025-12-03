from traitlets import  List, Unicode

from vizproo.base_widget import BaseWidget, widgets, pd

@widgets.register
class BarPlot(BaseWidget):
    """Gráfico de barras interactivo con selección de valores.

    Permite renderizar barras en orientación vertical u horizontal. Sincroniza
    datos y selección con el frontend mediante traits.

    Attributes:
        dataRecords (List): Registros de datos (lista de dicts), sincronizados con el frontend.
        direction (Unicode): Orientación del gráfico ("vertical" o "horizontal").
        x (Unicode): Variable para el eje X.
        y (Unicode): Variable para el eje Y.
        hue (Unicode): Variable para color/categoría.
        selectedValuesRecords (List): Registros seleccionados por el usuario.
    """
    _view_name = Unicode("BarPlotView").tag(sync=True)
    _model_name = Unicode("BarPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    direction = Unicode().tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(self, data, direction="vertical", **kwargs):
        """Inicializa el gráfico con datos y orientación.

        Args:
            data (pd.DataFrame): Datos fuente para el gráfico.
            direction (str, optional): Orientación del gráfico ("vertical" o "horizontal").
                Por defecto "vertical".
            **kwargs: Argumentos adicionales propagados a BaseWidget.
        """
        self.data = data
        self.direction = direction
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
