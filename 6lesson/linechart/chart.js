async function drawLineChart() {
const data = await d3.json("./my_weather_data.json");


const dateParser = d3.timeParse("%Y-%m-%d");
const yAccessor = d => d.humidity;
const xAccessor  = d => dateParser(d.date);

let dimensions = {
  width: window.innerWidth*0.9,
  height: 400,
  margin: {
    top: 15,
    right: 15,
    bottom:40,
    left:60,
  },
}
	dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
	dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;




const wrapper = d3.select("#wrapper").append("svg")
						.attr("width", dimensions.width)
            .attr("height", dimensions.height);
const bounds = wrapper.append("g").style("transform", `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);
bounds.append("g").attr("class", "x-axis").style("transform", `translateY(${dimensions.boundedHeight}px)`)
bounds.append("g").attr("class", "y-axis")
bounds.append("path").attr("class", "line");



const yScale = d3.scaleLinear().domain(d3.extent(data, yAccessor)).range([dimensions.boundedHeight, 0]);
const xScale = d3.scaleTime().domain(d3.extent(data, xAccessor))	.range([0, dimensions.boundedWidth]);



const lineGenerator = d3.line()
							.x(d => xScale(xAccessor(d)))
							.y(d => yScale(yAccessor(d)));


const line = bounds.select(".line")
						.datum(data)
						.attr("d", d => lineGenerator(d))
            .attr("fill", "none")
            .attr("stroke", "#af9999")
            .attr("stroke-width", 2)


const yAxisGenerator = d3.axisLeft()
							.scale(yScale);

const xAxisGenerator = d3.axisBottom()
							.scale(xScale);

const yAxis = bounds.select(".y-axis")
						.call(yAxisGenerator);

const xAxis = bounds.select(".x-axis")
						.call(xAxisGenerator)



const tooltip = d3.select("#tooltip");
const formatDate = d3.timeFormat("%Y-%m-%d");

function onMouseEnter(e, d){

		pointx =d3.pointer(e)[0];
		pointy =  xScale.invert(pointx);

		const distance = d => Math.abs(pointy - xAccessor(d));

		closestDateIndex = d3.scan(d, (a, b) => distance(a) - distance(b));
		closestPoint = d[closestDateIndex];



		tooltip.select("#date")
				.text(formatDate(xAccessor(closestPoint)));

		tooltip.select("#value")
				.text(yAccessor(closestPoint));


		const x = xScale(xAccessor(closestPoint)) + dimensions.margin.left;
		const y = yScale(yAccessor(closestPoint)) + dimensions.margin.top;

		tooltip.style("transform", `translate(`
					+ `calc(-5% + ${x}px),`
					+ `calc(-5% + ${y}px)`
					+ `)`);

		tooltip.style("opacity", 1);




	};

	function onMouseLeave(){
		tooltip.style("opacity", 0);

	};

  bounds.select(".line")
  			.on("mouseenter", onMouseEnter)
  			.on("mouseleave", onMouseLeave);

}

drawLineChart();
