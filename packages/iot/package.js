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
    'accounts-ui',
    'accounts-password',
    'fourseven:scss',
    'ecmascript'
  ]);

  // 3rd party dependencies.
  api.use([
    'kadira:flow-router@2.7.0',
    'kadira:blaze-layout@2.2.0',
    'peerlibrary:computed-field@0.3.0'
  ]);

  // Internal dependencies.
  api.use([
    'ui-components',
    'core',
    'api',
    'session'
  ]);

  api.addFiles([
    'layout/layout.html',
    'layout/layout.coffee',
    'layout/loader.coffee',
    'layout/loader.html',
    'layout/header.html',
    'layout/header.coffee',
    'layout/footer.coffee',
    'layout/footer.html',
    'style/style.scss',
    'layout/not-found.coffee',
    'layout/not-found.html',
    'devices/display.coffee',
    'devices/display.html',
    'devices/list.coffee',
    'devices/list.html',
    'devices/linechart.coffee',
    'devices/linechart.html',
    'devices/new_device.coffee',
    'devices/new_device.html',
    'devices/new_thing.coffee',
    'devices/new_thing.html',
    'devices/routes.coffee',
    'users/account.coffee',
    'users/account.html',
    'users/login.coffee',
    'users/login.html',
    'users/register.coffee',
    'users/register.html',
    'users/routes.coffee'
  ], 'client');
});