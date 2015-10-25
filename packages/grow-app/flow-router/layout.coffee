class MainLayoutComponent extends UIComponent
  @register 'MainLayoutComponent'

FlowRouter.route '/',
  action: (params, queryParams) ->
    BlazeLayout.render 'MainLayoutComponent'