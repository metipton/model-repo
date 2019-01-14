import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import cssClasses from './BodyAccordion.css';

import TorsoGridList from './GridLists/TorsoGridList/GridList';
import LegsGridList from './GridLists/LegsGridList/GridList';
import TailGridList from './GridLists/TailGridList/GridList';
import BackGridList from './GridLists/BackGridList/GridList';
import MeasurementsEditor from './GridLists/MeasurementsEditor/GridList';


class BodyAccordion extends Component {
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

    const styles = theme => ({
      // Look at here: applied specific styles to resizing and background
      expansion: {
        height: "500px"
      }
    });

    return (
      <div className={classes.root}>
          <div>
            <ExpansionPanel className={styles.expansion} expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                 Torso
                </Typography>
              </ExpansionPanelSummary>
                  <TorsoGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
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
                  Legs
                </Typography>
              </ExpansionPanelSummary>
                  <LegsGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
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
                  Measurements
                </Typography>
              </ExpansionPanelSummary>
                <MeasurementsEditor
                    updateBodyTarget={this.props.updateBodyTarget}
                    morphPercents={this.props.morphPercents}/>
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
                  Tail
                </Typography>
              </ExpansionPanelSummary>
                  <TailGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
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
                  Back
                </Typography>
              </ExpansionPanelSummary>
                  <BackGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
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
    opacity: .8
  },
  heading: {
      '&:hover': {
        backgroundColor: '#4c4e51',
      },
    border: 'solid',
    borderRadius: '10',
    backgroundColor: '#5d809d',
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  headingExpanded: {
    backgroundColor: '#4c4e51',
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  headingContent: {

  },
  secondaryHeading: {
      width: '100%',
      border: 'solid',
      backgroundColor: 'lightgrey',
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  typography: {
      opacity: 1,
    fontWeight: 'bold',
    color: 'white',
  },
});



export default withStyles(styles)(BodyAccordion);
