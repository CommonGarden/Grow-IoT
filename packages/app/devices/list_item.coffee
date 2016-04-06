class Device.ListItemComponent extends Device.ListComponent
  @register 'Device.ListItemComponent'

  onCreated: ->
  	super

  	device = Template.currentData()

  	@autorun (computation) =>
      deviceUuid = device.uuid
      return unless deviceUuid

      @subscribe 'Device.one', deviceUuid

      @subscribe 'Data.points', deviceUuid

      @dataPoint = new ComputedField =>
        dataPoint = Data.documents.findOne
          'device._id': device?._id
        ,
          'sort':
            'insertedAt': -1
        dataPoint?.data

  currentValue: ->
  	@dataPoint()
