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
    'stylus'
  ]);

  // 3rd party dependencies.
  api.use([
    'kadira:flow-router@2.7.0',
    'kadira:blaze-layout@2.2.0'
  ]);

  // Internal dependencies.
  api.use([
    'ui-components',
    'core',
    'api'
  ]);

  api.addFiles([
    'flow-router/layout.html',
    'flow-router/layout.coffee',
    'flow-router/header.html',
    'flow-router/header.coffee',
    'flow-router/footer.coffee',
    'flow-router/footer.html',
    'flow-router/routes.coffee',
    'flow-router/style.styl'
  ], 'client');
});