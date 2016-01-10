Package.describe({
  summary: "A bootstrap slider control."
});

Package.on_use(function (api, where) {
  api.use('jquery');
  api.add_files(['./slider/css/slider.css', './slider/js/bootstrap-slider.js'], 'client');
});
