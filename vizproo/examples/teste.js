
import * as d3 from "https://esm.sh/d3@7";
import * as topojson from "https://esm.sh/topojson-client@3";

function render({ model, el } ) {
    let element;
    let width;
    let height;

    function getElement() {
        const elementId = model.get("elementId");

        let element = el;
        if (elementId) {
            element = document.getElementById(elementId);
        }
        
        return element;
    }

    function setSizes() {
        const elementId = model.get("elementId");

        height = 610;
        if (elementId) {
            element = document.getElementById(elementId);
            if (element.clientHeight) height = element.clientHeight;
            else height = null;
        }
        if (element.clientWidth) width = element.clientWidth;
        else width = null;
    }

    function replot() {
        element.innerHTML = "";

					const data = model.get("data");


        plot(data)
    }

    let elapsedTime = 0;

    let intr = setInterval(() => {
        try {
            elapsedTime += 100;
            if (elapsedTime > 20000) {
                throw "Widget took too long to render";
            }
            element = getElement();
            if (!element) return;
            setSizes();
            if (element && width && height) {
					model.on("change:data", replot);


					const data = model.get("data");

                    plot(data);
                    clearInterval(intr);
                }
        } catch (err) {
            console.log(err.stack);
            clearInterval(intr);
        }
    }, 100);

    function setSelectedValues(values) {
  model.set({ selectedValues: values });
  model.save_changes();
}

function plot(data) {
    const us = data;
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("class", "mapa-svg")  // Agrega clase en lugar de style
        .on("click", reset);

    const path = d3.geoPath();

    const g = svg.append("g");

    const states = g.append("g")
        .attr("class", "mapa-states")  // Agrega clase y elimina fill, cursor
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .join("path")
        .on("click", clicked)
        .attr("d", path);

    states.append("title")
        .text(d => d.properties.name);

    g.append("path")
        .attr("class", "mapa-mesh")  // Agrega clase y elimina fill, stroke, stroke-linejoin
        .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));

    svg.call(zoom);

    function reset() {
        states.transition().style("fill", null);
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
    }

    function clicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        states.transition().style("fill", null);
        d3.select(this).transition().style("fill", "red");
        // EnvÃ­a el JSON del estado seleccionado al modelo
        // (Incluye id y todas las propiedades del feature)
        setSelectedValues([{ id: d.id, ...d.properties }]);
        // Si prefieres enviar el feature completo (GeoJSON):
        // setSelectedValues([d]);
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.pointer(event, svg.node())
        );
    }

    function zoomed(event) {
        const { transform } = event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
    }
    d3.select(element).append(() => svg.node());

    return svg.node();
}
}

export default { render };
        