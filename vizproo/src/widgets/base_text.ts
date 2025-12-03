import { BaseWidget } from "../base/base_widget";
import { BaseTextParams } from "./interface";
import {BaseModel, BaseView} from '../base/base';

/**
 * Widget base para controles de texto.
 * Maneja placeholder, descripción, estado disabled y actualizaciones de valor.
 */
export abstract class TextBase extends BaseWidget{
    /**
     * Referencia al elemento de texto (input/textarea) gestionado por el widget.
     */
    protected text: HTMLElement | null;
    
    /**
     * Callback invocado cuando cambia el valor del texto.
     * Debe ser implementado por subclases para actualizar el elemento visual.
     * @param value - Nuevo valor del texto.
     */
    abstract onTextChanged(value: string): void;    

    /**
     * Actualiza el placeholder del elemento de texto.
     * @param placeholder - Texto de ayuda mostrado cuando el campo está vacío.
     */
    onPlaceholderChanged(placeholder: string) {
        if (this.text) {
            this.text.setAttribute("placeholder", placeholder);
        }
    }

    /**
     * Actualiza la descripción (label) del control y reinyecta el elemento de texto.
     * @param description - Texto del label; si es vacío, no se muestra.
     */
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

    /**
     * Habilita o deshabilita el elemento de texto.
     * @param disabled - Verdadero para deshabilitar; falso para habilitar.
     */
    onDisabledChanged(disabled: boolean) {
        if (this.text) {
            if (disabled) this.text.setAttribute("disabled", "");
            else this.text.removeAttribute("disabled");
        }
    }
    
    /**
     * Renderiza el control de texto aplicando los parámetros base.
     * @param params - Valor, placeholder, descripción y estado disabled.
     */
    plot(params: BaseTextParams) {
        const { value, placeholder, description, disabled } = params;
        this.onTextChanged(value);
        this.onPlaceholderChanged(placeholder);
        this.onDescriptionChanged(description);
        this.onDisabledChanged(disabled);
    }
}

/**
 * Modelo base para controles de texto.
 * Define traits comunes: value, placeholder, description, disabled y elementId.
 */
export abstract class TextBaseModel extends BaseModel {
  /**
   * Valores por defecto del modelo de texto.
   */
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

/**
 * Vista base para controles de texto.
 * Gestiona listeners del modelo y replot en resize.
 */
export abstract class TextBaseView<T extends TextBase = TextBase> extends BaseView<T> {
  /**
   * Crea o configura el elemento de texto visual.
   * Debe ser implementado por subclases.
   */
  abstract setText(): void;

  /**
   * Actualiza el placeholder en el widget.
   */
  setPlaceholder(): void {
    const placeholder = this.model.get("placeholder");
    this.widget.onPlaceholderChanged(placeholder);
  }

  /**
   * Actualiza la descripción (label) en el widget.
   */
  setDescription(): void {
    const description = this.model.get("description");
    this.widget.onDescriptionChanged(description);
  }

  /**
   * Actualiza el estado disabled del widget.
   */
  setDisabled(): void {
    const disabled = this.model.get("disabled");
    this.widget.onDisabledChanged(disabled);
  }

  /**
   * Parámetros base compartidos por los widgets de texto.
   * @returns Los parámetros actuales del modelo.
   */
  params(): BaseTextParams {
    return {
      value: this.model.get("value"),
      placeholder: this.model.get("placeholder"),
      description: this.model.get("description"),
      disabled: this.model.get("disabled")
    };
  }

  /**
   * Conecta listeners del modelo y maneja replot en resize.
   * @param element - Ignorado; la vista usa el contenedor asociado al widget.
   * @remarks
   * Suscribe cambios en value, placeholder, description y disabled.
   */
  plot(element?: HTMLElement): void {
    this.model.on("change:value", () => this.setText(), this);
    this.model.on("change:placeholder", () => this.setPlaceholder(), this);
    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);
    window.addEventListener("resize", () => this.replot());
  }
}