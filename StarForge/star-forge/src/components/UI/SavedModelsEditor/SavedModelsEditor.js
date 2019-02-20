import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import classes from './SavedModelsEditor.css';
import Aux from '../../../hoc/_Aux/_Aux';
import SavedModelToolbar from '../SavedModelsEditor/SavedModelToolbar/SavedModelToolbar';
import SavedModelFooter from './SavedModelFooter/SavedModelFooter';

const styles = theme => ({
    root: {
      position: 'relative',
      left: 0,
      top: 0,
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-around',
      overflow: 'auto',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      boxSizing: 'border-box',
      display: 'block',
      justifyContent: 'space-between',
      textAlign: 'center',
      // flexWrap: 'wrap',
      // alignItems: 'center',
      // justifyContent: 'space-between',
      // paddingLeft: '70px',
      // paddingRight: '70px',
      // backgroundColor: '#ddd',
      height: 100,
      width: '100%',
    },
    gridListTile: {
        display: 'inline-block',
        height: '40px',
        width: '40px',
        margin: '3px',
        padding: '3px',
        '&:hover': {
          border: 'solid 2px',
          borderColor: '#FFA500'
        },
    },
    gridListTileSelected: {
        display: 'inline-block',
        height: '100px',
        width: '100px',
        margin: '3px',
        padding: '3px',
        border: 'solid 2px',
        borderColor: '#FFA500',
    },
  });

class SavedModelsEditor extends Component {

    state = {
        selected: null
    }

    clickHandler = (name) => {
        this.setState({
            selected: name
        });
    }
    render() {
         return (
            <Aux className={classes.SavedModelsEditor}>
              <SavedModelToolbar/>
              <SavedModelFooter/>
            </Aux>
    
         )
       }
}

{/* <GridList cellHeight={80} className={classes.gridList} cols={6}>
{this.props.SavedModels.map(tile => (
      <GridListTile
          className={(this.state.selected === tile.name) ? classes.gridListTileSelected : classes.gridListTile}
          key={tile.img}
          cols={tile.cols || 1}
          onClick={() => this.clickHandler(tile.name)}>
        <img className={classes.image}  src={tile.img} alt={tile.title} />
      </GridListTile>
))}
</GridList> */}

export default withStyles(styles)(SavedModelsEditor);