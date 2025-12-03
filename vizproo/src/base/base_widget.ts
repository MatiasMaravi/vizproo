/**
 * Parámetros genéricos para widgets base.
 * Permite claves arbitrarias con cualquier tipo de valor.
 */
export interface BaseWidgetParams {
    [key: string]: any;
}

/**
 * Clase abstracta base para construir widgets visuales.
 * Provee manejo del elemento raíz y un mecanismo de "debounce" para replot.
 */
export abstract class BaseWidget {
    /**
     * Elemento HTML donde se renderiza el widget.
     */
    protected element: HTMLElement;
    /**
     * Identificador del timeout usado para hacer "debounce" en replot.
     * Es null cuando no hay un replot programado.
     */
    protected timeout: number | null = null;

    /**
     * Crea una instancia del widget base.
     * @param element - Elemento contenedor donde se dibuja el widget.
     */
    constructor(element: HTMLElement) {
        this.element = element;
    }

    /**
     * Renderiza el widget en el elemento asignado.
     * Debe ser implementado por las subclases.
     * @param params - Parámetros de configuración y datos del widget.
     */
    abstract plot(params: BaseWidgetParams): void;

    /**
     * Vuelve a renderizar el widget con "debounce".
     * @remarks
     * Implementa un retraso de 100 ms. Si se invoca múltiples veces rápidamente,
     * se cancela la ejecución anterior y solo se ejecuta la última. Esto evita
     * parpadeos y cálculos innecesarios en el DOM.
     * @param params - Parámetros de configuración y datos del widget.
     */
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