import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import tileData from './TileData';

const styles = theme => ({
  root: {
    position: 'relative',
    left: 0,
    top: 0,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '70px',
    paddingRight: '70px',
    backgroundColor: '#ddd',
    height: 200,
    width: '100%',
  },
  subheader: {
    width: '100%',
  },
  gridListTile: {
      height: 'auto',
      width: 'auto',
      margin: '3px',
      padding: '3px',
      '&:hover': {
        border: 'solid 2px',
        borderColor: '#FFA500'
      },
  },
  gridListTileSelected: {
      margin: '3px',
      padding: '3px',
      border: 'solid 2px',
      borderColor: '#FFA500',
  },
  image: {
      height: '100%',
      width: '100%'
  },
});


/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *     cols: 2,
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
class ImageGridList extends Component {


    clickHandler = (category, selection, panel) => {
        this.props.updateSelection(category, selection);
    };


    render() {
        const {classes} = this.props;
        return (
        <div className={classes.root}>
          <GridList cellHeight={150} className={classes.gridList} cols={3}>
            {tileData.map(tile => (
              <GridListTile
                  className={(this.props.state.currentName.BaseItem === tile.name) ? classes.gridListTileSelected : classes.gridListTile}
                  key={tile.img}
                  cols={tile.cols || 1}
                  onClick={() => this.clickHandler('BaseItem', tile.name, tile.name)}>
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
