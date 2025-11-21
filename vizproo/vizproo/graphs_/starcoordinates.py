from traitlets import  List, Unicode

from vizproo.base_widget import BaseWidget, widgets, pd

@widgets.register
class StarCoordinates(BaseWidget):
    _view_name = Unicode("StarCoordinatesView").tag(sync=True)
    _model_name = Unicode("StarCoordinatesModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    dimensions = List([]).tag(sync=True)
    hue = Unicode().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(self, data, dimensions, hue, **kwargs):
        self.data = data
        self.dimensions = dimensions
        self.hue = hue
        self.selectedValues = pd.DataFrame()
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")

    @property
    def selectedValues(self):
        return pd.DataFrame.from_records(self.selectedValuesRecords)

    @selectedValues.setter
    def selectedValues(self, val):
        self.selectedValuesRecords = val.to_dict(orient="records")

    def on_select_values(self, callback):
        self.observe(callback, names=["selectedValuesRecords"])
