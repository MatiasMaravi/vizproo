import { SelectColorParams } from "./interface";
import { BaseWidget } from "../base/base_widget";
import { BaseModel, BaseView } from "../base/base";
import { colorbrewer } from "../const/colors";

export class SelectColor extends BaseWidget {
    private container: HTMLDivElement;
    private paletteSelect: HTMLSelectElement;
    private numColorsSelect: HTMLSelectElement;
    private previewContainer: HTMLDivElement;

    onDescriptionChanged(description: string) {
        if (this.container) {
            const label = this.container.querySelector("label");
            if (label) label.textContent = description;
        }
    }

    onDisabledChanged(disabled: boolean) {
        if (this.paletteSelect) {
            if (disabled) this.paletteSelect.setAttribute("disabled", "");
            else this.paletteSelect.removeAttribute("disabled");
        }
        if (this.numColorsSelect) {
            if (disabled) this.numColorsSelect.setAttribute("disabled", "");
            else this.numColorsSelect.removeAttribute("disabled");
        }
    }

    onPaletteChanged(paletteName: string, numColors: number) {
        if (this.previewContainer && paletteName) {
            this.previewContainer.innerHTML = "";
            const palette = colorbrewer[paletteName as keyof typeof colorbrewer];
            const colors = palette?.[numColors as keyof typeof palette] as string[] | undefined;
            if (colors) {
                for (const color of colors) {
                    const colorBox = document.createElement("div");
                    colorBox.style.width = "30px";
                    colorBox.style.height = "30px";
                    colorBox.style.backgroundColor = color;
                    colorBox.style.display = "inline-block";
                    colorBox.style.margin = "2px";
                    colorBox.style.border = "1px solid #ccc";
                    colorBox.style.borderRadius = "3px";
                    this.previewContainer.appendChild(colorBox);
                }
            }
        }
    }

    plot(params: SelectColorParams) {
        const { description, selectedPalette, selectedNumColors, disabled, setPaletteChanged } = params;

        this.container = document.createElement("div");
        this.container.style.padding = "10px";
        this.container.style.fontFamily = "Arial, sans-serif";

        const label = document.createElement("label");
        label.textContent = description;
        label.style.display = "block";
        label.style.marginBottom = "8px";
        label.style.fontWeight = "bold";
        this.container.appendChild(label);

        const selectContainer = document.createElement("div");
        selectContainer.style.marginBottom = "10px";
        selectContainer.style.display = "flex";
        selectContainer.style.gap = "10px";

        this.paletteSelect = document.createElement("select");
        this.paletteSelect.style.padding = "5px";
        this.paletteSelect.style.borderRadius = "4px";
        this.paletteSelect.style.border = "1px solid #ccc";
        this.paletteSelect.addEventListener("change", setPaletteChanged);

        for (const paletteName of Object.keys(colorbrewer)) {
            const option = document.createElement("option");
            option.value = paletteName;
            option.textContent = paletteName;
            if (paletteName === selectedPalette) {
                option.selected = true;
            }
            this.paletteSelect.appendChild(option);
        }

        this.numColorsSelect = document.createElement("select");
        this.numColorsSelect.style.padding = "5px";
        this.numColorsSelect.style.borderRadius = "4px";
        this.numColorsSelect.style.border = "1px solid #ccc";
        this.numColorsSelect.addEventListener("change", setPaletteChanged);

        for (let i = 3; i <= 12; i++) {
            const option = document.createElement("option");
            option.value = i.toString();
            option.textContent = `${i} colores`;
            if (i === selectedNumColors) {
                option.selected = true;
            }
            this.numColorsSelect.appendChild(option);
        }

        selectContainer.appendChild(this.paletteSelect);
        selectContainer.appendChild(this.numColorsSelect);
        this.container.appendChild(selectContainer);

        this.previewContainer = document.createElement("div");
        this.previewContainer.style.marginTop = "10px";
        this.previewContainer.style.padding = "10px";
        this.previewContainer.style.border = "1px solid #e0e0e0";
        this.previewContainer.style.borderRadius = "4px";
        this.previewContainer.style.backgroundColor = "#f9f9f9";
        this.container.appendChild(this.previewContainer);

        this.onDescriptionChanged(description);
        this.onDisabledChanged(disabled);
        this.onPaletteChanged(selectedPalette, selectedNumColors);

        this.element.appendChild(this.container);
    }
}

export class SelectColorModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SelectColorModel.model_name,
      _view_name: SelectColorModel.view_name,

      description: String,
      selectedPalette: String,
      selectedNumColors: Number,
      disabled: false,
      elementId: String,
    };
  }
  public static readonly model_name = "SelectColorModel";
  public static readonly view_name = "SelectColorView";
}

export class SelectColorView extends BaseView<SelectColor> {
  setDescription(): void {
    const description = this.model.get("description");
    this.widget.onDescriptionChanged(description);
  }
  
  setDisabled(): void {
    const disabled = this.model.get("disabled");
    this.widget.onDisabledChanged(disabled);
  }

  setPalette(): void {
    const palette = this.model.get("selectedPalette");
    const numColors = this.model.get("selectedNumColors");
    this.widget.onPaletteChanged(palette, numColors);
  }

  setPaletteChanged(): void {
    const palette = (this.widget as any).paletteSelect.value;
    const numColors = Number.parseInt((this.widget as any).numColorsSelect.value);
    
    this.model.set({ 
      selectedPalette: palette, 
      selectedNumColors: numColors,
      _paletteChanged: !this.model.get("_paletteChanged")
    });
    this.model.save_changes();
  }

  params(): SelectColorParams {
    return {
      description: this.model.get("description"),
      selectedPalette: this.model.get("selectedPalette"),
      selectedNumColors: this.model.get("selectedNumColors"),
      disabled: this.model.get("disabled"),
      setPaletteChanged: this.setPaletteChanged.bind(this)
    };
  }

  plot(element: HTMLElement): void {
    this.widget = new SelectColor(element);

    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);
    this.model.on("change:selectedPalette", () => this.setPalette(), this);
    this.model.on("change:selectedNumColors", () => this.setPalette(), this);

    this.widget.plot(this.params());
  }
}