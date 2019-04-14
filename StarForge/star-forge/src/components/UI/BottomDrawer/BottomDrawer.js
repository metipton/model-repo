import React from 'react';
import {connect} from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {saveInProgress, saveComplete} from '../../../store/actions/index';




const styles = theme => ({
  paper: {
      zIndex: 99,
      borderWidth: '.125rem',
      borderStyle: 'solid',
      borderColor: '#FFA500',
      display: 'inline-block',
      width: '35rem',
      marginLeft:'-17.5rem',
      left: '50%',
      opacity: .8,
      backgroundColor: '#d9dbde',
      overflow: 'hidden',
      borderRadius: '10px'
  },
  container: {
    verticalAlign: 'middle',
    position: 'absolute',
    marginLeft:'-100px',
    left: '50%',
    bottom: 0,
  },
  button: {
    width:'200px',
    height: '20px',

    backgroundColor: '#a8a8a8',
    opacity: '.8'
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
    display: 'flex',
    justifyContent: 'flex-start',
    zIndex: 99
  },
  textField: {
    color: '#FFA500',
    padding: '.3rem',
    marginTop: '.5rem',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '6rem',
  },
  textFieldColor: {
    color: '#06437A'
  },
  innerButtons: {
    cursor: 'pointer',
    boxSizing: 'border-box',
    width: '6.25rem',
    textAlign: 'center',
    color: '#06437A',
    padding: '.3rem',
    marginLeft: 0,
    marginRight: 0,
    transition: '.3s',
    '&:hover':{
      backgroundColor: '#FFA500',
      color: '#06437A'
    },
  },
  icon: {
    marginTop: '.4rem'
  },
  saveInProgress: {
    marginTop: '.4rem',
    color: 'darkgrey'
  },
  innerSpan: {
    display: 'block',
    margin: '.4rem',
  },
  label:{
    color: '#06437A',
    fontWeight: 'bold',
    height: '.66rem'
  }
});

class TemporaryDrawer extends React.Component {
  state = {
    bottom: false,
    name: '',
    saving: false
  };

  handleChange = name => event => {
    this.setState({
      ...this.state,
      bottom: true,
      [name]: event.target.value,
    });
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      ...this.state,
      [side]: open,
    });
  };

  saveHero = () => {
    try{
      this.props.saveInProgress();
      this.props.saveHero();
    } catch (error) {
      console.log(error);
      this.props.saveComplete();
    }

  }

  render() {
    const { classes } = this.props;
    let saveImage = (
        <div className={classes.innerButtons} onClick={this.saveHero}>
          <FontAwesomeIcon className={classes.icon} icon={['fas', 'save']} size="1x" />
          <span className={classes.innerSpan}>
            Save
          </span>
        </div >
        
    );
    if(this.props.savingModel){
      saveImage = (
        <div className={classes.innerButtons}>
          <FontAwesomeIcon className={classes.saveInProgress} icon={['fas','sync']} spin size="1x" />
          <span className={classes.innerSpan}>
            Save
          </span>
        </div >  
      );
    }

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
                InputProps={{
                  classes: {
                    input: classes.textFieldColor,
                  },
                }}
                value={this.props.name}
                onChange={this.props.changeName('modelName')}
                />
            {saveImage}
            <div className={classes.innerButtons}
              onClick={this.props.shareHero}>
              <FontAwesomeIcon className={classes.icon} icon={['fas', 'share']} size="1x" />
               <span className={classes.innerSpan}>
                Share
              </span>   
            </div>
            <div className={classes.innerButtons}
              onClick={this.props.openSavedHeroModal}>     
              <FontAwesomeIcon className={classes.icon} icon={['fas', 'folder']} size="1x" />
              <span className={classes.innerSpan}>
                Models
              </span>  
            </div> 
            <div 
              className={classes.innerButtons}
              onClick={this.props.resetHero}>
              <FontAwesomeIcon className={classes.icon} icon={['fas', 'user']} size="1x" />
              <span className={classes.innerSpan}>
                New
              </span>
            </div>          
        </div>
    );

    let buttonClass = !this.state.bottom ? classes.button : classes.buttonInvis;

    return (
      <div className={classes.container}>
        <Button 
          className={buttonClass} 
          onClick={this.toggleDrawer('bottom', true)}
          classes={{
              label: classes.label
          }}>
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


const mapStateToProps = state => {
  return {
    savingModel: state.savedModal.saveInProgress
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveInProgress: ()=>dispatch(saveInProgress()),
    saveComplete: ()=>dispatch(saveComplete()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TemporaryDrawer));