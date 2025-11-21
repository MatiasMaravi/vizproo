import { BaseModel, BaseView } from "../base/base";
import { BaseWidget } from "../base/base_widget";
import "../../css/layout.css";

export interface MatrixParams {
	matrix: number[][],
	grid_areas: string[],
	grid_template_areas: string,
	style: string,
	rows?: number,
	columns?: number
}


class MatrixLayout extends BaseWidget {

	constructor(element: HTMLElement) {
		super(element);
	}

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

export class MatrixLayoutModel extends BaseModel {
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

	public static readonly model_name = "MatrixLayoutModel";
	public static readonly view_name = "MatrixLayoutView";
}

export class MatrixLayoutView extends BaseView<MatrixLayout> {
	params() {
		return {
			matrix: this.model.get("matrix"),
			grid_areas: this.model.get("grid_areas"),
			grid_template_areas: this.model.get("grid_template_areas"),
			style: this.model.get("style")
		};
	}


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