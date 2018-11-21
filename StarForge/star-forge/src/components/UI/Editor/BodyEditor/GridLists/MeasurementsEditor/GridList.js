import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from '../../../../SliderMeasurements/Slider';

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
        let height = 'Height';
        let weight = 'Weight';
        let build = 'Build';
        let muscularity = 'Muscularity';
        let bust = 'Bust';
        let waist = 'Waist';
        let curves = 'Curves';
        let booty = 'Booty';

        
        const {classes} = this.props;
        return (
        <div className={classes.root}>
          <div className={classes.text}>
              <span className={classes.text} >{height}</span>
          </div>

          <div className={classes.slider}>
            <Slider 
                startVal={20} 
                name={height}
                updateBodyTarget={this.props.updateBodyTarget}
                morphPercents={this.props.morphPercents}/>
          </div>

          <div className={classes.text}>
              <span className={classes.text}>{weight}</span>
          </div>

          <div className={classes.slider}>
              <Slider 
                  startVal={0} 
                  name={weight}
                  updateBodyTarget={this.props.updateBodyTarget}
                  morphPercents={this.props.morphPercents}/>
          </div>

          <div className={classes.text}>
              <span className={classes.text}>{build}</span>
          </div>

          <div className={classes.slider}>
             <Slider 
                 startVal={0}
                 name={build} 
                 updateBodyTarget={this.props.updateBodyTarget}
                 morphPercents={this.props.morphPercents}/>
          </div>

          <div className={classes.text}>
              <span className={classes.text}>{muscularity}</span>
          </div>

          <div className={classes.slider}>
            <Slider 
                startVal={0} 
                name={muscularity}
                updateBodyTarget={this.props.updateBodyTarget}
                morphPercents={this.props.morphPercents}/>
          </div>

          <div className={classes.text}>
              <span className={classes.text}>{bust}</span>
          </div>

          <div className={classes.slider}>
            <Slider 
                startVal={0} 
                name={bust}
                updateBodyTarget={this.props.updateBodyTarget}
                morphPercents={this.props.morphPercents}/> 
          </div>

          <div className={classes.text}>
              <span className={classes.text}>{waist}</span>
          </div>

          <div className={classes.slider}>
            <Slider 
                startVal={0}
                name={waist}
                updateBodyTarget={this.props.updateBodyTarget}
                morphPercents={this.props.morphPercents}/> 
          </div>

          <div className={classes.text}>
              <span className={classes.text}>{curves}</span>
          </div>

          <div className={classes.slider}>
            <Slider 
                startVal={0} 
                name={curves}
                updateBodyTarget={this.props.updateBodyTarget}
                morphPercents={this.props.morphPercents}/> 
          </div>

          <div className={classes.text}>
              <span className={classes.text}>{booty}</span>
          </div>

          <div className={classes.slider}>
            <Slider 
                startVal={0} 
                name={booty}
                updateBodyTarget={this.props.updateBodyTarget}
                morphPercents={this.props.morphPercents}/> 
          </div>

        </div>
        );
    }
}

ImageGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageGridList);
