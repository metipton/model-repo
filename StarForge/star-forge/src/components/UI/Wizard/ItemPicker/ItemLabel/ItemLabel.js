import React, {Component} from 'react';

import classes from './ItemLabel.css';
import image from "../icons/Back.png"

class ImageLabel extends Component{ 
    state = {

    }

    constructor(props) {
        super(props);
        this.state = {        
            width: 64,
            height: 32};
        this.onImgLoad = this.onImgLoad.bind(this);
    }

    onImgLoad({target:img}) {
        this.setState({
            height: img.naturalHeight,
            width: img.naturalWidth}, () => {
                console.log(this.state);
            });
        
    }

    render(){

        return (
            <div>
                <img style={{
                    width: (this.state.width / 2),
                    height: this.state.height
                    }}
                    src={this.props.url}/>
            </div>

       );
    }
  }

  export default ImageLabel;