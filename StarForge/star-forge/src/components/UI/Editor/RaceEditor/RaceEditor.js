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
                    className={(this.props.state.currentName.Race === 'race1') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'race1')}>
                    <img className={classes.ImageActual} src={image1} alt="race_1" />
                </div>
                <div
                    className={(this.props.state.currentName.Race === 'race2') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'race2')}>
                    <img className={classes.ImageActual} src={image2} alt="race_2" />
                </div>
                <div
                    className={(this.props.state.currentName.Race === 'race3') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'race3')}>
                    <img className={classes.ImageActual} src={image3} alt="race_3" />
                </div>
                <div
                    className={(this.props.state.currentName.Race === 'soldier1') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'soldier1')}>
                    <img className={classes.ImageActual} src={image4} alt="race_4" />
                </div>
                <div
                    className={(this.props.state.currentName.Race === 'race5') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'race5')}>
                    <img className={classes.ImageActual} src={image5} alt="race_5" />
                </div>
                <div
                    className={(this.props.state.currentName.Race === 'race6') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'race6')}>
                    <img className={classes.ImageActual} src={image6} alt="race_6" />
                </div>
                <div
                    className={(this.props.state.currentName.Race === 'race7') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'race7')}>
                    <img className={classes.ImageActual} src={image7} alt="race_7" />
                </div>
                <div
                    className={(this.props.state.currentName.Race === 'race8') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Race', 'race8', )}>
                    <img className={classes.ImageActual} src={image8} alt="race_8" />
                </div>
            </div>
        );
    };
}

export default RaceEditor;
