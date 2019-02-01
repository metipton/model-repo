import React from 'react';

import classes from './Tooltip.css';

const Tooltip = (props) => (
    <div className={classes.tooltip}>
        <img className={classes.tooltiptext} src={props.src} alt="tooltipper" />
    </div>
);

export default Tooltip;