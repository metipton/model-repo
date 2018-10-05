import React from 'react';

import classes from './NavigationItem.css';

const navigationItem = ( props ) => (
    <li className={classes.NavigationItem}>
        <a
            href={props.link}
            target="_blank">{props.children}</a>
    </li>
);

export default navigationItem;
