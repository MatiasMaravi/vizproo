import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { BaseModel, BaseView } from "../base/base";
import { 
    ClickSelectButton,   
    BoxSelectButton,
    DeselectAllButton,
    SideBar
} from "./tools/tools";

import { RadVizParams, RadVizPoint, RadVizAxis } from "./interface";

export class RadViz extends BasePlot {
    private chartRadius: number = 0;
    private centerX: number = 0;
    private centerY: number = 0;

    private createAxes(dimensions: string[]): RadVizAxis[] {
        const n = dimensions.length;
        return dimensions.map((key, i) => ({
            label: key,
            angle: (2 * Math.PI * i) / n,
            x: Math.cos((2 * Math.PI * i) / n),
            y: Math.sin((2 * Math.PI * i) / n)
        }));
    }

    private createNormalizationScales(data: any[], dimensions: string[]): Record<string, d3.ScaleLinear<number, number>> {
        const scales: Record<string, d3.ScaleLinear<number, number>> = {};
        for (const key of dimensions) {
            const extent = d3.extent(data, d => d[key]) as [number, number];
            scales[key] = d3.scaleLinear().domain(extent).range([0, 1]);
        }
        return scales;
    }

    private calculateRadVizPositions(
        data: any[], 
        dimensions: string[], 
        axes: RadVizAxis[], 
        scales: Record<string, d3.ScaleLinear<number, number>>
    ): RadVizPoint[] {
        return data.map((d, index) => {
            let sumW = 0, x = 0, y = 0;
            
            for (let i = 0; i < dimensions.length; i++) {
                const key = dimensions[i];
                const w = scales[key](d[key]);
                sumW += w;
                x += w * axes[i].x;
                y += w * axes[i].y;
            }
            
            x /= sumW;
            y /= sumW;
            
            return {
                x: x * this.chartRadius,
                y: y * this.chartRadius,
                originalData: d,
                id: index
            };
        });
    }

    plot(params: RadVizParams): void {
        const { data, dimensions, hue, setSelectedValues, width, height, noSideBar } = params;
        let actualWidth = width;
        let clickSelectButton: ClickSelectButton<SVGCircleElement> | null = null;
        let boxSelectButton: BoxSelectButton<SVGCircleElement> | null = null;
        let deselectAllButton: DeselectAllButton | null = null;

        if (!noSideBar) actualWidth = width ? width - SideBar.SIDE_BAR_WIDTH : 0;

        this.init(actualWidth, height);

        const GG = this.gGrid;
        
        // Calculate chart dimensions
        const chartWidth = (actualWidth || this.element.clientWidth || 500) - this.margin.left - this.margin.right;
        const chartHeight = (height || this.element.clientHeight || 500) - this.margin.top - this.margin.bottom;
        this.chartRadius = Math.min(chartWidth, chartHeight) / 2 - 50;
        this.centerX = chartWidth / 2;
        this.centerY = chartHeight / 2;

        // Create dial group
        const dial = GG.append("g")
            .attr("transform", `translate(${this.centerX}, ${this.centerY})`);

        function callUpdateSelected() {
            if (setSelectedValues) {
                const selectedData = dial.selectAll(".point.selected").data() as RadVizPoint[];
                const cleanedData = selectedData.map((d: RadVizPoint) => d.originalData);
                setSelectedValues(cleanedData);
            }
            
            // Update visual styling based on selection
            updateSelectionStyling();
        }

        function updateSelectionStyling() {
            const selectedPoints = dial.selectAll(".point.selected");
            const unselectedPoints = dial.selectAll(".point:not(.selected)");
            
            // PRIMERO: Restaurar TODOS los puntos a su estado original
            pointSelection
                .attr("fill", (d: RadVizPoint) => {
                    if (hue && d.originalData[hue] !== undefined) {
                        return colorScale(String(d.originalData[hue]));
                    }
                    return colorScale("default");
                })
                .attr("fill-opacity", 0.7)
                .attr("stroke", "#000")
                .attr("stroke-width", 0.5);
            
            // SEGUNDO: Si hay selecciones, aplicar estilos específicos
            if (selectedPoints.size() > 0) {
                // Style selected points (highlighted)
                selectedPoints
                    .attr("fill-opacity", 1)
                    .attr("stroke-width", 2)
                    .attr("stroke", "#000");
                
                // Style unselected points (grayed out)
                unselectedPoints
                    .attr("fill", "#888")
                    .attr("fill-opacity", 0.3)
                    .attr("stroke", "#666")
                    .attr("stroke-width", 0.5);
            }
        }

        // Use provided dimensions instead of detecting numeric columns
        if (!dimensions || dimensions.length < 2) {
            console.warn("RadViz requires at least 2 dimensions");
            return;
        }

        // Create axes
        const axes = this.createAxes(dimensions);

        // Create normalization scales
        const scales = this.createNormalizationScales(data, dimensions);

        // Calculate RadViz positions
        const points = this.calculateRadVizPositions(data, dimensions, axes, scales);

        // Create color scale
        let colorScale: d3.ScaleOrdinal<string, string>;
        if (hue && data.length > 0) {
            const categories = Array.from(new Set(data.map(d => String(d[hue]))));
            colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);
        } else {
            colorScale = d3.scaleOrdinal(["#1f77b4"]).domain(["default"]);
        }

        // Draw axis labels
        dial.selectAll("text.axis-label")
            .data(axes)
            .enter()
            .append("text")
            .attr("class", "axis-label")
            .attr("x", d => d.x * (this.chartRadius + 15))
            .attr("y", d => d.y * (this.chartRadius + 15))
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("fill", "black")
            .text(d => d.label);

        const axisPointsSelection = dial.selectAll("circle.axis-point").data(axes);
        const axisPointsEnter = axisPointsSelection.enter()
            .append("circle")
            .attr("class", "axis-point")
            .attr("cx", d => d.x * this.chartRadius)
            .attr("cy", d => d.y * this.chartRadius)
            .attr("r", 6)
            .attr("fill", "#f00a0aff")
            .attr("cursor", "move");
        const axisPoints = axisPointsEnter.merge(axisPointsSelection as any)
            .attr("cx", d => d.x * this.chartRadius)
            .attr("cy", d => d.y * this.chartRadius);

        // Add drag behavior to axis lines
        const chartRadius = this.chartRadius;
       

        const pointDragBehavior = d3.drag<SVGCircleElement, RadVizAxis>()
            .on("start", function(event, d: RadVizAxis) {
                d3.select(this).attr("r", 8);
            })
            .on("drag", (event, d: RadVizAxis) => {
                // Obtener coordenadas del mouse relativas al centro del dial
                const [mouseX, mouseY] = d3.pointer(event, dial.node());
                
                // Calcular el ángulo desde el centro hacia el mouse
                const angle = Math.atan2(mouseY, mouseX);
                
                // Actualizar los datos del eje (valores normalizados entre -1 y 1)
                d.x = Math.cos(angle);
                d.y = Math.sin(angle);
                d.angle = angle;
                
                // Calcular la posición exacta en el perímetro del círculo (coordenadas absolutas)
                const newX = d.x * chartRadius;
                const newY = d.y * chartRadius;

                // Actualizar el punto del eje correspondiente
                dial.selectAll("circle.axis-point")
                    .filter((l: any) => l === d)
                    .attr("cx", newX)
                    .attr("cy", newY);
                
                dial.selectAll("text.axis-label")
                    .filter((l: any) => l === d)
                    .attr("x", d.x * (chartRadius + 15))
                    .attr("y", d.y * (chartRadius + 15));
                
                // Recalcular y actualizar posiciones de todos los puntos
                const updatedPoints = this.calculateRadVizPositions(data, dimensions, axes, scales);
                pointSelection
                    .data(updatedPoints)
                    .attr("cx", (pt: any) => pt.x)
                    .attr("cy", (pt: any) => pt.y);
            })
            .on("end", function(event, d: RadVizAxis) {
                d3.select(this).attr("r", 6);
            });

        axisPoints.call(pointDragBehavior);

        // Draw outer circle
        dial.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", this.chartRadius)
            .attr("fill", "none")
            .attr("stroke", "#ddd")
            .attr("stroke-width", 1);

        // Draw points
        const pointSelection = dial.selectAll("circle.point")
            .data(points)
            .enter()
            .append("circle")
            .attr("class", "point")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 4)
            .attr("fill", d => {
                if (hue && d.originalData[hue] !== undefined) {
                    return colorScale(String(d.originalData[hue]));
                }
                return colorScale("default");
            })
            .attr("fill-opacity", 0.7)
            .attr("stroke", "#000")
            .attr("stroke-width", 0.5)
            .on("click", (event: MouseEvent, d: RadVizPoint) => {
                if (clickSelectButton) {
                    clickSelectButton.selectionClickEffect(d3.select(event.currentTarget as SVGCircleElement));
                    callUpdateSelected();
                }
            });

        // Initialize sidebar with selection tools
        if (!noSideBar) {
            clickSelectButton = new ClickSelectButton(true);
            deselectAllButton = new DeselectAllButton(pointSelection, callUpdateSelected);
            
            // Create scales for box selection (using chart coordinates)
            const xScale = d3.scaleLinear()
                .domain([-this.chartRadius, this.chartRadius])
                .range([-this.chartRadius, this.chartRadius]);
            const yScale = d3.scaleLinear()
                .domain([-this.chartRadius, this.chartRadius])
                .range([-this.chartRadius, this.chartRadius]);

            boxSelectButton = new BoxSelectButton({
                xScale: xScale,
                yScale: yScale,
                x_value: "x",
                y_value: "y",
                x_translate: this.centerX,
                y_translate: this.centerY,
                selectables: pointSelection as d3.Selection<SVGCircleElement, any, SVGGElement, any>,
                callUpdateSelected: callUpdateSelected,
                base: dial,
                selected: false
            });

            const sideBar = new SideBar(
                this.element,
                clickSelectButton,
                boxSelectButton,
                deselectAllButton
            );
            sideBar.inicializar();
        }
    }
}

export class RadVizModel extends BaseModel {
    defaults() {
        return {
            ...super.defaults(),
            _model_name: RadVizModel.model_name,
            _view_name: RadVizModel.view_name,
            dataRecords: [],
            dimensions: [],
            hue: String,
            elementId: String,
            selectedValuesRecords: [],
        };
    }

    static readonly model_name = "RadVizModel";
    static readonly view_name = "RadVizView";
}

export class RadVizView extends BaseView<RadViz> {
    params(): RadVizParams {
        return {
            data: this.model.get("dataRecords"),
            dimensions: this.model.get("dimensions"),
            hue: this.model.get("hue"),
            setSelectedValues: this.setSelectedValues.bind(this),
            width: this.width,
            height: this.height,
            noSideBar: false,
        };
    }

    plot(element: HTMLElement) {
        this.widget = new RadViz(element);

        this.model.on("change:dataRecords", () => this.replot(), this);
        this.model.on("change:hue", () => this.replot(), this);
        window.addEventListener("resize", () => this.replot());

        this.widget.plot(this.params());
    }

    setSelectedValues(values: any[]) {
        this.model.set({ selectedValuesRecords: values });
        this.model.save_changes();
    }
}
