Package.describe({
  name: 'images',
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
    'peerlibrary:blaze-components@0.15.0',
    'kadira:flow-router@2.7.0',
    'cfs:standard-packages',
    'cfs:gridfs',
    'cfs:filesystem'
  ]);

  // Internal dependencies.
  api.use([
    'ui-components',
    'core',
    'api',
    'session',
    'jquery'
  ]);

  api.export('Images');

  api.addFiles([
    'common.js'
  ]);

  api.addFiles([
    'server.js'
  ], 'server');

  api.addFiles([
    'images.coffee',
    'images.html'
  ], 'client');
});