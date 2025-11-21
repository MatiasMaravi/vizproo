import ipywidgets as widgets
from traitlets import Unicode
from ._frontend import module_name, module_version

import ipywidgets as widgets
import pandas as pd
class BaseWidget(widgets.DOMWidget):
    _view_module = Unicode(module_name).tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)

    elementId = Unicode().tag(sync=True)
