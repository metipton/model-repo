import React from 'react';
import PropTypes from "prop-types";
import ReactTooltip from 'react-tooltip'
import classes from './Thumb.css';

const Thumb = props => {
  return (
    <div className={props.classes}>
      <div data-tip='tooltip' data-for={props.cartNum.toString()}>
        <img src={props.src} alt={props.alt} title={props.title} />
        <ReactTooltip
            className={classes.opaque}
            id={props.cartNum.toString()}
            type="dark"
            effect="solid"
            place="left"
            border={true}
            > 
              <img src={props.lgSrc} alt={props.alt} />
        </ReactTooltip>
      </div>
    </div>
  );
};

Thumb.propTypes = {
  alt: PropTypes.string,
  title: PropTypes.string,
  classes: PropTypes.string,
  src: PropTypes.string.isRequired,
};

export default Thumb;