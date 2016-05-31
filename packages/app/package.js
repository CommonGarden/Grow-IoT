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
    'cg-camera',
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
    'style/responsive.scss',

    'devices/display.coffee',
    'devices/display.html',
    'devices/list.coffee',
    'devices/list.html',
    'devices/list_item.coffee',
    'devices/list_item.html',
    'devices/event_log.coffee',
    'devices/event_log.html',

    'visualization/linechart.coffee',
    'visualization/linechart.html',
    'visualization/gauge.coffee',
    'visualization/gauge.html',
    'visualization/visualization.coffee',
    'visualization/visualization.html',
    'components/list.coffee',
    'components/list.html',
    'components/sensors_list.coffee',
    'components/sensors_list.html',
    'components/sensor.coffee',
    'components/sensor.html',
    'components/action.coffee',
    'components/action.html',

    // 'lib/html5-sortable.jquery.min.js',

    'environments/display.coffee',
    'environments/display.html',
    'environments/list.coffee',
    'environments/list.html',
    'environments/list_item.coffee',
    'environments/list_item.html',
    'environments/new_environment.coffee',
    'environments/new_environment.html',
    'environments/new_device.coffee',
    'environments/new_device.html',

    'routes.coffee',

    'lib/jquery-cron.js',

    'things/images.coffee',
    'things/images.html',
    'things/new_thing.coffee',
    'things/new_thing.html',
    'things/display.coffee',
    'things/display.html',
    'things/list_item.coffee',
    'things/list_item.html',
    'things/list.coffee',
    'things/list.html',

    'notifications/notification.coffee',
    'notifications/notification.html',
    'notifications/navui.coffee',
    'notifications/navui.html',
    'notifications/history.coffee',
    'notifications/history.html'
  ], 'client');
});