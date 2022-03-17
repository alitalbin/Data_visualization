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
    dimensions.boundedWidth = dimensions.width
      - dimensions.margin.left
      - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
      - dimensions.margin.top
      - dimensions.margin.bottom

    // 3. Draw canvas

    const wrapper = d3.select("#wrapper")
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const bounds = wrapper.append("g")
        .style("translate", `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    const dateParser = d3.timeParse("%Y-%m-%d");
    const drawLineChart = metric => {
        //Accessor
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
            .range([5, dimensions.boundedWidth])



    const lineGenerator = d3.line()
              .x(d=>xScale(xAccesor(d)))
              .y(d=>yScale(yAccessor(d)))
    const line = bounds.append("path")
                .attr("d",lineGenerator(data))
                .attr("fill","none")
                .attr("stroke","#af9999")
                .attr("stroke-width", 2)

    const yAxisGenerator = d3.axisLeft()
                .scale(yScale);

    const xAxisGenertor = d3.axisBottom()
                .scale(xScale);

    const yAxis = bounds.append("g").call(yAxisGenerator);

    const xAxis = bounds.append("g").call(xAxisGenertor)
                .style("transform",`translateY(${dimensions.boundedHeight}px)`)

      /*  const bins = binsGen(dataset);
        console.log(bins);

        const yScaler = d3.scaleLinear()
            .domain([0, d3.max(bins, yAccessor)])
            .range([dimensions.boundedHeight, 0])

        let binGroups = bounds.select(".bins").selectAll(".bin").data(bins)

        const oldBinGroups = binGroups.exit()
        oldBinGroups.selectAll("rect")
            .style("fill", "orangered")
            .transition(exitTransition)
            .attr("y", dimensions.boundedHeight)
            .attr('height', 0)
        oldBinGroups.selectAll("text")
            .transition(exitTransition)
            .attr("y", dimensions.boundedHeight)

        oldBinGroups.transition(exitTransition).remove()

        const newBinGroups = binGroups.enter().append("g")
            .attr("class", "bin")

        newBinGroups.append("rect")
        newBinGroups.append("text")

        binGroups = newBinGroups.merge(binGroups)

        const barPadding = 1

        const barRect = binGroups.select("rect")
            .transition(updateTransition)
            .attr("x", d => xScaler(d.x0) + barPadding / 2)
            .attr("y", d => yScaler(yAccessor(d)))
            .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - barPadding]))
            .attr("height", d => dimensions.boundedHeight - yScaler(yAccessor(d)))
            .transition()
            .style("fill","cornflowerblue")


        const barText = binGroups.select("text")
            .transition(updateTransition)
            .attr("x", d => xScaler(d.x0) + (xScaler(d.x1) - xScaler(d.x0)) / 2)
            .attr("y", d => yScaler(yAccessor(d)) - 5)
            .text(d => yAccessor(d) || "")



        const mean = d3.mean(dataset, metricAccessor);
        console.log(mean);
        const meanLine = bounds.selectAll(".mean")
            .transition(updateTransition)
            .attr("x1", xScaler(mean))
            .attr("x2", xScaler(mean))
            .attr("y1", -15)
            .attr("y2", dimensions.boundedHeight)

        const xAxisGen = d3.axisBottom()
            .scale(xScaler);
        const xAxis = bounds.select("x-axis")
            .transition(updateTransition)
            .call(xAxisGen)
            .style("transform", `translateY(${dimensions.boundedHeight}px)`);

*/
    }


    const metrics = [

        "temperatureMin",
        "temperatureMax"
    ]
    let mIndex = 0

   drawLineChart(metrics[mIndex])
    const button = d3.select("body")
        .append("button")
        .text("Change Metric")

    button.node().addEventListener("click", onClick)

    function onClick() {
        mIndex = (mIndex + 1) % metrics.length
        drawLineChart(metrics[mIndex])
        console.log(mIndex)
    }

}

drawLine()
