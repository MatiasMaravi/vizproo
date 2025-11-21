import type { Axis as D3Axis } from "d3-axis";

type D3Selection = d3.Selection<SVGGElement, unknown, null, undefined>

type Primitive = string | number | boolean | null | undefined;


type NumericScale = d3.ScaleLinear<number, number>;
type BandScale = d3.ScaleBand<string>;
export type AnyScale = NumericScale | BandScale;

// Tipo auxiliar que renombra las claves según el mapa M
type Rename<T, M extends Record<string, string>> = {
    [K in keyof T as K extends keyof M ? M[K] : K]: T[K];
};

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


export interface BasePlotParams {
    data: any[],
}

interface LinearScaleParams {
    domain: [number, number],
}

export interface LinearScaleXParams extends LinearScaleParams {
    width: number,
    leftPadding?: number,
}

export interface LinearScaleYParams extends LinearScaleParams {
    height: number,
    topPadding?: number,
}

interface BandScaleParams {
    values: string[],
    padding: number,
}

export interface BandScaleXParams extends BandScaleParams {
    width: number,
    leftPadding?: number,
}

export interface BandScaleYParams extends BandScaleParams {
    height: number,
    topPadding?: number,
}


export interface PlotAxesParams<
    XScale extends AnyScale = AnyScale,
    YScale extends AnyScale = AnyScale
> {
    svg: D3Selection;
    xScale: XScale;
    yScale: YScale;
    xLabel: string;
    yLabel: string;
    xAxisFormatter?: (axis: D3Axis<any>) => void;
    yAxisFormatter?: (axis: D3Axis<any>) => void;
}

export interface PlotAxesResult {
    xAxis: D3Selection;
    yAxis: D3Selection;
}


export interface BarPlotParams extends BasePlotParams {
    xValue: string;
    yValue: string;
    hue?: string;
    setSelectedValues?: (values: any[]) => void;
    direction: 'vertical' | 'horizontal';
    width: number | null;
    height: number | null;
    noAxes?: boolean;
    noSideBar?: boolean;
}

// Modifica la interface AggregatedValues
export interface AggregatedValues {
    count: number;
    sum: number;
}

export interface ProcessedDataRow {
    id: number; // Identificador único para cada fila
    x_: string;
    y_: number;
    originalData?: any; // Almacena el primer registro original
    allOriginalData?: any[]; // Almacena todos los registros que contribuyeron a esta barra
    [key: string]: any; // Permite propiedades adicionales
}

export interface ScaleConfig {
    baseScale: AnyScale;
    sideScale: AnyScale;
    baseAxis: 'x' | 'y';
    sideAxis: 'x' | 'y';
    baseLength: 'width' | 'height';
    sideLength: 'width' | 'height';
    X: AnyScale;
    Y: AnyScale;
}

export interface RadVizParams extends BasePlotParams {
    dimensions: string[];
    hue?: string;
    setSelectedValues?: (values: any[]) => void;
    width: number | null;
    height: number | null;
    noSideBar?: boolean;
}

export interface RadVizPoint {
    x: number;
    y: number;
    originalData: any;
    id: number;
}

export interface RadVizAxis {
    label: string;
    angle: number;
    x: number;
    y: number;
}

//scatetr

export interface ScatterPlotParams extends BasePlotParams {
    x: string; // [OBLIGATORIO] Nombre de la columna para el eje X.
    y: string; // [OBLIGATORIO] Nombre de la columna para el eje Y.
    hue?: string; // [OPCIONAL] Nombre de la columna para mapear el color.
    setSelectedValues?: (values: any[]) => void;
    size?: string; // [OPCIONAL] Nombre de la columna para mapear el tamaño del punto (radio).
    pointSize: number; // [OPCIONAL] Tamaño base de los puntos (usado si 'size' no está definido).
    opacity: number; // [OPCIONAL]Opacidad de los puntos (valor entre 0.0 y 1.0).
    width: number | null; //[POR SI SE QUIERE PONER MANUALMENTE] Ancho del contenedor del gráfico.
    height: number | null; // [POR SI SE QUIERE PONER MANUALMENTE]Alto del contenedor del gráfico.
    noSideBar: boolean;
}

export interface ProcessedScatterData {
    x_: number;
    y_: number;
    size_?: number;
    id: number;
    originalData?: any; // Store the original row data
    [key: string]: any;
}

export interface HorizonChartParams extends BasePlotParams {
    xValue: string;
    yValue: string;
    seriesValue?: string; // Columna para agrupar en múltiples gráficos
    bands: number; // Número de bandas de color
    mode: 'offset' | 'mirror'; // Modo para valores negativos
    width: number | null;
    height: number | null; // Altura para CADA serie de horizon
    setSelectedValues?: (values: any[]) => void;
    noSideBar?: boolean;
}

// ...existing code...

export interface HorizonDataPoint {
    // El eje X es un valor temporal (Date)
    x_: Date;
    // El eje Y es el valor numérico de la serie
    y_: number;
    // Serie a la que pertenece el punto
    series: string;
    // ID único para cada punto
    id: number;
    // Datos originales de la fila
    originalData: any;
    // Atributos originales para mantener la consistencia
    [key: string]: any;
}
export interface StarCoordinatesParams extends BasePlotParams {
    dimensions: string[];
    hue?: string;
    setSelectedValues?: (values: any[]) => void;
    width: number | null;
    height: number | null;
    noSideBar?: boolean;
}

export interface StarCoordinatesPoint {
    x: number;
    y: number;
    originalData: any;
    id: number;
}

export interface StarCoordinatesAnchor {
    feature: string;
    x: number;
    y: number;
}
