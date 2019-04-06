import React from 'react';
import classes from './ItemDescriptionCard.css';

const ItemDescriptionCard = (props) => (
    <div className={classes.orderItemContainer}>
        <div className={classes.ImageContainer}>
            <div className={classes.ImageContainer2}>
                <img className={classes.Image} src={props.image} alt="Item_image"/>
            </div>
        </div>
        <div className={classes.Info}>
            <div className={classes.InfoContainer}>
                <p className={classes.Name}>{props.name}</p>
                <p className={classes.Para}>{props.description}</p>
                <p className={classes.Para}>{props.material}</p>
            </div>
        </div>
        <div className={classes.Price}>
            ${props.price}
        </div>
    </div>
);

export default ItemDescriptionCard;