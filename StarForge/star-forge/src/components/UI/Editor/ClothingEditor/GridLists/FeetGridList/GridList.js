import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {tileDataLeft, tileDataRight} from './TileData';
import lock from '../locks/lock_24px.png';
import unlock from '../locks/unlock_24px.png';

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
        this.props.updateFeet(category, selection);
    };


    render() {
        const {classes} = this.props;
        return (
        <div className={classes.root}>
          <GridList cellHeight={150} className={classes.gridList} cols={1}>
            {tileDataLeft.map((tile, index) => (
                <div className={classes.container} key = {index}>
                  <GridListTile
                      className={(this.props.state.currentName.Feet === tile.name) ? classes.gridListTileSelected : classes.gridListTile}
                      cols={tile.cols || 1}
                      onClick={() => this.clickHandler('FootLeft', tile.name)}>
                    <img className={classes.image}  src={tile.img} alt={tile.title} />
                  </GridListTile>
                  <img className={classes.lock} src={lock} />
                  <GridListTile
                      className={(this.props.state.currentName.Feet === tile.name) ? classes.gridListTileSelected : classes.gridListTile}
                      cols={tileDataRight[index].cols || 1}
                      onClick={() => this.clickHandler('FootRight', tileDataRight[index].name)}>
                    <img className={classes.image}  src={tileDataRight[index].img} alt={tileDataRight[index].title} />
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
