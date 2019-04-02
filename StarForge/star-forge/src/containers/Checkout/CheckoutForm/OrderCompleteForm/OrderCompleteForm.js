// import React, {Component} from 'react';
// import {connect} from 'react-redux';
// import 'firebase/storage';

// import * as actions from '../../../store/actions/index';
// import { withStyles } from '@material-ui/core/styles';
// import SavedModelToolbar from '../SavedModelsEditor/SavedModelToolbar/SavedModelToolbar';
// import SavedModelFooter from './SavedModelFooter/SavedModelFooter';
// import GridList from '@material-ui/core/GridList';
// import ModalSmall from '../modalSmall/modalSmall';
// import PictureTile from './PictureTile';
// import SmallModalButton from '../Button/SmallModalButton'
// import DeleteModelButton from '../Button/deleteModelButton'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import InputBase from '@material-ui/core/InputBase';
// import InputLabel from '@material-ui/core/InputLabel';



// const styles = theme => ({
//   root: {
//     boxSizing: 'border-box',
//     display: 'block',
//     justifyContent: 'space-between',
//     textAlign: 'center',
//     height: '94%',
//     width: '100%',
//     marginTop: '3rem' ,
//   },
//   gridList: {
//     boxSizing: 'border-box',
//     display: 'block',
//     justifyContent: 'space-between',
//     textAlign: 'center',
//     height: '100%',
//     width: '100%',
//     marginTop: '2rem'    
//   },
//   escape: {
//     color: '#696969',
//     top: '.3rem',
//     right: '.3rem',
//     position: 'absolute',
//     cursor: 'pointer',
//     zIndex: 101,
//     '&:hover': {
//         color: 'black',
//       }
//   },
//   smallModal: {
//     textAlign: 'left'
//   },
//   text: {
//     marginTop:'1rem',
//     marginBottom:'.4rem',
//     color: 'white',
//     fontWeight: 400,
//     fontSize: '1.2rem'
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 300,
//     fontSize: '1rem'
//   },
//   bootstrapRoot: {

//     'label + &': {
//       marginTop: '.4rem',
//     },
//     '&:focus': {
//       color: 'white',
//       fontSize: '1.5rem',
//     },
//   },
//   bootstrapInput: {
//     borderRadius: 4,
//     marginBottom: '.4rem',
//     position: 'relative',
//     backgroundColor: 'lightgrey',
//     border: '1px solid #ced4da',
//     fontSize: 16,
//     width: 'auto',
//     padding: '10px 12px',
//     transition: theme.transitions.create(['border-color', 'box-shadow']),
//     '&:focus': {
//       borderRadius: 4,
//       borderColor: '#ffffff ',
//       boxShadow: '0 0 0 0.2rem rgba(255,255,255, 1)',
//     },
//   },
//   bootstrapFormLabel: {
//     color: 'white',
//     fontSize: '1.2rem',
//   },
// });

// class SavedModelsEditor extends Component {

//     state = {
//         selected: null,
//     }

//   constructor(props){
//     super(props);
//     this.modal = React.createRef();
//     //changes the size of screen when browser resized
//     window.addEventListener('resize', this.onWindowResize, false);
//   }

//     componentDidMount () {
//       this.onWindowResize();
//     }


//     onWindowResize = () => {
//       let cWidth;

//       if(this.modal.current){
//         cWidth = this.modal.current.offsetWidth
//       } else {
//         cWidth =300;
//       }

//       this.setState({
//         ...this.state,
//         width: cWidth
//       })
//     }

//     nameInputHandler = name => event => {
//       this.setState({
//         ...this.state,
//         [name]: event.target.value,
//       });
//     };


//     render() {
//         const { classes } = this.props;

//          return (
//             <div></div>
//          )}
// }

// const mapStateToProps = state => {
//   return {
//     userId: state.auth.userId,

//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SavedModelsEditor));

