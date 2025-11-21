import random
import string

import ipywidgets as widgets
from IPython.display import display
from traitlets import List, Unicode

from vizproo.base_widget import BaseWidget


@widgets.register
class MatrixLayout(BaseWidget):
    _view_name = Unicode("MatrixLayoutView").tag(sync=True)
    _model_name = Unicode("MatrixLayoutModel").tag(sync=True)

    matrix = List().tag(sync=True)
    grid_areas = List().tag(sync=True)
    grid_template_areas = Unicode().tag(sync=True)
    style = Unicode().tag(sync=True)

    def __init__(self, matrix, **kwargs):
        self._widgets_to_display = {}
        self._dom_ready = False
        self._check_matrix_format(matrix)
        self.matrix = matrix
        self._all_widgets = []
        self.positions_hashs = {}
        self.grid_areas = []
        for num in self.all_numbers:
            random_string = "".join(random.choice(string.ascii_letters) for _ in range(10))
            self.positions_hashs[num] = random_string
            self.grid_areas.append(random_string)

        self.grid_template_areas = ""
        for row in matrix:
            self.grid_template_areas += '\n"'
            for num in row:
                self.grid_template_areas += self.positions_hashs[num] + " "
            self.grid_template_areas += '"'

        super().__init__(**kwargs)

        self.on_msg(self._handle_frontend_msg)

    def _handle_frontend_msg(self, widget, content, buffers):

        if content.get("event") == "dom_ready":
            self._dom_ready = True
            for pos, w in self._widgets_to_display.items():
                self._assign_widget_to_position(w, pos, force=True)
            self._widgets_to_display.clear()

    def _assign_widget_to_position(self, widget, position, force=False):
        element_id = self.positions_hashs[position]
        setter = getattr(widget, "set_trait", None)
        if force:
            if callable(setter):
                setter("elementId", "")
            else:
                widget.elementId = ""
        if callable(setter):
            setter("elementId", element_id)
        else:
            widget.elementId = element_id


    def not_list_of_lists(self):
        raise ValueError("Matrix format must be a list of lists of integers")

    def not_rects(self):
        raise ValueError("Matrix must contain only unduplicate rectangles.")

    def _check_all_integers_positive(self, matrix):
        all_numbers = []
        for row in matrix:
            for item in row:
                if type(item) is not int:
                    self.not_list_of_lists()
                if item < 0:
                    raise ValueError("All integers must be positives")
                if item not in all_numbers:
                    all_numbers.append(item)
        return all_numbers
    
    def _check_matrix_format(self, matrix):
        if any(type(row) is not list for row in matrix):
            self.not_list_of_lists()
        self.all_numbers = self._check_all_integers_positive(matrix)

        first_row_len = len(matrix[0])
        if any(len(row) != first_row_len for row in matrix):
            raise ValueError("All rows must have the same size")

        self.all_numbers.sort()
        for i in range(1, len(self.all_numbers)):
            if self.all_numbers[i] - self.all_numbers[i - 1] != 1:
                raise ValueError("All numbers must be in sequence.")

        self._check_if_has_only_rects(matrix)

    def _check_if_has_only_rects(self, matrix):
        all_positions = {}

        for i in range(len(matrix)):
            row = matrix[i]
            for j in range(len(row)):
                item = row[j]
                position = (i, j)
                if item not in all_positions:
                    all_positions[item] = []
                all_positions[item].append(position)

        for num, num_positions in all_positions.items():
            self._validate_rectangle(num_positions)

    def _validate_rectangle(self, num_positions):
        rows = {}
        num_positions.sort()
        for position in num_positions:
            if position[0] not in rows:
                rows[position[0]] = []
            rows[position[0]].append(position[1])
        self._check_row_contiguity(rows)
        self._check_rectangle_shape(rows)

    def _check_row_contiguity(self, rows):
        first_row = list(rows.keys())[0]
        for i in range(1, len(rows[first_row])):
            if rows[first_row][i] - rows[first_row][i - 1] != 1:
                self.not_rects()

    def _check_rectangle_shape(self, rows):
        rows_keys = list(rows.keys())
        first_row = rows_keys[0]
        for i in range(1, len(rows_keys)):
            if rows_keys[i] - rows_keys[i - 1] != 1:
                self.not_rects()
            if len(rows[rows_keys[i]]) != len(rows[first_row]):
                self.not_rects()
            if rows[rows_keys[i]][0] != rows[first_row][0]:
                self.not_rects()
            if rows[rows_keys[i]][-1] != rows[first_row][-1]:
                self.not_rects()

    def add(self, widget, position: int):

        
        # NUEVO: Validar que la posición existe en la matriz
        if position not in self.positions_hashs:
            available = sorted(self.positions_hashs.keys())
            raise ValueError(
                f"Position {position} is not valid. "
                f"Available positions in matrix: {available}"
            )
        
        self._all_widgets.append(widget)
        self._assign_widget_to_position(widget, position)
        display(widget)
        if self._dom_ready:
            self._assign_widget_to_position(widget, position, force=True)
        else:
            self._widgets_to_display[position] = widget

@widgets.register
class MatrixCreator(BaseWidget):
    _view_name = Unicode("MatrixCreatorView").tag(sync=True)
    _model_name = Unicode("MatrixCreatorModel").tag(sync=True)

    matrix = List().tag(sync=True)
    grid_areas = List().tag(sync=True) 
    grid_template_areas = Unicode().tag(sync=True)
    rows = Unicode("3").tag(sync=True)
    columns = Unicode("3").tag(sync=True)

    def __init__(self, rows=3, columns=3, **kwargs):
        # Almacenar los valores de filas y columnas como strings para el frontend
        self.rows = str(rows)
        self.columns = str(columns)
        
        # Inicializar matriz vacía - el frontend la generará basándose en rows y columns
        self.matrix = []
        self.grid_areas = []
        self.grid_template_areas = ""
        
        super().__init__(**kwargs)

        self.on_msg(self._handle_frontend_msg)

    def _handle_frontend_msg(self, widget, content, buffers):

        if content.get("event") == "matrix_generated":
            matrix = content.get("matrix", [])
            # NUEVO: sincroniza el trait para poder leerlo desde Python
            self.matrix = matrix
            if callable(getattr(self, "on_matrix_generated", None)):
                self.on_matrix_generated(matrix)
                
    def generate_new_matrix(self, rows=None, columns=None):
        """Genera una nueva matriz con las dimensiones especificadas"""
        if rows is None:
            rows = len(self.matrix)
        if columns is None:
            columns = len(self.matrix[0]) if self.matrix else 3
            
        new_matrix = []
        value = 1
        for _ in range(rows):
            row = []
            for _ in range(columns):
                row.append(value)
                value += 1
                new_matrix.append(row)
            
        self.matrix = new_matrix
        return self.matrix            
    
    @property
    def data(self):
        return self.matrix