import React from 'react';

import classes from './SocialMedia.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const SocialMedia = (props) => (
    <div className={classes.SocialMedia}>
        <a href="https://www.twitter.com" name="twitter" target="_blank" rel="noopener noreferrer" className={classes.Icon}>
            <FontAwesomeIcon icon={['fab', 'twitter']} size="1x"  />
        </a>
        <a href="https://www.facebook.com" name="facebook" target="_blank" rel="noopener noreferrer" className={classes.Icon}>
            <FontAwesomeIcon icon={['fab', 'facebook']} size="1x" />
        </a>
        <a href="https://www.instagram.com" name="instagram" target="_blank" rel="noopener noreferrer" className={classes.Icon}>
            <FontAwesomeIcon icon={['fab', 'instagram']} size="1x" />
        </a>
    </div>
);

export default SocialMedia;
