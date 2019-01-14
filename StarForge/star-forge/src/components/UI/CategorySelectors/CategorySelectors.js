import React, {Component} from 'react';

import CategorySelector from './CategorySelector/CategorySelector';
import classes from './CategorySelectors.css';
import head from '../../../assets/Icons/head.png';
import laser from '../../../assets/Icons/laser.png';
import ship from '../../../assets/Icons/ship.png';
import base from '../../../assets/Icons/base.png';
import body from '../../../assets/Icons/body.png';
import clothing from '../../../assets/Icons/clothing.png';
import genre from '../../../assets/Icons/genre.png';
import material from '../../../assets/Icons/material.png';
import race from '../../../assets/Icons/race.png';
import pose from '../../../assets/Icons/pose.png';
import robot from '../../../assets/Icons/robot.png';

class categorySelectors extends Component{

    state = {
      selected: null,
    };

    handleChange = panel => {
      this.setState({
        'selected': panel
    }, update => {
        console.log(this.state);
    });
    };

    clickHandler = (panel) => {
        this.handleChange(panel);
        console.log(this.state.selected)
    };


    render (){


        return (
                <div className={classes.CategorySelectors}>
                        <div
                            onClick={() => this.clickHandler('panel1')}
                            className={classes.List}>
                            <CategorySelector
                                backgroundActive={(this.state.selected ==='panel1') ? true : false }
                                onClick={() => this.clickHandler('panel1')}
                                clicked={this.props.updateCategory}
                                title="Genre"
                                src={genre} />
                        </div>
                        <div className={classes.List}
                             onClick={() => this.clickHandler('panel2')}>
                            <CategorySelector
                                backgroundActive={(this.state.selected ==='panel2') ? true : false }
                                 clicked={this.props.updateCategory}
                                 title="Race"
                                 src={race} />
                        </div>
                        <div className={classes.List}
                             onClick={() => this.clickHandler('panel3')}>
                            <CategorySelector
                                backgroundActive={(this.state.selected ==='panel3') ? true : false }
                                clicked={this.props.updateCategory}
                                title="Head"
                                src={head} />
                        </div>
                        <div className={classes.List}
                             onClick={() => this.clickHandler('panel4')}>
                            <CategorySelector
                                backgroundActive={(this.state.selected ==='panel4') ? true : false }
                                clicked={this.props.updateCategory}
                                title="Body"
                                src={body} />
                        </div>
                        <div className={classes.List}
                             onClick={() => this.clickHandler('panel5')}>
                            <CategorySelector
                                backgroundActive={(this.state.selected ==='panel5') ? true : false }
                                clicked={this.props.updateCategory}
                                title="Clothing"
                                src={clothing} />
                        </div>
                        <div className={classes.List}
                            onClick={() => this.clickHandler('panel6')}>
                            <CategorySelector
                                backgroundActive={(this.state.selected ==='panel6') ? true : false }
                                clicked={this.props.updateCategory}
                                title="Items"
                                src={laser} />
                        </div>
                        <div className={classes.List}
                             onClick={() => this.clickHandler('panel7')}>
                            <CategorySelector
                                backgroundActive={(this.state.selected ==='panel7') ? true : false }
                                clicked={this.props.updateCategory}
                                title="Base"
                                src={base} />
                        </div>
                        <div className={classes.List}
                            onClick={() => this.clickHandler('panel8')}>
                            <CategorySelector
                                backgroundActive={(this.state.selected ==='panel8') ? true : false }
                                clicked={this.props.updateCategory}
                                title="Pose"
                                 src={pose} />
                        </div>
                        <div className={classes.List}
                             onClick={() => this.clickHandler('panel9')}>
                            <CategorySelector
                                backgroundActive={(this.state.selected ==='panel9') ? true : false }
                                clicked={this.props.updateCategory}
                                title="Material"
                                src={material} />
                        </div>
                        <div className={classes.List}
                             onClick={() => this.clickHandler('panel10')}>
                            <CategorySelector
                                backgroundActive={(this.state.selected ==='panel10') ? true : false }
                                clicked={this.props.updateCategory}
                                title="Ships"
                                src={ship} />
                        </div>
                </div>
        );
    }
}


export default categorySelectors;
