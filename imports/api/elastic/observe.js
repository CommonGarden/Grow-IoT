import { queue } from '../events/eventBus';

const enqueueTask = function (id, type, collection, index) {
  const  task = {
    id,
    type,
    collection,
    index,
  };
  queue.enqueue('elastic', task, (err, job) => {
    console.log('enqueued:', job.data);
  });
};

// Rename to Eventbus?
export const elasticSync = (collection, index) => {
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

elasticSync(Events, 'event');
