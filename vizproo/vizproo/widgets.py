import ipywidgets as widgets
import pandas as pd
from traitlets import Bool, Float, List, Unicode, Int
from vizproo.base_widget import BaseWidget

class TextBaseWidget(BaseWidget):
    """Base para widgets de texto con sincronización de valor y estado.

    Proporciona atributos comunes para widgets que manejan texto.

    Attributes:
        value (Unicode): Valor del texto actual.
        placeholder (Unicode): Texto de ayuda mostrado cuando está vacío.
        description (Unicode): Etiqueta descriptiva.
        disabled (Bool): Indica si el widget está deshabilitado.
    """
    value = Unicode().tag(sync=True)
    placeholder = Unicode().tag(sync=True)
    description = Unicode().tag(sync=True)
    disabled = Bool().tag(sync=True)

@widgets.register
class Button(BaseWidget):
    """Botón interactivo con evento de click.

    Attributes:
        description (Unicode): Texto mostrado en el botón.
        disabled (Bool): Estado de deshabilitado.
        _clicked (Bool): Flag interno para detectar clics desde el frontend.
    """
    _view_name = Unicode("ButtonView").tag(sync=True)
    _model_name = Unicode("ButtonModel").tag(sync=True)

    description = Unicode().tag(sync=True)
    disabled = Bool().tag(sync=True)
    _clicked = Bool().tag(sync=True)

    def on_click(self, callback):
        """Registra un callback para el evento de click.

        Args:
            callback (Callable): Función que recibe el cambio del trait `_clicked`.
        """
        self.observe(callback, names=["_clicked"])

@widgets.register
class Checkbox(BaseWidget):
    """Checkbox con estado chequeado sincronizado.

    Attributes:
        description (Unicode): Etiqueta del checkbox.
        checked (Bool): Estado de selección.
    """
    _view_name = Unicode("CheckboxView").tag(sync=True)
    _model_name = Unicode("CheckboxModel").tag(sync=True)

    description = Unicode().tag(sync=True)
    checked = Bool().tag(sync=True)

    def on_check(self, callback):
        """Registra un callback para cambios en `checked`.

        Args:
            callback (Callable): Función que recibe el cambio del trait `checked`.
        """
        self.observe(callback, names=["checked"])

@widgets.register
class Dropdown(BaseWidget):
    """Selector desplegable con opciones y datos tabulares opcionales.

    Attributes:
        dataRecords (List): Registros de datos en formato dict (sincronizados).
        variable (Unicode): Nombre de la variable asociada (opcional).
        description (Unicode): Etiqueta del selector.
        options (List): Lista de opciones disponibles.
        value (Unicode): Valor seleccionado.
        disabled (Bool): Estado de deshabilitado.
    """
    _view_name = Unicode("DropdownView").tag(sync=True)
    _model_name = Unicode("DropdownModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    variable = Unicode().tag(sync=True)
    description = Unicode().tag(sync=True)
    options = List().tag(sync=True)
    value = Unicode().tag(sync=True)
    disabled = Bool().tag(sync=True)
    _clicked = Bool().tag(sync=True)

    def __init__(self, data=pd.DataFrame(), **kwargs):
        """Inicializa el Dropdown con un DataFrame opcional.

        Args:
            data (pd.DataFrame, optional): Datos para inicializar `dataRecords`.
            **kwargs: Argumentos adicionales propagados a BaseWidget.
        """
        self.data = data
        super().__init__(**kwargs)

    @property
    def data(self):
        """Devuelve los datos como DataFrame.

        Returns:
            pd.DataFrame: DataFrame construido desde `dataRecords`.
        """
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        """Establece los datos desde un DataFrame.

        Args:
            val (pd.DataFrame): DataFrame a convertir a registros dict.
        """
        self.dataRecords = val.to_dict(orient="records")

    def on_select(self, callback):
        """Registra un callback para cambios en `value`.

        Args:
            callback (Callable): Función que recibe el cambio del trait `value`.
        """
        self.observe(callback, names=["value"])

@widgets.register
class Input(TextBaseWidget):
    """Campo de entrada de texto de una sola línea.

    Hereda los atributos comunes de TextBaseWidget.
    """
    _view_name = Unicode("InputView").tag(sync=True)
    _model_name = Unicode("InputModel").tag(sync=True)

    def on_text_changed(self, callback):
        """Registra un callback para cambios en `value`.

        Args:
            callback (Callable): Función que recibe el cambio del trait `value`.
        """
        self.observe(callback, names=["value"])

@widgets.register
class RangeSlider(BaseWidget):
    """Selector de rango numérico con límites y paso configurables.

    Attributes:
        dataRecords (List): Registros de datos (opcional).
        variable (Unicode): Variable asociada (opcional).
        step (Float): Incremento del slider.
        description (Unicode): Etiqueta del control.
        fromValue (Float): Valor inicial del rango.
        toValue (Float): Valor final del rango.
        minValue (Float): Límite inferior permitido.
        maxValue (Float): Límite superior permitido.
    """
    _view_name = Unicode("RangeSliderView").tag(sync=True)
    _model_name = Unicode("RangeSliderModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    variable = Unicode().tag(sync=True)
    step = Float().tag(sync=True)
    description = Unicode().tag(sync=True)
    fromValue = Float().tag(sync=True)
    toValue = Float().tag(sync=True)
    minValue = Float().tag(sync=True)
    maxValue = Float().tag(sync=True)

    def __init__(self, data=pd.DataFrame(), **kwargs):
        """Inicializa el RangeSlider con un DataFrame opcional.

        Args:
            data (pd.DataFrame, optional): Datos para inicializar `dataRecords`.
            **kwargs: Argumentos adicionales propagados a BaseWidget.
        """
        self.data = data
        super().__init__(**kwargs)

    @property
    def data(self):
        """Devuelve los datos como DataFrame.

        Returns:
            pd.DataFrame: DataFrame construido desde `dataRecords`.
        """
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        """Establece los datos desde un DataFrame.

        Args:
            val (pd.DataFrame): DataFrame a convertir a registros dict.
        """
        self.dataRecords = val.to_dict(orient="records")

    def on_drag(self, callback):
        """Registra un callback para cambios en `fromValue` y `toValue`.

        Args:
            callback (Callable): Función que recibe cambios del rango.
        """
        self.observe(callback, names=["fromValue", "toValue"])

@widgets.register
class TextArea(TextBaseWidget):
    """Área de texto multilínea.

    Hereda los atributos comunes de TextBaseWidget.
    """
    _view_name = Unicode("TextAreaView").tag(sync=True)
    _model_name = Unicode("TextAreaModel").tag(sync=True)

    def on_text_changed(self, callback):
        """Registra un callback para cambios en `value`.

        Args:
            callback (Callable): Función que recibe el cambio del trait `value`.
        """
        self.observe(callback, names=["value"])

@widgets.register
class Text(TextBaseWidget):
    """Visualización de texto no editable.

    Hereda los atributos comunes de TextBaseWidget.
    """
    _view_name = Unicode("TextView").tag(sync=True)
    _model_name = Unicode("TextModel").tag(sync=True)

