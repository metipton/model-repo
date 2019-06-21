import React from 'react';
import { Wave } from 'react-animated-text';

import classes from './BackdropUpload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const backdropUpload = (props) => (
    props.show ? <div className={classes.Backdrop} onClick={props.clicked}>
                    <div>      
                        <FontAwesomeIcon className={classes.UploadInProgress} icon={['fas','spinner']} spin size="4x" />
                        <div className={classes.UploadText}>
                            <Wave  
                                text="Uploading Model..."   
                                effect="verticalFadeIn"
                                effectDirection="right"
                                effectChange={1.0} />
                        </div>
                    </div>
                </div> : null
);

export default backdropUpload;