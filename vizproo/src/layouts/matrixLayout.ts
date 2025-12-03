import { BaseModel, BaseView } from "../base/base";
import { BaseWidget } from "../base/base_widget";
import "../../css/layout.css";

/**
 * Parámetros del layout matricial.
 * Define matriz, áreas y estilos de grid CSS.
 */
export interface MatrixParams {
	matrix: number[][],
	grid_areas: string[],
	grid_template_areas: string,
	style: string,
	rows?: number,
	columns?: number
}

/**
 * Widget para renderizar un layout CSS Grid a partir de una matriz.
 * Crea contenedores por área y aplica estilos de grid.
 */
class MatrixLayout extends BaseWidget {

	/**
	 * Crea una instancia del layout.
	 * @param element - Elemento contenedor del widget.
	 */
	constructor(element: HTMLElement) {
		super(element);
	}

	/**
	 * Crea el contenedor principal configurado como CSS Grid.
	 * @param matrix - Matriz base para filas y columnas.
	 * @param style - Clase CSS aplicada al contenedor.
	 * @param grid_template_areas - Definición de áreas para grid-template-areas.
	 * @returns Elemento DOM configurado como grid.
	 */
	create_node(matrix: number[][],
		style: string,
		grid_template_areas: string): HTMLElement {
		const node = document.createElement("div");

		node.classList.add(style);
		node.style.display = "grid";
		node.style.gridTemplateAreas = grid_template_areas;
		node.style.gridTemplateRows = `repeat(${matrix.length}, 180px)`;
		node.style.gridTemplateColumns = `repeat(${matrix[0].length}, 1fr)`;
		node.style.width = "100%";

		return node;
	}

	/**
	 * Renderiza el layout: crea el grid y añade las áreas definidas.
	 * @param params - Parámetros del layout y configuración de CSS Grid.
	 */
	plot(params: MatrixParams): void {
		const { matrix, grid_areas, grid_template_areas } = params;
		let { style } = params;
		if (!style) {
			style = "basic";
		}
		const node = this.create_node(matrix, style, grid_template_areas);

		for (const area of grid_areas) {
			const grid_area = document.createElement("div");
			grid_area.setAttribute("id", area);
			grid_area.style.gridArea = area;
			grid_area.classList.add("dashboard-div");
			console.log(`=== Div creado con id: ${area} ===`);
			node.appendChild(grid_area);
		}
		this.element.appendChild(node);
		console.log("=== DOM completamente construido ===");
	}
}

/**
 * Modelo para MatrixLayout.
 * Define nombres de modelo/vista y propiedades reactivas.
 */
export class MatrixLayoutModel extends BaseModel {
	/**
	 * Valores por defecto del modelo, incluyendo matriz, áreas, template y estilo.
	 */
	defaults() {
		return {
			...super.defaults(),
			_model_name: MatrixLayoutModel.model_name,
			_view_name: MatrixLayoutModel.view_name,

			matrix: [],
			grid_areas: [],
			grid_template_areas: String,
			style: String,
		};
	}

	/**
	 * Nombre de la clase de modelo y vista.
	 */
	public static readonly model_name = "MatrixLayoutModel";
	public static readonly view_name = "MatrixLayoutView";
}

/**
 * Vista que integra MatrixLayout con Jupyter.
 * Orquesta el render usando requestAnimationFrame cuando está disponible.
 */
export class MatrixLayoutView extends BaseView<MatrixLayout> {
	/**
	 * Obtiene los parámetros de render desde el modelo.
	 */
	params() {
		return {
			matrix: this.model.get("matrix"),
			grid_areas: this.model.get("grid_areas"),
			grid_template_areas: this.model.get("grid_template_areas"),
			style: this.model.get("style")
		};
	}

	/**
	 * Inicializa el widget y ejecuta el render.
	 * @param element - Elemento contenedor del widget.
	 * @remarks
	 * Usa requestAnimationFrame para un render no bloqueante si está disponible.
	 */
	plot(element: HTMLElement): void {
		console.log("=== MatrixLayoutView.plot() called ===");
		this.widget = new MatrixLayout(element);
		const runPlot = () => this.widget.plot(this.params());
		if (typeof globalThis !== "undefined" && "requestAnimationFrame" in globalThis) {
			globalThis.requestAnimationFrame(runPlot);
		} else {
			runPlot();
		}
	}
}