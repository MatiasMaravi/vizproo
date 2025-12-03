import { BaseTextInputParams } from "./interface";
import { TextBase, TextBaseModel, TextBaseView } from "./base_text";

/**
 * Widget de campo de texto (input) basado en TextBase.
 * Maneja valor, placeholder, descripción y estado disabled.
 */
export class Input extends TextBase{
    /**
     * Elemento input HTML administrado por el widget.
     */
    text: HTMLInputElement;
    /**
     * Callback para propagar el valor al modelo.
     */
    private setValue!: (value: string) => void;
    
    /**
     * Actualiza el valor visual del input.
     * @param value - Nuevo valor del campo.
     */
    onTextChanged(value: string) {
        if (this.text) {
            this.text.value = value;
        }
    }

    /**
     * Maneja el cambio del input y envía el valor al modelo.
     */
    onValueChanged() {
        const value = this.text.value
        this.setValue(value)
    }

    /**
     * Renderiza el input y conecta eventos.
     * @param params - Parámetros del campo (valor, placeholder, etc.).
     */
    plot(params: BaseTextInputParams) {
        const { value, placeholder, description, disabled, setValue } = params;
        this.text = document.createElement("input");
        this.setValue = setValue;
        this.text.addEventListener("change", this.onValueChanged.bind(this));
        super.plot({ value, placeholder, description, disabled });
    }
}

/**
 * Modelo del widget Input.
 * Hereda traits base y define nombres de modelo/vista.
 */
export class InputModel extends TextBaseModel {
  /**
   * Valores por defecto del modelo.
   */
  defaults() {
    return {
      ...super.defaults(),
      _model_name: InputModel.model_name,
      _view_name: InputModel.view_name,
    };
  }

  /**
   * Nombre de la clase de modelo y vista.
   */
  public static readonly model_name = "InputModel";
  public static readonly view_name = "InputView";
}

/**
 * Vista del widget Input.
 * Sincroniza el modelo con el elemento input y gestiona eventos.
 */
export class InputView extends TextBaseView {

  /**
   * Actualiza el valor del input en el widget.
   */
  setText(): void {
    const value = this.model.get("value");
    this.widget.onTextChanged(value);
  }

  /**
   * Propaga el nuevo valor al modelo y persiste cambios.
   * @param value - Valor actualizado del input.
   */
  setValue(value: string): void {
    this.model.set({ value: value });
    this.model.save_changes();
  }

  /**
   * Construye los parámetros del input desde el modelo.
   * @returns Parámetros base más el callback setValue.
   */
  params(): BaseTextInputParams {
    return {
      ...super.params(),
      setValue: this.setValue.bind(this)
    };
  }

  /**
   * Inicializa el widget, conecta listeners base y renderiza.
   * @param element - Elemento contenedor del widget.
   */
  plot(element: HTMLElement): void {
    this.widget = new Input(element);
    super.plot(element);
    this.widget.plot(this.params());
  }
}