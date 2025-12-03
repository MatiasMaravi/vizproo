import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { BaseModel, BaseView } from "../base/base";
import { 
    ClickSelectButton,   
    BoxSelectButton,
    DeselectAllButton ,
    SideBar
} from "./tools/tools";
 
import { 
        BarPlotParams,
        AggregatedValues,
        ProcessedDataRow,
        ScaleConfig
    } from "./interface";

/**
 * Gráfico de barras interactivo.
 * Soporta orientación vertical/horizontal, selección por clic/caja y barra lateral.
 */
export class BarPlot extends BasePlot {
    /**
     * Normaliza datos según la orientación (vertical/horizontal).
     * @param direction - Dirección del gráfico ('vertical' | 'horizontal').
     * @param xValue - Nombre de la columna para el eje X.
     * @param yValue - Nombre de la columna para el eje Y.
     * @param data - Datos originales.
     * @returns Datos con claves auxiliares x_ y y_ además de un id.
     */
    private verifyDirection(direction: string, xValue: string, yValue: string, data: any[]): any[] {
        if (direction === 'vertical') {
            return data.map((item, index) => ({
                ...item,
                x_: item[xValue],
                y_: item[yValue],
                id: index
            }));
        } else {
            return data.map((item, index) => ({
                ...item,
                x_: item[yValue],
                y_: item[xValue],
                id: index
            }));
        }
    }

    /**
     * Obtiene todos los valores únicos del atributo hue como strings.
     * @param RenamedData - Datos normalizados.
     * @param hue_value - Nombre del atributo usado para color.
     * @returns Lista de categorías únicas para el color.
     */
    private get_all_hues(RenamedData: any[], hue_value: string): string[] {
        return RenamedData.reduce((all, row) => {
            const hueValueAsString = String(row[hue_value]);
            if (!all.includes(hueValueAsString)) {
                all.push(hueValueAsString);
            }
            return all;
        }, [] as string[]);
    }

    /**
     * Renderiza el gráfico de barras y configura herramientas de selección.
     * @param params - Datos, mapeos, orientación, dimensiones y callbacks.
     */
    plot(params: BarPlotParams): void {
        const { data, xValue, yValue, hue, setSelectedValues, direction, height, noAxes, noSideBar } = params;
        let width = params.width;
        let clickSelectButton: ClickSelectButton<SVGRectElement> | null = null;
        let boxSelectButton: BoxSelectButton<SVGRectElement> | null = null;
        let deselectAllButton: DeselectAllButton | null = null;
        

        if (!noSideBar) width = width ? width - SideBar.SIDE_BAR_WIDTH : 0;

        const randomString = Math.floor(
            Math.random() * Date.now() * 10000
        ).toString(36);

        this.init(width, height);

        const GG = this.gGrid;

        function callUpdateSelected() {
            if (setSelectedValues) {
                const selectedData = GG.selectAll(".bar.selected").data();
                // Filtrar los atributos internos antes de guardar
                const cleanedData = selectedData.map((d: any) => {
                    const { x_, y_, id, originalData, allOriginalData, ...rest } = d;
                    return rest;
                });
                setSelectedValues(cleanedData);
            }
        }

        const mouseClick = (event: MouseEvent, d: ProcessedDataRow) => {
            if (clickSelectButton) {
                clickSelectButton.selectionClickEffect(d3.select(event.currentTarget as SVGRectElement));
                callUpdateSelected();
            }
        };
        const isVertical = direction === 'vertical';

        const RenamedData = this.verifyDirection(direction, xValue, yValue, data);

        let hue_value: string;
        if (hue) hue_value = hue;
        else hue_value = 'x_';

        const allHues = this.get_all_hues(RenamedData, hue_value);

        if (hue_value === 'x_') {
            createSingleBars(this);
        }

        /**
         * Crea barras agregando por categoría y configura escalas/axes.
         * @param plot - Instancia del gráfico.
         */
        function createSingleBars(plot: BarPlot){
            // Agrega por categoría: suma y cuenta
            const agg: Record<string, AggregatedValues & { rows: any[] }> = {};
            for (const row of RenamedData) {
                const x = String(row.x_);
                const y = Number(row.y_);
                if (agg[x]) {
                    agg[x].sum += y;
                    agg[x].count += 1;
                    agg[x].rows.push(row);
                } else {
                    agg[x] = { sum: y, count: 1, rows: [row] };
                }
            }

            const processedData: ProcessedDataRow[] = Object.keys(agg).map((key, index) => {
                const aggregatedGroup = agg[key];
                const firstRow = aggregatedGroup.rows[0];
                
                // Crear el objeto procesado manteniendo todos los atributos originales
                const { x_, y_, id, ...originalAttributes } = firstRow;
                
                const processedRow: ProcessedDataRow = {
                    ...originalAttributes, // Primero todos los atributos originales
                    id: index,
                    x_: key,
                    y_: aggregatedGroup.sum / aggregatedGroup.count,
                    originalData: firstRow,
                    allOriginalData: aggregatedGroup.rows,
                };
                
                return processedRow;
            });
            
            const groups: string[] = processedData
                .map((r) => r.x_)
                .sort((a, b) => a.localeCompare(b));

            const side_domain: [number, number] = [
                d3.min(processedData, (d) => d.y_) ?? 0,
                d3.max(processedData, (d) => d.y_) ?? 0,
            ];
            if (side_domain[0] > 0 && side_domain[1] > 0) side_domain[0] = 0;
            else if (side_domain[0] < 0 && side_domain[1] < 0) side_domain[1] = 0;

            const scaleConfig: ScaleConfig = createScaleConfig();

            function createScaleConfig(): ScaleConfig {
                /**
                 * Genera escalas band/linear según la orientación y datos.
                 * @returns Configuración completa de escalas, ejes y dimensiones.
                 */
                if (width === null || height === null){
                    throw new Error("Width and Height must be defined");
                }
                
                const X = isVertical 
                    ? plot.getXBandScale({values: groups, width, padding: 0.2})
                    : plot.getXLinearScale({domain: side_domain, width});
                    
                const Y = isVertical
                    ? plot.getYLinearScale({domain: side_domain, height})
                    : plot.getYBandScale({values: groups, height, padding: 0.2});
                
                return {
                    X,
                    Y,
                    baseScale: isVertical ? X : Y,
                    sideScale: isVertical ? Y : X,
                    baseAxis: isVertical ? 'x' : 'y',
                    sideAxis: isVertical ? 'y' : 'x',
                    baseLength: isVertical ? 'width' : 'height',
                    sideLength: isVertical ? 'height' : 'width'
                };
            }

            if (!noAxes) plot.plotAxes({
                svg: GG, 
                xScale: scaleConfig.X, 
                yScale: scaleConfig.Y, 
                xLabel: isVertical ? xValue : yValue, 
                yLabel: isVertical ? yValue : xValue
            });
            const color = d3.scaleOrdinal(d3.schemeCategory10)
                            .domain(allHues);

            const bars = GG.selectAll(".bar").data(processedData).enter().append("rect");
            bars.attr("id", function (d, i) {
                return "bar-" + randomString + "-" + d.id;
            })
            .attr("class", "bar")
            .attr(scaleConfig.baseAxis, function(d: ProcessedDataRow) {
                const bandScale = scaleConfig.baseScale as d3.ScaleBand<string>;
                return bandScale(d.x_) ?? 0;
            })
            .attr(scaleConfig.sideAxis, function(d: ProcessedDataRow){
                const linearScale = scaleConfig.sideScale as d3.ScaleLinear<number, number>;
                const sideValue = linearScale(d.y_);
                const zeroValue = linearScale(0);
                return Math.min(sideValue, zeroValue);
            })
            .attr(scaleConfig.baseLength, function(){
                const bandScale = scaleConfig.baseScale as d3.ScaleBand<string>;
                return bandScale.bandwidth();
            })
            .attr(scaleConfig.sideLength, function(d: ProcessedDataRow){
                const linearScale = scaleConfig.sideScale as d3.ScaleLinear<number, number>;
                const sideValue = linearScale(d.y_);
                const zeroValue = linearScale(0);
                return Math.abs(zeroValue - sideValue);
            })
            .attr("fill", function(d: ProcessedDataRow){
                const hueValue = String((d as any)[hue_value] ?? d.x_);
                return color(hueValue);
            })
            .on("click", mouseClick);

            // Configura herramientas y barra lateral si está habilitada.
            if (!noSideBar) {
                clickSelectButton = new ClickSelectButton(true);
                deselectAllButton = new DeselectAllButton(bars, callUpdateSelected);
                boxSelectButton = new BoxSelectButton({
                    xScale: scaleConfig.X as d3.ScaleLinear<number, number, never>,
                    yScale: scaleConfig.Y as d3.ScaleLinear<number, number, never>,
                    x_value: xValue,
                    y_value: yValue,
                    x_translate: 0,
                    y_translate: 0,
                    selectables: bars,
                    callUpdateSelected: callUpdateSelected,
                    base: GG,
                    selected: false
                });
                const sideBar = new SideBar(
                    plot.element,
                    clickSelectButton,
                    boxSelectButton,
                    deselectAllButton
                );
                sideBar.inicializar();
            }
        }
    }
}

/**
 * Modelo para BarPlot.
 * Define propiedades reactivas: datos, mapeos, orientación y valores seleccionados.
 */
export class BarPlotModel extends BaseModel {
  /**
   * Valores por defecto del modelo.
   */
  defaults() {
    return {
        ...super.defaults(),
        _model_name: BarPlotModel.model_name,
        _view_name: BarPlotModel.view_name,

        dataRecords: [],
        direction: String,
        x: String,
        y: String,
        hue: String,
        elementId: String,
        selectedValuesRecords: [],
    };
  }

  /**
   * Nombre de la clase de modelo y vista.
   */
  static readonly model_name = "BarPlotModel";
  static readonly view_name = "BarPlotView";
}

/**
 * Vista para BarPlot.
 * Construye parámetros, renderiza y sincroniza selección con el modelo.
 */
export class BarPlotView extends BaseView<BarPlot> {
    /**
     * Obtiene los parámetros desde el modelo y el layout calculado.
     * @returns Parámetros de renderizado para el gráfico de barras.
     */
    params(): BarPlotParams {

        return {
            data: this.model.get("dataRecords"),
            xValue: this.model.get("x"),
            yValue: this.model.get("y"),
            hue: this.model.get("hue"),
            setSelectedValues: this.setSelectedValues.bind(this),
            direction: this.model.get("direction"),
            width: this.width,
            height: this.height,
            noAxes: false,
            noSideBar: false,
        };
    }

    /**
     * Inicializa el widget, conecta listeners de cambios y renderiza.
     * @param element - Elemento contenedor del widget.
     */
    plot(element: HTMLElement) {
        this.widget = new BarPlot(element);

        this.model.on("change:dataRecords", () => this.replot(), this);
        this.model.on("change:x", () => this.replot(), this);
        this.model.on("change:y", () => this.replot(), this);
        this.model.on("change:hue", () => this.replot(), this);
        this.model.on("change:direction", () => this.replot(), this);
        window.addEventListener("resize", () => this.replot());

        this.widget.plot(this.params());
    }

    /**
     * Actualiza en el modelo los valores seleccionados y persiste cambios.
     * @param values - Filas seleccionadas del gráfico.
     */
    setSelectedValues(values: any[]) {
        this.model.set({ selectedValuesRecords: values });
        this.model.save_changes();
    }
}