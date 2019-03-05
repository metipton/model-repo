import React, {Component} from 'react';


import Aux from '../../../hoc/_Aux/_Aux';
import {connect} from 'react-redux';
import GridListTile from '@material-ui/core/GridListTile';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../../../store/actions/index';
import ExitImage from './sprite_delete-icon.png';

const styles = theme => ({

    gridListTile: {
        boxSizing: 'border-box',
        display: 'inline-block',
        height: '12.5rem',
        width: '12.5rem',
        '&:hover': {
          backgroundColor: 'grey',
        },
    },
    gridListTileSelected: {
        boxSizing: 'border-box',
        display: 'inline-block',
        height: '12.5rem',
        width: '12.5rem',
        border: 'solid 2px',
        backgroundColor: 'white',
        borderColor: '#FFA500',
    },
    image: {
      height: '12.5rem',
      width: '12.5rem'
    },  
    escape: {
        width: '1rem',
        height: '1rem',
        top: '.3rem',
        right: '3%',
        borderRadius: '50%',
        position: 'absolute',
        backgroundSize: 'auto 100%',
        backgroundImage: `url(${ExitImage})`,
        backgroundRepeat: 'no-repeat',
        Zindex: 2,
        cursor: 'pointer',
        '&:hover': {
            backgroundPositionX: '-17px'
            },
    }             
  });


class PictureTile extends Component {

    removeSaved = () => {

    }

    render() {
        const { classes } = this.props;
        let tile;
        if(this.props.selected){
            tile = (
                <GridListTile
                classes={{root : (this.props.selected ? classes.gridListTileSelected : classes.gridListTile)}}
                key={this.props.tile}
                cols={this.props.col}
                onClick={this.props.clicked}>
                    <div
                        className={classes.escape}
                        onMouseOver={() => this.handleMouseOver()}
                        onMouseOut={() => this.handleMouseOut()}
                        />
                    <img className={classes.image} key={this.props.key}  src={this.props.src} alt={this.props.key} />
            </GridListTile> 
            )
        } else {
            tile = (
                <GridListTile
                    classes={{root : (this.props.selected ? classes.gridListTileSelected : classes.gridListTile)}}
                    key={this.props.tile}
                    cols={this.props.col}
                    onClick={this.props.clicked}>
                        <img className={classes.image} key={this.props.key}  src={this.props.src} alt={this.props.key} />
                </GridListTile> 
            )
        }

        return (
            <Aux>
                {tile}
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
      userId: state.auth.userId,
      byId: state.savedModal.modelById,
      byTimestamp: state.savedModal.modelByTimestamp,
      savedModal: state.savedModal
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      addSavedModels: (payload, timestamps) => dispatch(actions.addSavedModels(payload, timestamps)),
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PictureTile));

