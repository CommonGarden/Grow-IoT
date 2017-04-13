export const MONGO_URL = process.env.MONGO_URL;
import monq from 'monq';
export const client = monq(MONGO_URL);
export const queue = client.queue('eventsqueue');

// A work in progress...

const enqueueTask = function (id, type, collection, index) {
  const task = {
    id,
    type,
    collection,
    index,
  };
  queue.enqueue('events', task, (err, job) => {
    if (err) {throw err}
  });
};

const EventBus = (collection, index) => {
  const cursor = collection.find({});
  cursor.observeChanges({
    added: function (id) {
      enqueueTask(id, 'added', collection._name, index);
    },
    changed: function (id) {
      enqueueTask(id, 'changed', collection._name, index);
    },
    removed: function (id) {
      enqueueTask(id, 'removed', collection._name, index);
    },
  });
};

const worker = client.worker(['eventsqueue']);

worker.register({
	events: function (params, callback) {
	  try {
	    switch(params.type) {
			  case 'added':
			    added(params.id, params.collection, params.index);
			    break;
			  case 'removed': 
			    removed(params.id, params.collection, params.index);
			    break;
			  default:
			    break;
			}
	    callback(null, params);
	  } catch (err) {
	    callback(err);
	  }
	}
});

worker.start();

function added(id, collection, index) {
// query MongoDB for the document
}

function removed(id, collection, index) {
	//
}
