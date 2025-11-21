import { BaseWidget } from "../base/base_widget";
import { CheckboxParams } from "./interface";
import {BaseModel, BaseView} from '../base/base';

export class Checkbox extends BaseWidget {
    private checkbox: HTMLInputElement;
    private label: HTMLLabelElement | null = null;

    onDescriptionChanged(description: string) {
        if (!this.label) {
            this.label = document.createElement("label");
            this.label.htmlFor = this.checkbox.id;
        }
        this.label.textContent = description;
    }

    plot(params: CheckboxParams) {
        const { description, setChecked } = params;

        this.checkbox = document.createElement("input");
        this.checkbox.type = "checkbox";
        this.checkbox.id = `checkbox-${crypto.randomUUID()}`; // Unique ID for the checkbox

        this.checkbox.addEventListener("change", (e) => {
            setChecked({ checked: (e.target as HTMLInputElement).checked });
        });

        this.onDescriptionChanged(description);

        // Limpa o container e adiciona o checkbox e o label
        this.element.innerHTML = "";
        this.element.appendChild(this.checkbox);
        if (this.label) {
            this.element.appendChild(this.label);
        }
    }
}

export class CheckboxModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: CheckboxModel.model_name,
      _view_name: CheckboxModel.view_name,

      description: String,
      checked: false,
      elementId: String,
    };
  }

  public static readonly model_name = "CheckboxModel";
  public static readonly view_name = "CheckboxView";
}


export class CheckboxView extends BaseView<Checkbox> {
  setDescription(): void {
    const description = this.model.get("description");
    this.widget.onDescriptionChanged(description);
  }

  setChecked(change: { checked: boolean }): void {
    const checked = change.checked;
    this.model.set({ checked: checked });
    this.model.save_changes();
  }

  params(): CheckboxParams {
    return { 
            description: this.model.get("description"), 
            setChecked: this.setChecked.bind(this) 
          };
  }

  plot(element: HTMLElement): void {
    this.widget = new Checkbox(element);

    this.model.on("change:description", () => this.setDescription(), this);

    this.widget.plot(this.params());
  }
}