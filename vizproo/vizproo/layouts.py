import random
import string

import ipywidgets as widgets
from IPython.display import display
from traitlets import List, Unicode

from vizproo.base_widget import BaseWidget


@widgets.register
class MatrixLayout(BaseWidget):
    """Layout de rejilla basado en una matriz de enteros.

    Cada número en la matriz representa un rectángulo contiguo dentro del grid.
    Los widgets se asignan a posiciones usando el número del rectángulo y se
    ubican en el DOM mediante `elementId`.

    Attributes:
        matrix (List): Matriz de enteros que describe el layout por áreas.
        grid_areas (List): Identificadores únicos por área para CSS Grid.
        grid_template_areas (Unicode): String con la definición de `grid-template-areas`.
        style (Unicode): Estilos CSS opcionales aplicados al contenedor.
    """
    _view_name = Unicode("MatrixLayoutView").tag(sync=True)
    _model_name = Unicode("MatrixLayoutModel").tag(sync=True)

    matrix = List().tag(sync=True)
    grid_areas = List().tag(sync=True)
    grid_template_areas = Unicode().tag(sync=True)
    style = Unicode().tag(sync=True)

    def __init__(self, matrix, **kwargs):
        """Inicializa el layout a partir de una matriz de rectángulos.

        Valida la matriz, genera identificadores para cada área y construye
        la cadena `grid-template-areas`.

        Args:
            matrix (List[List[int]]): Matriz de enteros, donde cada entero
                representa un área rectangular contigua.
            **kwargs: Argumentos adicionales propagados a BaseWidget.

        Raises:
            ValueError: Si la matriz no es válida (no lista de listas, tamaños
                inconsistentes, enteros no positivos, no secuenciales o áreas
                no rectangulares).
        """
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
        """Manejador de eventos desde el frontend.

        Escucha el evento `dom_ready` para forzar la asignación de widgets
        pendientes a sus posiciones en el grid.

        Args:
            widget: Referencia al widget que envía el mensaje.
            content (dict): Contenido del mensaje desde el frontend.
            buffers: Buffers binarios (no utilizados).
        """
        if content.get("event") == "dom_ready":
            self._dom_ready = True
            for pos, w in self._widgets_to_display.items():
                self._assign_widget_to_position(w, pos, force=True)
            self._widgets_to_display.clear()

    def _assign_widget_to_position(self, widget, position, force=False):
        """Asigna el `elementId` de un widget a la posición del grid.

        Intenta usar `set_trait("elementId", ...)` si está disponible, o
        asigna directamente el atributo `elementId`.

        Args:
            widget: Widget hijo a posicionar.
            position (int): Número del área en la matriz.
            force (bool): Si es True, limpia primero el `elementId` para forzar
                re-render en el frontend.
        """
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
        """Lanza un error por formato de matriz inválido."""
        raise ValueError("Matrix format must be a list of lists of integers")

    def not_rects(self):
        """Lanza un error cuando las áreas no forman rectángulos contiguos."""
        raise ValueError("Matrix must contain only unduplicate rectangles.")

    def _check_all_integers_positive(self, matrix):
        """Verifica que todos los elementos sean enteros positivos y únicos.

        Args:
            matrix (List[List[int]]): Matriz a validar.

        Returns:
            List[int]: Lista de enteros únicos encontrados.

        Raises:
            ValueError: Si hay elementos no enteros o negativos.
        """
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
        """Valida el formato general de la matriz.

        Comprueba:
        - Que sea una lista de listas.
        - Que todas las filas tengan el mismo tamaño.
        - Que los números sean positivos y estén en secuencia continua.
        - Que las áreas formen rectángulos contiguos.

        Args:
            matrix (List[List[int]]): Matriz de layout.

        Raises:
            ValueError: Si cualquiera de las validaciones falla.
        """
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
        """Verifica que cada número forme un rectángulo contiguo.

        Args:
            matrix (List[List[int]]): Matriz de layout.
        """
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
        """Valida contigüidad por filas y forma rectangular de un área.

        Args:
            num_positions (List[Tuple[int, int]]): Posiciones ocupadas por el número.
        """
        rows = {}
        num_positions.sort()
        for position in num_positions:
            if position[0] not in rows:
                rows[position[0]] = []
            rows[position[0]].append(position[1])
        self._check_row_contiguity(rows)
        self._check_rectangle_shape(rows)

    def _check_row_contiguity(self, rows):
        """Comprueba que las columnas de la primera fila sean contiguas.

        Args:
            rows (dict[int, List[int]]): Mapa fila->columnas ocupadas.

        Raises:
            ValueError: Si hay saltos entre columnas.
        """
        first_row = list(rows.keys())[0]
        for i in range(1, len(rows[first_row])):
            if rows[first_row][i] - rows[first_row][i - 1] != 1:
                self.not_rects()

    def _check_rectangle_shape(self, rows):
        """Comprueba que las filas sean contiguas y compartan el mismo rango de columnas.

        Args:
            rows (dict[int, List[int]]): Mapa fila->columnas ocupadas.

        Raises:
            ValueError: Si no forma un rectángulo perfecto.
        """
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
        """Añade un widget a una posición del layout y lo muestra.

        Si el DOM no está listo, se encola hasta recibir `dom_ready`.

        Args:
            widget: Widget hijo a insertar en el área.
            position (int): Número de área en la matriz.

        Raises:
            ValueError: Si `position` no existe en la matriz.
        """
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
    """Widget para crear matrices de layout desde el frontend.

    Expone traits sincronizados para filas, columnas y la matriz generada,
    permitiendo que el frontend construya y envíe el layout a Python.

    Attributes:
        matrix (List): Matriz generada por el frontend.
        grid_areas (List): Áreas del grid (puede ser usado por el frontend).
        grid_template_areas (Unicode): String de `grid-template-areas` (si aplica).
        rows (Unicode): Número de filas como string para sincronización.
        columns (Unicode): Número de columnas como string para sincronización.
    """
    _view_name = Unicode("MatrixCreatorView").tag(sync=True)
    _model_name = Unicode("MatrixCreatorModel").tag(sync=True)

    matrix = List().tag(sync=True)
    grid_areas = List().tag(sync=True) 
    grid_template_areas = Unicode().tag(sync=True)
    rows = Unicode("3").tag(sync=True)
    columns = Unicode("3").tag(sync=True)

    def __init__(self, rows=3, columns=3, **kwargs):
        """Inicializa el creador con dimensiones por defecto.

        Args:
            rows (int, optional): Cantidad de filas inicial. Por defecto 3.
            columns (int, optional): Cantidad de columnas inicial. Por defecto 3.
            **kwargs: Argumentos adicionales propagados a BaseWidget.
        """
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
        """Manejador de mensajes del frontend.

        Escucha `matrix_generated` para sincronizar la matriz generada y
        ejecutar un callback opcional `on_matrix_generated`.

        Args:
            widget: Referencia al widget que envía el mensaje.
            content (dict): Contenido enviado desde el frontend.
            buffers: Buffers binarios (no utilizados).
        """
        if content.get("event") == "matrix_generated":
            matrix = content.get("matrix", [])
            # NUEVO: sincroniza el trait para poder leerlo desde Python
            self.matrix = matrix
            if callable(getattr(self, "on_matrix_generated", None)):
                self.on_matrix_generated(matrix)
                
    def generate_new_matrix(self, rows=None, columns=None):
        """Genera una nueva matriz con las dimensiones especificadas.

        Si no se pasan dimensiones, intenta usar la matriz actual como referencia.

        Args:
            rows (int, optional): Número de filas.
            columns (int, optional): Número de columnas.

        Returns:
            List[List[int]]: Nueva matriz generada.
        """
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
        """Retorna la matriz actual generada.

        Returns:
            List[List[int]]: Matriz sincronizada desde el frontend.
        """
        return self.matrix