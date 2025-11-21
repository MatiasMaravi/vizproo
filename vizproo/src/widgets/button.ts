import { ButtonParams } from "./interface";
import { BaseWidget } from "../base/base_widget";
import { BaseModel, BaseView } from "../base/base";
export class Button extends BaseWidget {
    private button: HTMLButtonElement;

    onDescriptionChanged(description: string) {
        if (this.button) {
            this.button.innerHTML = description;
        }
    }

    onDisabledChanged(disabled: boolean) {
        if (this.button) {
            if (disabled) this.button.setAttribute("disabled", "");
            else this.button.removeAttribute("disabled");
        }
    }

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

export class ButtonModel extends BaseModel {
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
  public static readonly model_name = "ButtonModel";
  public static readonly view_name = "ButtonView";
}

export class ButtonView extends BaseView<Button> {
  setDescription(): void {
    const description = this.model.get("description");
    this.widget.onDescriptionChanged(description);
  }
  setDisabled(): void {
    const disabled = this.model.get("disabled");
    this.widget.onDisabledChanged(disabled);
  }

  setClicked(): void {
    const clicked = this.model.get("_clicked");
    this.model.set({ _clicked: !clicked });
    this.model.save_changes();
  }

  params(): ButtonParams {
    return {
            description: this.model.get("description"),
            disabled: this.model.get("disabled"),
            setClicked: this.setClicked.bind(this)  
           };
  }

  plot(element: HTMLElement): void {
    this.widget = new Button(element);
    
    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);

    this.widget.plot(this.params());
  }
}