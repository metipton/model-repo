import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import acc_classes from '../styles/accordion.css';
import GridList from './GridList/GridList';

class Accordion extends React.Component {
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
      <div >
        <ExpansionPanel className={classes.root}>
          expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary
              classes={{
                  root: 'classes.heading',
                  expanded: 'expanded', }
              }
            expandIcon={<ExpandMoreIcon className={classes.typography} />}>
            <Typography className={classes.typography}>
              General settings
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.secondaryHeading}>
              <GridList/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    width: '55%',
  },
  heading: {
    justifyContent: 'right',
    backgroundColor: 'darkgrey',
    fontSize: theme.typography.pxToRem(15),
    //flexBasis: '33.33%',
    //flexShrink: 0,
  },
  heading.expanded: {
    backgroundColor: '#FFA500',

  },
  secondaryHeading: {
    border: 'solid',
    backgroundColor: 'lightgrey',
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  typography: {
    fontWeight: 'bold',
    color: 'white',
  },
});


export default withStyles(styles)(Accordion);
