import { createElement, IconNode } from "lucide";

export abstract class BaseButton {
    button: HTMLButtonElement;
    isSelected: boolean;
    clickNotify: (button: BaseButton) => void;
    whenUnselectedCallback: () => void;
    whenSelectedCallback: () => void;

    addWhenSelectedCallback(whenSelectedCallback: () => void) {
        this.whenSelectedCallback = whenSelectedCallback;
    }

    addWhenUnselectedCallback(whenUnselectedCallback: () => void) {
        this.whenUnselectedCallback = whenUnselectedCallback;
    }

    constructor(selected = false) {
        this.isSelected = selected;
    }

    addClickNotification(notification: (button: BaseButton) => void) {
        this.clickNotify = notification;
    }

    notified() {
        this.unselect();
    }

    select() {
        this.isSelected = true;
        this.button.classList.add("is_selected");
        if (this.whenSelectedCallback) this.whenSelectedCallback();
    }

    unselect() {
        this.isSelected = false;
        this.button.classList.remove("is_selected");
        if (this.whenUnselectedCallback) this.whenUnselectedCallback();
    }

    createButton(icon?: IconNode): HTMLButtonElement {
        this.button = document.createElement("button");
        if (this.isSelected) {
        this.button.classList.add("is_selected");
        if (this.whenSelectedCallback) this.whenSelectedCallback();
        }
        this.button.addEventListener("click", this.on_click.bind(this));
        if (icon) {
            const iconElement = createElement(icon);
            this.button.appendChild(iconElement);
        }
        return this.button;
    }

    on_click() {
        if (this.isSelected) return;

        this.clickNotify(this);
        this.select();
    }
}
