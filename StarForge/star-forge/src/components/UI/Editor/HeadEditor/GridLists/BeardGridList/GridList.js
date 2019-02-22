import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import tileData from './TileData';
import styles from '../../../PictureStyle';


class ImageGridList extends Component {


    clickHandler = (category, selection, panel) => {
        this.props.updateSelection(category, selection);
    };


    render() {
        const {classes} = this.props;
        return (
        <div className={classes.root}>
          <GridList cellHeight={100} className={classes.gridList} cols={5}>
            {tileData.map(tile => (
              <GridListTile
                  className={(this.props.state.selected.Beard === tile.name) ? classes.gridListTileSelected : classes.gridListTile}
                  key={tile.img}
                  cols={tile.cols || 1}
                  onClick={() => this.clickHandler('Beard', tile.name, tile.name)}>
                <img className={classes.image}  src={tile.img} alt={tile.title} />
              </GridListTile>
            ))}
          </GridList>

        </div>
        );
    }
}

ImageGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageGridList);
