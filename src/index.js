require('./styles/main.scss')
import * as d3 from "d3"
import colorMap from "./colorMap"

let width = window.innerWidth;
let height = window.innerHeight/4;
const margin = 0.1*window.innerWidth;

const outerSvg = d3.select('body')
  .append('svg')
  .attr("xmlns","http://www.w3.org/2000/svg")
  .attr("width",width)
  .attr("height",height)
  .attr("viewBox",`0 0 ${width} ${height}`)
  
const svg = outerSvg.attr('id','viz')
  .append("g")
  .style("transform", `translate(${margin}px,${margin}px)`)

d3.json('data.json',function(resp){
	
  const releaseYears = []
  const inductedYears = []
  resp.map(function(d){
    releaseYears.push(parseInt(d.release))
    inductedYears.push(parseInt(d.inducted))
  })

  const theScale = d3.scaleLinear()
    .domain([Math.min(Math.min(...releaseYears),Math.min(...inductedYears)),Math.max(Math.max(...releaseYears),Math.max(...inductedYears))])
    .range([0,width-2*margin])

  const axis = d3.axisBottom(theScale)
    .tickFormat(d3.format("d"))

  svg.append("g")
    .call(axis);

  let numGenres = new Set(resp.map((d)=>d.type))

  svg.selectAll("path").data(resp).enter().append("path")
  .attr("class","movies")
  .attr("d",function(d){
    let startPoint = theScale(parseInt(d.release))
    let endPoint = theScale(parseInt(d.inducted))
    let divisions = ((endPoint-startPoint) / 4) 
    let firstControl = divisions + startPoint
    let secondControl = (divisions * 3) + startPoint

    return `M${endPoint} 0 C ${secondControl} -80, ${firstControl} -80, ${startPoint} 0`    
  })
  .style("stroke",(d)=> colorMap[d.type])
  .style("stroke-width","0.1")
  .style("stroke-dasharray",function(){return Math.ceil(this.getTotalLength())})
  .style("stroke-dashoffset",function(){return Math.ceil(this.getTotalLength())})
  .style("opacity",0.4)

  animateYear(1989)
})

function animateYear(year){
  if(year>2017) {
    d3.selectAll(".movies")
    .transition()
    .duration(500)
    .ease(d3.easeCubicInOut)
    .style("opacity",0.8)
    .style("stroke-width","0.2")

    return
  }
  
  const t = d3.transition()
    .duration(2500)
    .ease(d3.easeCubicInOut)
    .on('end', function(){animateYear(parseInt(year)+1)})

  d3.selectAll(".movies")
  .filter((d)=>{return parseInt(d.inducted)==year;})
  .style("stroke-width","1")
  .style("opacity",1)
  .transition(t)
  .style("stroke-dashoffset",0)

  d3.selectAll(".movies")
  .filter((d)=>{return parseInt(d.inducted)!=year;})
  .transition()
  .duration(500)
  .ease(d3.easeCubicInOut)
  .style("opacity",0.25)
  .style("stroke-width","0.1")
}

window.onresize = function(){
  let width = window.innerWidth;
  let height = window.innerHeight;
  const margin = 0.1*window.innerWidth;
  outerSvg.attr("width",width)
     .attr("height",height)
}










