import React, {Component} from 'react';

import classes from './Editor.css';
import CategorySelectors from '../CategorySelectors/CategorySelectors';
import HeadEditor from './HeadEditor/HeadAccordion';
import GenreEditor from './GenreEditor/GenreEditor';
import RaceEditor from './RaceEditor/RaceEditor';
import BodyEditor from './BodyEditor/BodyAccordion';
import ItemEditor from './ItemsEditor/ItemsAccordion';
import ClothingEditor from './ClothingEditor/ClothingAccordion';
import PoseEditor from './PoseEditor/PoseEditor';
import BaseEditor from './BaseEditor/BaseAccordion';

class categorySelectors extends Component{
    state = {
        categorySelected : 'Head'
    }

    updateCategoryHandler = (category) => {
        this.setState({categorySelected : category});
    };

    render (){
        let secondaryPanel = null;
        switch (this.state.categorySelected) {
            case 'Genre':
                secondaryPanel = (
                    <div className={classes.SecondColumn}>
                        <GenreEditor
                            state={this.props.state}
                            updateObject={this.props.updateObject}/>
                    </div>
                );
                break;
            case 'Race':
                secondaryPanel = (
                    <div className={classes.SecondColumn}>
                        <RaceEditor
                            state={this.props.state}
                            updateSelection={this.props.updateObject}/>
                    </div>
                );
                break;
            case 'Head':
                secondaryPanel = (
                    <div className={classes.SecondColumn}>
                        <HeadEditor
                            state={this.props.state}
                            updateSelection={this.props.updateObject}
                            updateExpression ={this.props.updateExpression}
                            morphPercents={this.props.morphPercents}/>
                    </div>
                );
                break;
            case 'Body':
                secondaryPanel = (
                    <div className={classes.SecondColumn}>
                        <BodyEditor
                            state={this.props.state}
                            updateSelection={this.props.updateObject}
                            updateBodyTarget={this.props.updateBodyTarget}
                            morphPercents={this.props.morphPercents}/>
                    </div>
                );
                break;
            case 'Clothing':
                secondaryPanel = (
                    <div className={classes.SecondColumn}>
                            <ClothingEditor
                                state={this.props.state}
                                updateSelection={this.props.updateObject}
                                setFeetLink={this.props.setFeetLink}
                                updateFeet={this.props.updateFeet}
                                setGloveLink={this.props.setGloveLink}
                                updateGlove={this.props.updateGlove}/>
                    </div>
                );
                break;
            case 'Items':
                secondaryPanel = (
                    <div className={classes.SecondColumn}>
                            <ItemEditor
                                state={this.props.state}
                                updateSelection={this.props.updateObject}/>
                    </div>
                );
                break;
            case 'Base':
                secondaryPanel = (
                    <div className={classes.SecondColumn}>
                            <BaseEditor
                                state={this.props.state}
                                updateSelection={this.props.updateObject}/>
                    </div>
                );
                break;
            case 'Pose':
                secondaryPanel = (
                    <div className={classes.SecondColumn}>
                            <PoseEditor
                                state={this.props.state}
                                updateSelection={this.props.updatePose}/>
                    </div>
                );
                break;
            case 'Material':
                break;
            case 'Ships':
                break;
            case 'Robots':
            default:
                break;


        }
        return (
                <div className={classes.Editor}>
                    <div className={classes.FirstColumn}>
                        <CategorySelectors
                            updateCategory={(category) => this.updateCategoryHandler(category)}/>
                    </div>
                    {secondaryPanel}
                </div>
        );
    }
}


export default categorySelectors;
