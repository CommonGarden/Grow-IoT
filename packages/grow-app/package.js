Package.describe({
  name: 'grow-app',
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
    'peerlibrary:blaze-components@0.15.0'
  ]);

  // Internal dependencies.
  api.use([
  ]);

  api.addFiles([
    'main.html',
    'main.coffee',
    'body.html'
  ], 'client');
});
