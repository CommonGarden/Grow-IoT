const coap  = require('coap')
    , req   = coap.request({
                observe: true
              })

req.on('response', function(res) {
  res.pipe(process.stdout)
})

req.end()
