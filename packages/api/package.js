Package.describe({
  name: 'api',
  version: '0.1.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2');

  // Core dependencies.
  api.use([
    'coffeescript',
    'random'
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
    'device/methods.coffee'
  ]);

  api.addFiles([
    'device/publish.coffee'
  ], 'server');
});
