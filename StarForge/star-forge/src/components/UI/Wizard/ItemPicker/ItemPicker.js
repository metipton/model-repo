import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: '50%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
});

const width = 50;

const widthModifier = {
  width: `${width}px`,
  minWidth: `${width}px`,
  border: '1px solid grey'
};



export default function ItemPicker(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState("Chest");

  function handleChange(event, newValue) {
    setValue(newValue);
    props.updateItemPicker(newValue);
    console.log(newValue)
  }

  return (
    <Paper square className={classes.root}>
      <Tabs
        value={value}
        scrollButtons="on"
        onChange={handleChange}
        variant="scrollable"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab icon={<FontAwesomeIcon className={classes.icon} icon={['fas', 'tshirt']} size="1x" />} style={widthModifier} value="Chest" />
        <Tab icon={<FontAwesomeIcon className={classes.icon} icon={['fas', 'mitten']} size="1x" />} style={widthModifier} value="Gloves" />
        <Tab icon={<PersonPinIcon />} style={widthModifier} value="LegsWearable"/>
        <Tab icon={<FavoriteIcon />} style={widthModifier} value="Headwear"/>
        <Tab icon={<PersonPinIcon />} style={widthModifier} value="Back"/>
        <Tab icon={<PersonPinIcon />} style={widthModifier} value="Feet"/>
        <Tab icon={<PersonPinIcon />} style={widthModifier} value="Handheld"/>
        <Tab icon={<PersonPinIcon />} style={widthModifier} value="Base"/>
      </Tabs>
    </Paper>
  );
}