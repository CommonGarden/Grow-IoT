import Influx from 'influx';
import { Meteor } from 'meteor/meteor';

const INFLUX_URL = process.env.METEOR_SETTINGS ? JSON.parse(process.env.METEOR_SETTINGS).INFLUX_URL : false;

console.log('Influx URL: ' + INFLUX_URL);

if (INFLUX_URL) {
  // See: https://www.npmjs.com/package/influx
  // See: https://docs.influxdata.com/influxdb/v1.2/concepts/schema_and_data_layout/
  const influx = new Influx.InfluxDB({
    host: INFLUX_URL,
    database: 'events',
    schema: [
      {
        measurement: 'events',
        fields: {
          value: Influx.FieldType.FLOAT,
          message: Influx.FieldType.STRING,
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
    console.error(err);
  })

  export default influx;
}

