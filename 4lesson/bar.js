async function drawBar() {

  const dataset = await d3.json("./abstract.json")
  console.table(dataset)
  //Accessor
  const abstractAccessor = d => d.len;
  const yAccessor = d => d.length;

    const width = 600
    let dimensions = {
      width: width*1.5,
      height: width * 0.6,
      margin: {
        top: 30,
        right: 10,
        bottom: 50,
        left: 50,
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
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
      .style("transform",`translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    const xScaler = d3.scaleLinear()
      .domain(d3.extent(dataset,abstractAccessor))
      .range([0,dimensions.boundedWidth])
      .nice()

    const binsGen = d3.bin()
      .domain(xScaler.domain())
      .value(abstractAccessor
      )
      .thresholds(15);

    const bins = binsGen(dataset);
    console.log(bins);

    const yScaler = d3.scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight,0])

    const binGroup = bounds.append("g");
    const binGroups = binGroup.selectAll("g")
      .data(bins)
      .enter()
      .append("g");




    //Axis
    const yAxisGenerator = d3.axisRight()
        .scale(yScaler);

    const xAxisGenertor = d3.axisBottom()
        .scale(xScaler);

    const yAxis = bounds.append("g").call(yAxisGenerator);

    const xAxis = bounds.append("g").call(xAxisGenertor)
        .style("transform",`translateY(${dimensions.boundedHeight}px)`)

    const barPadding = 1
    const barRect = binGroups.append("rect")
          .attr("x", d => xScaler(d.x0) + barPadding/2)
          .attr("y", d => yScaler(yAccessor(d)))
          .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - barPadding]))
          .attr("height", d => dimensions.boundedHeight - yScaler(yAccessor(d)))
          .attr("fill", "#AAAAEE");

      const mean = d3.mean(dataset,abstractAccessor);
      console.log(mean);
      const meanLine = bounds.append("line")
          .attr("x1", xScaler(mean))
          .attr("x2", xScaler(mean))
          .attr("y1", -15)
          .attr("y2", dimensions.boundedHeight)
          .attr("stroke","black")
          .attr("stroke-dasharray","2px 4px");

      const meanLabel = bounds.append("text")
          .attr("x",xScaler(mean))
          .attr("y",10)
          .text("Mean")
          .attr("fill","maroon")
          .attr("font-size","12px")
          .attr("text-anchor","middle");



      const barText = binGroups.filter(yAccessor)
          .append("text")
          .attr("x", d => xScaler(d.x0) + (xScaler(d.x1)-xScaler(d.x0))/2)
          .attr("y", d => yScaler(yAccessor(d)) - 5)
          .text(yAccessor)
          .attr("fill","darkgrey")
          .attr("font-size","12px")
          .attr("text-anchor","middle");


}




drawBar()
