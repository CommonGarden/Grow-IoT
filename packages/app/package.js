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
    'jquery'
  ]);

  // Internal dependencies.
  api.use([
    'ui-components',
    'core',
    'api',
    'session'
  ]);

  // Note: files are loaded in by order in the list, see Meteor docs for more info.
  api.addFiles([
    'layout/layout.html',
    'layout/layout.coffee',
    'layout/loader.js',
    'layout/loader.html',
    'layout/header.html',
    'layout/header.js',
    'layout/footer.js',
    'layout/footer.html',
    'layout/not-found.js',
    'layout/not-found.html',
    'layout/dashboard.js',
    'layout/dashboard.html',
    'layout/back_button.js',
    'layout/back_button.html',

    'style/style.scss',
    'style/navigation.scss',
    'style/responsive.scss',

    'devices/display.js',
    'devices/display.html',
    'devices/list.js',
    'devices/list.html',
    'devices/list_item.js',
    'devices/list_item.html',
    'devices/event_log.js',
    'devices/event_log.html',

    'visualization/linechart.coffee',
    'visualization/linechart.html',
    'visualization/gauge.coffee',
    'visualization/gauge.html',
    'visualization/visualization.coffee',
    'visualization/visualization.html',

    'components/list.js',
    'components/list.html',
    'components/sensors_list.js',
    'components/sensors_list.html',
    'components/sensor.js',
    'components/sensor.html',
    'components/action.js',
    'components/action.html',

    'environments/display.js',
    'environments/display.html',
    'environments/list.js',
    'environments/list.html',
    'environments/list_item.coffee',
    'environments/list_item.html',
    'environments/new_environment.coffee',
    'environments/new_environment.html',
    'environments/new_device.coffee',
    'environments/new_device.html',

    'routes.js',

    // 'things/new_thing.coffee',
    // 'things/new_thing.html',
    // 'things/display.coffee',
    // 'things/display.html',
    // 'things/list_item.coffee',
    // 'things/list_item.html',
    // 'things/list.coffee',
    // 'things/list.html',

    'notifications/notification.js',
    'notifications/notification.html',
    'notifications/navui.coffee',
    'notifications/navui.html',
    'notifications/history.js',
    'notifications/history.html'
  ], 'client');
});