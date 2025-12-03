import { TextBase, TextBaseModel, TextBaseView} from "./base_text";
import { BaseTextInputParams } from "./interface";

/**
 * Widget de área de texto (textarea) basado en TextBase.
 * Maneja valor, placeholder, descripción y estado disabled.
 */
export class TextArea extends TextBase{
  /**
   * Elemento textarea HTML administrado por el widget.
   */
  text: HTMLTextAreaElement;
  /**
   * Callback para propagar el valor al modelo.
   */
  private setValue!: (value: string) => void;

  /**
   * Actualiza el valor visual del textarea.
   * @param value - Nuevo valor del campo.
   */
  onTextChanged(value: string) {
      this.text.value = value;
  }

  /**
   * Maneja el cambio del textarea y envía el valor al modelo.
   */
  onValueChanged() {
    const value = this.text.value
    this.setValue(value)
  }

  /**
   * Renderiza el textarea y conecta eventos.
   * @param params - Parámetros del campo (valor, placeholder, etc.).
   */
  plot(params: BaseTextInputParams) {
    this.text = document.createElement("textarea");
    this.setValue = params.setValue;
    this.text.addEventListener("change", this.onValueChanged.bind(this));
    super.plot(params);
  }
}

/**
 * Modelo del widget TextArea.
 * Hereda traits base y define nombres de modelo/vista.
 */
export class TextAreaModel extends TextBaseModel {
  /**
   * Valores por defecto del modelo.
   */
  defaults() {
    return {
      ...super.defaults(),
      _model_name: TextAreaModel.model_name,
      _view_name: TextAreaModel.view_name,
    };
  }

  /**
   * Nombre de la clase de modelo y vista.
   */
  public static readonly model_name = "TextAreaModel";
  public static readonly view_name = "TextAreaView";
}

/**
 * Vista del widget TextArea.
 * Sincroniza el modelo con el elemento textarea y gestiona eventos.
 */
export class TextAreaView extends TextBaseView {
  /**
   * Actualiza el valor del textarea en el widget.
   */
  setText(): void {
    const value = this.model.get("value");
    this.widget.onTextChanged(value);
  }

  /**
   * Propaga el nuevo valor al modelo y persiste cambios.
   * @param value - Valor actualizado del textarea.
   */
  setValue(value: string): void {
    this.model.set({ value: value });
    this.model.save_changes();
  }

  /**
   * Construye los parámetros del textarea desde el modelo.
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
    this.widget = new TextArea(element);
    super.plot(element);
    this.widget.plot(this.params());
  }
}