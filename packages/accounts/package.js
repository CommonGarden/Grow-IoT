Package.describe({
  name: 'accounts',
  version: '0.1.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2');

  // Core dependencies.
  api.use([
    'coffeescript',
    'underscore',
    'accounts-base',
    'accounts-password',
    'fourseven:scss',
    'ecmascript'
  ]);

  // 3rd party dependencies.
  api.use([
    'kadira:flow-router@2.7.0',
    'kadira:blaze-layout@2.2.0',
    'themeteorchef:jquery-validation'
  ]);

  // Internal dependencies.
  api.use([
    'ui-components',
    'core',
    'api',
    'session'
  ]);

  // Client files
  api.addFiles([
    'client/account-page.coffee',
    'client/account-page.html',
    'client/routes.coffee',
    'client/sign-in-or-up.coffee',
    'client/sign-in-or-up.html',
    'client/reset-password.coffee',
    'client/reset-password.html'
  ], 'client');

  // Server files
  api.addFiles([
    'server/account-creation.coffee',
    'server/reset-password.coffee',
    'server/startup.coffee'
  ], 'server');
});

