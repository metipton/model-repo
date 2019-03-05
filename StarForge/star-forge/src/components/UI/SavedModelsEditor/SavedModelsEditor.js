import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'firebase/storage';

import * as actions from '../../../store/actions/index';
import { withStyles } from '@material-ui/core/styles';

import SavedModelToolbar from '../SavedModelsEditor/SavedModelToolbar/SavedModelToolbar';
import SavedModelFooter from './SavedModelFooter/SavedModelFooter';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import PictureTile from './PictureTile';



const styles = theme => ({
  root: {
    boxSizing: 'border-box',
    display: 'block',
    justifyContent: 'space-between',
    textAlign: 'center',
    height: '94%',
    width: '100%',
    marginTop: '3rem' ,
  },
  gridList: {
    boxSizing: 'border-box',
    display: 'block',
    justifyContent: 'space-between',
    textAlign: 'center',
    height: '100%',
    width: '100%',
    marginTop: '2rem'    
  },
  gridListTile: {
      boxSizing: 'border-box',
      display: 'inline-block',
      height: '12.5rem',
      width: '12.5rem',
      '&:hover': {
        backgroundColor: '',
        border: 'solid 2px',
        borderColor: '#FFA500'
      },
  },
  gridListTileSelected: {
      boxSizing: 'border-box',
      display: 'inline-block',
      height: '12.5rem',
      width: '12.5rem',
      border: 'solid 2px',
      borderColor: '#FFA500',
  },
  image: {
    height: '12.5rem',
    width: '12.5rem'
  }
});

class SavedModelsEditor extends Component {

    state = {
        selected: null,
        width: 1000,
    }

  constructor(props){
    super(props);
    this.modal = React.createRef();
    //changes the size of screen when browser resized
    window.addEventListener('resize', this.onWindowResize, false);
  }

    componentDidMount () {
      this.onWindowResize();
    }

    deleteSelected = () => {

    }

    onWindowResize = () => {
      let cWidth;

      if(this.modal.current){
        cWidth = this.modal.current.offsetWidth
      } else {
        cWidth =300;
      }

      this.setState({
        ...this.state,
        width: cWidth
      })
    }

    clickHandler = (tile) => {
        this.setState({
            ...this.state,
            selected: tile
        });
    }
    render() {
        const { classes } = this.props;
        let cards = null;

        let picWidth = 200;
        if( this.props.savedModal !== null && this.props.savedModal !== undefined && this.props.byId){  

          cards = (  
            <GridList  cellHeight={picWidth} classes={{ root: classes.root}}  cols={ this.state.width / picWidth || 4}>
              {this.props.byId.map( (tile) => (
                    <PictureTile
                        key={tile}
                        tile={tile}
                        cols={1}
                        selected={this.state.selected === tile}
                        clicked={() => this.clickHandler(tile)}
                        src={this.props.byTimestamp[tile].url}>
                    </PictureTile>
              ))}
            </GridList>
          )

        }

         return (
            <div ref={this.modal} className={classes.root}>
              <SavedModelToolbar/>
                {cards}
              <SavedModelFooter/>
            </div>
    
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SavedModelsEditor));

