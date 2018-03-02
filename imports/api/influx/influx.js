import Influx from 'influx';
import { Meteor } from 'meteor/meteor';

let INFLUX_URL = 'ec2-34-214-153-209.us-west-2.compute.amazonaws.com';
console.log(process.env);

if (INFLUX_URL) {
  console.log('Influx URL: ' + INFLUX_URL);

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
      console.log(names);
      if (!names.includes('events')) {
      return influx.createDatabase('events');
    }
  })
  .catch(err => {
    console.error(err);
  })

  export default influx;
}

