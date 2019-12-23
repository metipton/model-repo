
import React from 'react';

import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { withStyles } from '@material-ui/core';

const styles = {
  root: {
    backgroundColor: '#BFD8D2',
    borderRadius: 3,
    border: 0,
    height: '3rem',
    width: '12rem',
    padding: '0 30px',
    color:'white',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    '&selected':{
      backgroundColor: '#DF744A'
    }
  },
  selected: {
    backgroundColor: '#DF744A'
  }
};

function CharacterSelector(props) {
  const {classes} = props;
  const [alignment, setAlignment] = React.useState(1);

  const handleChange = (event, character) => {
    if(character === null){
      return;
    }
    setAlignment(character);
    props.setChar(character);
  };

  const children = [
    <ToggleButton className={classes.root} size="large" key={1} value={1}>
      <span>Character 1</span>
    </ToggleButton>,
    <ToggleButton className={classes.root} size="large" key={2} value={2}>
      <span>Character 2</span>
    </ToggleButton>,
  ];

  return (
    <Grid  container spacing={8} direction="column" alignItems="center">
      <Grid  item>
        <ToggleButtonGroup  size="large" value={alignment} exclusive onChange={handleChange}>
          {children}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(CharacterSelector);