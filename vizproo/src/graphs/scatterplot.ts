import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { BaseModel, BaseView } from "../base/base";

import { 
    ClickSelectButton,   
    DeselectAllButton ,
    BoxSelectButton,
    SideBar
} from "./tools/tools";
 

import { 
        ScatterPlotParams,
        ProcessedScatterData
    } from "./interface";

const DEFAULT_COLOR = "#4299e1";

export class ScatterPlot extends BasePlot {
    
    plot(params: ScatterPlotParams): void {
        const { data, x, y, size, height, hue,setSelectedValues, noSideBar } = params;
        let {width, opacity, pointSize} = params;
        opacity = opacity ?? 0.7;
        pointSize = pointSize ?? 5;

        if (!noSideBar) width = width ? width - SideBar.SIDE_BAR_WIDTH : 0;

        let clickSelectButton: ClickSelectButton<SVGCircleElement> | null = null;
        let deselectAllButton: DeselectAllButton | null = null;
        let boxSelectButton: BoxSelectButton<SVGCircleElement> | null = null;

        const randomString = Math.floor(
            Math.random() * Date.now() * 10000
        ).toString(36);

        this.init(width, height);

        const GG = this.gGrid;
        function callUpdateSelected() {
            if (setSelectedValues) {
                const selectedData = GG.selectAll(".scatter_dot.selected").data();
                // Filtrar los atributos internos antes de guardar
                const cleanedData = selectedData.map((d: any) => {
                    const { x_, y_, id, originalData, size_, ...rest } = d;
                    return originalData || rest; // Return original data if available, otherwise filtered data
                });
                setSelectedValues(cleanedData);
            }
        }

        const mouseClick = (event: MouseEvent, d: ProcessedScatterData) => {
            if (clickSelectButton) {
                clickSelectButton.selectionClickEffect(d3.select(event.currentTarget as SVGCircleElement));
                callUpdateSelected();
            }
        };
        // Procesar datos
        const processedData: ProcessedScatterData[] = data
            .map((row: any, index: number) => {
                const xVal = Number.parseFloat(row[x]);
                const yVal = Number.parseFloat(row[y]);

                if (Number.isNaN(xVal) || Number.isNaN(yVal)) {
                    return null;
                }

                const processed: ProcessedScatterData = {
                    ...row,
                    x_: xVal,
                    y_: yVal,
                    id: index,
                    originalData: { ...row } // Store a copy of the original row
                };


                if (size && row[size] !== undefined) {
                    const sizeVal = Number.parseFloat(row[size]);
                    if (!Number.isNaN(sizeVal)) {
                        processed.size_ = sizeVal;
                    }
                }

                return processed;
            })
            .filter((d): d is ProcessedScatterData => d !== null);

        if (processedData.length === 0) {
            console.warn("No hay datos válidos para graficar");// mensajes de error
            return;
        }
        if (width == null || height == null) {
            throw new Error("Width and height must be defined");// mensajes de error
        }
        // Crear escalas X e Y
        const xExtent = d3.extent(processedData, d => d.x_) as [number, number];
        const yExtent = d3.extent(processedData, d => d.y_) as [number, number];

        const xScale = this.getXLinearScale({ domain: xExtent, width });
        const yScale = this.getYLinearScale({ domain: yExtent, height });

        // Escala de color categórica
        let colorScale: d3.ScaleOrdinal<string, string>;
        if (hue == null) {
            colorScale = d3.scaleOrdinal<string, string>([DEFAULT_COLOR]);
        } else {
            const categories = Array.from(
                new Set(
                    processedData
                        .map(d => d[hue])
                        .filter(v => v !== undefined && v !== null)
                )
            ).map(String);

            if (categories.length === 0) {
                colorScale = d3.scaleOrdinal<string, string>([DEFAULT_COLOR]);
            } else {
                colorScale = d3.scaleOrdinal<string, string>()
                    .domain(categories)
                    .range(d3.schemeCategory10);
            }
        }

        // Escala de tamaño
        let sizeScale: d3.ScaleLinear<number, number> | null = null;

        if (size && processedData.some(d => d.size_ !== undefined)) {
            const sizeExtent = d3.extent(processedData, d => d.size_) as [number, number];
            sizeScale = d3.scaleLinear()
                .domain(sizeExtent)
                .range([pointSize * 0.5, pointSize * 2]);
        }

        // Dibujar ejes
        this.plotAxes({
            svg: GG,
            xScale,
            yScale,
            xLabel: x,
            yLabel: y
        });

        const dots = GG.selectAll(".scatter_dot").data(processedData).enter().append("circle");

        dots.attr("id", function (d, i) {
                return "scatter_dot-" + randomString + "-" + d.id;
            })
            .attr('class','scatter_dot')
            .attr("cx", d => xScale(d.x_))
            .attr("cy", d => yScale(d.y_))
            .attr("r", d => {
                if (sizeScale && d.size_ !== undefined) {
                    return sizeScale(d.size_);
                }
                return pointSize;
            })
            .attr("fill", d => {
                if (hue == null) return DEFAULT_COLOR;
                return colorScale(String(d[hue]));
            })
            .attr("fill-opacity", opacity)
            .on("click", mouseClick);
        if (!noSideBar) {
            clickSelectButton = new ClickSelectButton(true);
            deselectAllButton = new DeselectAllButton(dots, callUpdateSelected);
            boxSelectButton = new BoxSelectButton({
                xScale: xScale,
                yScale: yScale,
                x_value: x,
                y_value: y,
                x_translate: 0,
                y_translate: 0,
                selectables: dots,
                callUpdateSelected: callUpdateSelected,
                base: GG,
                selected: false
            })
            const sideBar = new SideBar(
                this.element,
                clickSelectButton,
                deselectAllButton,
                boxSelectButton
            );
            sideBar.inicializar();
        }

    }
}

export class ScatterPlotModel extends BaseModel {
    defaults() {
        return {
            ...super.defaults(),
            _model_name: ScatterPlotModel.model_name,
            _view_name: ScatterPlotModel.view_name,

            dataRecords: [],
            x: String,
            y: String,
            hue: String,
            size: String,
            pointSize: 5,
            opacity: 0.7,
            elementId: String,
            selectedValuesRecords: []
        };
    }

    static readonly model_name = "ScatterPlotModel";
    static readonly view_name = "ScatterPlotView";
}

export class ScatterPlotView extends BaseView<ScatterPlot> {
    params(): ScatterPlotParams {
        return {
            data: this.model.get("dataRecords"),
            x: this.model.get("x"),
            y: this.model.get("y"),
            hue: this.model.get("hue"),
            setSelectedValues: this.setSelectedValues.bind(this),
            size: this.model.get("size"),
            pointSize: this.model.get("pointSize"),
            opacity: this.model.get("opacity"),
            width: this.width,
            height: this.height,
            noSideBar: false,
        };
    }

    plot(element: HTMLElement) {
        this.widget = new ScatterPlot(element);

        this.model.on("change:dataRecords", () => this.replot(), this);
        this.model.on("change:x", () => this.replot(), this);
        this.model.on("change:y", () => this.replot(), this);
        this.model.on("change:hue", () => this.replot(), this);
        this.model.on("change:size", () => this.replot(), this);
        this.model.on("change:pointSize", () => this.replot(), this);
        this.model.on("change:opacity", () => this.replot(), this);
        window.addEventListener("resize", () => this.replot());

        this.widget.plot(this.params());
    }
    setSelectedValues(values: any[]) {
        this.model.set({ selectedValuesRecords: values });
        this.model.save_changes();
    }
}
