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
                    className={(this.props.material === 'Standard') ? classes.MaterialSelected : classes.Material}
                    onClick={() => this.clickHandler('Standard')}
                    style={{marginTop: '0px'}}>Standard Plastic</div>
                <div
                    className={(this.props.material === 'Premium') ? classes.MaterialSelected : classes.Material}
                    onClick={() => this.clickHandler('Premium')}>Premium Plastic</div>
                <div
                    className={(this.props.material === 'Steel') ? classes.MaterialSelected : classes.Material}
                    onClick={() => this.clickHandler('Steel')}>Steel</div>
                <div
                    className={(this.props.material === 'Bronze') ? classes.MaterialSelected : classes.Material}
                    onClick={() => this.clickHandler('Bronze')}>Bronze</div>
                <div
                    className={(this.props.material === 'Digital') ? classes.MaterialSelected : classes.Material}
                    onClick={() => this.clickHandler('Digital')}>Digital Download</div>
            </div>
        );
    };
}

export default GenreEditor;
