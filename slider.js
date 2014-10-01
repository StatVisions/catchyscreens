function slider(selector) {

  var instance = {};
  // defaults
  var height = 100;
  var width = 600
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
  var sliderColor= "#eee";
  var handleStroke = "#586e75";
  var handleFill = "#F5F5F5";
  var axisOn = true;
  var axisColor = "#586e75";
  var values = [0,100];
  var tickCount = 4;
  var fontStyle = "1rem sans-serif";

  instance.xScale = function(_xScale){
    if(!arguments.length) return xScale;
    xScale = _xScale;
    return instance;
  }

  instance.values = function(_values){
    if(!arguments.length) return values;
    values = _values;
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
    brushFill = _color;
    return
  }

  instance.sliderColor = function(_color) {
    if(!arguments.length) return sliderColor;
    sliderColor = _color;
    return instance;
  }

  instance.handlestrokecolor = function(_color) {
    if(!arguments.length) return handleStroke;
    handleStroke = _color;
    return instance;
  }

  instance.handleFill = function(_color) {
    if(!arguments.length) return handleFill;
    handleFill = _color;
    return instance;
  }

  instance.axisOn = function(b) {
    if(!arguments.length) return axisOn;
    axisOn = b;
    return instance;
  }


    var brush = d3.svg.brush();

    brushstart = function() {
      svg.classed("selecting", true);
    }

    brushmove = function() {
      var s = brush.extent();
    }

    brushend = function() {
      svg.classed("selecting", !d3.event.target.empty());
    } 
    // brush /////////////////////////////////////////
    var sliderHeightWidth = [height/2, width - height/2];
    var xScale = d3.scale.linear().domain(values).range(sliderHeightWidth).nice();

    brush
      .x(xScale)
      .extent(xScale.domain())
      .on("brushstart", brushstart)
      .on("brush", brushmove)
      .on("brushend", brushend);

    var brushg = svg.append("g")
      .attr("class", "brush")
      .style("fill",brushFill)
      .call(brush);

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
  
  d3.select(selector)
      .style("overflow","hidden")
      .style("background-color",sliderColor);
  
  brushstart();
  brushmove();

  instance.render = function() {

    svg.attr("width", width)
      .attr("height", height);

    if(axisOn) renderaxis();

    renderhandles();


    return instance;

  }

  return instance;
} 