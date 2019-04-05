import React from 'react';
import classes from './ItemDescriptionCard.css';

const ItemDescriptionCard = (props) => (
    <div className={classes.orderItemContainer}>
        <img className={classes.Image} src={props.image} alt="Item_image"/>
        <div className={classes.Info}>
            <p className={classes.Name}>{props.name}</p>
            <p>{props.description}</p>
            <p>{props.material}</p>
        </div>
        <div className={classes.Price}>
            ${props.price}
        </div>
    </div>
);

export default ItemDescriptionCard;