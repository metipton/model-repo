import React from 'react';
import classes from './SideDrawerEditor.css';
import paintbrush from './paintbrush.png';




const sideDrawerEditor = (props) => {
    return (
        <div className={classes["pure-container"]} data-effect="pure-effect-zoom">
            <input type="checkbox" id="pure-toggle-left" className={classes["pure-toggle"]} data-toggle="left"/>
            <label className={classes["pure-toggle-label"]} htmlFor="pure-toggle-left" data-toggle-label="left">
                <div 
                    className={classes["pure-toggle-icon-img"]}>   
                    <img src={paintbrush} />
                </div>
            </label>
            <div className={classes["pure-drawer"]} data-position="left">
                {props.children}
            </div>
        </div>
    );
};

export default sideDrawerEditor;
