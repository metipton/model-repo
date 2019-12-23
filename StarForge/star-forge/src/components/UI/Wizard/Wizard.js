import React, {Component} from 'react';

import classes from './Wizard.css';
import ModeSelector from './ModeSelector/ModeSelector'
import PoseMode from './PoseMode/PoseMode';
import AccessorizeMode from './AccessorizeMode/AccessorizeMode';

class Wizard extends Component{

    state = {
      selected: 'Pose',
      itemPicker: "Chest"
    };

    handleChange = panel => {
      console.log(panel);
      this.setState({
        'selected': panel
    }, update => {
    });
    };

    updateItemPicker = (selection) => {
      this.setState({
        ...this.state,
        itemPicker: selection
      })
    }

   

    render (){
      let selection;
      
      switch(this.state.selected) {
        case 'Pose':
          selection = (
            <PoseMode 
              setGender={this.props.setGender}
              state={this.props.state}
              updateSelection={this.props.updatePose}
              updateHeight={this.props.updateHeight}/> 
          );
          break;
        case 'Accessorize':
          selection = (
            <AccessorizeMode
              state={this.props.state}  
              setChar={this.props.setChar}
              setColor={this.props.setColor}
              updateGlove={this.props.updateGlove}
              setGloveLink={this.props.setGloveLink}
              updateFeet={this.props.updateFeet}
              setFeetLink={this.props.setFeetLink}
              updateSelection={this.props.updateObject}
              updatePicker={this.updateItemPicker}
              itemPicker={this.state.itemPicker}/> 
          );
          break;
        case 'Customize':
          selection = null;
          break;
        default:
          selection = null;
      }

        return (
                <div className={classes.Wizard}>
                      <ModeSelector  handleChange={(mode)=>this.handleChange(mode)}/>
                      {selection}
                </div>
        );
    }
}


export default Wizard;
