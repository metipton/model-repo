import React, {Component} from 'react';

import classes from './PoseEditor.css';

import image1 from './Pose/race1.png';
import image2 from './Pose/race2.png';
import image3 from './Pose/race3.png';
import image4 from './Pose/race4.png';
import image5 from './Pose/race5.png';
import image6 from './Pose/race6.png';
import image7 from './Pose/race7.png';
import image8 from './Pose/race8.png';

class RaceEditor extends Component {
    state = {
      selected: null,
    };

    handleChange = image => {
      this.setState({
        'selected': image
    }, update => {
        console.log(this.state);
        });
    };

    clickHandler = (category, selection, panel) => {
        this.props.updateSelection(selection);
        this.handleChange(panel);

    };

    render() {

        return (
            <div className={classes.Container}>
                <div
                    className={(this.props.state.currentName.Pose === 'pose1') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'pose1', 'image1')}>
                    <img className={classes.ImageActual} src={image1} alt="race_1" />
                </div>
                <div
                    className={(this.props.state.currentName.Pose === 'pose2') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'pose2', 'image2')}>
                    <img className={classes.ImageActual} src={image2} alt="race_2" />
                </div>
                <div
                    className={(this.props.state.currentName.Pose === 'pose3') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'pose3', 'image3')}>
                    <img className={classes.ImageActual} src={image3} alt="race_3" />
                </div>
                <div
                    className={(this.props.state.currentName.Pose === 'pose4') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'pose4', 'image4')}>
                    <img className={classes.ImageActual} src={image4} alt="race_4" />
                </div>
                <div
                    className={(this.props.state.currentName.Pose === 'pose5') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'pose5', 'image5')}>
                    <img className={classes.ImageActual} src={image5} alt="race_5" />
                </div>
                <div
                    className={(this.props.state.currentName.Pose === 'pose6') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'pose6', 'image6')}>
                    <img className={classes.ImageActual} src={image6} alt="race_6" />
                </div>
                <div
                    className={(this.props.state.currentName.Pose === 'pose7') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'pose7', 'image7')}>
                    <img className={classes.ImageActual} src={image7} alt="race_7" />
                </div>
                <div
                    className={(this.props.state.currentName.Pose === 'pose8') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'pose8', 'image8')}>
                    <img className={classes.ImageActual} src={image8} alt="race_8" />
                </div>
            </div>
        );
    };
}

export default RaceEditor;
