import React, {Component} from 'react';

import Aux from '../../../hoc/_Aux/_Aux';
import {connect} from 'react-redux';
import GridListTile from '@material-ui/core/GridListTile';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../../../store/actions/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const styles = theme => ({

    gridListTile: {
        position: 'relative',
        margin: '1rem',
        boxSizing: 'border-box',
        display: 'inline-block',
        height: '15rem',
        width: '12.5rem',
        '&:hover': {
          backgroundColor: 'grey',
        },
    },
    gridListTileSelected: {
        margin: '1rem',
        position: 'relative',
        boxSizing: 'border-box',
        display: 'inline-block',
        height: '15rem',
        width: '12.5rem',
        backgroundColor: '#b1b1af',
        boxShadow: '0px 0px .4rem 1px black'
    },
    image: {
      height: '12.5rem',
      width: '12.5rem'
    },  
    escape: {
        color: '#696969',
        top: '.3rem',
        right: '3%',
        position: 'absolute',
        cursor: 'pointer',
        zIndex: 99,
        '&:hover': {
            color: 'black',
          },
    },
    edit: {
        color: '#696969',
        bottom: '.3rem',
        right: '3%',
        position: 'absolute',
        cursor: 'pointer',
        zIndex: 99,
        '&:hover': {
            color: 'white',
          },
    },
    toolbar: {
        color: 'white',
        height: '1.7rem',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1.25rem',
        boxSizing: 'border-box',
        Zindex: 99,
        overflow: 'hidden',
        backgroundColor: '#06437A',
        opacity: .8
    }             
  });


class PictureTile extends Component {

    removeSaved = () => {

    }

    render() {
        const { classes } = this.props;
        let tile;
        if(this.props.selected == this.props.tile){
            tile = (
                <GridListTile
                classes={{root : classes.gridListTileSelected}}
                key={this.props.tile}
                cols={this.props.col}
                onClick={this.props.clicked}>
                    <FontAwesomeIcon 
                        className={classes.escape}
                        onClick={this.props.openDeleteModal} 
                        icon={['fas', 'trash-alt']} 
                        size="1x" 
                        />

                    <img className={classes.image} key={this.props.key}  src={this.props.src} alt={this.props.key} />
                    <div className={classes.toolbar}/>
                    <FontAwesomeIcon 
                        className={classes.edit} 
                        onClick={this.props.openNameModal} 
                        icon={['fas', 'edit']} 
                        size="1x" 
                        />
            </GridListTile> 
            )
        } else {
            tile = (
                <GridListTile
                    classes={{root : classes.gridListTile}}
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
      savedModal: state.savedModal,
      selected: state.savedModal.selected
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      addSavedModels: (payload, timestamps) => dispatch(actions.addSavedModels(payload, timestamps)),
      openNameModal: () => dispatch(actions.openNameModal()),
      openDeleteModal: () => dispatch(actions.openDeleteModal())
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PictureTile));

