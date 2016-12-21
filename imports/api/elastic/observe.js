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
const cursor = Events.find({});
cursor.observeChanges({
  added: function (id) {
    enqueueTask(id, 'added');
  },
  changed: function (id) {
    enqueueTask(id, 'changed');
  },
  removed: function (id) {
    enqueueTask(id, 'removed');
  },
});
