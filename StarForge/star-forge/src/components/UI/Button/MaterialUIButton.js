import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
  },
  button: {
    margin: theme.spacing.unit,
    textAlign: 'center',
    opacity: '.8'
  },
  input: {
    display: 'none',
  },
  label: {
  }
});

function ContainedButtons(props) {
  const { classes } = props;
  return (
    <div>
      <Button
          disabled={props.disabled}
          variant={props.variant}
          color={props.color} 
          classes={{
            root: classes.button,
            label: classes.label}}
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
