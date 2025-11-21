
import * as d3 from "https://esm.sh/d3@7";


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

        height = 400;
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

    function plot(data) {

    // Specify the chartâ€™s dimensions.
    //   const width = 928;
    //   const height = width;
    const padding = 28;
    const columns = Object.keys(data[0]).filter(d => typeof data[0][d] === "number");
    
    const size = (width - (columns.length + 1) * padding) / columns.length + padding;

    // Define the horizontal scales (one for each row).
    const x = columns.map(c => d3.scaleLinear()
        .domain(d3.extent(data, d => d[c]))
        .rangeRound([padding / 2, size - padding / 2]))

    // Define the companion vertical scales (one for each column).
    const y = x.map(x => x.copy().range([size - padding / 2, padding / 2]));

    // Define the color scale.
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.species))
        .range(d3.schemeCategory10);

    // Define the horizontal axis (it will be applied separately for each column).
    const axisx = d3.axisBottom()
        .ticks(6)
        .tickSize(size * columns.length);
    const xAxis = g => g.selectAll("g").data(x).join("g")
        .attr("transform", (d, i) => `translate(${i * size},0)`)
        .each(function (d) { return d3.select(this).call(axisx.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));

    // Define the vertical axis (it will be applied separately for each row).
    const axisy = d3.axisLeft()
        .ticks(6)
        .tickSize(-size * columns.length);
    const yAxis = g => g.selectAll("g").data(y).join("g")
        .attr("transform", (d, i) => `translate(0,${i * size})`)
        .each(function (d) { return d3.select(this).call(axisy.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-padding, 0, width, height]);

    svg.append("style")
        .text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    const cell = svg.append("g")
        .selectAll("g")
        .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
        .join("g")
        .attr("transform", ([i, j]) => `translate(${i * size},${j * size})`);

    cell.append("rect")
        .attr("fill", "none")
        .attr("stroke", "#aaa")
        .attr("x", padding / 2 + 0.5)
        .attr("y", padding / 2 + 0.5)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.each(function ([i, j]) {
        d3.select(this).selectAll("circle")
            .data(data.filter(d => !isNaN(d[columns[i]]) && !isNaN(d[columns[j]])))
            .join("circle")
            .attr("cx", d => x[i](d[columns[i]]))
            .attr("cy", d => y[j](d[columns[j]]));
    });

    const circle = cell.selectAll("circle")
        .attr("r", 3.5)
        .attr("fill-opacity", 0.7)
        .attr("fill", d => color(d.species));

    svg.append("g")
        .style("font", "bold 10px sans-serif")
        .style("pointer-events", "none")
        .selectAll("text")
        .data(columns)
        .join("text")
        .attr("transform", (d, i) => `translate(${i * size},${i * size})`)
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(d => d);

    // Inserta el SVG en el contenedor del widget
    d3.select(element).append(() => svg.node());
    return Object.assign(svg.node(), { scales: { color } });
}
}

export default { render };
        