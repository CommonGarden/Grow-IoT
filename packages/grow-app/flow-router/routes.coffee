FlowRouter.route '/',
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent'

FlowRouter.route '/details',
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent'
    
