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
    'peerlibrary:blaze-common-component',
    'peerlibrary:blaze-components@0.15.0',
    'kadira:blaze-layout@2.2.0',
    'peerlibrary:computed-field@0.3.0',
    'themeteorchef:jquery-validation',
    'useraccounts:bootstrap',
    'useraccounts:core',
    'softwarerero:accounts-t9n',
    'jquery'
  ]);

  // Internal dependencies.
  api.use([
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

    'accounts/accounts_config.js',
    'accounts/account-page.html',
    'accounts/account-page.js',
    'accounts/sign-in-or-up.html',
    'accounts/sign-in-or-up.js',

    'style/style.scss',
    'style/navigation.scss',
    'style/responsive.scss',

    'devices/all_devices.js',
    'devices/all_devices.html',
    'devices/display.js',
    'devices/display.html',
    'devices/list.js',
    'devices/list.html',
    'devices/list_item.js',
    'devices/list_item.html',
    'devices/event_log.js',
    'devices/event_log.html',
    'devices/components/list.js',
    'devices/components/list.html',
    'devices/components/sensors_list.js',
    'devices/components/sensors_list.html',
    'devices/components/sensor.js',
    'devices/components/sensor.html',
    'devices/components/action.js',
    'devices/components/action.html',

    'visualization/linechart.js',
    'visualization/linechart.html',
    'visualization/visualization.js',
    'visualization/visualization.html',

    'environments/display.js',
    'environments/display.html',
    'environments/list.js',
    'environments/list.html',
    'environments/list_item.js',
    'environments/list_item.html',
    'environments/new_environment.js',
    'environments/new_environment.html',
    'environments/new_device.js',
    'environments/new_device.html',

    'routes.js',

    // 'things/new_thing.js',
    // 'things/new_thing.html',
    // 'things/display.js',
    // 'things/display.html',
    // 'things/list_item.js',
    // 'things/list_item.html',
    // 'things/list.js',
    // 'things/list.html',

    'notifications/notification.js',
    'notifications/notification.html',
    'notifications/navui.js',
    'notifications/navui.html',
    'notifications/history.js',
    'notifications/history.html'
  ], 'client');
});