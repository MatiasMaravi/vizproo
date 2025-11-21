from traitlets import  List, Unicode, Float

from vizproo.base_widget import BaseWidget, widgets, pd

#Scatter
@widgets.register
class ScatterPlot(BaseWidget):
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
        self.data = data
        self.pointSize = point_size
        self.opacity = opacity
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
