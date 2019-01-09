import React, {Component} from 'react';

import classes from './MaterialEditor.css';

class GenreEditor extends Component {




    clickHandler = (material) => {
        this.props.updateMaterial(material);
    };

    render() {

        return (
            <div className={classes.Container}>
                <div
                    className={(this.props.state.currentName.Material === 'Standard') ? classes.MaterialSelected : classes.Material}
                    onClick={() => this.clickHandler('Standard')}>Standard Plastic</div>
                <div
                    className={(this.props.state.currentName.Material === 'Premium') ? classes.MaterialSelected : classes.Material}
                    onClick={() => this.clickHandler('Premium')}>Premium Plastic</div>
                <div
                    className={(this.props.state.currentName.Material === 'Steel') ? classes.MaterialSelected : classes.Material}
                    onClick={() => this.clickHandler('Steel')}>Steel</div>
                <div
                    className={(this.props.state.currentName.Material === 'Bronze') ? classes.MaterialSelected : classes.Material}
                    onClick={() => this.clickHandler('Bronze')}>Bronze</div>
                <div
                    className={(this.props.state.currentName.Material === 'Digital') ? classes.MaterialSelected : classes.Material}
                    onClick={() => this.clickHandler('Digital')}>Digital Download</div>
            </div>
        );
    };
}

export default GenreEditor;
