
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import zIndex from '@material-ui/core/styles/zIndex';

const styles = ()=> ({
  root: {
    position: 'fixed',
    marginTop: '2rem',
    zIndex: '100000',
  },
  formControl: {
    position: 'fixed',
    marginTop: '2rem',
    zIndex: '100000',
  },
  group: {
    position: 'fixed',
    marginTop: '2rem',
    zIndex: '100000',
  },
}) ;

function CharSelectButton(props) {
  const classes = styles;


  const [char1, setValue1] = React.useState('female');
  const [char2, setValue2] = React.useState('male');
  function handleChange1(event) {
    setValue1(event.target.value);
    props.setChar(1);
  }

  function handleChange2(event) {
      setValue2(event.target.value);
      props.setChar(2);
  }

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Char 1</FormLabel>
        <RadioGroup
          aria-label="Gender"
          name="gender1"
          className={classes.group}
          value={char1}
          onClick={handleChange1}
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Char 2</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender2"
          className={classes.group}
          value={char2}
          onClick={handleChange2}
        >
          <FormControlLabel
            value="female"
            control={<Radio color="primary" />}
            label="Female"
            labelPlacement="start"
          />
          <FormControlLabel
            value="male"
            control={<Radio color="primary" />}
            label="Male"
            labelPlacement="start"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}


export default withStyles(styles)(CharSelectButton);