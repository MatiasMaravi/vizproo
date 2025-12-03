import type { Axis as D3Axis } from "d3-axis";

/**
 * Selección D3 para grupos SVG.
 */
type D3Selection = d3.Selection<SVGGElement, unknown, null, undefined>

/**
 * Tipos primitivos aceptados en registros genéricos.
 */
type Primitive = string | number | boolean | null | undefined;

/**
 * Escala numérica (lineal) de D3.
 */
type NumericScale = d3.ScaleLinear<number, number>;
/**
 * Escala categórica (band) de D3.
 */
type BandScale = d3.ScaleBand<string>;
/**
 * Unión de escalas soportadas por la infraestructura del gráfico.
 */
export type AnyScale = NumericScale | BandScale;

/**
 * Tipo auxiliar que renombra claves de un objeto según un mapa.
 */
type Rename<T, M extends Record<string, string>> = {
    [K in keyof T as K extends keyof M ? M[K] : K]: T[K];
};

/**
 * Renombra las claves de un objeto según el mapa proporcionado.
 * No muta el objeto original.
 * @param obj - Objeto fuente con claves originales.
 * @param keyMap - Mapa de renombre: clave original -> nueva clave.
 * @returns Nuevo objeto con claves renombradas.
 */
function renameKeys<
    T extends Record<string, Primitive>,
    M extends Record<string, string>
>(obj: T, keyMap: M): Rename<T, M> {
    const result = {} as Rename<T, M>;

    for (const key in obj) {
        const newKey = (keyMap as Record<string, string>)[key] || key;
        (result as any)[newKey] = obj[key];
    }

    return result;
}
export { renameKeys };

/**
 * Parámetros base para gráficos.
 */
export interface BasePlotParams {
    /**
     * Colección de registros de datos.
     */
    data: any[],
}

/**
 * Parámetros base para escalas lineales (dominio).
 */
interface LinearScaleParams {
    domain: [number, number],
}

/**
 * Parámetros para escala lineal en X.
 */
export interface LinearScaleXParams extends LinearScaleParams {
    /**
     * Ancho total disponible para el gráfico.
     */
    width: number,
    /**
     * Padding inicial en el rango X.
     */
    leftPadding?: number,
}

/**
 * Parámetros para escala lineal en Y.
 */
export interface LinearScaleYParams extends LinearScaleParams {
    /**
     * Alto total disponible para el gráfico.
     */
    height: number,
    /**
     * Padding superior en el rango Y.
     */
    topPadding?: number,
}

/**
 * Parámetros base para escalas categóricas (band).
 */
interface BandScaleParams {
    /**
     * Valores categóricos.
     */
    values: string[],
    /**
     * Padding entre bandas.
     */
    padding: number,
}

/**
 * Parámetros para escala band en X.
 */
export interface BandScaleXParams extends BandScaleParams {
    /**
     * Ancho total disponible.
     */
    width: number,
    /**
     * Padding inicial en el rango X.
     */
    leftPadding?: number,
}

/**
 * Parámetros para escala band en Y.
 */
export interface BandScaleYParams extends BandScaleParams {
    /**
     * Alto total disponible.
     */
    height: number,
    /**
     * Padding superior en el rango Y.
     */
    topPadding?: number,
}

/**
 * Parámetros para renderizar ejes X/Y.
 */
export interface PlotAxesParams<
    XScale extends AnyScale = AnyScale,
    YScale extends AnyScale = AnyScale
> {
    /**
     * Selección del grupo SVG raíz.
     */
    svg: D3Selection;
    /**
     * Escala del eje X.
     */
    xScale: XScale;
    /**
     * Escala del eje Y.
     */
    yScale: YScale;
    /**
     * Etiqueta del eje X.
     */
    xLabel: string;
    /**
     * Etiqueta del eje Y.
     */
    yLabel: string;
    /**
     * Formateador opcional para el eje X.
     * @param axis - Generador de eje.
     */
    xAxisFormatter?: (axis: D3Axis<any>) => void;
    /**
     * Formateador opcional para el eje Y.
     * @param axis - Generador de eje.
     */
    yAxisFormatter?: (axis: D3Axis<any>) => void;
}

/**
 * Resultado del renderizado de ejes.
 */
export interface PlotAxesResult {
    xAxis: D3Selection;
    yAxis: D3Selection;
}

/**
 * Parámetros para BarPlot.
 */
export interface BarPlotParams extends BasePlotParams {
    /**
     * Columna para eje X.
     */
    xValue: string;
    /**
     * Columna para eje Y.
     */
    yValue: string;
    /**
     * Columna opcional para color (hue).
     */
    hue?: string;
    /**
     * Callback para notificar filas seleccionadas.
     * @param values - Filas seleccionadas.
     */
    setSelectedValues?: (values: any[]) => void;
    /**
     * Orientación del gráfico.
     */
    direction: 'vertical' | 'horizontal';
    /**
     * Ancho calculado del contenedor.
     */
    width: number | null;
    /**
     * Alto calculado del contenedor.
     */
    height: number | null;
    /**
     * Desactiva ejes si es verdadero.
     */
    noAxes?: boolean;
    /**
     * Desactiva barra lateral si es verdadero.
     */
    noSideBar?: boolean;
}

/**
 * Valores agregados por categoría.
 */
export interface AggregatedValues {
    count: number;
    sum: number;
}

/**
 * Fila procesada para BarPlot con metadatos.
 */
export interface ProcessedDataRow {
    /**
     * Identificador único de la barra.
     */
    id: number;
    /**
     * Categoría (X).
     */
    x_: string;
    /**
     * Valor agregado (Y).
     */
    y_: number;
    /**
     * Primer registro original del grupo.
     */
    originalData?: any;
    /**
     * Todos los registros que componen la barra.
     */
    allOriginalData?: any[];
    /**
     * Campos adicionales preservados del original.
     */
    [key: string]: any;
}

/**
 * Configuración de escalas y ejes para un gráfico.
 */
export interface ScaleConfig {
    baseScale: AnyScale;
    sideScale: AnyScale;
    baseAxis: 'x' | 'y';
    sideAxis: 'x' | 'y';
    baseLength: 'width' | 'height';
    sideLength: 'width' | 'height';
    /**
     * Escala X completa.
     */
    X: AnyScale;
    /**
     * Escala Y completa.
     */
    Y: AnyScale;
}

/**
 * Parámetros para RadViz.
 */
export interface RadVizParams extends BasePlotParams {
    dimensions: string[];
    hue?: string;
    /**
     * Callback para notificar selección.
     * @param values - Puntos seleccionados.
     */
    setSelectedValues?: (values: any[]) => void;
    width: number | null;
    height: number | null;
    noSideBar?: boolean;
}

/**
 * Punto en RadViz con referencia al dato original.
 */
export interface RadVizPoint {
    x: number;
    y: number;
    originalData: any;
    id: number;
}

/**
 * Eje/ancoraje en RadViz.
 */
export interface RadVizAxis {
    label: string;
    angle: number;
    x: number;
    y: number;
}

/**
 * Parámetros para ScatterPlot.
 */
export interface ScatterPlotParams extends BasePlotParams {
    /**
     * Nombre de la columna para X.
     */
    x: string;
    /**
     * Nombre de la columna para Y.
     */
    y: string;
    /**
     * Columna opcional para color.
     */
    hue?: string;
    /**
     * Callback de selección.
     * @param values - Puntos seleccionados.
     */
    setSelectedValues?: (values: any[]) => void;
    /**
     * Columna opcional para tamaño del punto.
     */
    size?: string;
    /**
     * Tamaño base del punto cuando no se define 'size'.
     */
    pointSize: number;
    /**
     * Opacidad de puntos (0.0 a 1.0).
     */
    opacity: number;
    /**
     * Ancho del contenedor.
     */
    width: number | null;
    /**
     * Alto del contenedor.
     */
    height: number | null;
    /**
     * Deshabilita barra lateral.
     */
    noSideBar: boolean;
}

/**
 * Punto procesado para ScatterPlot con metadatos.
 */
export interface ProcessedScatterData {
    x_: number;
    y_: number;
    size_?: number;
    id: number;
    originalData?: any;
    [key: string]: any;
}

/**
 * Parámetros para HorizonChart.
 */
export interface HorizonChartParams extends BasePlotParams {
    xValue: string;
    yValue: string;
    /**
     * Columna para agrupar múltiples series.
     */
    seriesValue?: string;
    /**
     * Número de bandas de color.
     */
    bands: number;
    /**
     * Modo de visualización para negativos.
     */
    mode: 'offset' | 'mirror';
    width: number | null;
    /**
     * Altura para cada serie.
     */
    height: number | null;
    setSelectedValues?: (values: any[]) => void;
    noSideBar?: boolean;
}

/**
 * Punto de datos para HorizonChart con atributos originales.
 */
export interface HorizonDataPoint {
    /**
     * Valor temporal en el eje X.
     */
    x_: Date;
    /**
     * Valor numérico en el eje Y.
     */
    y_: number;
    /**
     * Serie a la que pertenece el punto.
     */
    series: string;
    /**
     * ID único del punto.
     */
    id: number;
    /**
     * Datos originales de la fila.
     */
    originalData: any;
    /**
     * Atributos originales adicionales.
     */
    [key: string]: any;
}

/**
 * Parámetros para Star Coordinates.
 */
export interface StarCoordinatesParams extends BasePlotParams {
    dimensions: string[];
    hue?: string;
    setSelectedValues?: (values: any[]) => void;
    width: number | null;
    height: number | null;
    noSideBar?: boolean;
}

/**
 * Punto de Star Coordinates con referencia al dato original.
 */
export interface StarCoordinatesPoint {
    x: number;
    y: number;
    originalData: any;
    id: number;
}

/**
 * Ancla de Star Coordinates (feature y posición).
 */
export interface StarCoordinatesAnchor {
    feature: string;
    x: number;
    y: number;
}
