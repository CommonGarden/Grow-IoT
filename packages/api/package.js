Package.describe({
  name: 'api',
  version: '0.1.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2');

  // Core dependencies.
  api.use([
    'coffeescript',
    'random',
    'ecmascript'
  ]);

  // 3rd party dependencies.
  api.use([
    'peerlibrary:middleware@0.1.1',
    'peerlibrary:check-extension@0.2.0'
  ]);

  // Internal dependencies.
  api.use([
    'core'
  ]);

  api.addFiles([
    'device/methods.coffee',
    'environment/methods.coffee',
    'notifications/methods.coffee',
    'plant/methods.coffee',
    'images/methods.coffee'
  ]);

  api.addFiles([
    'device/publish.coffee',
    'device/server-methods.coffee',
    'data/publish.coffee',
    'environment/publish.coffee',
    'notifications/publish.coffee',
    'plant/publish.coffee',
    'images/publish.coffee'
  ], 'server');
});
