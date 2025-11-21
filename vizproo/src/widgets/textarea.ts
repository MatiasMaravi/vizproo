import { TextBase, TextBaseModel, TextBaseView} from "./base_text";
import { BaseTextInputParams } from "./interface";

export class TextArea extends TextBase{
  text: HTMLTextAreaElement;
  private setValue!: (value: string) => void;
  onTextChanged(value: string) {
      this.text.value = value;
  }

  onValueChanged() {
    const value = this.text.value
    this.setValue(value)
  }

  plot(params: BaseTextInputParams) {
    this.text = document.createElement("textarea");
    this.setValue = params.setValue;
    this.text.addEventListener("change", this.onValueChanged.bind(this));
    super.plot(params);
  }
}

export class TextAreaModel extends TextBaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: TextAreaModel.model_name,
      _view_name: TextAreaModel.view_name,
    };
  }

  public static readonly model_name = "TextAreaModel";
  public static readonly view_name = "TextAreaView";
}

export class TextAreaView extends TextBaseView {
  setText(): void {
    const value = this.model.get("value");
    this.widget.onTextChanged(value);
  }

  setValue(value: string): void {
    this.model.set({ value: value });
    this.model.save_changes();
  }

  params(): BaseTextInputParams {
    return {
      ...super.params(),
      setValue: this.setValue.bind(this)
    };    
  }
  plot(element: HTMLElement): void {
    this.widget = new TextArea(element);
    super.plot(element);
    this.widget.plot(this.params());
  }
}