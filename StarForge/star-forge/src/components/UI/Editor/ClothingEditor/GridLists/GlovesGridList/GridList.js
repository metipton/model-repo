import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {tileDataLeft, tileDataRight} from './TileData';
import lock from '../locks/lock_24px.png';
import unlock from '../locks/unlock_24px.png';
import styles from '../../../PictureStyle';


class ImageGridList extends Component {


    clickHandler = (category, selection) => {
        this.props.updateGlove(category, selection);
    };


    render() {
        const {classes} = this.props;

        return (
        <div className={classes.root}>
          <GridList cellHeight={120} className={classes.gridList} cols={1}>
            {tileDataRight.map((tile, index) => (
                <div className={classes.container} key = {index}>
                  <GridListTile
                      className={(this.props.state.selected.GloveRight === tile.name) ? classes.gridListTileSelected : classes.gridListTile}
                      cols={tile.cols || 1}
                      onClick={() => this.clickHandler('GloveRight', tile.name)}>
                     <img className={classes.image}  src={tileDataRight[index].img} alt={tileDataRight[index].title} />
                  </GridListTile>

                  {this.props.state.links.gloves.linked ?
                      <img
                          className={classes.lock}
                          src={lock}
                          onClick={() => this.props.gloveLink(index)}/> :
                      <img
                          className={classes.lock}
                          src={unlock}
                          onClick={() => this.props.gloveLink(index)}/>}

                  <GridListTile
                      className={(this.props.state.selected.GloveLeft === tile.name) ? classes.gridListTileSelected : classes.gridListTile}
                      cols={tileDataRight[index].cols || 1}
                      onClick={() => this.clickHandler('GloveLeft', tileDataRight[index].name)}>
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
