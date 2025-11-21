import * as d3 from "d3";
import { BoxSelect } from "lucide";
import { BaseButton } from "./button_base";

interface BoxSelectParams<E extends SVGGraphicsElement = SVGGraphicsElement> {
	xScale: d3.ScaleLinear<number, number, never>;
	yScale: d3.ScaleLinear<number, number, never>;
	x_value: string;
	y_value: string;
	x_translate: number;
	y_translate: number;
	selectables: d3.Selection<E, any, SVGGElement, any>;
	callUpdateSelected: () => void;
	base: d3.Selection<SVGGElement, any, null, undefined>;
	selected?: boolean;
}

export class BoxSelectButton<E extends SVGGraphicsElement = SVGGraphicsElement> extends BaseButton {
	xScale: d3.ScaleLinear<number, number, never>;
	yScale: d3.ScaleLinear<number, number, never>;
	x_value: string;
	y_value: string;
	x_translate: number;
	y_translate: number;
	selectables: d3.Selection<E, any, SVGGElement, any>;
	callUpdateSelected: () => void;
	interationRect: d3.Selection<SVGGElement, any, null, undefined>;
	mode: boolean = true;
	brush: d3.BrushBehavior<unknown>;

	constructor(params: BoxSelectParams<E>) {
		super(params.selected ?? false);
		this.xScale = params.xScale;
		this.yScale = params.yScale;
		this.x_value = params.x_value;
		this.y_value = params.y_value;
		this.x_translate = params.x_translate;
		this.y_translate = params.y_translate;
		this.selectables = params.selectables;
		this.callUpdateSelected = params.callUpdateSelected;
		this.interationRect = params.base;

		// Compute brush extent from provided scales so the brush covers
		// the same coordinate system as the points (can be negative around center)
		const xRange = this.xScale.range() as [number, number];
		const yRange = this.yScale.range() as [number, number];
		const x0 = Math.min(xRange[0], xRange[1]);
		const x1 = Math.max(xRange[0], xRange[1]);
		const y0 = Math.min(yRange[0], yRange[1]);
		const y1 = Math.max(yRange[0], yRange[1]);

		this.brush = d3
			.brush()
			.extent([[x0, y0], [x1, y1]])
			.on("end", this.brushed.bind(this));
	}

	createButton() {
		return super.createButton(BoxSelect);
	}

	updateScales(
		xScale: d3.ScaleLinear<number, number, never>,
		yScale: d3.ScaleLinear<number, number, never>
	) {
		this.xScale = xScale;
		this.yScale = yScale;

		// When scales update, update the brush extent to match the new ranges
		const xRange = this.xScale.range() as [number, number];
		const yRange = this.yScale.range() as [number, number];
		const x0 = Math.min(xRange[0], xRange[1]);
		const x1 = Math.max(xRange[0], xRange[1]);
		const y0 = Math.min(yRange[0], yRange[1]);
		const y1 = Math.max(yRange[0], yRange[1]);

		this.brush.extent([[x0, y0], [x1, y1]]);

		// If the brush is already attached to the DOM, reapply it so the updated
		// extent takes effect immediately. Otherwise skip.
		const existing = this.interationRect.selectAll<SVGGElement, any>(".brush");
		if (!existing.empty()) {
			existing.call(this.brush as any);
		}
	}

	select() {
		super.select();
		this.mode = true;
		this.button.classList.add("mode_positive");
		this.button.classList.remove("mode_negative");

		this.interationRect
			.append("g")
			.attr("class", "brush")
			.call(this.brush);
	}

	unselect() {
		super.unselect();
		this.interationRect.select(".brush").remove();
	}

	on_click() {
		if (this.isSelected) this.changeMode();
		super.on_click();
	}

	changeMode() {
		this.mode = !this.mode;
		if (this.mode) {
			this.button.classList.add("mode_positive");
			this.button.classList.remove("mode_negative");
		} else {
			this.button.classList.add("mode_negative");
			this.button.classList.remove("mode_positive");
		}
	}

	brushed(event: d3.D3BrushEvent<unknown>) {
		if (!event.selection) return;

		const [[x0, y0], [x1, y1]] = event.selection as [[number, number], [number, number]];
		
		// Primero limpiar todas las selecciones anteriores
		this.selectables.classed("selected", false);

		this.selectables.classed("selected", (d: any, i, nodes) => {
			const node = nodes[i];
			let overlap = false;

			// Distintos tipos de elementos SVG
			if (node.tagName === "rect") {
				const bbox = node.getBBox();
				overlap = !(bbox.x > x1 || bbox.x + bbox.width < x0 || bbox.y > y1 || bbox.y + bbox.height < y0);
			} else if (node.tagName === "circle") {
				// No sumar x_translate/y_translate porque el brush ya está en el mismo sistema de coordenadas
				const cx = Number.parseFloat(node.getAttribute("cx") || "0");
				const cy = Number.parseFloat(node.getAttribute("cy") || "0");
				const r = Number.parseFloat(node.getAttribute("r") || "0");
				overlap = cx >= x0 - r && cx <= x1 + r && cy >= y0 - r && cy <= y1 + r;
			}

			// Simplemente devolver si hay overlap (nueva selección reemplaza la anterior)
			return overlap;
		});

		this.callUpdateSelected();
		this.interationRect.select(".brush").call(this.brush.move as any, null);
	}
}
