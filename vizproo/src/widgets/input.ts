
import { BaseTextInputParams } from "./interface";
import { TextBase, TextBaseModel, TextBaseView } from "./base_text";
export class Input extends TextBase{
    text: HTMLInputElement;
    private setValue!: (value: string) => void;
    
    onTextChanged(value: string) {
        if (this.text) {
            this.text.value = value;
        }
    }

    onValueChanged() {
        const value = this.text.value
        this.setValue(value)
    }

    plot(params: BaseTextInputParams) {
        const { value, placeholder, description, disabled, setValue } = params;
        this.text = document.createElement("input");
        this.setValue = setValue;
        this.text.addEventListener("change", this.onValueChanged.bind(this));
        super.plot({ value, placeholder, description, disabled });
    }
}

export class InputModel extends TextBaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: InputModel.model_name,
      _view_name: InputModel.view_name,
    };
  }

  public static readonly model_name = "InputModel";
  public static readonly view_name = "InputView";
}

export class InputView extends TextBaseView {

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
    this.widget = new Input(element);
    super.plot(element);
    this.widget.plot(this.params());
  }
}