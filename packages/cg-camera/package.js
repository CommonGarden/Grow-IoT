// TODO: if we make progress with this package, let's publish it on Atmosphere.
Package.describe({
  name: "cg-camera",
  summary: "Photos with one function call on desktop and mobile.",
  version: "1.0.0",
  git: "https://github.com/meteor/mobile-packages"
});

// Todo: check if this is up to date.
Cordova.depends({
  "cordova-plugin-camera": "2.0.0"
});

Package.onUse(function(api) {
  api.export('MeteorCamera');
  api.use(["templating", "session", "ui", "blaze", "less@1.0.0||2.0.0", "reactive-var"]);
  api.versionsFrom("METEOR@1.2");
  api.use("isobuild:cordova@5.2.0");

  api.addFiles('photo.html');
  api.addFiles('photo.js');
  api.addFiles("camera.less", ["web.browser"]);
  api.addFiles('photo-browser.js', ['web.browser']);
  api.addFiles('photo-cordova.js', ['web.cordova']);
});
