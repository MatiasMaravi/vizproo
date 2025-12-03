import { BaseWidget } from "../base/base_widget";
import { BaseModel, BaseView, WIDGET_MARGIN } from "../base/base";
import { RangeSliderParams, MarginParams } from "./interface";
import * as d3 from "d3";

/**
 * Widget de rango doble (range slider) para seleccionar valores [from, to].
 * Calcula min/max a partir de datos si no se proveen y sincroniza con el modelo.
 */
export class RangeSlider extends BaseWidget {
    /**
     * Elemento visual que muestra el rango actual (from - to).
     */
    private rangeValue!: HTMLSpanElement;
    /**
     * Control deslizante para el valor inferior.
     */
    private fromSlider!: HTMLInputElement;
    /**
     * Control deslizante para el valor superior.
     */
    private toSlider!: HTMLInputElement;
    /**
     * Callback para propagar los valores seleccionados al modelo.
     */
    private setValues!: (from: number, to: number) => void;

    /**
     * Renderiza el componente, calcula min/max si es necesario y conecta eventos.
     * @param params - Datos, variable, step, descripción, valores iniciales y callbacks.
     */
    plot(params: RangeSliderParams): void {
        const { data, variable, step, description, fromValue, toValue, setValues, setMinMax, margin } = params;
        let { minValue, maxValue } = params;
        
        this.setValues = setValues;
        
        const { min, max } = this.calculateMinMax(data, variable, minValue, maxValue);
        minValue = min;
        maxValue = max;

        const rangeOutsideContainer = this.createContainer(description, margin);
        const slidersControl = this.createSlidersControl(rangeOutsideContainer);
        this.createSliders(slidersControl, step, minValue, maxValue, fromValue, toValue);
        
        const from = Number.parseFloat(this.fromSlider.value);
        const to = Number.parseFloat(this.toSlider.value);
        
        this.updateValues(from, to);
        setMinMax(min, max);
        
        this.setupEventListeners();
        this.element.appendChild(rangeOutsideContainer);
    }

    /**
     * Calcula los valores mínimo y máximo a partir de los datos si no se proveen.
     * @param data - Colección de datos fuente.
     * @param variable - Nombre de la variable a evaluar.
     * @param minValue - Valor mínimo opcional.
     * @param maxValue - Valor máximo opcional.
     * @returns Objeto con propiedades min y max calculadas.
     */
    private calculateMinMax(data: any[], variable: string, minValue?: number, maxValue?: number) {
        let min = minValue;
        let max = maxValue;
        
        if (!min && data.length > 0) {
            min = d3.min(data, (d) => d[variable]);
        }
        if (!max && data.length > 0) {
            max = d3.max(data, (d) => d[variable]);
        }
        
        return { min: min!, max: max! };
    }

    /**
     * Crea el contenedor externo e interno del slider y la etiqueta descriptiva.
     * @param description - Texto mostrado como descripción del control.
     * @param margin - Márgenes aplicados alrededor del componente.
     * @returns Contenedor principal del componente.
     */
    private createContainer(description: string, margin: MarginParams): HTMLDivElement {
        const rangeOutsideContainer = document.createElement("div");
        rangeOutsideContainer.classList.add("range_outside_container");
        rangeOutsideContainer.style.margin = `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`;

        const rangeDescription = document.createElement("span");
        rangeDescription.classList.add("range_description");
        rangeDescription.textContent = description;
        rangeOutsideContainer.appendChild(rangeDescription);

        const rangeInsideContainer = document.createElement("div");
        rangeInsideContainer.classList.add("range_inside_container");
        rangeOutsideContainer.appendChild(rangeInsideContainer);

        this.rangeValue = document.createElement("span");
        this.rangeValue.classList.add("range_value");
        rangeOutsideContainer.appendChild(this.rangeValue);

        return rangeOutsideContainer;
    }

    /**
     * Crea el contenedor específico para los sliders.
     * @param container - Contenedor principal del componente.
     * @returns Contenedor de sliders.
     */
    private createSlidersControl(container: HTMLDivElement): HTMLDivElement {
        const rangeInsideContainer = container.querySelector('.range_inside_container') as HTMLDivElement;
        
        const slidersControl = document.createElement("div");
        slidersControl.classList.add("sliders_control");
        rangeInsideContainer.appendChild(slidersControl);
        
        return slidersControl;
    }

    /**
     * Crea los dos controles deslizantes y asigna sus valores iniciales.
     * @param container - Contenedor de sliders.
     * @param step - Incremento entre valores.
     * @param minValue - Valor mínimo del rango.
     * @param maxValue - Valor máximo del rango.
     * @param fromValue - Valor inicial inferior (opcional).
     * @param toValue - Valor inicial superior (opcional).
     */
    private createSliders(container: HTMLDivElement, step: number, minValue: number, maxValue: number, fromValue?: number, toValue?: number): void {
        this.fromSlider = this.createSlider(container, step, minValue, maxValue, fromValue || minValue, "top_slider");
        this.toSlider = this.createSlider(container, step, minValue, maxValue, toValue || maxValue);
    }

    /**
     * Crea un input type="range" con los atributos configurados.
     * @param container - Contenedor donde se inserta el slider.
     * @param step - Incremento entre valores.
     * @param min - Mínimo del slider.
     * @param max - Máximo del slider.
     * @param value - Valor inicial del slider.
     * @param extraClass - Clase CSS adicional para estilo (opcional).
     * @returns El elemento input creado.
     */
    private createSlider(container: HTMLDivElement, step: number, min: number, max: number, value: number, extraClass?: string): HTMLInputElement {
        const slider = document.createElement("input");
        if (extraClass) {
            slider.classList.add(extraClass);
        }
        slider.setAttribute("step", step.toString());
        slider.setAttribute("type", "range");
        slider.setAttribute("min", min.toString());
        slider.setAttribute("max", max.toString());
        slider.value = value.toString();
        
        container.appendChild(slider);
        return slider;
    }

    /**
     * Conecta los listeners de input/click para mantener coherencia entre sliders.
     */
    private setupEventListeners(): void {
        this.fromSlider.addEventListener("input", () => this.handleFromSliderInput());
        this.toSlider.addEventListener("input", () => this.handleToSliderInput());
        this.fromSlider.addEventListener("click", () => this.setActiveSlider(this.fromSlider, this.toSlider));
        this.toSlider.addEventListener("click", () => this.setActiveSlider(this.toSlider, this.fromSlider));
    }

    /**
     * Maneja el input del slider inferior, asegurando que no supere al superior.
     */
    private handleFromSliderInput(): void {
        const from = Number.parseFloat(this.fromSlider.value);
        const to = Number.parseFloat(this.toSlider.value);
        
        if (from > to) {
            this.fromSlider.value = this.toSlider.value;
        }
        
        this.updateValues(Number.parseFloat(this.fromSlider.value), to);
    }

    /**
     * Maneja el input del slider superior, asegurando que no sea menor al inferior.
     */
    private handleToSliderInput(): void {
        const from = Number.parseFloat(this.fromSlider.value);
        const to = Number.parseFloat(this.toSlider.value);
        
        if (to < from) {
            this.toSlider.value = this.fromSlider.value;
        }
        
        this.updateValues(from, Number.parseFloat(this.toSlider.value));
    }

    /**
     * Marca un slider como activo con la clase 'top_slider' y desmarca el otro.
     * @param activeSlider - Slider que recibe la clase activa.
     * @param inactiveSlider - Slider que pierde la clase activa.
     */
    private setActiveSlider(activeSlider: HTMLInputElement, inactiveSlider: HTMLInputElement): void {
        activeSlider.classList.add("top_slider");
        inactiveSlider.classList.remove("top_slider");
    }

    /**
     * Actualiza el texto del rango y notifica los nuevos valores al modelo.
     * @param from - Valor inferior seleccionado.
     * @param to - Valor superior seleccionado.
     */
    private updateValues(from: number, to: number): void {
        this.rangeValue.textContent = `${from} - ${to}`;
        this.setValues(from, to);
    }
}

/**
 * Modelo para RangeSlider.
 * Define propiedades reactivas para datos, variable, límites y metadatos.
 */
export class RangeSliderModel extends BaseModel {
  /**
   * Valores por defecto del modelo, incluyendo datos, variable y límites.
   */
  defaults() {
    return {
      ...super.defaults(),
      _model_name: RangeSliderModel.model_name,
      _view_name: RangeSliderModel.view_name,

      dataRecords: [],
      variable: String,
      step: Number,
      description: String,
      minValue: Number,
      maxValue: Number,
      elementId: String,
    };
  }
  
  /**
   * Nombre de la clase de modelo y vista.
   */
  public static readonly model_name = "RangeSliderModel";
  public static readonly view_name = "RangeSliderView";
}

/**
 * Vista del RangeSlider.
 * Sincroniza valores (from/to y min/max) entre el widget y el modelo.
 */
export class RangeSliderView extends BaseView {
  /**
   * Actualiza en el modelo los valores seleccionados y guarda cambios.
   * @param from - Nuevo valor inferior.
   * @param to - Nuevo valor superior.
   */
  setFromTo(from: number, to: number): void {
    this.model.set({ fromValue: from, toValue: to });
    this.model.save_changes();
  }

  /**
   * Actualiza en el modelo los límites min/max y guarda cambios.
   * @param min - Nuevo mínimo.
   * @param max - Nuevo máximo.
   */
  setMinMax(min: number, max: number): void {
    this.model.set({ minValue: min, maxValue: max });
    this.model.save_changes();
  }
  
  /**
   * Construye los parámetros para renderizar el RangeSlider.
   * @returns Parámetros actuales del modelo y callbacks.
   */
  params(): RangeSliderParams {
    return {
      data: this.model.get("dataRecords"),
      variable: this.model.get("variable"),
      step: this.model.get("step"),
      description: this.model.get("description"),
      fromValue: this.model.get("fromValue"),
      toValue: this.model.get("toValue"),
      minValue: this.model.get("minValue"),
      maxValue: this.model.get("maxValue"),
      setValues: this.setFromTo.bind(this),
      setMinMax: this.setMinMax.bind(this),
      margin: WIDGET_MARGIN
    };
  }

  /**
   * Inicializa el widget, conecta listeners de cambios y renderiza.
   * @param element - Elemento contenedor del widget.
   */
  plot (element: HTMLElement): void {
    this.widget = new RangeSlider(element);
      
    this.model.on("change:dataRecords", () => this.replot(), this);
    this.model.on("change:variable", () => this.replot(), this);
    this.model.on("change:step", () => this.replot(), this);
    this.model.on("change:description", () => this.replot(), this);
    this.model.on("change:minValue", () => this.replot(), this);
    this.model.on("change:maxValue", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(this.params());
  }
}
