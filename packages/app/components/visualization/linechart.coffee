class LineChartComponent extends UIComponent
  @register 'LineChartComponent'

  onCreated: ->
    super

    @currentDeviceUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    @property = new ComputedField =>
      templateData = Template.currentData()
      templateData.property

    @subscribe 'Data.points', @currentDeviceUuid()

  onRendered: ->
    super

    # TODO: make this a bit more responsive? Perhaps get the width of the div and
    # set the width to that?
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
    
    # Here we namespace the visualization instance so there can be multiple visualizations on a page.
    instance = {}
    instance[@property()] = {}
    instance[@property()].xAxis = d3.svg.axis().scale(x).orient('bottom')
    instance[@property()].yAxis = d3.svg.axis().scale(y).orient('left')
    instance[@property()].svg = d3.select('#' + @property()).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    instance[@property()].svg.append('g').attr('class', 'x axis').attr 'transform', 'translate(0,' + height + ')'
    instance[@property()].svg.append('g').attr('class', 'y axis').append('text').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.71em').style('text-anchor', 'end').text '' # TODO: Add unit value if it exists

    @autorun (computation) =>
      property = Template.currentData().property

      @datapoints = new ComputedField =>
        Data.documents.find
          'data.type': property
          'event':
            $exists: false
        .fetch()

      instance[property].paths = instance[property].svg.selectAll('path.line').data( @datapoints() )

      x.domain d3.extent(@datapoints(), (d) ->
        d.insertedAt
      )

      # TODO: scale things to a reasonable amount, it is weird to see it zoomed in too closely.
      y.domain d3.extent(@datapoints(), (d) ->
        d.data.value
      )

      # Temperature specific HACK
      # y.domain [0, 40]

      line = d3.svg.line().x((d) ->
        x d.insertedAt
      ).y((d) ->
        y d.data.value
      ).interpolate("linear")

      # TODO: fix graph blinking when lots of data or when data is coming in
      # at a different rate.

      #Update X axis
      instance[property].svg.select('.x.axis').transition().duration(1000).call instance[property].xAxis
      #Update Y axis
      instance[property].svg.select('.y.axis').transition().duration(1000).call instance[property].yAxis
      instance[property].paths
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('d', line(@datapoints()))
        .transition()
        .duration(1000)
        .remove()
      instance[property].paths.exit().remove()
      return


# n = 40
# random = d3.random.normal(0, .2)
# data = d3.range(n).map(random)
# margin = 
#   top: 20
#   right: 20
#   bottom: 20
#   left: 40
# width = 960 - (margin.left) - (margin.right)
# height = 500 - (margin.top) - (margin.bottom)
# x = d3.scale.linear().domain([
#   0
#   n - 1
# ]).range([
#   0
#   width
# ])
# y = d3.scale.linear().domain([
#   -1
#   1
# ]).range([
#   height
#   0
# ])
# line = d3.svg.line().x((d, i) ->
#   x i
# ).y((d, i) ->
#   y d
# )
# svg = d3.select('body').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

# tick = ->
#   # push a new data point onto the back
#   data.push random()
#   # redraw the line, and slide it to the left
#   path.attr('d', line).attr('transform', null).transition().duration(500).ease('linear').attr('transform', 'translate(' + x(-1) + ',0)').each 'end', tick
#   # pop the old data point off the front
#   data.shift()
#   return

# svg.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', width).attr 'height', height
# svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + y(0) + ')').call d3.svg.axis().scale(x).orient('bottom')
# svg.append('g').attr('class', 'y axis').call d3.svg.axis().scale(y).orient('left')
# path = svg.append('g').attr('clip-path', 'url(#clip)').append('path').datum(data).attr('class', 'line').attr('d', line)
# tick()
