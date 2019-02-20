import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import tileData from './TileData';
import Slider from '../../../../SliderExpression/Slider';

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
  subheader: {
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
  image: {
      height: '100%',
      width: '100%'
  },
  lock: {
      opacity: '.4',
      '&:hover': {
          opacity: '.9'
      }
  },
  slider: {
      margin: 'auto',
      height: '30px',
      width: '90%',

  },
  text: {
      textAlign: 'center',
      color: 'black',
      fontWeight: 'bold',
      fontSize: '.8rem',
  }
});


class ImageGridList extends Component {

    getGridListCols = () => {
        if (isWidthUp('xl', this.props.width)) {
          return 6;
        }
    
        if (isWidthUp('lg', this.props.width)) {
          return 3;
        }
    
        if (isWidthUp('md', this.props.width)) {
          return 2;
        }
    
        return 1;
      }

    clickHandler = (category, selection, panel) => {
        this.props.updateSelection(category, selection);
    };


    render() {
        let smile = 'Smile';
        let cocky = 'Cocky';
        let snarl = 'Snarl';
        let confused = 'Confused';
        let embarrassed = 'Embarrassed';

        const {classes} = this.props;
        return (
        <div className={classes.root}>
            <div>
              <GridList cellHeight={80} className={classes.gridList} cols={6}>
                {tileData.map(tile => (
                      <GridListTile
                          className={(this.props.state.selected.Expression === tile.name) ? classes.gridListTileSelected : classes.gridListTile}
                          key={tile.img}
                          cols={tile.cols || 1}
                          onClick={() => this.clickHandler('Expression', tile.name, tile.name)}>
                        <img className={classes.image}  src={tile.img} alt={tile.title} />
                      </GridListTile>
                ))}
              </GridList>
          </div>
          <div className={classes.text}>
              <span className={classes.text} >{smile}</span>
          </div>

          <div className={classes.slider}>
            <Slider 
              name = {smile}
              startVal={20} 
              morphPercents={this.props.morphPercents}
              updateExpression={this.props.updateExpression}/>
          </div>

          <div className={classes.text}>
              <span className={classes.text}>{cocky}</span>
          </div>

          <div className={classes.slider}>
              <Slider 
                name={cocky}
                startVal={0} 
                morphPercents={this.props.morphPercents}
                updateExpression={this.props.updateExpression}/>
          </div>

          <div className={classes.text}>
              <span className={classes.text}>{snarl}</span>
          </div>

          <div className={classes.slider}>
             <Slider 
                startVal={0} 
                name={snarl}
                morphPercents={this.props.morphPercents}
                updateExpression={this.props.updateExpression}/>
          </div>

          <div className={classes.text}>
              <span className={classes.text}>{confused}</span>
          </div>

          <div className={classes.slider}>
            <Slider 
              name={confused}
              startVal={0}
              morphPercents={this.props.morphPercents}
              updateExpression={this.props.updateExpression} />
          </div>

          <div className={classes.text}>
              <span className={classes.text}>{embarrassed}</span>
          </div>

          <div className={classes.slider}>
            <Slider
              name={embarrassed} 
              startVal={0}
              morphPercents={this.props.morphPercents}
              updateExpression={this.props.updateExpression} /> 
          </div>

        </div>
        );
    }
}

ImageGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withWidth()(withStyles(styles)(ImageGridList));
