import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Raphael from 'raphael';
import 'justgage';

class JustGauge extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode( this );

    this.guage = new JustGage({
      id: "guage",
      value: parseInt( this.props.value ),
      min: parseInt( this.props.min ),
      max: parseInt( this.props.max ),
      title: this.props.title,
      label: this.props.label
    });
  }

  componentWillReceiveProps( nextProps ) {
    if ( nextProps.value !== this.props.value ) {
      this.guage.refresh( nextProps.value );      
    }
    if ( nextProps.max !== this.props.max ) {
      this.guage.refresh( this.props.value, nextProps.max );      
    }
  }

  componentWillUnmount() {
    React.unmountComponentAtNode( this.node );
  }

  render() {
    return (
      <div id="guage" />
    );
  }
}

export default JustGauge;
