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
import DeleteModelButton from '../Button/deleteModelButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';



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
  bootstrapRoot: {

    'label + &': {
      marginTop: '.4rem',
    },
    '&:focus': {
      color: 'white',
      fontSize: '1.5rem',
    },
  },
  bootstrapInput: {
    borderRadius: 4,
    marginBottom: '.4rem',
    position: 'relative',
    backgroundColor: 'lightgrey',
    border: '1px solid #ced4da',
    fontSize: 16,
    width: 'auto',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#ffffff ',
      boxShadow: '0 0 0 0.2rem rgba(255,255,255, 1)',
    },
  },
  bootstrapFormLabel: {
    color: 'white',
    fontSize: '1.2rem',
  },
});

class SavedModelsEditor extends Component {

    state = {
        selected: null,
        width: 1000,
        modalType: null,
        modallNameShow: false,
        modalDeleteShow: false,
        changeName: ''
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

    keyPressHandler = (event ) => {
      console.log(event.charCode);
      if( event.charCode === 13){
          this.props.renameModel(this.state.selected, this.state.changeName);
      }
    }

    clickHandler = (tile) => {
        this.setState({
            ...this.state,
            selected: tile,
            changeName: this.props.byTimestamp[tile]['name']
        });
        this.props.selectModel(tile);
    }

    nameInputHandler = name => event => {
      this.setState({
        ...this.state,
        [name]: event.target.value,
      });
    };

    changeNameHandler = () => {
      this.props.renameModel(this.state.selected, this.state.changeName);
    }

    deleteModelHandler = () => {
      this.props.deleteModel(this.state.selected);
    }

    loadSavedHandler = () => {
      this.props.loadSavedModel(this.state.selected);
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
        let defaultEntry = null;
        if(this.props.byTimestamp && this.props.byTimestamp[this.state.selected]){
            defaultEntry = (
                  <InputBase
                    key={this.state.selected}
                    id="bootstrap-input"
                    defaultValue={this.props.byTimestamp[this.state.selected]['name']}
                    onChange={this.nameInputHandler('changeName')}
                    inputProps={{ onKeyPress: this.keyPressHandler }}
                    classes={{
                      root: classes.bootstrapRoot,
                      input: classes.bootstrapInput,
                    }}/>
            );

        }

         return (
            <div ref={this.modal} className={classes.root}>
              <ModalSmall
                classes={classes.smallModal}
                show={this.props.nameModalShow}
                modalClosed={this.props.closeNameModal}
                modalType='name'>
                  <FontAwesomeIcon 
                    className={classes.escape} 
                    icon={['fas', 'times-circle']} 
                    size="1x" 
                    onClick={this.props.closeNameModal}/>


                      <InputLabel 
                        shrink htmlFor="bootstrap-input"
                        FormLabelClasses={{
                          root: classes.bootstrapFormLabel,
                          focused: classes.bootstrapFormLabel}}
                        classes={{
                          root: classes.bootstrapFormLabel,
                          focused: classes.bootstrapFormLabel}}>
                        Model Name
                      </InputLabel>
                    {defaultEntry}

                    <SmallModalButton style={{float: 'left'}} variant="outlined" color="secondary">
                      <div 
                        className={classes.buttonText}
                        onClick={this.changeNameHandler}>Accept</div>
                    </SmallModalButton>

                    <SmallModalButton variant="outlined" color="primary">
                      <div className={classes.buttonText} onClick={this.props.closeNameModal}>Cancel</div>
                    </SmallModalButton>

              </ModalSmall>
              <ModalSmall
                classes={classes.smallModal}
                show={this.props.deleteModalShow}
                modalClosed={this.props.closeDeleteModal}
                modalType='delete'>
                  <FontAwesomeIcon 
                    className={classes.escape} 
                    icon={['fas', 'times-circle']} 
                    size="1x" 
                    onClick={this.props.closeDeleteModal}/>
                    <div className={classes.text}> Are you sure you want to delete this model?</div>          
                  <DeleteModelButton variant="outlined" color="secondary">
                      <div className={classes.buttonText} onClick={this.deleteModelHandler}>Delete</div>
                  </DeleteModelButton>
                  <DeleteModelButton variant="outlined" color="primary">
                      <div 
                        className={classes.buttonText}
                        onClick={this.props.closeDeleteModal}
                        >Cancel</div>
                  </DeleteModelButton>

              </ModalSmall>
              <SavedModelToolbar/>
                {cards}
              <SavedModelFooter
                loadSaved={this.loadSavedHandler}/>
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

