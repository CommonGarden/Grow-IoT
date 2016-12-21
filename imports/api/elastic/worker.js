import elasticsearch from 'elasticsearch';
import db from 'mongodb';
import { client, MONGO_URL } from './queue';
const ELASTIC_URL = process.env.ELASTIC_URL || 'localhost:9200';
const esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

const MongoClient = db.MongoClient; 
// Connection URL 
// Use connect method to connect to the Server 
const worker = client.worker(['eventsqueue']);

worker.register({
  elastic: function (params, callback) {
    try {
      processParams(params);
      callback(null, params);
    } catch (err) {
      callback(err);
    }
  }
});

worker.start();
worker.on('complete', function (data) {
  // console.log(data);
});
worker.on('failed', function (err) {
  // console.log(err);
});
function processParams(params) {
console.log(params);
  switch(params.type) {
    case 'added', 'changed':
      MongoClient.connect(MONGO_URL, function(err, db) {
        added(db, params.id, params.collection, params.index);
      });

      break;
    case 'removed': 
      removed(params.id, params.collection, params.index);
      break;
    default:
      break;
  }

}
// Worker APP
function added(db, id, collection, index) {
  // query MongoDB for the document
  console.log(id);
  db.collection(collection).find({_id: id}).toArray(
    function (err, docs) {
      // index data on elasticsearch
      const _doc = _.omit(docs[0], '_id');
      esClient.index({
        index,
        type: collection,
        id,
        body: _doc // because there's only one doc
      });
    }
  )
}
// changed is same as add
// function changed(db, esClient, id, collection)
function removed(id, collection, index) {
  esClient.delete({
    index,
    type: collection,
    id,
  });
}
