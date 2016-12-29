import elasticsearch from 'elasticsearch';
import MongoDriver from 'mongodb';
import { client, MONGO_URL } from '../eventbus';

const ELASTIC_URL = process.env.ELASTIC_URL;

if (ELASTIC_URL) {
  const esClient = new elasticsearch.Client({
    host: ELASTIC_URL
  });

  const MongoClient = MongoDriver.MongoClient; 
  const esSync = {};
  MongoClient.connect(MONGO_URL, function(err, db) {
    esSync.db = db;
  });

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

  function processParams(params) {
    console.log(params)
    switch(params.type) {
      case 'added':
        added(params.id, params.collection, params.index);
        break;
      case 'added':
        added(params.id, params.collection, params.index);
        break;
      case 'removed': 
        removed(params.id, params.collection, params.index);
        break;
      default:
        break;
    }

  }

  function added(id, collection, index) {
    // query MongoDB for the document
    esSync.db.collection(collection).find({_id: id}).toArray(
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

  function removed(id, collection, index) {
    esClient.delete({
      index,
      type: collection,
      id,
    });
  }
}
