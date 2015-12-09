class Device.LineChartComponent extends UIComponent
  @register 'Device.LineChartComponent'

  onCreated: ->
    super

    @currentDeviceUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

  onRendered: ->
    super

    # Set up line chart
    margin = 
      top: 20
      right: 20
      bottom: 30
      left: 50
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
    svg = d3.select('#lineChart').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    svg.append('g').attr('class', 'x axis').attr 'transform', 'translate(0,' + height + ')'
    svg.append('g').attr('class', 'y axis').append('text').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.71em').style('text-anchor', 'end').text 'Temperature (f)'

    @device = new ComputedField =>
      Device.documents.findOne
        uuid: @currentDeviceUuid()

    # TODO: it would be cool if these visulization components could be more reusable.
    @datapoints = new ComputedField =>
      Data.documents.find
        'device._id': @device()?._id
      ,
        'sort':
          'insertedAt': -1
      ,
        'limit': 5
      .fetch()

    @autorun (computation) =>
      dataset = @datapoints()

      paths = svg.selectAll('path.line').data( dataset )
      
      # TODO: For devices with enough data we could support multiple views of
      # of the data: years, months, weeks, days.
      x.domain d3.extent(dataset, (d) ->
        d.body.timestamp
      )

      # TODO: make this more general rather than example specific.
      # templateData = Template.currentData()
      # property = templateData.property
      
      y.domain d3.extent(dataset, (d) ->
        # need to get the value of the passed in property
        d.body.readings[0].value
      )

      line = d3.svg.line().x((d) ->
        x d.body.timestamp
      ).y((d) ->
        y d.body.readings[0].value
      ).interpolate("linear")

      #Update X axis
      svg.select('.x.axis').transition().duration(1000).call xAxis
      #Update Y axis

      # TODO: improve this.
      svg.select('.y.axis').transition().duration(1000).call yAxis
      paths.enter().append('path').attr('class', 'line').attr 'd', line dataset
      # paths.attr 'd', line dataset
      # paths.attr('transform', null).transition().duration(5000).remove()

      paths.exit().remove()
      return
