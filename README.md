# graphql-schema
grow-iot graphQL schema

```js
import executableSchema from 'grow-graphql-api';

config = {
  database: 'mongodb://localhost:3001/meteor',
}
validate = {
  allThings(root, args, context) {
   // do validation of allThings query
  },
  // similarly allEvents,getThing,getEvent
}
const schema = executableSchema({ config, validate });

/*
....
*/

app.use('/graphql', graphqlExpress((req) => {
  // Get the query, the same way express-graphql does it
  // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    // None of our app's queries are this long
    // Probably indicates someone trying to send an overly expensive query
    throw new Error('Query too large.');
  }

  return {
    schema,
    context: {
    },
  };
}));
```
