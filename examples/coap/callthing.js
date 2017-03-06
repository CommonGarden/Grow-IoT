const coap = require('coap');

var req = coap.request('coap://localhost/turn_light_on');

req.on('response', function(res) {
  res.pipe(process.stdout)
})

req.end()