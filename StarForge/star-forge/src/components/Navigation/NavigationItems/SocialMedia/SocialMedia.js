import React from 'react';

import classes from './SocialMedia.css';
import { SocialIcon } from 'react-social-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const SocialMedia = (props) => (
    <div className={classes.SocialMedia}>
        <div className={classes.Icon}>
            <FontAwesomeIcon icon={['fab', 'twitter']} size="1x" url="http://www.twitter.com"  />
        </div>
        <div className={classes.Icon}>
            <FontAwesomeIcon icon={['fab', 'facebook']} size="1x" url="http://www.facebook.com"  />
        </div>
        <div className={classes.Icon}>
            <FontAwesomeIcon icon={['fab', 'instagram']} size="1x" url="http://www.instagram.com"  />
        </div>
    </div>
);

export default SocialMedia;


/* <div>
<SocialIcon url="http://www.facebook.com" />
</div>
<div>
<SocialIcon url="http://www.twitter.com" />
</div>
<div>
<SocialIcon url="http://www.instagram.com" />
</div> */