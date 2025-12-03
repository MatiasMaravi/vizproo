import { ButtonParams } from "./interface";
import { BaseWidget } from "../base/base_widget";
import { BaseModel, BaseView } from "../base/base";

/**
 * Widget de botón básico.
 * Maneja descripción, estado disabled y evento de clic.
 */
export class Button extends BaseWidget {
    private button: HTMLButtonElement;

    /**
     * Actualiza el texto del botón.
     * @param description - Texto visible del botón.
     */
    onDescriptionChanged(description: string) {
        if (this.button) {
            this.button.innerHTML = description;
        }
    }

    /**
     * Habilita o deshabilita el botón.
     * @param disabled - Verdadero para deshabilitar; falso para habilitar.
     */
    onDisabledChanged(disabled: boolean) {
        if (this.button) {
            if (disabled) this.button.setAttribute("disabled", "");
            else this.button.removeAttribute("disabled");
        }
    }

    /**
     * Renderiza el botón y conecta el evento de clic.
     * @param params - Descripción, estado disabled y callback de clic.
     */
    plot(params : ButtonParams) {
        const { description, disabled, setClicked } = params;
        
        const container = document.createElement("div");
        container.classList.add("button_container");

        this.button = document.createElement("button");
        this.button.classList.add("vp_button");
        this.button.addEventListener("click", setClicked);

        this.onDescriptionChanged(description);
        this.onDisabledChanged(disabled);

        container.appendChild(this.button);
        this.element.appendChild(container);
    }
}

/**
 * Modelo del botón.
 * Define propiedades reactivas para descripción, estado y clic.
 */
export class ButtonModel extends BaseModel {
  /**
   * Valores por defecto del modelo.
   */
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ButtonModel.model_name,
      _view_name: ButtonModel.view_name,

      description: String,
      disabled: false,
      _clicked: Boolean,
      elementId: String,
    };
  }
  /**
   * Nombre de la clase de modelo y vista.
   */
  public static readonly model_name = "ButtonModel";
  public static readonly view_name = "ButtonView";
}

/**
 * Vista del botón.
 * Sincroniza el modelo con el widget y maneja eventos.
 */
export class ButtonView extends BaseView<Button> {
  /**
   * Actualiza la descripción en el widget.
   */
  setDescription(): void {
    const description = this.model.get("description");
    this.widget.onDescriptionChanged(description);
  }

  /**
   * Actualiza el estado disabled en el widget.
   */
  setDisabled(): void {
    const disabled = this.model.get("disabled");
    this.widget.onDisabledChanged(disabled);
  }

  /**
   * Alterna el estado de clic en el modelo y persiste cambios.
   */
  setClicked(): void {
    const clicked = this.model.get("_clicked");
    this.model.set({ _clicked: !clicked });
    this.model.save_changes();
  }

  /**
   * Construye los parámetros para renderizar el botón.
   * @returns Parámetros actuales de descripción, estado y callback de clic.
   */
  params(): ButtonParams {
    return {
            description: this.model.get("description"),
            disabled: this.model.get("disabled"),
            setClicked: this.setClicked.bind(this)  
           };
  }

  /**
   * Inicializa el widget y conecta listeners del modelo.
   * @param element - Elemento contenedor del widget.
   */
  plot(element: HTMLElement): void {
    this.widget = new Button(element);
    
    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);

    this.widget.plot(this.params());
  }
}