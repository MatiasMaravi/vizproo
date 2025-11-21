import { BaseWidget } from "../base/base_widget";
import { BaseTextParams } from "./interface";
import {BaseModel, BaseView} from '../base/base';

export abstract class TextBase extends BaseWidget{
    protected text: HTMLElement | null;
    
    abstract onTextChanged(value: string): void;    

    onPlaceholderChanged(placeholder: string) {
        if (this.text) {
            this.text.setAttribute("placeholder", placeholder);
        }
    }

    onDescriptionChanged(description: string) {
        this.element.innerHTML = "";
        if (description) {
            const label = document.createElement("label");
            label.setAttribute("title", description);
            label.innerHTML = description + ": ";
            label.style.verticalAlign = "top";
            this.element.appendChild(label);
        }
        if (this.text) {
            this.element.appendChild(this.text);
        }
    }

    onDisabledChanged(disabled: boolean) {
        if (this.text) {
            if (disabled) this.text.setAttribute("disabled", "");
            else this.text.removeAttribute("disabled");
        }
    }
    
    plot(params: BaseTextParams) {
        const { value, placeholder, description, disabled } = params;
        this.onTextChanged(value);
        this.onPlaceholderChanged(placeholder);
        this.onDescriptionChanged(description);
        this.onDisabledChanged(disabled);
    }
}

export abstract class TextBaseModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      value: String,
      placeholder: String,
      description: String,
      disabled: false,
      elementId: String,
    };
  }
}

export abstract class TextBaseView<T extends TextBase = TextBase> extends BaseView<T> {
  abstract setText(): void;

  setPlaceholder(): void {
    const placeholder = this.model.get("placeholder");
    this.widget.onPlaceholderChanged(placeholder);
  }

  setDescription(): void {
    const description = this.model.get("description");
    this.widget.onDescriptionChanged(description);
  }

  setDisabled(): void {
    const disabled = this.model.get("disabled");
    this.widget.onDisabledChanged(disabled);
  }

  // Método protegido que devuelve los parámetros base
  params(): BaseTextParams {
    return {
      value: this.model.get("value"),
      placeholder: this.model.get("placeholder"),
      description: this.model.get("description"),
      disabled: this.model.get("disabled")
    };
  }

  plot(element?: HTMLElement): void {
    this.model.on("change:value", () => this.setText(), this);
    this.model.on("change:placeholder", () => this.setPlaceholder(), this);
    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);
    window.addEventListener("resize", () => this.replot());
  }
}