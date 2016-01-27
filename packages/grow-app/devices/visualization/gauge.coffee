class Device.GaugeComponent extends UIComponent
  @register 'Device.GaugeComponent'

  onCreated: ->
    super

    @currentDeviceUuid = new ComputedField =>
      FlowRouter.getParam 'uuid'

    # HACK: this should be configurable.
    @configure {
      size: 300,
      label: @property(),
      min: 0,
      max: 14    
    }

  property: ->
    templateData = Template.currentData()
    templateData.property

  configure: (configuration) ->
    @config = configuration
    @config.size = @config.size * 0.9
    @config.raduis = @config.size * 0.97 / 2
    @config.cx = @config.size / 2
    @config.cy = @config.size / 2
    @config.min = if undefined != configuration.min then configuration.min else 0
    @config.max = if undefined != configuration.max then configuration.max else 100
    @config.range = @config.max - (@config.min)
    @config.majorTicks = configuration.majorTicks or 5
    @config.minorTicks = configuration.minorTicks or 2
    @config.greenColor = configuration.greenColor or '#109618'
    @config.yellowColor = configuration.yellowColor or '#FF9900'
    @config.redColor = configuration.redColor or '#DC3912'
    @config.transitionDuration = configuration.transitionDuration or 500
    @config.yellowZones = [{ from: 2.5, to: 5 }, { from: 10.5, to: 13 }]
    @config.redZones = [{ from: @config.min + @config.range*0.9, to: @config.max }]

  onRendered: ->
    super

    @device = new ComputedField =>
      Device.documents.findOne
        'uuid': @currentDeviceUuid()

    @datapoint = new ComputedField =>
      Data.documents.findOne
        'device._id': @device()._id

    @body = d3.select('#' + @property()).append('svg:svg').attr('class', 'gauge').attr('width', @config.size).attr('height', @config.size)
    @body.append('svg:circle').attr('cx', @config.cx).attr('cy', @config.cy).attr('r', @config.raduis).style('fill', '#ccc').style('stroke', '#000').style 'stroke-width', '0.5px'
    @body.append('svg:circle').attr('cx', @config.cx).attr('cy', @config.cy).attr('r', 0.9 * @config.raduis).style('fill', '#fff').style('stroke', '#e0e0e0').style 'stroke-width', '2px'

    for index of @config.greenZones
      @drawBand @config.greenZones[index].from, @config.greenZones[index].to, @config.greenColor
    for index of @config.yellowZones
      @drawBand @config.yellowZones[index].from, @config.yellowZones[index].to, @config.yellowColor
    for index of @config.redZones
      @drawBand @config.redZones[index].from, @config.redZones[index].to, @config.redColor
    if undefined != @config.label
      fontSize = Math.round(@config.size / 9)
      @body.append('svg:text').attr('x', @config.cx).attr('y', @config.cy / 2 + fontSize / 2).attr('dy', fontSize / 2).attr('text-anchor', 'middle').text(@config.label).style('font-size', fontSize + 'px').style('fill', '#333').style 'stroke-width', '0px'
    fontSize = Math.round(@config.size / 16)
    majorDelta = @config.range / (@config.majorTicks - 1)
    major = @config.min
    while major <= @config.max
      minorDelta = majorDelta / @config.minorTicks
      minor = major + minorDelta
      while minor < Math.min(major + majorDelta, @config.max)
        point1 = @valueToPoint(minor, 0.75)
        point2 = @valueToPoint(minor, 0.85)
        @body.append('svg:line').attr('x1', point1.x).attr('y1', point1.y).attr('x2', point2.x).attr('y2', point2.y).style('stroke', '#666').style 'stroke-width', '1px'
        minor += minorDelta
      point1 = @valueToPoint(major, 0.7)
      point2 = @valueToPoint(major, 0.85)
      @body.append('svg:line').attr('x1', point1.x).attr('y1', point1.y).attr('x2', point2.x).attr('y2', point2.y).style('stroke', '#333').style 'stroke-width', '2px'
      if major == @config.min or major == @config.max
        point = @valueToPoint(major, 0.63)
        @body.append('svg:text').attr('x', point.x).attr('y', point.y).attr('dy', fontSize / 3).attr('text-anchor', if major == @config.min then 'start' else 'end').text(major).style('font-size', fontSize + 'px').style('fill', '#333').style 'stroke-width', '0px'
      major += majorDelta
    pointerContainer = @body.append('svg:g').attr('class', 'pointerContainer')
    

    @autorun (computation) =>
      data = @datapoint()
      # Todo: get value by using the property.
      debugger
      value = data.body.readings[3].value
      pointerPath = @buildPointerPath(value)
      pointerLine = d3.svg.line().x((d) ->
        d.x
      ).y((d) ->
        # `var fontSize`
        d.y
      ).interpolate('basis')
      pointerContainer.selectAll('path').data([ pointerPath ]).enter().append('svg:path').attr('d', pointerLine).style('fill', '#dc3912').style('stroke', '#c63310').style 'fill-opacity', 0.7
      pointerContainer.append('svg:circle').attr('cx', @config.cx).attr('cy', @config.cy).attr('r', 0.12 * @config.raduis).style('fill', '#4684EE').style('stroke', '#666').style 'opacity', 1
      fontSize = Math.round(@config.size / 10)
      pointerContainer.selectAll('text').data([ value ]).enter().append('svg:text').attr('x', @config.cx).attr('y', @config.size - (@config.cy / 4) - fontSize).attr('dy', fontSize / 2).attr('text-anchor', 'middle').style('font-size', fontSize + 'px').style('fill', '#000').style 'stroke-width', '0px'
      @redraw @config.min, 0
      return

  buildPointerPath: (value) ->
    delta = @config.range / 13
    head = @valueToPoint(value, 0.85)
    head1 = @valueToPoint(value - delta, 0.12)
    head2 = @valueToPoint(value + delta, 0.12)
    tailValue = value - (@config.range * 1 / (270 / 360) / 2)
    tail = @valueToPoint(tailValue, 0.28)
    tail1 = @valueToPoint(tailValue - delta, 0.12)
    tail2 = @valueToPoint(tailValue + delta, 0.12)

    valueToPoint = (value, factor) ->
      point = @valueToPoint(value, factor)
      point.x -= @config.cx
      point.y -= @config.cy
      point

    [
      head
      head1
      tail2
      tail
      tail1
      head2
      head
    ]

  drawBand: (start, end, color) ->
    if 0 >= end - start
      return
    @body.append('svg:path').style('fill', color).attr('d', d3.svg.arc().startAngle(@valueToRadians(start)).endAngle(@valueToRadians(end)).innerRadius(0.65 * @config.raduis).outerRadius(0.85 * @config.raduis)).attr 'transform', =>
      'translate(' + @config.cx + ', ' + @config.cy + ') rotate(270)'

  redraw: (value, transitionDuration) ->
    pointerContainer = @body.select('.pointerContainer')
    pointerContainer.selectAll('text').text Math.round(value)
    pointer = pointerContainer.selectAll('path')
    pointer.transition().duration(if undefined != transitionDuration then transitionDuration else @config.transitionDuration).attrTween 'transform', =>
      pointerValue = value
      if value > @config.max
        pointerValue = @config.max + 0.02 * @config.range
      else if value < @config.min
        pointerValue = @config.min - (0.02 * @config.range)
      targetRotation = @valueToDegrees(pointerValue) - 90
      currentRotation = @_currentRotation or targetRotation
      @_currentRotation = targetRotation
      rotation = currentRotation + (targetRotation - currentRotation)
      'translate(' + @config.cx + ', ' + @config.cy + ') rotate(' + rotation + ')'

  valueToDegrees: (value) ->
    value / @config.range * 270 - (@config.min / @config.range * 270 + 45)

  valueToRadians: (value) ->
    @valueToDegrees(value) * Math.PI / 180

  valueToPoint: (value, factor) ->
    {
      x: @config.cx - (@config.raduis * factor * Math.cos(@valueToRadians(value)))
      y: @config.cy - (@config.raduis * factor * Math.sin(@valueToRadians(value)))
    }



