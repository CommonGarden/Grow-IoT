import Influx from 'influx';
import { Meteor } from 'meteor/meteor';

const INFLUX_URL = process.env.METEOR_SETTINGS ? JSON.parse(process.env.METEOR_SETTINGS).INFLUX_URL : false;

// TODO: think more about schemas etc... and reorganize code...
// https://docs.influxdata.com/influxdb/v1.2/concepts/schema_and_data_layout/

if (INFLUX_URL) {
  // See https://www.npmjs.com/package/influx
  const influx = new Influx.InfluxDB({
    host: INFLUX_URL,
    database: 'events',
    schema: [
      {
        measurement: 'events',
        fields: {
          value: Influx.FieldType.FLOAT
        },
        tags: [
          'thing', 'environment', 'type'
        ]
      }
    ]
  });

  influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('events')) {
      return influx.createDatabase('events');
    }
  })
  .catch(err => {
    console.error(`Error creating Influx database! Be sure you are using an INFLUX_URL environment variable or hosting an instance locally.`);
  })

  export default influx;
}

