from traitlets import  List, Unicode

from vizproo.base_widget import BaseWidget, widgets, pd

@widgets.register
class StarCoordinates(BaseWidget):
    """Gráfico Star Coordinates interactivo para visualización multivariada.

    Proyecta registros usando dimensiones como ejes radiales. Sincroniza datos,
    dimensiones, color y selección con el frontend.

    Attributes:
        dataRecords (List): Registros de datos (lista de dicts) sincronizados con el frontend.
        dimensions (List): Lista de nombres de columnas usadas como dimensiones.
        hue (Unicode): Variable categórica para colorear los puntos.
        selectedValuesRecords (List): Registros seleccionados por el usuario.
    """
    _view_name = Unicode("StarCoordinatesView").tag(sync=True)
    _model_name = Unicode("StarCoordinatesModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    dimensions = List([]).tag(sync=True)
    hue = Unicode().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(self, data, dimensions, hue, **kwargs):
        """Inicializa el gráfico con datos, dimensiones y variable de color.

        Args:
            data (pd.DataFrame): Datos fuente para el gráfico.
            dimensions (List[str]): Columnas a usar como dimensiones radiales.
            hue (str): Columna categórica para colorear puntos.
            **kwargs: Argumentos adicionales propagados a BaseWidget.
        """
        self.data = data
        self.dimensions = dimensions
        self.hue = hue
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
