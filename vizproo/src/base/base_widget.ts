
export interface BaseWidgetParams {
    [key: string]: any;
}

export abstract class BaseWidget {
    protected element: HTMLElement;
    protected timeout: number | null = null;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    abstract plot(params: BaseWidgetParams): void;

    replot(params: BaseWidgetParams): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.element.innerHTML = "";
            this.plot(params);
        }, 100);
    }
}