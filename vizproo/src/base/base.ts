import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
import { BaseWidget, BaseWidgetParams } from "./base_widget";
import "../../css/widget.css";

import packageData from "../../package.json";

export const WIDGET_HEIGHT = 500;
export const WIDGET_MARGIN = { top: 20, right: 20, bottom: 30, left: 20 };
export const RENDER_TIMEOUT = 20000;
export const RENDER_INTERVAL = 100;


export abstract class BaseModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_module: BaseModel.model_module,
      _view_module: BaseModel.view_module,
      _model_module_version: BaseModel.model_module_version,
      _view_module_version: BaseModel.view_module_version,
    };
  }

  public static readonly model_module = packageData.name;
  public static readonly model_module_version = packageData.version;
  public static readonly view_module = packageData.name;
  public static readonly view_module_version = packageData.version;
}

export abstract class BaseView<T extends BaseWidget = BaseWidget> extends DOMWidgetView {
  element: HTMLElement | null = null;
  width: number | null = null;
  height: number | null = null;
  elementId: string | null = null;
  widget!: T;
  abstract plot(element: HTMLElement): void;
  abstract params(): BaseWidgetParams;
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

  replot(): void {
    this.setSizes();
    this.widget.replot(this.params());
  }

  getElement(): HTMLElement | null {
    this.elementId = this.model.get("elementId");

    let element: HTMLElement | null = this.el;

    if (this.elementId) {
      element = document.getElementById(this.elementId);
    }
    return element;
  }

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
