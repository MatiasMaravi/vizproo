import { BaseWidget } from "../base/base_widget";
import { CheckboxParams } from "./interface";
import {BaseModel, BaseView} from '../base/base';

/**
 * Widget de checkbox básico.
 * Maneja descripción, estado checked y sincronización con el modelo.
 */
export class Checkbox extends BaseWidget {
    private checkbox: HTMLInputElement;
    private label: HTMLLabelElement | null = null;

    /**
     * Actualiza el texto de la etiqueta asociada al checkbox.
     * Crea la etiqueta si aún no existe.
     * @param description - Texto visible de la etiqueta.
     */
    onDescriptionChanged(description: string) {
        if (!this.label) {
            this.label = document.createElement("label");
            this.label.htmlFor = this.checkbox.id;
        }
        this.label.textContent = description;
    }

    /**
     * Renderiza el checkbox y conecta el manejador de cambio.
     * @param params - Descripción y callback para actualizar el estado checked.
     */
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

/**
 * Modelo del checkbox.
 * Define propiedades reactivas para descripción y estado checked.
 */
export class CheckboxModel extends BaseModel {
  /**
   * Valores por defecto del modelo.
   */
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

  /**
   * Nombre de la clase de modelo y vista.
   */
  public static readonly model_name = "CheckboxModel";
  public static readonly view_name = "CheckboxView";
}

/**
 * Vista del checkbox.
 * Sincroniza cambios entre el modelo y el widget.
 */
export class CheckboxView extends BaseView<Checkbox> {
  /**
   * Actualiza la descripción del checkbox en el widget.
   */
  setDescription(): void {
    const description = this.model.get("description");
    this.widget.onDescriptionChanged(description);
  }

  /**
   * Actualiza el estado checked en el modelo y persiste cambios.
   * @param change - Objeto con la propiedad checked.
   */
  setChecked(change: { checked: boolean }): void {
    const checked = change.checked;
    this.model.set({ checked: checked });
    this.model.save_changes();
  }

  /**
   * Construye los parámetros para renderizar el checkbox.
   * @returns Parámetros actuales de descripción y callback de cambio.
   */
  params(): CheckboxParams {
    return { 
            description: this.model.get("description"), 
            setChecked: this.setChecked.bind(this) 
          };
  }

  /**
   * Inicializa el widget y conecta listeners del modelo.
   * @param element - Elemento contenedor del widget.
   */
  plot(element: HTMLElement): void {
    this.widget = new Checkbox(element);

    this.model.on("change:description", () => this.setDescription(), this);

    this.widget.plot(this.params());
  }
}