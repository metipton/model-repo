import React, {Component} from 'react';

import classes from './PoseEditor.css';

import image1 from '../../../../assets/Thumbs/poses/TPose.png';
import image2 from '../../../../assets/Thumbs/poses/Pose2.png';
import image3 from '../../../../assets/Thumbs/poses/Pose3.png';
import image4 from '../../../../assets/Thumbs/poses/Pose4.png';


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
                    className={(this.props.state.currentName.Pose === 'Pose1') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'Pose1', 'image1')}>
                    <img className={classes.ImageActual} src={image1} alt="race_1" />
                </div>
                <div
                    className={(this.props.state.currentName.Pose === 'Pose2') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'Pose2', 'image2')}>
                    <img className={classes.ImageActual} src={image2} alt="race_2" />
                </div>
                <div
                    className={(this.props.state.currentName.Pose === 'Pose3') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'Pose3', 'image3')}>
                    <img className={classes.ImageActual} src={image3} alt="race_3" />
                </div>
                <div
                    className={(this.props.state.currentName.Pose === 'Pose4') ? classes.ImageSelected : classes.Image}
                    onClick={() => this.clickHandler('Pose', 'Pose4', 'image4')}>
                    <img className={classes.ImageActual} src={image4} alt="race_4" />
                </div>
            </div>
        );
    };
}

export default RaceEditor;
