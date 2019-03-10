import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'firebase/storage';

import * as actions from '../../../store/actions/index';
import { withStyles } from '@material-ui/core/styles';

import SavedModelToolbar from '../SavedModelsEditor/SavedModelToolbar/SavedModelToolbar';
import SavedModelFooter from './SavedModelFooter/SavedModelFooter';
import GridList from '@material-ui/core/GridList';
import ModalSmall from '../modalSmall/modalSmall';
import PictureTile from './PictureTile';
import SmallModalButton from '../Button/SmallModalButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



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
  escape: {
    color: '#696969',
    top: '.3rem',
    right: '.3rem',
    position: 'absolute',
    cursor: 'pointer',
    zIndex: 101,
    '&:hover': {
        color: 'black',
      }
  },
  smallModal: {
    textAlign: 'left'
  },
  text: {
    marginTop:'1rem',
    marginBottom:'.4rem',
    color: 'white',
    fontWeight: 400,
    fontSize: '1.2rem'
  },
  buttonText: {
    color: 'white',
    fontWeight: 300,
    fontSize: '1rem'
  },
});

class SavedModelsEditor extends Component {

    state = {
        selected: null,
        width: 1000,
        modalType: null,
        modallNameShow: false,
        modalDeleteShow: false
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
        this.props.selectModel(tile);
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
                        timestamp={tile}
                        cols={1}
                        clicked={() => this.clickHandler(tile)}
                        src={this.props.byTimestamp[tile].url}>
                    </PictureTile>
              ))}
            </GridList>
          )

        }

         return (
            <div ref={this.modal} className={classes.root}>
              <ModalSmall
                classes={classes.smallModal}
                show={this.props.nameModalShow}
                modalClosed={this.props.closeNameModal}>
                  <FontAwesomeIcon 
                    className={classes.escape} 
                    icon={['fas', 'times-circle']} 
                    size="1x" 
                    onClick={this.props.closeNameModal}/>
                    <div className={classes.text}>Model Name</div>
                    <SmallModalButton variant="outlined" color="secondary">
                      <div className={classes.buttonText}>Accept</div>
                    </SmallModalButton>
                    <SmallModalButton variant="outlined" color="primary">
                      <div className={classes.buttonText}>Cancel</div>
                    </SmallModalButton>
              </ModalSmall>
              <ModalSmall
                classes={classes.smallModal}
                show={this.props.deleteModalShow}
                modalClosed={this.props.closeDeleteModal}>
                  <FontAwesomeIcon 
                    className={classes.escape} 
                    icon={['fas', 'times-circle']} 
                    size="1x" 
                    onClick={this.props.closeDeleteModal}/>
                    <div className={classes.text}> Are you sure you want to delete this model?</div>

                    <SmallModalButton variant="outlined" color="secondary">
                        <div className={classes.buttonText}>Delete</div>
                    </SmallModalButton>
                    <SmallModalButton variant="outlined" color="primary">
                       <div className={classes.buttonText}>Cancel</div>
                    </SmallModalButton>

              </ModalSmall>
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
    savedModal: state.savedModal,
    nameModalShow: state.savedModal.modalSmallNameShow,
    deleteModalShow: state.savedModal.modalSmallDeleteShow
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addSavedModels: (payload, timestamps) => dispatch(actions.addSavedModels(payload, timestamps)),
    selectModel: (payload) => dispatch(actions.selectModel(payload)),
    closeNameModal: () => dispatch(actions.closeNameModal()),
    closeDeleteModal: () => dispatch(actions.closeDeleteModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SavedModelsEditor));

