Package.describe({
  name: 'fixtures',
  version: '0.1.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2');

  // Core dependencies.
  api.use([
    'coffeescript'
  ]);

  // Internal dependencies.
  api.use([
  	'core'
  ]);

  api.addFiles([
    'fixtures.coffee'
  ], 'server');
});