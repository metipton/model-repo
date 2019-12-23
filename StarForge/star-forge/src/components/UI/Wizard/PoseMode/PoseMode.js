
import React from 'react';

import GenderSelectButton from './GenderSelectButton';
import HeightSelector from './HeightSelector';
import classes from './PoseMode.css'
import PoseEditor from '../../Editor/PoseEditor/PoseEditor'



function PoseMode(props) {

  // const [alignment, setAlignment] = React.useState('Pose');

  // const handleChange = (event, newAlignment) => {
  //   setAlignment(newAlignment);
  // };

  return (
    <div>
        <div className={classes.CharSelect}>
            <GenderSelectButton
                setGender={props.setGender}/>
            <div>Relative Height</div>
            <HeightSelector setHeight={props.updateHeight}/>
            <PoseEditor 
                state={props.state}
                updateSelection={props.updateSelection}/>
        </div>
    </div>
  );
}

export default (PoseMode);