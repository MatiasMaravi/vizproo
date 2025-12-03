import { TextBase, TextBaseModel, TextBaseView} from "./base_text";
import { BaseTextParams } from "./interface";

/**
 * Widget de texto estático basado en TextBase.
 * Renderiza contenido HTML dentro de un contenedor div.
 */
export class Text extends TextBase{
  /**
   * Contenedor HTML donde se muestra el texto.
   */
  text: HTMLDivElement;

  /**
   * Actualiza el contenido del texto.
   * @param value - Nuevo contenido HTML o texto plano.
   */
  onTextChanged(value: string) {
      if (this.text) {
      this.text.innerHTML = value;
      }
  }

  /**
   * Renderiza el widget de texto y aplica estilos básicos.
   * @param params - Parámetros de texto: valor, placeholder, descripción y disabled.
   */
  plot(params: BaseTextParams) {
    this.text = document.createElement("div");
    this.text.style.marginLeft = "4px";
    this.element.style.display = "flex";
    super.plot(params);
  }
}

/**
 * Modelo del widget Text.
 * Hereda traits base y define nombres de modelo/vista.
 */
export class TextModel extends TextBaseModel {
  /**
   * Valores por defecto del modelo.
   */
  defaults() {
    return {
      ...super.defaults(),
      _model_name: TextModel.model_name,
      _view_name: TextModel.view_name,
    };
  }

  /**
   * Nombre de la clase de modelo y vista.
   */
  public static readonly model_name = "TextModel";
  public static readonly view_name = "TextView";
}

/**
 * Vista del widget Text.
 * Sincroniza el valor del modelo con el contenedor de texto y renderiza.
 */
export class TextView extends TextBaseView {
  /**
   * Aplica el valor actual del modelo al widget.
   */
  setText(): void {
    const value = this.model.get("value");
    this.widget.onTextChanged(value);
  }

  /**
   * Inicializa el widget, conecta listeners base y renderiza.
   * @param element - Elemento contenedor del widget.
   */
  plot(element: HTMLElement): void {
    this.widget = new Text(element);
    super.plot(element);
    this.widget.plot(this.params());
  }
}