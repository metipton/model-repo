import React from 'react';

import classes from './NavigationItem.css';

const navigationItem = ( props ) => (
    <li className={classes.NavigationItem}>
        <a
            href={props.link}
            target="_blank"
            rel="noopener noreferrer">{props.children}</a>
    </li>
);

export default navigationItem;
