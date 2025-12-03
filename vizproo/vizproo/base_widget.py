import ipywidgets as widgets
from traitlets import Unicode
from ._frontend import module_name, module_version

import ipywidgets as widgets
import pandas as pd
class BaseWidget(widgets.DOMWidget):
    """
    Clase base para widgets personalizados en el frontend.

    Esta clase maneja la configuración de los módulos y versiones necesarios
    para sincronizar el modelo y la vista entre Python y JavaScript.

    Attributes:
        _view_module (Unicode): El nombre del módulo npm donde reside la vista.
            Se sincroniza con el frontend.
        _model_module (Unicode): El nombre del módulo npm donde reside el modelo.
            Se sincroniza con el frontend.
        _view_module_version (Unicode): La versión semver del módulo de la vista.
        _model_module_version (Unicode): La versión semver del módulo del modelo.
        elementId (Unicode): Identificador único opcional para el elemento DOM.
            Útil para manipular el widget mediante CSS o selectores JS externos.
    """

    _view_module = Unicode(module_name).tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)

    elementId = Unicode().tag(sync=True)