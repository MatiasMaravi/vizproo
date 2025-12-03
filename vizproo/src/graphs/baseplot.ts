import * as d3 from "d3";
import { BaseWidget } from "../base/base_widget";
import { axisLeft, axisBottom } from "d3-axis";
import type { Axis as D3Axis } from "d3-axis";
import { WIDGET_MARGIN } from "../base/base";
import { 
        LinearScaleXParams, 
        LinearScaleYParams,
        BandScaleXParams,
        BandScaleYParams,
        PlotAxesParams,
        PlotAxesResult,
        AnyScale
    } from "./interface";
import "../../css/graphs.css";

/**
 * Clase base para gráficos con D3.
 * Provee inicialización de SVG, creación de escalas y renderizado de ejes.
 */
export abstract class BasePlot extends BaseWidget {
    /**
     * Márgenes del gráfico usados para calcular dimensiones internas.
     */
    margin: { top: number; right: number; bottom: number; left: number; };
    /**
     * Elemento SVG raíz del gráfico.
     */
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    /**
     * Grupo base donde se posiciona el contenido del gráfico.
     */
    gGrid: d3.Selection<SVGGElement, unknown, null, undefined>;

    /**
     * Crea una instancia base de gráfico.
     * @param element - Contenedor HTML donde se inserta el SVG.
     */
    constructor(element: HTMLElement) {
        super(element);
        this.margin = WIDGET_MARGIN;
    }

    /**
     * Inicializa el SVG y el grupo base con márgenes.
     * @param width - Ancho total disponible.
     * @param height - Alto total disponible.
     */
    init(width: number | null, height: number | null){
        this.svg = d3.select(this.element)
            .append("svg")
            .attr("width", width ? width - 2 : 0)
            .attr("height", height || 0)
            .attr("class", "graph");
        this.gGrid = this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    }

    /**
     * Crea una escala lineal para el eje X.
     * @param params - Dominio, ancho y padding izquierdo opcional.
     * @returns Escala lineal de D3 configurada.
     */
    getXLinearScale(params: LinearScaleXParams): d3.ScaleLinear<number, number> {
        const { domain, width, leftPadding = 0 } = params;
        const innerWidth = width - this.margin.left - this.margin.right;
        const scale = d3.scaleLinear().range([leftPadding, innerWidth]);
        scale.domain(domain).nice();

        return scale;
    }

    /**
     * Crea una escala lineal para el eje Y.
     * @param params - Dominio, alto y padding superior opcional.
     * @returns Escala lineal de D3 configurada.
     */
    getYLinearScale(params: LinearScaleYParams): d3.ScaleLinear<number, number> {
        const { domain, height, topPadding = 0 } = params;
        const innerHeight = height - this.margin.top - this.margin.bottom;
        const scale = d3.scaleLinear().range([innerHeight, topPadding]);
        scale.domain(domain).nice();

        return scale;
    }

    /**
     * Crea una escala band para el eje X.
     * @param params - Valores, padding, ancho y padding izquierdo opcional.
     * @returns Escala categórica (band) de D3 configurada.
     */
    getXBandScale(params: BandScaleXParams): d3.ScaleBand<string> {
        const { values, padding, width, leftPadding = 0 } = params;
        const innerWidth = width - this.margin.left - this.margin.right;
        const scale = d3.scaleBand().range([leftPadding, innerWidth]);
        scale.domain(values).padding(padding);

        return scale;
    }

    /**
     * Crea una escala band para el eje Y.
     * @param params - Valores, alto, padding y padding superior opcional.
     * @returns Escala categórica (band) de D3 configurada.
     */
    getYBandScale(params: BandScaleYParams): d3.ScaleBand<string> {
        const { values, height, padding, topPadding = 0 } = params;
        const innerHeight = height - this.margin.top - this.margin.bottom;
        const scale = d3.scaleBand().range([innerHeight, topPadding]);
        scale.domain(values).padding(padding);

        return scale;
    }

    /**
     * Renderiza los ejes X/Y y ajusta el rango de X según el ancho de ticks del Y.
     * @param params - Escalas, labels y formatters opcionales.
     * @returns Los elementos de ejes renderizados.
     */
    plotAxes<
        XScale extends AnyScale, 
        YScale extends AnyScale
    >(params: PlotAxesParams<XScale, YScale>): PlotAxesResult {
        const { svg, xScale, yScale, xLabel, yLabel, xAxisFormatter, yAxisFormatter } = params;
        
        const height = this.getScaleRangeStart(yScale);

        // Create and configure Y axis
        const yAxis = this.createYAxis(svg, yScale, yLabel, yAxisFormatter);
        
        // Calculate max width of Y axis tick labels
        const maxTickWidth = this.calculateMaxTickWidth(yAxis);
        
        // Adjust X scale range based on Y axis width
        this.adjustXScaleRange(xScale, maxTickWidth);
        
        // Position Y axis
        yAxis.attr("transform", `translate(${this.getScaleRangeStart(xScale)}, 0)`);
        
        // Create and configure X axis
        const xAxis = this.createXAxis(svg, xScale, height, xLabel, xAxisFormatter);

        return { xAxis, yAxis };
    }

    /**
     * Crea y configura el eje Y, incluyendo su etiqueta.
     * @param svg - Grupo raíz donde se añadirá el eje.
     * @param yScale - Escala para el eje Y (band o lineal).
     * @param yLabel - Texto de la etiqueta del eje Y.
     * @param yAxisFormatter - Función para customizar el eje (opcional).
     * @returns Selección del grupo del eje Y.
     */
    private createYAxis<YScale extends AnyScale>(
        svg: d3.Selection<SVGGElement, unknown, null, undefined>,
        yScale: YScale,
        yLabel: string,
        yAxisFormatter?: (axis: D3Axis<any>) => void
    ): d3.Selection<SVGGElement, unknown, null, undefined> {
        const yAxisGenerator = this.isBandScale(yScale)
            ? axisLeft(yScale)
            : axisLeft(yScale as d3.ScaleLinear<number, number>);

        if (yAxisFormatter) {
            yAxisFormatter(yAxisGenerator);
        }

        const yAxis = svg
            .append("g")
            .attr("class", "y axis")
            .call(yAxisGenerator);

        // Add Y axis label
        yAxis
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dx", -this.getScaleRangeEnd(yScale))
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("fill", "black")
            .text(yLabel);

        return yAxis;
    }

    /**
     * Crea y configura el eje X, incluyendo su etiqueta.
     * @param svg - Grupo raíz donde se añadirá el eje.
     * @param xScale - Escala para el eje X (band o lineal).
     * @param height - Altura donde posicionar el eje X.
     * @param xLabel - Texto de la etiqueta del eje X.
     * @param xAxisFormatter - Función para customizar el eje (opcional).
     * @returns Selección del grupo del eje X.
     */
    private createXAxis<XScale extends AnyScale>(
        svg: d3.Selection<SVGGElement, unknown, null, undefined>,
        xScale: XScale,
        height: number,
        xLabel: string,
        xAxisFormatter?: (axis: D3Axis<any>) => void
    ): d3.Selection<SVGGElement, unknown, null, undefined> {
        const xAxisGenerator = this.isBandScale(xScale)
            ? axisBottom(xScale)
            : axisBottom(xScale as d3.ScaleLinear<number, number>);
                
        if (xAxisFormatter) {
            xAxisFormatter(xAxisGenerator);
        }

        const xAxis = svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxisGenerator);

        // Add X axis label
        xAxis
            .append("text")
            .attr("class", "label")
            .attr("x", this.getScaleRangeEnd(xScale))
            .attr("y", -6)
            .style("text-anchor", "end")
            .attr("fill", "black")
            .text(xLabel);

        return xAxis;
    }

    /**
     * Calcula el ancho máximo de los textos de ticks del eje Y.
     * @param yAxis - Selección del eje Y.
     * @returns Ancho máximo encontrado.
     */
    private calculateMaxTickWidth(yAxis: d3.Selection<SVGGElement, unknown, null, undefined>): number {
        let maxWidth = 0;
        yAxis.selectAll<SVGTextElement, unknown>(".tick text").each(function () {
            const bbox = this.getBBox();
            maxWidth = Math.max(maxWidth, bbox.width);
        });
        return maxWidth;
    }

    /**
     * Ajusta el rango inicial de la escala X según el ancho máximo de ticks del Y.
     * @param xScale - Escala del eje X.
     * @param maxTickWidth - Ancho máximo de los ticks del Y.
     */
    private adjustXScaleRange<XScale extends AnyScale>(
        xScale: XScale,
        maxTickWidth: number
    ): void {
        const xRange = xScale.range() as [number, number];
        xRange[0] += maxTickWidth;
        xScale.range(xRange);
    }

    /**
     * Obtiene el inicio del rango de una escala.
     * @param scale - Escala de D3 (band/lineal).
     * @returns Valor inicial del rango.
     */
    private getScaleRangeStart(scale: AnyScale): number {
        return scale.range()[0];
    }

    /**
     * Obtiene el fin del rango de una escala.
     * @param scale - Escala de D3 (band/lineal).
     * @returns Valor final del rango.
     */
    private getScaleRangeEnd(scale: AnyScale): number {
        return scale.range()[1];
    }
    
    /**
     * Determina si una escala es de tipo band (categórica).
     * @param scale - Escala de D3.
     * @returns Verdadero si la escala posee método bandwidth.
     */
    private isBandScale(scale: AnyScale): scale is d3.ScaleBand<string> {
        return typeof (scale as d3.ScaleBand<string>).bandwidth === "function";
    }
}