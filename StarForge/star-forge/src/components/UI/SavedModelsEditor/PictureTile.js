import React, {Component} from 'react';

import Aux from '../../../hoc/_Aux/_Aux';
import {connect} from 'react-redux';
import GridListTile from '@material-ui/core/GridListTile';
import { withStyles } from '@material-ui/core/styles';
import {addSavedModels, openNameModal, openDeleteModal} from '../../../store/actions/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const styles = theme => ({

    gridListTile: {
        position: 'relative',
        margin: '1rem',
        boxSizing: 'border-box',
        display: 'inline-block',
        height: '15rem',
        width: '12.5rem',
        transition: '.3s',
        '&:hover': {
          backgroundColor: 'grey',
          color: 'white !important'
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
        boxShadow: '0px 0px .4rem 1px black',
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
        opacity: .8,
        textAlign: 'center'
    },
    toolbarUnselected: {
        color: '#65686c',
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
        opacity: 1,
        textAlign: 'center',
    },
    name : {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontWeight: '400',
        paddingTop: '1rem'
    },
    loadInProgress: {
        zIndex: 1001,
        position: 'absolute',
        margin: 'auto',
        top:0,
        bottom: 0,
        left: 0,
        right: 0,
        color: '#FFA500'
      },

  });


class PictureTile extends Component {

    removeSaved = () => {

    }

    render() {
        const { classes } = this.props;

        let loadIcon = (
            <FontAwesomeIcon className={classes.loadInProgress} icon={['fas','spinner']} spin size="3x" />
            );

        let tile;
        if(this.props.selected === this.props.timestamp){
            tile = (
                <GridListTile
                classes={{root : classes.gridListTileSelected}}
                key={this.props.timestamp}
                cols={this.props.col}
                onClick={this.props.clicked}>
                    <FontAwesomeIcon 
                        className={classes.escape}
                        onClick={this.props.openDeleteModal} 
                        icon={['fas', 'trash-alt']} 
                        size="1x" 
                        />
                    {(this.props.loadInProgress && this.props.timestamp === this.props.selected) ? loadIcon : null}
                    <img className={classes.image} key={this.props.key}  src={this.props.src} alt={this.props.key} />
                    <div className={classes.toolbar}>
                        <p className={classes.name}>{this.props.byTimestamp[this.props.timestamp]['name']}</p>
                    </div>
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

                    <div className={classes.toolbarUnselected}>
                        <p className={classes.name}>{this.props.byTimestamp[this.props.timestamp]['name']}</p>
                    </div>
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
      selected: state.savedModal.selected,
      loadInProgress: state.savedModal.loadInProgress
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      addSavedModels: (payload, timestamps) => dispatch(addSavedModels(payload, timestamps)),
      openNameModal: () => dispatch(openNameModal()),
      openDeleteModal: () => dispatch(openDeleteModal())
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PictureTile));

