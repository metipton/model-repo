import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button/';

const styles = theme => ({
  root: {
    width: '500px',
  },
  button: {
    margin: theme.spacing.unit,
    width: '500px',
    textAlign: 'center'
  },
  input: {
    display: 'none',
  },
});

function addToCartButton(props) {
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

addToCartButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(addToCartButton);
