import { queue } from './queue';

const enqueueTask = function (id, type) {
  const  task = {
    id: id,
    type: type,
    collection: 'Events'
  };
  queue.enqueue('elastic', task, (err, job) => {
    // console.log('enqueued:', job.data);
  });
};
export const elasticSync = (collection) => {
  const cursor = collection.find({});
  cursor.observeChanges({
    added: function (id) {
      enqueueTask(id, 'added', collection._name);
    },
    changed: function (id) {
      enqueueTask(id, 'changed', collection._name);
    },
    removed: function (id) {
      enqueueTask(id, 'removed', collection._name);
    },
  });
};
