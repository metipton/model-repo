import React, {Component} from 'react';

import classes from './GenreEditor.css';

class GenreEditor extends Component {


    clickHandler = (category, selection, panel) => {
        this.props.updateSelection(category, selection);
    };

    render() {

        return (
            <div className={classes.Container}>
                <div
                    className={(this.props.state.currentName.Genre === 'Fantasy') ? classes.GenreSelected : classes.Genre}
                    onClick={() => this.clickHandler('Genre', 'Fantasy', 'panel1')}
                    style={{marginTop: '0px'}}>Fantasy</div>
                <div
                    className={(this.props.state.currentName.Genre === 'Sci Fi') ? classes.GenreSelected : classes.Genre}
                    onClick={() => this.clickHandler('Genre', 'Sci Fi', 'panel2')}>Sci Fi</div>
                <div
                    className={(this.props.state.currentName.Genre === 'Western') ? classes.GenreSelected : classes.Genre}
                    onClick={() => this.clickHandler('Genre', 'Western', 'panel3')}>Western</div>
                <div
                    className={(this.props.state.currentName.Genre === 'Modern') ? classes.GenreSelected : classes.Genre}
                    onClick={() => this.clickHandler('Genre', 'Modern', 'panel4')}>Modern</div>
                <div
                    className={(this.props.state.currentName.Genre === 'East Asian') ? classes.GenreSelected : classes.Genre}
                    onClick={() => this.clickHandler('Genre', 'East Asian', 'panel5')}>East Asian</div>
            </div>
        );
    };
}

export default GenreEditor;
