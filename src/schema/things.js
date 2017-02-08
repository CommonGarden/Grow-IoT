export const ThingSchema = [`
type thing {
  _id: String!
  uuid: String!
  token: String,
  owner: String,
  component: String,
  name : String,
  onlineSince: Boolean,
  properties: {
    state: String
  },
  registeredAt: Date
}
`,
];

