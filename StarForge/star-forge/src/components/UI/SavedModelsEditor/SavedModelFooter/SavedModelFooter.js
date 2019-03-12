import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from '../../Button/SavedHeroButtons';
import * as actions from '../../../../store/actions/index';

import classes from './SavedModelFooter.css';
//import MaterialUIButton from '../../components/UI/Button/MaterialUIButton';
//import * as actions from '../../store/actions/index';




class SavedModelToolbar extends Component {

    state = {
        showShoppingCart: false
    }

    closeModal = () => {
        this.props.closeSavedModal();
    }

    render (){   

        return (
            <div className={classes.Toolbar}>
                    <Button
                        clicked={this.props.loadSaved}
                        disabled={this.props.loadInProgress}
                        variant="contained"
                        color="primary">Load Model</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        clicked={this.closeModal}>Cancel</Button>
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        loadInProgress: state.savedModal.loadInProgress
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeSavedModal: () => dispatch(actions.closeSavedModal()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SavedModelToolbar);
