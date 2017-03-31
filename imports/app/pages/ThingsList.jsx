import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
// import { createContainer } from 'meteor/react-meteor-data';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import ThingDisplay from '../components/ThingDisplay.jsx';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class ThingsList extends Component {
  componentWillMount() {
    // this.subThings();
  }
  subThings(){
    // Meteor.subscribe('Things.list');
  }
  render () {
    const Things = this.props.Things || [];
    return (
      <div className="layout horizontal wrap">
        {
          Things.map((v, k) => {
            return (
              <ThingDisplay key={k}
                thing={v}
              />
            )
          })
        }
      </div>
    )
  }
}
ThingsList.propTypes = {
  Things: React.PropTypes.array,
  hasErrors: React.PropTypes.bool,
  refetch: React.PropTypes.func,
  loading: React.PropTypes.bool,
}
const GET_THINGS_DATA = gql`query allThings($limit: Int, $skip: Int){
  allThings(limit: $limit, skip: $skip) {
    _id
    uuid
    token
    owner
    component
    name
    properties {
      state
    }
    registeredAt
  }
}`
const withData = graphql(GET_THINGS_DATA, {
  // destructure the default props to more explicit ones
  props: ({ data: { error, loading, allThings, refetch } }) => {
    if (loading) return { loading: true };
    if (error) return { hasErrors: true };

    return {
      Things: allThings,
      refetch,
    };
  },
});
export default withData(ThingsList);
// export default ThingsListContainer= createContainer(({ user }) => {
// return {
// Things: Things.find().fetch(),
// }
// }, ThingsList);
