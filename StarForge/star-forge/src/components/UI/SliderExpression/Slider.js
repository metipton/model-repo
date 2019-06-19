import React, { Component } from 'react';
import Slider from 'react-slider-simple';
 
export default class SliderComp extends Component {
  state  = {
    percent: 0,
  }
 
  onChange = (percent) => {
    this.setState({ percent });
    if(Math.abs(percent - this.props.morphPercents.expression[this.props.name]['percent']) >= 3){
      this.props.updateExpression(this.props.name, percent);  
    }
  }
  onDone = (percent) => {
  };

  componentDidMount () {
      this.setState({percent: this.props.startVal})
  }
 
  render() {
    
    return (
        <Slider
          value={this.state.percent}
          rounded={true}
          onChange={this.onChange}
          thumbColor="rgb(255, 165, 0)"
          shadowColor="rgb(255, 165, 0)"
          sliderPathColor="rgb(255, 217, 159)"
        />
    );
  }
}