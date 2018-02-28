const http = require('http');

/**
 * Create http server
 */
exports.listen = (options) => {
    this.server = http.createServer((req, res) => {
        var urlParts = url.parse(req.url, true);

        try {
            // Remove slashes from path.
            let method = urlParts.pathname.replace(/\//g, '');

            if (method === 'set') {
                // should be called with a key, value query
                let key = urlParts.query.key;
                let value = urlParts.query.value;
                this.set(key, value);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ key: value }));
            } else if (method === 'get') {
                let key = urlParts.query.key;
                let property = this.get(key);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ value: property }));
            } else {
                var output = this.call(method, req.payload.toString());
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ output }));
            }
        } catch (error) {
            console.log(error);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(error);
        }
    }).listen(options);
}
