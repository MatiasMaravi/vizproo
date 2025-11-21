import { MousePointer } from "lucide";
import { BaseButton } from "./button_base";
import type { Selection } from "d3";
export class ClickSelectButton<E extends SVGGraphicsElement = SVGGraphicsElement> extends BaseButton {
	createButton() {
    	return super.createButton(MousePointer);
    }

    selectionClickEffect(selection: Selection<E, unknown, null, undefined>) {
        if (this.isSelected) {
            const wasSelected = selection.classed("selected");
            selection.classed("selected", !wasSelected);
        }
    }
}
