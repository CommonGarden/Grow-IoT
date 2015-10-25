Package.describe({
  name: 'meshblu',
  version: '0.1.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2');

  // Core dependencies.
  api.use([
    'coffeescript'
  ]);

  // 3rd party dependencies.
  api.use([
    'commongarden:meshblu@1.30.1_1'
  ]);

  // Internal dependencies.
  api.use([
  ]);

  api.addFiles([
    'base.coffee'
  ], 'server');
});
