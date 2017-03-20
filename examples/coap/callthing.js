const coap = require('coap');

var req = coap.request('coap://localhost/turn_on');

req.on('response', function(res) {
  res.pipe(process.stdout)
})

req.end()

var req2 = coap.request('coap://localhost/get?key=state');

req2.on('response', function(res2) {
  res2.pipe(process.stdout)
});

req2.end();
