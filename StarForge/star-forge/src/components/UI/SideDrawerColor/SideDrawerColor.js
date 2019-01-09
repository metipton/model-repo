import React from 'react';
import classes from './SideDrawerColor.css';
import ColorPicker from 'coloreact';
import paintbrush from './paintbrush.png';




const sideDrawerColor = (props) => {
    return (
        <div className={classes["pure-container"]} data-effect="pure-effect-zoom">
            <input type="checkbox" id="pure-toggle-left" className={classes["pure-toggle"]} data-toggle="left"/>
            <label className={classes["pure-toggle-label"]} htmlFor="pure-toggle-left" data-toggle-label="left">
                <div 
                    onClick={props.toggleColor}
                    className={classes["pure-toggle-icon-img"]}>   
                    <img src={paintbrush} alt="paintbrush"/>
                </div>
            </label>
            <div className={classes["pure-drawer"]} data-position="left">
                <ColorPicker color="408fa3" onChange={color => props.setColor(color.hex)}/> 
            </div>
        </div>
    );
};

export default sideDrawerColor;
