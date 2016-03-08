class LineChartComponent extends UIComponent
  @register 'LineChartComponent'

  onCreated: ->
    super

    @currentDeviceUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    # @autorun (computation) =>
    @subscribe 'Data.points', @currentDeviceUuid()

  property: ->
    templateData = Template.currentData()
    templateData.property

  onRendered: ->
    super

    # Set up line chart
    margin = 
      top: 20
      right: 20
      bottom: 30
      left: 50
    # TODO: make this a bit more reponsive for smaller devices?
    width = 600 - (margin.left) - (margin.right)
    height = 400 - (margin.top) - (margin.bottom)
    x = d3.time.scale().range([
      0
      width
    ])
    y = d3.scale.linear().range([
      height
      0
    ])
    xAxis = d3.svg.axis().scale(x).orient('bottom')
    yAxis = d3.svg.axis().scale(y).orient('left')
    svg = d3.select('#' + @property()).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    svg.append('g').attr('class', 'x axis').attr 'transform', 'translate(0,' + height + ')'
    svg.append('g').attr('class', 'y axis').append('text').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.71em').style('text-anchor', 'end').text '' # TODO: Add unit value if it exists

    @autorun (computation) =>
      property = Template.currentData().property

      @datapoints = new ComputedField =>
        Data.documents.find
          'event':
            $exists: false
        .fetch()

      dataset = @datapoints()

      if dataset.length > 100
        dataset.shift()

      paths = svg.selectAll('path.line').data( dataset )

      x.domain d3.extent(dataset, (d) ->
        d.insertedAt
      )

      y.domain d3.extent(dataset, (d) ->
        d.data.value
      )

      line = d3.svg.line().x((d) ->
        x d.insertedAt
      ).y((d) ->
        y d.data.value
      ).interpolate("linear")

      #Update X axis
      svg.select('.x.axis').transition().duration(1000).call xAxis
      #Update Y axis
      svg.select('.y.axis').transition().duration(1000).call yAxis
      paths
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('d', line(dataset))
        .transition()
        .duration(1000)
        .remove()
      paths.exit().remove()
      return



# var n = 40,
#     random = d3.random.normal(0, .2),
#     data = d3.range(n).map(random);
# var margin = {top: 20, right: 20, bottom: 20, left: 40},
#     width = 960 - margin.left - margin.right,
#     height = 500 - margin.top - margin.bottom;
# var x = d3.scale.linear()
#     .domain([0, n - 1])
#     .range([0, width]);
# var y = d3.scale.linear()
#     .domain([-1, 1])
#     .range([height, 0]);
# var line = d3.svg.line()
#     .x(function(d, i) { return x(i); })
#     .y(function(d, i) { return y(d); });
# var svg = d3.select("body").append("svg")
#     .attr("width", width + margin.left + margin.right)
#     .attr("height", height + margin.top + margin.bottom)
#   .append("g")
#     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
# svg.append("defs").append("clipPath")
#     .attr("id", "clip")
#   .append("rect")
#     .attr("width", width)
#     .attr("height", height);
# svg.append("g")
#     .attr("class", "x axis")
#     .attr("transform", "translate(0," + y(0) + ")")
#     .call(d3.svg.axis().scale(x).orient("bottom"));
# svg.append("g")
#     .attr("class", "y axis")
#     .call(d3.svg.axis().scale(y).orient("left"));
# var path = svg.append("g")
#     .attr("clip-path", "url(#clip)")
#   .append("path")
#     .datum(data)
#     .attr("class", "line")
#     .attr("d", line);
# tick();
# function tick() {
#   // push a new data point onto the back
#   data.push(random());
#   // redraw the line, and slide it to the left
#   path
#       .attr("d", line)
#       .attr("transform", null)
#     .transition()
#       .duration(500)
#       .ease("linear")
#       .attr("transform", "translate(" + x(-1) + ",0)")
#       .each("end", tick);
#   // pop the old data point off the front
#   data.shift();
# }