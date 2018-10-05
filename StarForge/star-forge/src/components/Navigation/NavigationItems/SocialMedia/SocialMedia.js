import React from 'react';

import classes from './SocialMedia.css';
import { SocialIcon } from 'react-social-icons';

const SocialMedia = (props) => (
    <div className={classes.SocialMedia}>
        <div>
            <SocialIcon url="http://www.facebook.com" />
        </div>
        <div>
            <SocialIcon url="http://www.twitter.com" />
        </div>
        <div>
            <SocialIcon url="http://www.instagram.com" />
        </div>
    </div>
);

export default SocialMedia;
