let hypercore = require('hypercore');

let feed = hypercore('./data', {valueEncoding: 'utf-8'});
feed.on('ready', ()=> {
    console.log(feed.key);
})
