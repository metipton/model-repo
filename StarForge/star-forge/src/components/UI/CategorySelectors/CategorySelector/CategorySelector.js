import React from 'react';

import classes from './CategorySelector.css';

const categorySelector = (props) => (
    <div

        className={props.backgroundActive ? classes.CategorySelectorSelected : classes.CategorySelector}
        title={props.title}
        onClick={() => props.clicked(props.title)}>
            <img className={classes.image} src={props.src} alt={props.title}/>
            <span className={classes.text}>{props.title}</span>
    </div>
);

export default categorySelector;
