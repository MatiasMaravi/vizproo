import { BaseWidget } from "../base/base_widget";
import { DropdownParams, DataRecord } from "./interface";
import {BaseModel, BaseView} from '../base/base';
export class Dropdown extends BaseWidget {
    private select: HTMLSelectElement;
    private dropdown: HTMLDivElement;
    private label: HTMLLabelElement;
    private setValue!: (value: string) => void;

    onDescriptionChanged(description: string) {
        if (this.label) {
            this.label.innerHTML = description + ": ";
        }
    }

    onDisabledChanged(disabled: boolean) {
        if (this.select) {
            this.select.disabled = disabled;
        }
    }

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

    onValueChanged() {
        const value = this.select.value;
        this.setValue(value);
    }

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

export class DropdownModel extends BaseModel {
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

  public static readonly model_name = "DropdownModel";
  public static readonly view_name = "DropdownView";
}

export class DropdownView extends BaseView {
  widget!: Dropdown;

  setDescription(): void {
    const description = this.model.get("description");
    this.widget.onDescriptionChanged(description);
  }

  setDisabled(): void {
    const disabled = this.model.get("disabled");
    this.widget.onDisabledChanged(disabled);
  }

  setOptions(): void {
    const data = this.model.get("dataRecords");
    const variable = this.model.get("variable");
    const options = this.model.get("options");

    this.widget.onOptionsChanged(data, variable, options);
  }

  setValue(value: string): void {
    this.model.set({ value: value });
    this.model.save_changes();
  }

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