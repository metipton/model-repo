import React, { Component } from 'react';
import Slider from 'react-slider-simple';
 
export default class SliderComp extends Component {
  state  = {
    percent: 30,
  }
 
  onChange = (percent) => {
    this.props.updateBodyTarget(this.props.name, percent);
    this.setState({ percent });
  }
  onDone = (percent) => {
  };

  componentDidMount () {
      this.setState({percent: this.props.startVal})
  }
 
  render() {
    let percent;
    if(this.props.morphPercents !== undefined){
      percent = this.props.morphPercents.body[this.props.name]['percent'];
    } else {
      percent = this.state;
    }
    return (
        <Slider
          value={percent}
          onChange={this.onChange}
          thumbColor="rgb(255, 165, 0)"
          shadowColor="rgb(255, 165, 0)"
          sliderPathColor="rgb(255, 217, 159)"
        />
    );
  }
}