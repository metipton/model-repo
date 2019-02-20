import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {tileDataLeft, tileDataRight} from './TileData';

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
  container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ddd',
      height: 200,
      width: '100%',
  },
  gridList: {
    boxSizing: 'border-box',
    display: 'block',
    // flexWrap: 'wrap',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingLeft: '70px',
    // paddingRight: '70px',
    // backgroundColor: '#ddd',
    height: 200,
    width: '100%',
  },
  subheader: {
    width: '100%',
  },
  gridListTile: {
      height: '100px',
      width: '100px',
      margin: '3px',
      padding: '3px',
      '&:hover': {
        border: 'solid 2px',
        borderColor: '#FFA500'
      },
  },
  gridListTileSelected: {
      height: '100px',
      width: '100px',
      margin: '3px',
      padding: '3px',
      border: 'solid 2px',
      borderColor: '#FFA500',
  },
  image: {
      height: '100%',
      width: '100%'
  },
  lock: {
      opacity: '.4',
      '&:hover': {
          opacity: '.9'
      }
  }
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
