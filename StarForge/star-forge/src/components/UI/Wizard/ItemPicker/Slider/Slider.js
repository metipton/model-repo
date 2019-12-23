import React, { Component } from 'react';

import Slide from '../Slide/Slide'
import LeftArrow from '../Arrows/LeftArrow'
import RightArrow from '../Arrows/RightArrow'

export default class Slider extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  goToPrevSlide = () => {
    
  }
  
  goToNextSlide = () => {
    
  }

  render() {
    return (
      <div className="slider">
				<Slide/>
        <LeftArrow goToPrevSlide={this.goToPrevSlide} />
        <RightArrow goToNextSlide={this.goToNextSlide}  />
      </div>
    );
  }
}