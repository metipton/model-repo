import React, { Component } from 'react';
import Slider from 'react-slider-simple';
 
export default class SliderComp extends Component {
  state  = {
    percent: 30,
  }
 
  onChange = (percent) => {
    this.setState({ percent });
    if(Math.abs(percent - this.props.morphPercents.body[this.props.name]['percent']) >= 3){
      this.props.updateBodyTarget(this.props.name, percent);  
    }

  }
  onDone = (percent) => {
  };

  componentDidMount () {
      this.setState({percent: this.props.startVal})
  }
 
  render() {
    let percent = this.state.percent;

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