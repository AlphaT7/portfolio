export default class svgShapes {
    constructor() {
        this.svgUrl = "merriweather.sans.italic.svg";
        this.svgObjects = [];
    }

    async fetchSVGObjects(svgUrl) {
        // Fetch the SVG file
        // Return the ViewBox properties
        // And the SVG "d" path data
        const response = await fetch(svgUrl);
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElem = svgDoc.querySelector("svg");
        const paths = svgDoc.querySelectorAll("path");
        const viewBoxStr = svgElem.getAttribute("viewBox");
        const [x, y, w, h] = viewBoxStr.split(/\s+|,/).map(Number);
        const svgObject = {
            viewBox: { x, y, w, h },
            paths: Array.from(paths).map(path => path.getAttribute("d"))
        };

        return svgObject;
    }

    async load() {
        this.svgObjects = await this.fetchSVGObjects(this.svgUrl);
        return this.svgObjects;
    }
}