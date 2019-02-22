import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import cssClasses from './ItemsAccordion.css';

import HandHeldGridList from './GridLists/HandHeldGridList/GridList';
import SideGridList from './GridLists/SideGridList/GridList';
import BackGridList from './GridLists/BackGridList/GridList';


class BaseAccordion extends Component {
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
                    expandIcon: classes.expandIcon
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                  HandHeld
                </Typography>
              </ExpansionPanelSummary>
                  <HandHeldGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
            </ExpansionPanel>
        </div>

         <div className={cssClasses.Accordion}>
            <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    expandIcon: classes.expandIcon
                    }}
                expandIcon={<ExpandMoreIcon className={classes.typography} />}>
                <Typography className={classes.typography}>
                  Side
                </Typography>
              </ExpansionPanelSummary>
                  <SideGridList state={this.props.state} updateSelection={this.props.updateSelection}/>
            </ExpansionPanel>
        </div>

        <div className={cssClasses.Accordion}>
            <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
              <ExpansionPanelSummary
                  classes={{
                    root: classes.heading, // class name, e.g. `classes-nesting-root-x`
                    expanded: classes.headingExpanded, // class name, e.g. `classes-nesting-label-x`
                    expandIcon: classes.expandIcon
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
    opacity: .8,
  },
  heading: {
      '&:hover': {
        backgroundColor: '#FFA500',
      },
    border: 'solid',
    height: '2rem',
    borderRadius: '10',
    backgroundColor: '#06437A',
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    minHeight: '2rem',
  },
  headingExpanded: {
    backgroundColor: '#FFA500',
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  typography: {
    margin: 0,
    opacity: 1,
    fontWeight: 'normal',
    color: 'white',
  },
  expandIcon: {
    backgroundColor: 'transparent',
    height: '.25rem',
  }
});



export default withStyles(styles)(BaseAccordion);
