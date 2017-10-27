export const ThingSchema = [`
type thingProps {
    state: String
}
scalar Date
type Thing {
  _id: String!
  uuid: String!
  token: String,
  owner: String,
  component: String,
  name : String,
  onlineSince: Boolean,
  properties: thingProps,
  registeredAt: Date
}
`,
];

