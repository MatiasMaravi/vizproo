from traitlets import  List, Unicode

from vizproo.base_widget import BaseWidget, widgets, pd

@widgets.register
class BarPlot(BaseWidget):
    _view_name = Unicode("BarPlotView").tag(sync=True)
    _model_name = Unicode("BarPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    direction = Unicode().tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(self, data, direction="vertical", **kwargs):
        self.data = data
        self.direction = direction
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
