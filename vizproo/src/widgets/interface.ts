/**
 * Parámetros base comunes a varios widgets.
 * Incluye la descripción mostrada al usuario.
 */
interface BaseParams {
    /**
     * Texto descriptivo o etiqueta del control.
     */
    description: string;
}

/**
 * Parámetros para widgets de texto.
 * Incluye valor, placeholder y estado disabled.
 */
export interface BaseTextParams extends BaseParams {
    /**
     * Valor actual del texto.
     */
    value: string;
    /**
     * Texto de ayuda cuando el campo está vacío.
     */
    placeholder: string;
    /**
     * Indica si el control está deshabilitado.
     */
    disabled: boolean;
}

/**
 * Parámetros para inputs de texto con callback de actualización.
 */
export interface BaseTextInputParams extends BaseTextParams {
    /**
     * Callback para propagar el nuevo valor al modelo.
     * @param value - Valor actualizado del input.
     */
    setValue: (value: string) => void;
}

/**
 * Parámetros para el widget Button.
 */
export interface ButtonParams extends BaseParams {
    /**
     * Estado disabled del botón.
     */
    disabled: boolean;
    /**
     * Callback de clic para alternar o notificar estado.
     */
    setClicked: () => void;
}

/**
 * Parámetros para el widget Checkbox.
 */
export interface CheckboxParams extends BaseParams {
    /**
     * Callback que recibe el estado checked.
     * @param state - Objeto con la propiedad checked.
     */
    setChecked: (state: { checked: boolean }) => void;
}

/**
 * Registro genérico de datos.
 * Permite claves arbitrarias con valores de cualquier tipo.
 */
export interface DataRecord {
    [key: string]: any;
}

/**
 * Parámetros para el widget Dropdown (select).
 * Define datos, variable, opciones y callbacks.
 */
export interface DropdownParams extends BaseParams {
    /**
     * Registros de datos fuente.
     */
    data: DataRecord[];
    /**
     * Nombre de la columna usada para inferir opciones.
     */
    variable: string;
    /**
     * Lista explícita de opciones.
     */
    options: string[];
    /**
     * Valor seleccionado actual.
     */
    value: string;
    /**
     * Estado disabled del control.
     */
    disabled: boolean;
    /**
     * Callback para actualizar el valor seleccionado.
     * @param value - Nuevo valor seleccionado.
     */
    setValue: (value: string) => void;
}

/**
 * Parámetros de márgenes (CSS/visual).
 */
export interface MarginParams {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

/**
 * Parámetros para un RangeSlider.
 * Incluye datos, variable, valores desde/hasta y callbacks.
 */
export interface RangeSliderParams extends BaseParams {
    /**
     * Colección de datos base.
     */
    data: any[],
    /**
     * Variable usada para calcular el rango.
     */
    variable: string,
    /**
     * Incremento entre valores del slider.
     */
    step: number,
    /**
     * Valor inicial seleccionado.
     */
    fromValue: number,
    /**
     * Valor final seleccionado.
     */
    toValue: number,
    /**
     * Límite inferior del rango.
     */
    minValue: number,
    /**
     * Límite superior del rango.
     */
    maxValue: number,
    /**
     * Callback para actualizar los valores seleccionados.
     * @param from - Nuevo valor inicial.
     * @param to - Nuevo valor final.
     */
    setValues: (from: number, to: number) => void,
    /**
     * Callback para actualizar los límites del rango.
     * @param min - Nuevo mínimo.
     * @param max - Nuevo máximo.
     */
    setMinMax: (min: number, max: number) => void,
    /**
     * Márgenes aplicados al componente.
     */
    margin: MarginParams
}

/**
 * Parámetros para selección de paletas de color.
 */
export interface SelectColorParams {
    /**
     * Texto descriptivo del control.
     */
    description: string;
    /**
     * Paleta seleccionada por el usuario.
     */
    selectedPalette: string;
    /**
     * Número de colores seleccionados.
     */
    selectedNumColors: number;
    /**
     * Estado disabled del control.
     */
    disabled: boolean;
    /**
     * Callback invocado cuando la paleta cambia.
     */
    setPaletteChanged: () => void;
}
