import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
import { BaseWidget, BaseWidgetParams } from "./base_widget";
import "../../css/widget.css";

import packageData from "../../package.json";

export const WIDGET_HEIGHT = 500;
/**
 * Márgenes por defecto del widget.
 */
export const WIDGET_MARGIN = { top: 20, right: 20, bottom: 30, left: 20 };
/**
 * Tiempo máximo de espera (ms) para el renderizado inicial.
 */
export const RENDER_TIMEOUT = 20000;
/**
 * Intervalo (ms) de reintento durante el renderizado inicial.
 */
export const RENDER_INTERVAL = 100;

/**
 * Modelo base para widgets Jupyter.
 * Configura los metadatos del módulo y versiones a partir de package.json.
 */
export abstract class BaseModel extends DOMWidgetModel {
  /**
   * Valores por defecto del modelo, incluyendo metadatos de módulo y versión.
   */
  defaults() {
    return {
      ...super.defaults(),
      _model_module: BaseModel.model_module,
      _view_module: BaseModel.view_module,
      _model_module_version: BaseModel.model_module_version,
      _view_module_version: BaseModel.view_module_version,
    };
  }

  /**
   * Nombre del paquete donde reside el modelo.
   */
  public static readonly model_module = packageData.name;
  /**
   * Versión del paquete para el modelo.
   */
  public static readonly model_module_version = packageData.version;
  /**
   * Nombre del paquete donde reside la vista.
   */
  public static readonly view_module = packageData.name;
  /**
   * Versión del paquete para la vista.
   */
  public static readonly view_module_version = packageData.version;
}

/**
 * Vista base para widgets Jupyter.
 * Maneja obtención del elemento, cálculo de tamaños y ciclo de renderizado.
 */
export abstract class BaseView<T extends BaseWidget = BaseWidget> extends DOMWidgetView {
  /**
   * Elemento raíz donde se renderiza el widget.
   */
  element: HTMLElement | null = null;
  /**
   * Ancho calculado del contenedor del widget.
   */
  width: number | null = null;
  /**
   * Alto calculado del contenedor del widget.
   */
  height: number | null = null;
  /**
   * ID opcional del elemento DOM donde se montará el widget.
   */
  elementId: string | null = null;
  /**
   * Instancia del widget que realiza el renderizado.
   */
  widget!: T;

  /**
   * Dibuja el widget dentro del elemento suministrado.
   * Debe ser implementado por subclases.
   * @param element - Elemento contenedor del widget.
   */
  abstract plot(element: HTMLElement): void;

  /**
   * Retorna los parámetros de renderizado del widget.
   * Debe ser implementado por subclases.
   */
  abstract params(): BaseWidgetParams;

  /**
   * Inicia el proceso de renderizado con reintentos hasta que
   * existan dimensiones válidas o se alcance el tiempo máximo.
   * @remarks
   * Reintenta cada RENDER_INTERVAL ms y aborta si supera RENDER_TIMEOUT.
   */
  render() {
    let elapsedTime = 0;

    let intr = setInterval(() => {
      try {
        this.element = this.getElement();
        if (!this.element) return;
        this.setSizes();
        if (this.element && this.width && this.height) {
          this.plot(this.element);
          clearInterval(intr);
        }
        elapsedTime += RENDER_INTERVAL;
        if (elapsedTime > RENDER_TIMEOUT) {
          throw new Error("Widget took too long to render");
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.stack);
        } else {
          console.log(err);
        }
        clearInterval(intr);
      }
    }, RENDER_INTERVAL);
  }

  /**
   * Recalcula tamaños y solicita al widget que vuelva a renderizar
   * usando su mecanismo de "debounce".
   */
  replot(): void {
    this.setSizes();
    this.widget.replot(this.params());
  }

  /**
   * Obtiene el elemento DOM donde se renderiza el widget.
   * Si existe `elementId` en el modelo, lo usa para buscar el elemento.
   * @returns El elemento DOM o null si no existe.
   */
  getElement(): HTMLElement | null {
    this.elementId = this.model.get("elementId");

    let element: HTMLElement | null = this.el;

    if (this.elementId) {
      element = document.getElementById(this.elementId);
    }
    return element;
  }

  /**
   * Calcula y establece las dimensiones actuales del contenedor del widget.
   * @remarks
   * Usa `clientWidth` y `clientHeight` del elemento; si no están disponibles,
   * las dimensiones se establecen en null para evitar renderizados inválidos.
   */
  setSizes(): void {
    const elementId: string = this.model.get("elementId");

    this.height = WIDGET_HEIGHT;
    let element: HTMLElement | null = this.el;
    if (elementId) {
      element = document.getElementById(elementId);
      if (element?.clientHeight) this.height = element.clientHeight;
      else this.height = null;
    }
    if (element?.clientWidth) this.width = element.clientWidth;
    else this.width = null;
  }
}
