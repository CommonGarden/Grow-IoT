class Device.LineChartComponent extends UIComponent
  @register 'Device.LineChartComponent'

  onCreated: ->
    super

    @currentDeviceUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

  property: ->
    templateData = Template.currentData()
    templateData.property

  onRendered: ->
    super

    @device = new ComputedField =>
      Device.documents.findOne
        uuid: @currentDeviceUuid()

    @datapoints = new ComputedField =>
      Data.documents.find
        'device._id': @device()?._id
      .fetch()

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
      dataset = @datapoints()

      paths = svg.selectAll('path.line').data( dataset )

      x.domain d3.extent(dataset, (d) ->
        d.body.timestamp
      )

      property = Template.currentData().property

      y.domain d3.extent(dataset, (d) ->
        for reading in d.body.readings
          if reading.type == property
            value = reading.value
        value
      )

      line = d3.svg.line().x((d) ->
        x d.body.timestamp
      ).y((d) ->
        for reading in d.body.readings
          if reading.type == property
            value = reading.value
        y value
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