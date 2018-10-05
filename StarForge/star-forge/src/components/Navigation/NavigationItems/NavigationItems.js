import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';
import Divider from '@material-ui/core/Divider';
import SocialMedia from './SocialMedia/SocialMedia';

const navigationItems = ( props ) => (
    <div className={classes.NavigationItems}>
        <div className={classes.NavigationItem}>
            <NavigationItem link="/about" exact>About</NavigationItem>
        </div>
        <Divider/>
        <div className={classes.NavigationItem}>
            <NavigationItem link="/faq" exact>FAQ</NavigationItem>
        </div>
        <Divider/>
        <div className={classes.NavigationItem}>
            <NavigationItem link="/ToS" exact>Copyright and Terms</NavigationItem>
        </div>
        <Divider/>
        <div className={classes.NavigationItem}>
            <NavigationItem link="/shipping" exact>Shipping and Return</NavigationItem>
        </div>
        <Divider/>
        <div className={classes.NavigationItem}>
            <NavigationItem link="/materials" exact>Materials and Pricing</NavigationItem>
        </div>
        <Divider/>
        <div className={classes.NavigationItem}>
            <NavigationItem link="/privacy" exact>Privacy Policy</NavigationItem>
        </div>
        <Divider/>
        <div>
            <SocialMedia />
        </div>
    </div>
);

export default navigationItems;
