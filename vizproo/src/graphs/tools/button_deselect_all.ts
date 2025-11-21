import { X } from "lucide";
import { BaseButton } from "./button_base";
import type { Selection } from "d3";

export class DeselectAllButton extends BaseButton {
    selectables: Selection<any, any, any, any>;
    callUpdateSelected: () => void;

    constructor(
        selectables: Selection<any, any, any, any>,
        callUpdateSelected: () => void
    ) {
        super();
        this.selectables = selectables;
        this.callUpdateSelected = callUpdateSelected;
    }

    on_click() {
        this.selectables.classed("selected", false);
        this.callUpdateSelected();
    }

    createButton() {
        return super.createButton(X);
    }

    select() {
        // Do nothing on select
    }

    unselect() {
        // Do nothing on unselect
    }
}