async function drawLine() {

    const data = await d3.json("./my_weather_data.json")

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
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
      - dimensions.margin.top
      - dimensions.margin.bottom

 
    const wrapper = d3.select("#wrapper")
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const bounds = wrapper.append("g")
        .style("transform", `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);
    bounds.append("path")
            .attr("class", "line");
    bounds.append("g")
            .attr("class", "y-axis");

  const drawLineChart = metric => {
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = d => d[metric];
    function xAccesor(d) {
              return dateParser(d.date);
          }

    const exitTransition = d3.transition().duration(600)
    const updateTransition = exitTransition.transition().duration(600)

    const yScale = d3.scaleLinear()
          .domain(d3.extent(data,yAccessor))
          .range([dimensions.boundedHeight,0]);
    const xScale = d3.scaleTime()
            .domain(d3.extent(data, xAccesor))
            .range([dimensions.margin.right, dimensions.boundedWidth])



    const lineGenerator = d3.line()
              .x(d=>xScale(xAccesor(d)))
              .y(d=>yScale(yAccessor(d)))
    const line = bounds.select("path")
                .transition(updateTransition)
                .attr("d",lineGenerator(data))
                .attr("fill","none")
                .attr("stroke","#af9999")
                .attr("stroke-width", 2)

    const yAxisGenerator = d3.axisRight()
                .scale(yScale);

    const xAxisGenertor = d3.axisBottom()
                .scale(xScale);


    const yAxis = bounds.select(".y-axis")
                .transition(updateTransition)
                .style("transform",`translateX(${dimensions.margin.right}px)`)
                .call(yAxisGenerator)

    const xAxis = bounds.append("g").call(xAxisGenertor)
                .style("transform",`translateY(${dimensions.boundedHeight}px)`)

    }


    const metrics = [
        "windSpeed",
        "moonPhase",
        "dewPoint",
        "humidity",
        "uvIndex",
        "windBearing",
        "temperatureMin",
        "temperatureMax"
    ];
    let mIndex = 0;

   drawLineChart(metrics[mIndex])
   const button = d3.select("body")
        .append("button")
        .text("Change Metric");

    button.node().addEventListener("click", onClick)

   function onClick() {
        mIndex = (mIndex + 1) % metrics.length
        drawLineChart(metrics[mIndex])
        console.log(mIndex)
    }

}

drawLine()
