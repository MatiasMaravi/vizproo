import { BaseWidget } from "../base/base_widget";
import { DropdownParams, DataRecord } from "./interface";
import {BaseModel, BaseView} from '../base/base';

/**
 * Widget de selección (dropdown).
 * Maneja opciones, valor seleccionado, descripción y estado disabled.
 */
export class Dropdown extends BaseWidget {
    private select: HTMLSelectElement;
    private dropdown: HTMLDivElement;
    private label: HTMLLabelElement;
    private setValue!: (value: string) => void;

    /**
     * Actualiza el texto de la etiqueta del dropdown.
     * @param description - Texto del label mostrado junto al control.
     */
    onDescriptionChanged(description: string) {
        if (this.label) {
            this.label.innerHTML = description + ": ";
        }
    }

    /**
     * Habilita o deshabilita el control de selección.
     * @param disabled - Verdadero para deshabilitar; falso para habilitar.
     */
    onDisabledChanged(disabled: boolean) {
        if (this.select) {
            this.select.disabled = disabled;
        }
    }

    /**
     * Actualiza las opciones del dropdown.
     * Si no hay opciones explícitas, se generan a partir de los datos y la variable.
     * @param data - Registros de datos para inferir opciones.
     * @param variable - Nombre de la columna usada para extraer opciones.
     * @param options - Lista explícita de opciones; si está vacía se infiere.
     */
    onOptionsChanged(data: DataRecord[], variable: string, options: string[]) {
        // If options is empty, populate it with unique values from data
        if(options.length === 0 && data.length > 0){
            options = [...new Set(data.map((d) => d[variable]))].sort((a, b) => {
                if (typeof a === "number" && typeof b === "number") {
                    return a - b;
                }
                return String(a).localeCompare(String(b));
            });
        }

        this.select.innerHTML = "";
        for (const option of options) {
            const optionElement = document.createElement("option");
            optionElement.setAttribute("value", option);
            optionElement.innerHTML = option;
            this.select.appendChild(optionElement);
        }
    }

    /**
     * Maneja el cambio de selección y propaga el valor al modelo.
     */
    onValueChanged() {
        const value = this.select.value;
        this.setValue(value);
    }

    /**
     * Renderiza el dropdown con su etiqueta y opciones.
     * @param params - Datos, variable, descripción, opciones, valor, estado y callback.
     */
    plot(params: DropdownParams) {
        const { data, variable, description, options, value, disabled, setValue } = params;
        const randomString = Math.floor(
            Math.random() * Date.now() * 10000
        ).toString(36);

        this.dropdown = document.createElement("div");
        this.label = document.createElement("label");
        this.label.setAttribute("for", randomString);
        this.onDescriptionChanged(description);

        this.select = document.createElement("select");
        this.select.setAttribute("id", randomString);
        this.setValue = setValue;
        this.select.addEventListener("change", this.onValueChanged.bind(this));
        this.onDisabledChanged(disabled);

        this.dropdown.appendChild(this.label);
        this.dropdown.appendChild(this.select);

        this.onOptionsChanged(data, variable, options);

        if (value) {
            this.select.value = value;
        }

        this.element.appendChild(this.dropdown);
    }
}

/**
 * Modelo del dropdown.
 * Define propiedades reactivas: dataRecords, variable, options, value y disabled.
 */
export class DropdownModel extends BaseModel {
  /**
   * Valores por defecto del modelo.
   */
  defaults() {
    return {
      ...super.defaults(),
      _model_name: DropdownModel.model_name,
      _view_name: DropdownModel.view_name,

      dataRecords: [],
      variable: String,
      description: String,
      options: [],
      value: String,
      disabled: false,
      elementId: String,
    };
  }

  /**
   * Nombre de la clase de modelo y vista.
   */
  public static readonly model_name = "DropdownModel";
  public static readonly view_name = "DropdownView";
}

/**
 * Vista del dropdown.
 * Sincroniza el modelo con el widget y maneja cambios de selección.
 */
export class DropdownView extends BaseView {
  widget!: Dropdown;

  /**
   * Actualiza la descripción del control.
   */
  setDescription(): void {
    const description = this.model.get("description");
    this.widget.onDescriptionChanged(description);
  }

  /**
   * Actualiza el estado disabled del control.
   */
  setDisabled(): void {
    const disabled = this.model.get("disabled");
    this.widget.onDisabledChanged(disabled);
  }

  /**
   * Recalcula las opciones del dropdown desde el modelo.
   */
  setOptions(): void {
    const data = this.model.get("dataRecords");
    const variable = this.model.get("variable");
    const options = this.model.get("options");

    this.widget.onOptionsChanged(data, variable, options);
  }

  /**
   * Actualiza el valor seleccionado en el modelo y persiste cambios.
   * @param value - Nuevo valor seleccionado.
   */
  setValue(value: string): void {
    this.model.set({ value: value });
    this.model.save_changes();
  }

  /**
   * Construye los parámetros para renderizar el dropdown.
   * @returns Parámetros actuales del modelo y callbacks.
   */
  params(): DropdownParams {
    return {
      data: this.model.get("dataRecords"),
      variable: this.model.get("variable"),
      description: this.model.get("description"),
      options: this.model.get("options"),
      value: this.model.get("value"),
      disabled: this.model.get("disabled"),
      setValue: this.setValue.bind(this)
    };
  }

  /**
   * Inicializa el widget, conecta listeners del modelo y renderiza.
   * @param element - Elemento contenedor del widget.
   */
  plot(element: HTMLElement): void {
    this.widget = new Dropdown(element);

    this.model.on("change:dataRecords", () => this.setOptions(), this);
    this.model.on("change:variable", () => this.setOptions(), this);
    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:options", () => this.setOptions(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);

    this.widget.plot(this.params());
  }
}