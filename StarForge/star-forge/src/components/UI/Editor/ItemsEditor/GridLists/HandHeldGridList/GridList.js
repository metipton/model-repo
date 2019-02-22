import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {tileDataLeft, tileDataRight} from './TileData';
import styles from '../../../PictureStyle';

class ImageGridList extends Component {


    clickHandler = (category, selection) => {
        this.props.updateSelection(category, selection);
    };

    render() {
        const {classes} = this.props;

        return (
        <div className={classes.root}>
          <GridList cellHeight={150} className={classes.gridList} cols={1}>
            {tileDataRight.map((tile, index) => (
                <div className={classes.container} key = {index}>
                  <GridListTile
                      className={(this.props.state.selected.HandRight === tile.name) ? classes.gridListTileSelected : classes.gridListTile}
                      cols={tile.cols || 1}
                      onClick={() => this.clickHandler('HandRight', tile.name)}>
                    <img className={classes.image}  src={tileDataRight[index].img} alt={tileDataRight[index].title} />
                  </GridListTile>

                  <GridListTile
                      className={(this.props.state.currentName.HandLeft === tile.name) ? classes.gridListTileSelected : classes.gridListTile}
                      cols={tileDataRight[index].cols || 1}
                      onClick={() => this.clickHandler('HandLeft', tileDataRight[index].name)}>
                    <img className={classes.image}  src={tileDataLeft[index].img} alt={tileDataLeft[index].title} />
                  </GridListTile>
              </div>
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
