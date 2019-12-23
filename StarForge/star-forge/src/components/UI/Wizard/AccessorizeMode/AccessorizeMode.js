import React from 'react';
import ItemPicker from '../ItemPicker/ItemPicker';
import CharacterSelector from '../CharacterSelector/CharacterSelector'
import ColorPicker from 'coloreact';


import GlovesGridList from '../../Editor/ClothingEditor/GridLists/GlovesGridList/GridList'
import ChestGridList from '../../Editor/ClothingEditor/GridLists/ChestGridList/GridList'
import LegsGridList from '../../Editor/ClothingEditor/GridLists/LegsGridList/GridList'
import FeetGridList from '../../Editor/ClothingEditor/GridLists/FeetGridList/GridList'
import HeadwearGridList from '../../Editor/ClothingEditor/GridLists/HeadwearGridList/GridList'
import HandheldGridList from '../../Editor/ItemsEditor/GridLists/HandHeldGridList/GridList'
import BackGridList from '../../Editor/ItemsEditor/GridLists/BackGridList/GridList'


function AccessorizeMode(props) {

  let selection = null;
      
  switch(props.itemPicker) {
    case "Chest":
      selection = (
        <ChestGridList state={props.state} updateSelection={props.updateSelection}/>
      );
      break;
    case "Gloves":
      selection = (
        <GlovesGridList
          updateGlove={props.updateGlove}
          gloveLink={props.setGloveLink} 
          state={props.state}/>
      );
      break;
    case "LegsWearable":
      selection = (
        <LegsGridList state={props.state} updateSelection={props.updateSelection}/>
      );
      break;
    case "Headwear":
      selection = (
        <HeadwearGridList state={props.state} updateSelection={props.updateSelection}/>
      );
      break;
    case "Back":
      selection = (
        <BackGridList state={props.state} updateSelection={props.updateSelection}/>
      );
      break;
    case "Feet":
      selection = (
        <FeetGridList
          state={props.state}
          feetLink={props.setFeetLink}
          updateFeet={props.updateFeet}/>
      );
      break;
    case 6:
      selection = null;
      break;
    case 7:
    selection = null;
    break;

    default:
      selection = null;
  }



  return (
    <div>
        <div>
          <CharacterSelector setChar={props.setChar}/>
          <ItemPicker updateItemPicker={props.updatePicker}/>
          {selection}
          <div>
            <ColorPicker 
              style={{ position: 'relative', height: '300px', width: '100%', paddingLeft: '1.3em' }} 
              color="408fa3" 
              onChange={color => props.setColor(props.itemPicker, color.hex)}/> 
          </div>   
        </div>     
    </div>
  );
}

export default (AccessorizeMode);