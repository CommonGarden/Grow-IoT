import esClient from 'elasticsearch';
import { client } from './queue';

const worker = client.worker(['eventsqueue']);

worker.register({
  elastic: function (params, callback) {
    try {
      // switch(params.type) {
        // case 'added', 'changed':
          added(params.id, params.collection);
          // break;
        // case 'removed': 
          // removed(params.id, params.collection);
          // break;
        // default:
          // break;
      // }
      callback(null, params);
    } catch (err) {
      callback(err);
    }
  }
});

worker.start();
worker.on('complete', function (data) {
  console.log(data);
});
worker.on('failed', function (err) {
  console.log(err);
});
// Worker APP
function added(id, collection) {
  // query MongoDB for the document
  const doc = Events.findOne({_id: id});
  // index data on elasticsearch
  esClient.index({
    index: collection,
    type: collection,
    id: id,
    body: docs // because there's only one doc
  });
}
// changed is same as add
// function changed(db, esClient, id, collection)
function removed(id, collection) {
  esClient.delete({
    index: collection,
    type: collection,
    id: id,
  });
}
