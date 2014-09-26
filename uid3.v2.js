function ui2(selector) {

  var instance = {};
  // defaults
  var height = parseInt(d3.select(selector).style("height"));
  var width = parseInt(d3.select(selector).style("width"));
  var svg = d3.select(selector).append("svg");
  // add shadow filter
  var svgdef = svg.append('defs');
  
  var visualeffect = svgdef.append('filter')
    .attr('id','dropshadow');
  
  visualeffect.append('feGaussianBlur')
    .attr('in','SourceAlpha')
    .attr('stdDeviation',3)
    .attr('result','blur');

  visualeffect.append('feOffset')
    .attr('in','blur')
    .attr('dx',2)
    .attr('dy',3)
    .attr('result','offsetBlur');

  var blendvisuals = visualeffect.append('feMerge');

  blendvisuals.append('feMergeNode')
    .attr('in','offsetBlur');

  blendvisuals.append('feMergeNode')
    .attr('in','SourceGraphic');
  // end shadow filter

  var brushFill = "#00FF7F";
  var bgColor= "#FFF";
  var handleStroke = "#586e75";
  var handleFill = "#F5F5F5";
  var axisOn = true;
  var axisColor = "#586e75";
  var xDomain = d3.scale.linear().domain([0,100]);
  var tickCount = 4;
  var fontStyle = "10px sans-serif";


  instance.xDomain = function(_xDomain){
    if(!arguments.length) return xDomain;
    xDomain = _xDomain;
    return instance;
  }

  instance.axisColor = function(_axisColor){
    if(!arguments.length) return axisColor;
    axisColor = _axisColor;
    return instance;
  }

  instance.tickCount = function(_tickCount) {
    if(!arguments.length) return tickCount;
    tickCount = _tickCount;
    return instance
  }

  instance.axisfont = function(_axisfont) {
    if(!arguments.length) return axisfont;
    axisfont = _axisfont;
    return instance
  }

  instance.width = function(_width) {
    if(!arguments.length) return width;
    width = _width;
    return instance;
  }

  instance.height = function(_height) {
    if(!arguments.length) return height;
    height = _height;
    return instance;
  }

  instance.brushFill = function(_color) {
    if(!arguments.length) return brushFill;
    return brushFill = _color;
  }

  instance.bgColor = function(_color) {
    if(!arguments.length) return bgColor;
    return bgColor = _color;
  }

  instance.handlestrokecolor = function(_color) {
    if(!arguments.length) return handleStroke;
    return handleStroke = _color;
  }

  instance.handleFill = function(_color) {
    if(!arguments.length) return handleFill;
    return handleFill = _color; 
  }

  instance.axisOn = function(b) {
    if(!arguments.length) return axisOn;
    return axisOn = b;
  }


  instance.render = function() {

    brushstart = function() {
      svg.classed("selecting", true);
    }

    brushmove = function() {
      var s = brush.extent();
    }

    brushend = function() {
      svg.classed("selecting", !d3.event.target.empty());
    } 

    var xScale = xDomain
      .range([height/2, width - height/2])
      .nice();

    var min = xScale.domain()[0];
    var max = xScale.domain()[1];
      
    var brush = d3.svg.brush()
      .x(xScale)
      .extent([min, max])
      .on("brushstart", brushstart)
      .on("brush", brushmove)
      .on("brushend", brushend);

    var brushg = svg.append("g")
      .attr("class", "brush")
      .style("fill",brushFill)
      .call(brush);

    d3.select(selector)
      .style("overflow","hidden")
      .style("background-color",bgColor);

    svg.attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + 0 + "," + 0+ ")");

    if(axisOn) renderaxis();

    brushg.selectAll("rect")
      .attr("height",height*.2) 
      .attr("y",height*.4);

    d3.select(selector).style("border-radius",height/2+"px");

    function renderaxis() {
      svg.append("g")
      .attr("stroke",axisColor)
      .attr("fill","none")
      .attr("transform", "translate(0," + height*.8+ ")")
      .call(d3.svg.axis().scale(xScale).ticks(tickCount).orient("bottom")).selectAll("text").style("font",fontStyle);
    }

    function renderhandles() {
      brushg.selectAll(".resize").append("circle")
      .attr("id",function(d){ return d;})
      .attr("transform", "translate(0,0)")
      .attr("r",height/3.5) 
      .attr("cy",height/2)
      .attr("filter","url(#dropshadow)")
      .attr("fill",handleFill) 
      .attr("opacity",1);
    }
    renderhandles();
    brushstart();
    brushmove();

    return instance;

  }

  return instance;
} 