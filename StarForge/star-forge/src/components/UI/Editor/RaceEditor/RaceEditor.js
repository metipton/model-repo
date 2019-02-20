import React, {Component} from 'react';

import classes from './RaceEditor.css';

import image1 from './Races/race1.png';
import image2 from './Races/race2.png';
import image3 from './Races/race3.png';
import image4 from './Races/race4.png';
import image5 from './Races/race5.png';
import image6 from './Races/race6.png';
import image7 from './Races/race7.png';
import image8 from './Races/race8.png';

class RaceEditor extends Component {

    clickHandler = (category, selection) => {
        this.props.updateSelection(category, selection);
    };

    render() {

        return (
            <div className={classes.Container}>
                <div
                    className={(this.props.state.selected.Race === 'Race1') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'Race1')}>
                    <img className={classes.ImageActual} src={image1} alt="Race_1" />
                </div>
                <div
                    className={(this.props.state.selected.Race === 'Race2') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'Race2')}>
                    <img className={classes.ImageActual} src={image2} alt="Race_2" />
                </div>
                <div
                    className={(this.props.state.selected.Race === 'Race3') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'Race3')}>
                    <img className={classes.ImageActual} src={image3} alt="Race_3" />
                </div>
                <div
                    className={(this.props.state.selected.Race === 'Race4') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'Race4')}>
                    <img className={classes.ImageActual} src={image4} alt="Race_4" />
                </div>
                <div
                    className={(this.props.state.selected.Race === 'Race5') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'Race5')}>
                    <img className={classes.ImageActual} src={image5} alt="Race_5" />
                </div>
                <div
                    className={(this.props.state.selected.Race === 'Race6') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'Race6')}>
                    <img className={classes.ImageActual} src={image6} alt="Race_6" />
                </div>
                <div
                    className={(this.props.state.selected.Race === 'Race7') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'Race7')}>
                    <img className={classes.ImageActual} src={image7} alt="Race_7" />
                </div>
                <div
                    className={(this.props.state.selected.Race === 'Race8') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'Race8', )}>
                    <img className={classes.ImageActual} src={image8} alt="Race_8" />
                </div>
            </div>
        );
    };
}

export default RaceEditor;
