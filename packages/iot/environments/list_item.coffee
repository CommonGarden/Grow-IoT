class Environment.ListItemComponent extends Environment.ListComponent
  @register 'Environment.ListItemComponent'

  onCreated: ->
  	super

  # 	device = Template.currentData()

  # 	@autorun (computation) =>
  #     deviceUuid = device.uuid
  #     return unless deviceUuid

  #     @subscribe 'Environment.one', deviceUuid

  #     @subscribe 'Data.points', deviceUuid

  #     @dataPoint = new ComputedField =>
  #       dataPoint = Data.documents.findOne
  #         'device._id': device?._id
  #       ,
  #         'sort':
  #           'insertedAt': -1
  #       dataPoint?.body

  # currentValue: ->
  # 	@dataPoint()
