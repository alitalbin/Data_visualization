async function scatterPlot() {
  console.log("scatterPlot")
  const data = await d3.json("my_weather_data.json");
  console.log(data)
  const xAcc = d => d.humidity;
  const yAcc = d => d.dewPoint;
  const rAcc = d => d.temperatureMin
  let dimensions = {
    width: window.innerWidth*0.5,
    height: 300,
    margin: {
      top: 30,
      left: 30,
      bottom: 30,
      right: 30
    }
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  let wrapper = d3.select("#wrapper").append("svg");
  wrapper.attr("width", dimensions.width);
  wrapper.attr("height", dimensions.height);
  let container = wrapper.append("g");
  container.attr("transform",`translate(${dimensions.margin.left},${dimensions.margin.top})`);
  let xScale = d3.scaleLinear()
    .domain(d3.extent(data,xAcc))
    .range([dimensions.margin.left, dimensions.boundedWidth]);

  let yScale = d3.scaleLinear()
    .domain(d3.extent(data,yAcc))
    .range([dimensions.boundedHeight,0]);

  let rScale = d3.scaleLinear()
    .domain(d3.extent(data,rAcc))
    .range([0.5,3])

  let xAxisGen = d3.axisBottom().scale(xScale);
  let yAxisGen = d3.axisLeft().scale(yScale);
  const axisX = container.append("g").call(xAxisGen).style("transform",`translateY(${dimensions.boundedHeight}px)`)
  const axisY = container.append("g").call(yAxisGen).style("transform",`translateX(${dimensions.margin.right}px)`)

  const tooltip = d3.select("#tooltip")
  function onMouseEnter(e, datum) {
  tooltip.text('temperatureMin:'+rAcc(datum) +  "</br>"+ ' humidity:' + xAcc(datum) +  "</br>"+' dewPoint:'+ yAcc(datum))
  const x = xScale(xAcc(datum)) + dimensions.margin.left
  const y = yScale(yAcc(datum)) + dimensions.margin.top

  tooltip.style("transform", `translate(`
           + `calc( -50% + ${x}px),`
           + `calc(-100% + ${y}px)`
           + `)`)

  tooltip.style("opacity", 1)
       }

  function onMouseLeave() {
         tooltip.style("opacity", 0)
       }
  let viz = container.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
         .attr("cx", d=>xScale(xAcc(d)))
         .attr("cy", d=>yScale(yAcc(d)))
         .attr("r",d=>rScale(rAcc(d)))
         .attr("fill","blue")
         .on("mouseenter", onMouseEnter)
         .on("mouseleave", onMouseLeave)


}

scatterPlot()
