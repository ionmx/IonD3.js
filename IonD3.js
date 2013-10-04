var IonD3 = IonD3 || {};

IonD3.Utils = {}
IonD3.Utils.mergeProperties = function(a, b) {
  for (var prop in b) { a[prop] = b[prop]; }
}
IonD3.Utils.sumRow = function(row) {
  var sum = 0;
  row.map(function(value, index) { sum += value; });
  return sum;
}

IonD3.Stacked = function(e) {
  
  var element_id = e;

  var data = [];

  var options = {
    barWidth: 20,
    barSpacing: 10
  };

  IonD3.Stacked.prototype.draw = function(_data, _options) {
    
    data = _data;
    IonD3.Utils.mergeProperties(options, _options);


    var headers = data.shift();
    var y_labels = [];
    data.map(function(value, index) { y_labels.push(data[index].shift()); });
    var columns = headers.length - 1;
    options.height = (options.barWidth + options.barSpacing) * data.length;

    var x = d3.scale.linear()
          .domain([0, d3.max(data, function(datum, index) { return IonD3.Utils.sumRow(datum); })])
          .rangeRound([0, options.width - options.labelWidth]);
    
    var y = d3.scale.linear()
          .domain([0, data.length])
          .range([0, options.height]);

    var color = d3.scale.category20();

    var chart = d3.select(element_id)
                  .append("svg")
                  .attr("width", options.width + options.margin.left + options.margin.right)
                  .attr("height", options.height + options.margin.top + options.margin.bottom)
                  .append("g")
                    .attr("transform", "translate(10,20)");

    chart.selectAll("line")
         .data(x.ticks(10))
         .enter().append("line")
           .attr("transform", "translate(" + options.labelWidth + ",0)")
           .attr("x1", x)
           .attr("x2", x)
           .attr("y1", 0)
           .attr("y2", options.height)
           .style("stroke", "#ccc");

    for (var i = 0; i < columns; i++) {
      chart.selectAll("data_" + i)
           .data(data)
           .enter()
             .append("svg:rect")
               .attr("transform", "translate(" + options.labelWidth + ",0)")
               .attr("x", function(datum) { len = 0; for(var j = 0; j < i; j++) {len += datum[j]; }; return x(len); })
               .attr("y", function(datum, index) { return y(index); })
               .attr("width", function(datum) { return x(datum[i]); })
               .attr("height", options.barWidth)
               .attr("class", "bar_section")
               .attr("fill", color(i));

      chart.selectAll("data_" + i + "_label")
         .data(data)
         .enter()
         .append("svg:text")
           .attr("transform", "translate(" + options.labelWidth + ",0)")
           .attr("x", function(datum) { len = 0; for(var j = 0; j <= i; j++) {len += datum[j]; }; return x(len); })
           .attr("y", function(datum, index) { return y(index) + options.barWidth; })
           .attr("dx", -options.barWidth/2)
           .attr("dy", -options.barWidth/2 + 4)
           .attr("text-anchor", "middle")
           .text(function(datum) { return datum[i]; })
           .attr("fill", "white");

    }

    chart.selectAll(".rule")
         .data(x.ticks(20))
         .enter().append("text")
           .attr("transform", "translate(" + options.labelWidth + ",0)")
           .attr("class", "rule")
           .attr("x", x)
           .attr("y", options.height)
           .attr("dy", 12)
           .attr("text-anchor", "middle")
           .text(String);

    chart.append("line")
         .attr("transform", "translate(" + options.labelWidth + ",0)")
         .attr("y1", 0)
         .attr("y2", options.height)
         .style("stroke", "#000");

    chart.selectAll("text.y_labels")
         .data(y_labels)
         .enter().append("svg:text")
           .attr("x", options.labelWidth - 10)
           .attr("y", function(datum, index) { return y(index); })
           //.attr("dy", options.barWidth)
           .attr("text-anchor", "end")
           .attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
           .text(function(datum) { return datum;})
           .attr("transform", "translate(0, 18)")
           .attr("class", "yAxis");

  };
};
