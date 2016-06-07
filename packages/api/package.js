Package.describe({
  name: 'api',
  version: '0.1.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2');

  Npm.depends({
    'mime-types': '2.1.6'
  });

  // Core dependencies.
  api.use([
    'coffeescript',
    'random',
    'ecmascript'
  ]);

  // 3rd party dependencies.
  api.use([
    'peerlibrary:middleware@0.1.1',
    'peerlibrary:reactive-publish@0.1.3',
    'peerlibrary:check-extension@0.2.0',
    'peerlibrary:assert@0.2.5',
    'fermuch:cheerio@0.19.0',
    'peerlibrary:meteor-file@0.2.1'
  ]);

  // Internal dependencies.
  api.use([
    'core'  
  ]);

  api.addFiles([
    'device/methods.js',
    'environment/methods.js',
    'notifications/methods.js',
    'thing/methods.js'
  ]);

  api.addFiles([
    'device/publish.coffee',
    'device/server-methods.js',
    'data/publish.js',
    'environment/publish.js',
    'notifications/publish.js',
    'thing/publish.js'
  ], 'server');
});
