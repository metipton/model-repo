import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import TextField from '@material-ui/core/TextField';




const styles = theme => ({
  paper: {
      display: 'inline-block',
      width: '40%',
      marginLeft:'-20%',
      left: '50%',
      opacity: .5,
      backgroundColor: '#5d809d',
      overflow: 'hidden',
      borderRadius: '10px'
  },
  container: {
    position: 'absolute',
    marginLeft:'-50px',
    left: '50%',
    bottom: 0,
  },
  button: {
    width:'200px',
    height: '20px',
    backgroundColor: '#a8a8a8',
    opacity: '.5'
  },
  buttonInvis: {
    width:'200px',
    height: '20px',
    backgroundColor: '#a8a8a8',
    opacity: 0
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  drawer: {
    display: 'inline-block',
    zIndex: 9999999
  },
  textField: {
    padding: 5,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 150,
  },
});

class TemporaryDrawer extends React.Component {
  state = {
    bottom: false,
    name: '',
  };

  handleChange = name => event => {
    this.setState({
      bottom: true,
      [name]: event.target.value,
    });
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { classes } = this.props;
    const fullList = (
        <div className={classes.drawer}>
            <div className={classes.closeButton}>
                <IconButton onClick={this.toggleDrawer('bottom', false)}>
                    <DownIcon />
                </IconButton>
            </div>
            <TextField
                id="standard-name"
                label=" Hero Name"
                className={classes.textField}
                value={this.props.name}
                onChange={this.props.changeName('modelName')}
                />
        </div>
    );

    let buttonClass = !this.state.bottom ? classes.button : classes.buttonInvis;

    return (
      <div className={classes.container}>
        <Button className={buttonClass} onClick={this.toggleDrawer('bottom', true)}>
            Options
            <UpIcon />
        </Button>
            
        <Drawer
          classes={{
              paper: classes.paper
          }}
          variant="persistent"
          anchor="bottom"
          open={this.state.bottom}
          onClose={this.toggleDrawer('bottom', false)}
        >
            {fullList}
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TemporaryDrawer);