async function drawMap () {


	const stateShapes = await d3.json("china-provinces.json");

	let dimensions = {
		width: window.innerWidth *0.5,
		height: window.innerWidth * 0.5,
		margin: {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10
		}
	};

	dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
	dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

	const projection = d3.geoMercator()
							.center([120, 5])
							.scale(dimensions.boundedHeight/2)
							.translate([dimensions.width/2, dimensions.height/2]);

	const pathGenerator = d3.geoPath(projection);


	const wrapper = d3.select("#wrapper")
						.append("svg")
						.attr("width", dimensions.width)
						.attr("height", dimensions.height);

	const bounds = wrapper.append("g")
							.style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);





	const states = bounds.selectAll(".state")
							.data(stateShapes.features)
							.join("path")
							.attr("class", "state")
							.attr("d", pathGenerator)




};

drawMap();
