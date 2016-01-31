class Component.ListItemComponent extends Component.ListComponent
  @register 'Component.ListItemComponent'

  onCreated: ->
  	super

  	Component = Template.currentData()

  	@autorun (computation) =>
      ComponentUuid = Component.uuid
      return unless ComponentUuid

      @subscribe 'Component.one', ComponentUuid

      @subscribe 'Data.points', ComponentUuid

      @dataPoint = new ComputedField =>
        dataPoint = Data.documents.findOne
          'Component._id': Component?._id
        ,
          'sort':
            'insertedAt': -1
        dataPoint?.body

  currentValue: ->
  	@dataPoint()
