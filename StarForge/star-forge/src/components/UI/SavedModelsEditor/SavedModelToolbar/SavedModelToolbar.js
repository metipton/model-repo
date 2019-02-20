import React, {Component} from 'react';
import {connect} from 'react-redux';


import classes from './SavedModelToolbar.css';
//import MaterialUIButton from '../../components/UI/Button/MaterialUIButton';
//import * as actions from '../../store/actions/index';




class SavedModelToolbar extends Component {

    state = {
        showShoppingCart: false
    }


    render (){   

        return (
            <div>
                <header className={classes.Toolbar}>
                    <span>My Saved Models</span>
                 </header>
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SavedModelToolbar);
