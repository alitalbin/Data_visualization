console.log("Hello world!");

async function drawLineChart() {
console.log("drawLineChart");
const data = await d3.json("my_weather_data.json");

console.log(data);
const yAccessorMax = d => d.temperatureMax;
const yAccessorMin= d => d.temperatureMin;
const dateParser = d3.timeParse("%Y-%m-%d");
function xAccesor(d) {
      return dateParser(d.date);
  }
//const myArr = JSON.parse(yAccessorMax)
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

const wrapper = d3.select("#wrapper");
const svg = wrapper.append("svg");
svg.attr("width",dimensions.width);
svg.attr("height", dimensions.height);
//console.log(dimensions);
const bounds = svg.append("g").style("transform",`translate(${dimensions.margin.left},${dimensions.margin.top})`);
const yScale = d3.scaleLinear()
  .domain(d3.extent(data,yAccessorMax))
  .range([dimensions.boundedHeight,0]);
//change limitTemperature to 100
const limitTemperatureVal = yScale(100);

const limitTemperature = bounds.append("rect")
  .attr("x",0)
  .attr("width", dimensions.boundedWidth)
  .attr("y",limitTemperatureVal)
  .attr("height", dimensions.boundedHeight - limitTemperatureVal)
  .attr("fill","#eeeeee");

const xScale = d3.scaleTime()
  .domain(d3.extent(data, xAccesor))
  .range([10, dimensions.boundedWidth])

const lineGeneratorMax = d3.line()
  .x(d=>xScale(xAccesor(d)))
  .y(d=>yScale(yAccessorMax(d)))
const lineGeneratorMin = d3.line()
    .x(d=>xScale(xAccesor(d)))
    .y(d=>yScale(yAccessorMin(d)))

const lineMax = bounds.append("path")
  .attr("d",lineGeneratorMax(data))
  .attr("fill","none")
  .attr("stroke","red")
  .attr("stroke-width", 2)
const lineMin = bounds.append("path")
    .attr("d",lineGeneratorMin(data))
    .attr("fill","none")
    .attr("stroke","blue")
    .attr("stroke-width", 2)
//change axisLeft to axisRight
const yAxisGenerator = d3.axisRight()
  .scale(yScale);

const xAxisGenertor = d3.axisBottom()
  .scale(xScale);

const yAxis = bounds.append("g").call(yAxisGenerator);

const xAxis = bounds.append("g").call(xAxisGenertor)
  .style("transform",`translateY(${dimensions.boundedHeight}px)`)

const median = d => {
    let middle = Math.floor(d.length / 2);
      d = [...d].sort((a, b) => a - b);
    return d.length % 2 !== 0 ? d[middle] : (d[middle - 1] + d[middle]) / 2;
  };

const temperatureMin = data.map(x => x.temperatureMin)
const temperatureMax = data.map(x => x.temperatureMax)

console.log("Median temperatureMin:", median(temperatureMin));

console.log("Median temperatureMax:", median(temperatureMax));
const variance = d => {
    let i, v=0, avg=0;
    const len = d.length
    for (i = 0; i < len; i++) {
        avg = avg+d[i]
    }
    avg=avg/len
    for (i = 0; i < len; i++) {
        v = v+((d[i] - avg) ** 2) / len
    }
    return avg
}
console.log("Variance temperatureMin:", variance(temperatureMin));
console.log("Variance temperatureMax:", variance(temperatureMax));


}


drawLineChart();
