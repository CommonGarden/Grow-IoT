Package.describe({
  name: 'core',
  version: '0.1.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2');

  // Core dependencies.
  api.use([
    'coffeescript',
    'accounts-password',
    'ddp-client',
    'underscore',
    'ecmascript'
  ]);

  // 3rd party dependencies.
  api.use([
    'peerlibrary:peerdb@0.19.3',
    'cfs:standard-packages',
    'cfs:gridfs',
    'cfs:filesystem'
  ]);

  // Internal dependencies.
  api.use([
  ]);

  api.export('User');
  api.export('Device');
  api.export('Data');
  api.export('Component');
  api.export('Environment');
  api.export('Notifications');
  api.export('Plant');
  api.export('Images');
  api.export('Message', 'server');

  api.addFiles([
    'base.coffee',
    'documents/user.coffee',
    'documents/environment.coffee',
    'documents/device.coffee',
    'documents/data.coffee',
    'documents/notifications.coffee',
    'documents/plant.coffee',
    'documents/images.coffee',
    'documents/component.coffee',
    'finalize-documents.coffee'
  ]);

  api.addFiles([
    'documents/messages.coffee'
  ], 'server');
});