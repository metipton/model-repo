import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import cssClasses from './ClothingAccordion.css';

import HeadwearGridList from './GridLists/HeadwearGridList/GridList';
import MaskGridList from './GridLists/MaskGridList/GridList';
import UpperFaceGridList from './GridLists/UpperFaceGridList/GridList';
import LowerFaceGridList from './GridLists/LowerFaceGridList/GridList';
import ShouldersGridList from './GridLists/ShouldersGridList/GridList';
import GlovesGridList from './GridLists/GlovesGridList/GridList';
import ChestGridList from './GridLists/ChestGridList/GridList';
import LegsGridList from './GridLists/LegsGridList/GridList';
import FeetGridList from './GridLists/FeetGridList/GridList';

class ClothingAccordion extends Component {
    state = {
      expanded: null,
    };

    handleChange = panel => (event, expanded) => {
      this.setState({
        expanded: expanded ? panel : false,
      });
    };


  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
          <div>
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                  Headwear
                </Typography>
              </ExpansionPanelSummary>
                  <HeadwearGridList state={this.props.state}  updateSelection={this.props.updateSelection}/>
            </ExpansionPanel>
        </div>

         <div className={cssClasses.Accordion}>
            <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                  Mask
                </Typography>
              </ExpansionPanelSummary>
                  <MaskGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
            </ExpansionPanel>
        </div>

        <div className={cssClasses.Accordion}>
            <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                  Upper Face
                </Typography>
              </ExpansionPanelSummary>
                  <UpperFaceGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
            </ExpansionPanel>
        </div>

        <div className={cssClasses.Accordion}>
            <ExpansionPanel expanded={expanded === 'panel4'} onChange={this.handleChange('panel4')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                  Lower Face
                </Typography>
              </ExpansionPanelSummary>
                  <LowerFaceGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
            </ExpansionPanel>
        </div>

        <div className={cssClasses.Accordion}>
            <ExpansionPanel expanded={expanded === 'panel5'} onChange={this.handleChange('panel5')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                  Shoulders
                </Typography>
              </ExpansionPanelSummary>
                  <ShouldersGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
            </ExpansionPanel>
        </div>

        <div className={cssClasses.Accordion}>
            <ExpansionPanel expanded={expanded === 'panel6'} onChange={this.handleChange('panel6')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                  Gloves
                </Typography>
              </ExpansionPanelSummary>
                  <GlovesGridList
                      state={this.props.state}
                      updateSelection={this.props.updateSelection}
                      gloveLink={this.props.setGloveLink}
                      updateGlove={this.props.updateGlove}
                      />
            </ExpansionPanel>
        </div>

        <div className={cssClasses.Accordion}>
            <ExpansionPanel expanded={expanded === 'panel7'} onChange={this.handleChange('panel7')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                  Chest
                </Typography>
              </ExpansionPanelSummary>
                  <ChestGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
            </ExpansionPanel>
        </div>

        <div className={cssClasses.Accordion}>
            <ExpansionPanel expanded={expanded === 'panel8'} onChange={this.handleChange('panel8')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                  Legs
                </Typography>
              </ExpansionPanelSummary>
                  <LegsGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
            </ExpansionPanel>
        </div>

        <div className={cssClasses.Accordion}>
            <ExpansionPanel expanded={expanded === 'panel9'} onChange={this.handleChange('panel9')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                  Feet
                </Typography>
              </ExpansionPanelSummary>
                  <FeetGridList
                      state={this.props.state}
                      feetLink={this.props.setFeetLink}
                      updateFeet={this.props.updateFeet}
                      />
            </ExpansionPanel>
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    height: 70,
    width: '30%',
    borderRadius: "10px",
    opacity: .8,
  },
  heading: {
      '&:hover': {
        backgroundColor: '#FFA500',
      },
    border: 'solid',
    minHeight: '2rem',
    height: '2rem',
    borderRadius: '10',
    backgroundColor: '#06437A',
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  headingExpanded: {
    minHeight: '2rem',
    height: '2.25rem',
    backgroundColor: '#FFA500',
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  typography: {
      opacity: 1,
    fontWeight: 'normal',
    color: 'white',
  },
});



export default withStyles(styles)(ClothingAccordion);
