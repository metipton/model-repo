import React from 'react';
import classes from './SideDrawerColor.css';
import ColorPicker from 'coloreact';


const sideDrawerColor = (props) => {
    let attachedClasses = [classes.SideDrawerColor, classes.Open];
    return (
            <div className={attachedClasses.join(' ')}  >
                <ColorPicker color="#408fa3" onChange={color => props.setColor(color.hex)} />
            </div>
    );
};

export default sideDrawerColor;
