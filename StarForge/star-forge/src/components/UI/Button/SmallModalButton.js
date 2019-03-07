import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    width: '6rem',
  },
  button: {
    margin: theme.spacing.unit,
    width: '12rem',
    textAlign: 'center',
    opacity: '1',    
    width: '6rem',
    float: 'left',
    marginRight: '.4rem'
  },
  input: {
    display: 'none',
  },
});

function ContainedButtons(props) {
  const { classes } = props;
  return (
    <div>
      <Button
          disabled={props.disabled}
          variant={props.variant}
          color={props.color} 
          className={classes.button}
          onClick={props.clicked}>
        {props.children}
      </Button>
    </div>
  );
}

ContainedButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContainedButtons);