import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { BaseModel, BaseView } from "../base/base";
import { 
    ClickSelectButton, 
    BoxSelectButton,
    DeselectAllButton,
    SideBar
} from "./tools/tools";

import { StarCoordinatesParams, StarCoordinatesPoint, StarCoordinatesAnchor } from "./interface";

export class StarCoordinates extends BasePlot {
    private chartRadius: number = 0;
    private centerX: number = 0;
    private centerY: number = 0;

    private createAnchors(dimensions: string[]): StarCoordinatesAnchor[] {
        const n = dimensions.length;
        return dimensions.map((feature, i) => {
            const angle = (2 * Math.PI * i) / n;
            return {
                feature: feature,
                x: Math.cos(angle),
                y: Math.sin(angle)
            };
        });
    }

    private createNormalizationScales(data: any[], dimensions: string[]): Record<string, d3.ScaleLinear<number, number>> {
        const scales: Record<string, d3.ScaleLinear<number, number>> = {};
        for (const key of dimensions) {
            const extent = d3.extent(data, d => d[key]) as [number, number];
            scales[key] = d3.scaleLinear()
                .domain(extent)
                .range([0, 1]);
        }
        return scales;
    }

    private calculateStarCoordinatesPositions(
        data: any[], 
        dimensions: string[], 
        anchors: StarCoordinatesAnchor[], 
        scales: Record<string, d3.ScaleLinear<number, number>>
    ): StarCoordinatesPoint[] {
        return data.map((d, index) => {
            let x = 0, y = 0;
            
            for (let i = 0; i < dimensions.length; i++) {
                const key = dimensions[i];
                const normalizedValue = scales[key](d[key]);
                x += normalizedValue * anchors[i].x;
                y += normalizedValue * anchors[i].y;
            }
            
            return {
                x: x * this.chartRadius,
                y: y * this.chartRadius,
                originalData: d,
                id: index
            };
        });
    }

    plot(params: StarCoordinatesParams) {
        const { 
            data, 
            dimensions, 
            hue, 
            setSelectedValues, 
            width, 
            height, 
            noSideBar = false 
        } = params;

        let actualWidth = width;
        let clickSelectButton: ClickSelectButton<SVGCircleElement> | null = null;
        let boxSelectButton: BoxSelectButton<SVGCircleElement> | null = null;
        let deselectAllButton: DeselectAllButton | null = null;

        if (!noSideBar) actualWidth = width ? width - SideBar.SIDE_BAR_WIDTH : 0;

        this.init(actualWidth, height);
        const GG = this.gGrid;
        if (!GG) return;

        const chartWidth = (actualWidth || this.element.clientWidth || 500) - this.margin.left - this.margin.right;
        const chartHeight = (height || this.element.clientHeight || 500) - this.margin.top - this.margin.bottom;
        this.chartRadius = Math.max(50, (Math.min(chartWidth, chartHeight) / 2) - Math.max(40, Math.min(100, Math.min(chartWidth, chartHeight) * 0.15)));
        this.centerX = chartWidth / 2;
        this.centerY = chartHeight / 2;

        // Create dial group
        const dial = GG.append("g")
            .attr("transform", `translate(${this.centerX}, ${this.centerY})`);

        // Use provided dimensions instead of detecting numeric columns
        if (!dimensions || dimensions.length < 2) {
            console.warn("StarCoordinates requires at least 2 dimensions");
            return;
        }

        // Create anchors
        const anchors = this.createAnchors(dimensions);

        // Create normalization scales
        const scales = this.createNormalizationScales(data, dimensions);

        // Calculate Star Coordinates positions
        const points = this.calculateStarCoordinatesPositions(data, dimensions, anchors, scales);

        // Create color scale
        let colorScale: d3.ScaleOrdinal<string, string>;
        if (hue && data.length > 0) {
            const categories = Array.from(new Set(data.map(d => String(d[hue]))));
            colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);
        } else {
            colorScale = d3.scaleOrdinal(["#1f77b4"]).domain(["default"]);
        }

        // Draw anchor labels
        dial.selectAll("text.anchor-label")
            .data(anchors)
            .enter()
            .append("text")
            .attr("class", "anchor-label")
            .attr("x", d => {
                const offset = 25;
                const anchorX = d.x * this.chartRadius;
                const norm = Math.sqrt(anchorX * anchorX + (d.y * this.chartRadius) * (d.y * this.chartRadius));
                const offsetX = norm > 0 ? (anchorX / norm) * offset : 0;
                return anchorX + offsetX;
            })
            .attr("y", d => {
                const offset = 25;
                const anchorY = d.y * this.chartRadius;
                const norm = Math.sqrt((d.x * this.chartRadius) * (d.x * this.chartRadius) + anchorY * anchorY);
                const offsetY = norm > 0 ? (anchorY / norm) * offset : 0;
                return anchorY + offsetY;
            })
            .attr("text-anchor", d => {
                if (d.x > 0.1) return "start";
                if (d.x < -0.1) return "end";
                return "middle";
            })
            .attr("dominant-baseline", d => {
                if (d.y > 0.1) return "hanging";
                if (d.y < -0.1) return "baseline";
                return "central";
            })
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text(d => d.feature);
        
        dial.selectAll("line.axis-line")
            .data(anchors)
            .enter()
            .append("line")
            .attr("class", "axis-line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", d => d.x * this.chartRadius)
            .attr("y2", d => d.y * this.chartRadius)
            .style("stroke", "#999")
            .style("stroke-width", 1)
            .style("stroke-dasharray", "4 2");

        // Add drag behavior to axis points - WITH BOUNDARY RESTRICTIONS
        const chartRadius = this.chartRadius;
        const pointDragBehavior = d3.drag<SVGCircleElement, StarCoordinatesAnchor>()
            .on("start", function(event, d: StarCoordinatesAnchor) {
                d3.select(this).attr("stroke-width", 4);
            })
            .on("drag", (event, d: StarCoordinatesAnchor) => {
                // Get mouse coordinates relative to dial center
                let [mouseX, mouseY] = d3.pointer(event, dial.node());
                
                // APPLY GENTLER BOUNDARY RESTRICTIONS - allow significant extension
                const maxDistance = chartRadius * 2.5; // Allow 2.5x beyond base radius for more freedom
                const distance = Math.hypot(mouseX, mouseY);
                
                if (distance > maxDistance) {
                    // Scale back to maximum allowed distance
                    const scale = maxDistance / distance;
                    mouseX *= scale;
                    mouseY *= scale;
                }
                
                // Restrict to reasonable canvas boundaries
                const canvasMargin = 50; // Larger margin for labels
                const maxX = this.centerX - canvasMargin;
                const maxY = this.centerY - canvasMargin;
                const minX = -this.centerX + canvasMargin;
                const minY = -this.centerY + canvasMargin;
                
                mouseX = Math.max(minX, Math.min(maxX, mouseX));
                mouseY = Math.max(minY, Math.min(maxY, mouseY));
                
                // Update relative coordinates
                d.x = mouseX / chartRadius;
                d.y = mouseY / chartRadius;
                
                // Update axis line
                dial.selectAll("line.axis-line")
                    .filter((l: any) => l === d)
                    .attr('x2', mouseX)
                    .attr('y2', mouseY);
                
                // Update anchor label with offset from new position
                dial.selectAll("text.anchor-label")
                    .filter((l: any) => l === d)
                    .attr("x", () => {
                        const offset = 25;
                        const norm = Math.hypot(mouseX, mouseY);
                        const offsetX = norm > 0 ? (mouseX / norm) * offset : 0;
                        return mouseX + offsetX;
                    })
                    .attr("y", () => {
                        const offset = 25;
                        const norm = Math.hypot(mouseX, mouseY);
                        const offsetY = norm > 0 ? (mouseY / norm) * offset : 0;
                        return mouseY + offsetY;
                    })
                    .attr("text-anchor", () => {
                        const normalizedX = mouseX / chartRadius;
                        if (normalizedX > 0.1) return "start";
                        if (normalizedX < -0.1) return "end";
                        return "middle";
                    })
                    .attr("dominant-baseline", () => {
                        const normalizedY = mouseY / chartRadius;
                        if (normalizedY > 0.1) return "hanging";
                        if (normalizedY < -0.1) return "baseline";
                        return "central";
                    });
                
                // Update anchor node position
                dial.selectAll("circle.anchor-node")
                    .filter((l: any) => l === d)
                    .attr('cx', mouseX)
                    .attr('cy', mouseY);
                
                // Recalculate and update positions of all points
                const updatedPoints = this.calculateStarCoordinatesPositions(data, dimensions, anchors, scales);
                pointSelection
                    .data(updatedPoints)
                    .attr("cx", (pt: any) => pt.x)
                    .attr("cy", (pt: any) => pt.y);
            })
            .on("end", function(event, d: StarCoordinatesAnchor) {
                d3.select(this).attr("stroke-width", 2);
            });

        // Draw anchor nodes (black circles)
        dial.selectAll("circle.anchor-node")
            .data(anchors)
            .enter()
            .append("circle")
            .attr("class", "anchor-node")
            .attr("cx", (d: StarCoordinatesAnchor) => d.x * this.chartRadius)
            .attr("cy", (d: StarCoordinatesAnchor) => d.y * this.chartRadius)
            .attr("r", 6)
            .attr("fill", "#f00b0bff")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .style("cursor", "move")
            .style("filter", "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))")
            .call(pointDragBehavior);

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
            .attr("fill-opacity", 0.8)
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("click", (event: MouseEvent, d: StarCoordinatesPoint) => {
                // Integrate click selection tool if available
                if (clickSelectButton) {
                    clickSelectButton.selectionClickEffect(d3.select(event.currentTarget as SVGCircleElement));
                    callUpdateSelected();
                } else {
                    // Fallback: simple log
                }
            });

        function callUpdateSelected() {
            if (setSelectedValues) {
                const selectedData = dial.selectAll(".point.selected").data() as StarCoordinatesPoint[];
                const cleanedData = selectedData.map((d: StarCoordinatesPoint) => d.originalData);
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
                .attr("fill", (d: StarCoordinatesPoint) => {
                    if (hue && d.originalData[hue] !== undefined) {
                        return colorScale(String(d.originalData[hue]));
                    }
                    return colorScale("default");
                })
                .attr("fill-opacity", 0.8)
                .attr("stroke", "white")
                .attr("stroke-width", 2);

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

        // Initialize sidebar with selection tools
        if (!noSideBar) {
            clickSelectButton = new ClickSelectButton(true);
            deselectAllButton = new DeselectAllButton(pointSelection as d3.Selection<SVGCircleElement, any, SVGGElement, any>, callUpdateSelected);

            // Create scales for box selection - matching the coordinate system of the points
            const maxCoord = chartRadius * 2.5; // Match the maximum allowed distance
            const xScale = d3.scaleLinear()
                .domain([-maxCoord, maxCoord])
                .range([-maxCoord, maxCoord]);
            const yScale = d3.scaleLinear()
                .domain([-maxCoord, maxCoord])
                .range([-maxCoord, maxCoord]);

            boxSelectButton = new BoxSelectButton({
                xScale: xScale,
                yScale: yScale,
                x_value: "x",
                y_value: "y",
                x_translate: this.centerX, // Use center translation to match dial group
                y_translate: this.centerY, // Use center translation to match dial group
                selectables: pointSelection as d3.Selection<SVGCircleElement, any, SVGGElement, any>,
                callUpdateSelected: callUpdateSelected,
                base: dial, // Use the dial group where points are located
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

export class StarCoordinatesModel extends BaseModel {
    defaults() {
        return {
            ...super.defaults(),
            _model_name: "StarCoordinatesModel",
            _view_name: "StarCoordinatesView",
        };
    }
}

export class StarCoordinatesView extends BaseView {
    model: StarCoordinatesModel;

    get dataRecords() { return this.model.get("dataRecords"); }
    get dimensions() { return this.model.get("dimensions"); }
    get hue() { return this.model.get("hue"); }

    params(): StarCoordinatesParams {
        return {
            data: this.dataRecords,
            dimensions: this.dimensions,
            hue: this.hue,
            setSelectedValues: this.setSelectedValues.bind(this),
            width: this.width,
            height: this.height,
            noSideBar: false,
        };
    }

    plot(element: HTMLElement) {
        this.widget = new StarCoordinates(element);

        this.model.on("change:dataRecords", () => this.replot(), this);
        this.model.on("change:dimensions", () => this.replot(), this);
        this.model.on("change:hue", () => this.replot(), this);
        window.addEventListener("resize", () => this.replot());

        this.widget.plot(this.params());
    }

    setSelectedValues(values: any[]) {
        this.model.set({ selectedValuesRecords: values });
        this.model.save_changes();
    }
}