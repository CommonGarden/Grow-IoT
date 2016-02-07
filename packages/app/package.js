Package.describe({
  name: 'grow-app',
  version: '0.1.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2');

  // Core dependencies.
  api.use([
    'coffeescript',
    'underscore',
    'fourseven:scss',
    'ecmascript'
  ]);

  // 3rd party dependencies.
  api.use([
    'kadira:flow-router@2.7.0',
    'kadira:blaze-layout@2.2.0',
    'peerlibrary:computed-field@0.3.0',
    'themeteorchef:jquery-validation',
    'cg-camera'
  ]);

  // Internal dependencies.
  api.use([
    'ui-components',
    'core',
    'api',
    'session',
    'jquery'
  ]);

  // TODO: organize and document this better.
  api.addFiles([
    'layout/layout.html',
    'layout/layout.coffee',
    'layout/loader.coffee',
    'layout/loader.html',
    'layout/header.html',
    'layout/header.coffee',
    'layout/footer.coffee',
    'layout/footer.html',
    'layout/not-found.coffee',
    'layout/not-found.html',
    'layout/dashboard.coffee',
    'layout/dashboard.html',
    'layout/back-button.coffee',
    'layout/back-button.html',

    'style/style.scss',
    'style/navigation.scss',

    'devices/display.coffee',
    'devices/display.html',
    'devices/list.coffee',
    'devices/list.html',
    'devices/list_item.coffee',
    'devices/list_item.html',
    'devices/new_device.coffee',
    'devices/new_device.html',

    'components/visualization/linechart.coffee',
    'components/visualization/linechart.html',
    'components/visualization/gauge.coffee',
    'components/visualization/gauge.html',
    'components/visualization/visualization.coffee',
    'components/visualization/visualization.html',
    'components/actuator.coffee',
    'components/actuator.html',
    'components/list.coffee',
    'components/list.html',
    'components/sensor.coffee',
    'components/sensor.html',

    'lib/html5-sortable.jquery.min.js',
    
    'environments/display.coffee',
    'environments/display.html',
    'environments/list.coffee',
    'environments/list.html',
    'environments/list_item.coffee',
    'environments/list_item.html',
    'environments/new_environment.coffee',
    'environments/new_environment.html',
    
    'routes.coffee',
    
    'lib/jquery-cron.js',
    
    'plants/images.coffee',
    'plants/images.html',
    'plants/new_plant.coffee',
    'plants/new_plant.html',
    'plants/display.coffee',
    'plants/display.html',
    'plants/list_item.coffee',
    'plants/list_item.html',
    'plants/list.coffee',
    'plants/list.html',
    
    'notifications/notifications.coffee',
    'notifications/notifications.html'
  ], 'client');
});