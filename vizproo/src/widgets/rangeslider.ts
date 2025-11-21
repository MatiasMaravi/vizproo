import { BaseWidget } from "../base/base_widget";
import { BaseModel, BaseView, WIDGET_MARGIN } from "../base/base";
import { RangeSliderParams, MarginParams } from "./interface";
import * as d3 from "d3";

export class RangeSlider extends BaseWidget {
    private rangeValue!: HTMLSpanElement;
    private fromSlider!: HTMLInputElement;
    private toSlider!: HTMLInputElement;
    private setValues!: (from: number, to: number) => void;

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

    private createSlidersControl(container: HTMLDivElement): HTMLDivElement {
        const rangeInsideContainer = container.querySelector('.range_inside_container') as HTMLDivElement;
        
        const slidersControl = document.createElement("div");
        slidersControl.classList.add("sliders_control");
        rangeInsideContainer.appendChild(slidersControl);
        
        return slidersControl;
    }

    private createSliders(container: HTMLDivElement, step: number, minValue: number, maxValue: number, fromValue?: number, toValue?: number): void {
        this.fromSlider = this.createSlider(container, step, minValue, maxValue, fromValue || minValue, "top_slider");
        this.toSlider = this.createSlider(container, step, minValue, maxValue, toValue || maxValue);
    }

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

    private setupEventListeners(): void {
        this.fromSlider.addEventListener("input", () => this.handleFromSliderInput());
        this.toSlider.addEventListener("input", () => this.handleToSliderInput());
        this.fromSlider.addEventListener("click", () => this.setActiveSlider(this.fromSlider, this.toSlider));
        this.toSlider.addEventListener("click", () => this.setActiveSlider(this.toSlider, this.fromSlider));
    }

    private handleFromSliderInput(): void {
        const from = Number.parseFloat(this.fromSlider.value);
        const to = Number.parseFloat(this.toSlider.value);
        
        if (from > to) {
            this.fromSlider.value = this.toSlider.value;
        }
        
        this.updateValues(Number.parseFloat(this.fromSlider.value), to);
    }

    private handleToSliderInput(): void {
        const from = Number.parseFloat(this.fromSlider.value);
        const to = Number.parseFloat(this.toSlider.value);
        
        if (to < from) {
            this.toSlider.value = this.fromSlider.value;
        }
        
        this.updateValues(from, Number.parseFloat(this.toSlider.value));
    }

    private setActiveSlider(activeSlider: HTMLInputElement, inactiveSlider: HTMLInputElement): void {
        activeSlider.classList.add("top_slider");
        inactiveSlider.classList.remove("top_slider");
    }

    private updateValues(from: number, to: number): void {
        this.rangeValue.textContent = `${from} - ${to}`;
        this.setValues(from, to);
    }
}

export class RangeSliderModel extends BaseModel {
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
  
  public static readonly model_name = "RangeSliderModel";
  public static readonly view_name = "RangeSliderView";
}

export class RangeSliderView extends BaseView {
  setFromTo(from: number, to: number): void {
    this.model.set({ fromValue: from, toValue: to });
    this.model.save_changes();
  }

  setMinMax(min: number, max: number): void {
    this.model.set({ minValue: min, maxValue: max });
    this.model.save_changes();
  }
  
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
