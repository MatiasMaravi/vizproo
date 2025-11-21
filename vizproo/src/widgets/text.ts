import { TextBase, TextBaseModel, TextBaseView} from "./base_text";
import { BaseTextParams } from "./interface";

export class Text extends TextBase{
  text: HTMLDivElement;
  onTextChanged(value: string) {
      if (this.text) {
      this.text.innerHTML = value;
      }
  }

  plot(params: BaseTextParams) {
    this.text = document.createElement("div");
    this.text.style.marginLeft = "4px";
    this.element.style.display = "flex";
    super.plot(params);
  }
}

export class TextModel extends TextBaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: TextModel.model_name,
      _view_name: TextModel.view_name,
    };
  }

  public static readonly model_name = "TextModel";
  public static readonly view_name = "TextView";
}

export class TextView extends TextBaseView {
  setText(): void {
    const value = this.model.get("value");
    this.widget.onTextChanged(value);
  }

  plot(element: HTMLElement): void {
    this.widget = new Text(element);
    super.plot(element);
    this.widget.plot(this.params());
  }
}