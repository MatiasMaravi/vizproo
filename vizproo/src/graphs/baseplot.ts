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


export abstract class BasePlot extends BaseWidget {
    margin: { top: number; right: number; bottom: number; left: number; };
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    gGrid: d3.Selection<SVGGElement, unknown, null, undefined>;

    constructor(element: HTMLElement) {
        super(element);
        this.margin = WIDGET_MARGIN;
    }

    init(width: number | null, height: number | null){
        this.svg = d3.select(this.element)
            .append("svg")
            .attr("width", width ? width - 2 : 0)
            .attr("height", height || 0)
            .attr("class", "graph");
        this.gGrid = this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    }
    getXLinearScale(params: LinearScaleXParams): d3.ScaleLinear<number, number> {
        const { domain, width, leftPadding = 0 } = params;
        const innerWidth = width - this.margin.left - this.margin.right;
        const scale = d3.scaleLinear().range([leftPadding, innerWidth]);
        scale.domain(domain).nice();

        return scale;
    }

    getYLinearScale(params: LinearScaleYParams): d3.ScaleLinear<number, number> {
        const { domain, height, topPadding = 0 } = params;
        const innerHeight = height - this.margin.top - this.margin.bottom;
        const scale = d3.scaleLinear().range([innerHeight, topPadding]);
        scale.domain(domain).nice();

        return scale;
    }

    getXBandScale(params: BandScaleXParams): d3.ScaleBand<string> {
        const { values, padding, width, leftPadding = 0 } = params;
        const innerWidth = width - this.margin.left - this.margin.right;
        const scale = d3.scaleBand().range([leftPadding, innerWidth]);
        scale.domain(values).padding(padding);

        return scale;
    }

    getYBandScale(params: BandScaleYParams): d3.ScaleBand<string> {
        const { values, height, padding, topPadding = 0 } = params;
        const innerHeight = height - this.margin.top - this.margin.bottom;
        const scale = d3.scaleBand().range([innerHeight, topPadding]);
        scale.domain(values).padding(padding);

        return scale;
    }

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

    private calculateMaxTickWidth(yAxis: d3.Selection<SVGGElement, unknown, null, undefined>): number {
        let maxWidth = 0;
        yAxis.selectAll<SVGTextElement, unknown>(".tick text").each(function () {
            const bbox = this.getBBox();
            maxWidth = Math.max(maxWidth, bbox.width);
        });
        return maxWidth;
    }

    private adjustXScaleRange<XScale extends AnyScale>(
        xScale: XScale,
        maxTickWidth: number
    ): void {
        const xRange = xScale.range() as [number, number];
        xRange[0] += maxTickWidth;
        xScale.range(xRange);
    }

    private getScaleRangeStart(scale: AnyScale): number {
        return scale.range()[0];
    }

    private getScaleRangeEnd(scale: AnyScale): number {
        return scale.range()[1];
    }
    
    private isBandScale(scale: AnyScale): scale is d3.ScaleBand<string> {
        return typeof (scale as d3.ScaleBand<string>).bandwidth === "function";
    }
}