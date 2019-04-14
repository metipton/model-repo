import React, {Component} from 'react';
import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import {closeSavedModal} from '../../../../store/actions/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles = theme => ({ 
    exit: {
        color: 'darkgrey',
        cursor: 'pointer',
        zIndex: 99999,
        '&:hover': {
            color: 'white',
          },
    },
    toolbar: {
        color: 'white',
        height: '3rem',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1.25rem',
        boxSizing: 'border-box',
        zIndex: 90,
        overflow: 'hidden',
        backgroundColor: 'rgba(15, 15, 15, 0.315)',
    }
  
  });

class SavedModelToolbar extends Component {

    render (){   
        const { classes } = this.props;

        return (
                <div className={classes.toolbar}>
                    <span>My Saved Models</span>
                    <FontAwesomeIcon 
                        className={classes.exit} 
                        icon={['fas', 'times-circle']} 
                        size="1x" 
                        onClick={this.props.closeSavedModal}
                     />
                 </div>
        );
    };
}

// const mapStateToProps = state => {
//     return {

//     };
// };

const mapDispatchToProps = dispatch => {
    return {
        closeSavedModal: () => dispatch(closeSavedModal()),
    }
}


export default connect(null, mapDispatchToProps)(withStyles(styles)(SavedModelToolbar));
