// test_server.js
const coap = require('coap');

coap.createServer(function(req, res) {
  res.end('Hello ' + req.url.split('/')[1] + '\n')
}).listen();