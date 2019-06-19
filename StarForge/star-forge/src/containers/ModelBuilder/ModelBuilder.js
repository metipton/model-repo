import {connect} from 'react-redux';
import React, {Component} from 'react';
import {fbDatabase, fbStorage} from '../../Firebase';

import * as actions from '../../store/actions/index';
import classes from './ModelBuilder.css';
import Aux from '../../hoc/_Aux/_Aux';
import Editor from '../../components/UI/Editor/Editor';
import BottomBar from '../../components/UI/BottomBar/BottomBar';

import LoadingScreen from './LoadingScreen/LoadingScreen';
import BottomDrawer from '../../components/UI/BottomDrawer/BottomDrawer';
import Auth from '../../containers/auth0/Auth';
import Modal from '../../components/UI/Modal/Modal';
import ModalOrder from '../../components/UI/ModalOrder/ModalOrder'
import SavedModelsEditor from '../../components/UI/SavedModelsEditor/SavedModelsEditor';
import CheckoutForm from '../Checkout/CheckoutForm/CheckoutForm';
import BackdropOrder from '../../components/UI/Backdrop/BackdropOrder'
import SceneManager from './SceneManager';
import CharSelectButton from '../../components/UI/Button/CharSelectButton';
//import CharSelectButton from '../../components/UI/Button/CharSelectButton';


class ModelBuilder extends Component {

    state = {
        materials: {
            matType: 'Standard',
            price: 0,
            prices: null
        },
        modelName: 'Nameless',
        loading: true,
        coloringEnabled: false,
        RESOURCES_LOADED: false,
        numChars: 2
    }

    constructor (props) {
        super(props);
        this.sceneManager = new SceneManager(this, this.state.numChars);
    }

    async componentDidMount() {
        
        this.sceneManager.postMountInit(this.mount);
        await this.getPriceFromServer();
        //this.loadInitialModelAndObjects();
        const auth = new Auth();
        this.auth = auth;
    }

    authLogin = (callback) => {
        this.auth.login(callback);
    }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

  
    getPriceFromServer = () => {
        let prices = {};
        const database = fbDatabase.ref('Prices' );
        database.once("value").then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              // childData will be the actual contents of the child

                prices = {
                    ...prices,
                    [childSnapshot.key] : childSnapshot.val()
                };   
            })
        }).then( () => {
            this.setState({
                ...this.state,
                materials: {
                    ...this.state.materials,
                    "price": prices.Standard,
                    "prices": prices
                }

            })
        })  
    }


    exportScreenshotToCart = (cartNumber, size, image) => {
        return new Promise( ( resolve, reject ) => {
            fbStorage.ref( '/Carts/' + this.props.userId + '/CartItem' + cartNumber + '/screenshot-' + size + '.png' ).put(image).then((snapshot) => {
                snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    resolve(downloadURL);
                });
            }).catch( error => {
                reject(error);
            });
        });
    }

    exportScreenshotToSaved = (identifier, size, image) => {
        return new Promise( ( resolve, reject ) => {
            fbStorage.ref( '/Saved/' + this.props.userId + '/' + identifier + '/screenshot-' + size + '.png' ).put(image).then(() => {
                this.props.saveComplete();
                resolve();
            }).catch( error => {
                this.props.saveComplete();
                reject(error);
            });
        });
    }

    getCartNumber = () => {
        const url = "https://us-central1-starforge-153cc.cloudfunctions.net/getCartNumber?userid=" + this.props.userId;
        return new Promise( ( resolve, reject ) => {
            fetch(url)
                .then((response) => {
                    resolve(response.json())
                })
                .catch(() => {
                    try{
                        let currentCartNums = [];
                        for( let i = 0; i < this.props.currentCart.length; i++ ){
                            currentCartNums.push(this.props.currentCart[i].cartNumber);
                        }
                        currentCartNums.sort();
                        let cartNum = 0;
                        for(let i = 0; i < currentCartNums.length; i++ ){
                            if( cartNum !== currentCartNums[i]){
                                break;
                            }
                            cartNum++;
                        }
                        resolve(cartNum);
                    } catch(error){
                        reject(error);
                    };
                });
        })
    }
    

   addModelToCart = async () => {
        let func = this.addModelToCart;
        if(!this.props.userId){
            this.authLogin(func);
            return;
        }
        this.props.addInProgress();

        var cartNum = await this.getCartNumber();
        if(!Number.isInteger(cartNum)){
            cartNum = cartNum["cartNumber"];
        }

        var smallImage = this.sceneManager.takeScreenshot(140, 140);
        var largeImage = this.sceneManager.takeScreenshot(350, 350);
        let imageURL;
        try{
            await this.exportModelGLTF(cartNum);
            //this.exportModelSTL(cartNum);
            //this.exportModelOBJ(cartNum);
            await this.exportScreenshotToCart(cartNum, "sm", smallImage);
            imageURL = await this.exportScreenshotToCart(cartNum, "lg", largeImage);
        } catch(error){
            console.log(error);
            return;
        }

        const date = new Date();
        const dateString = date.toDateString();
        const timestamp = date.getTime();
        let payload = {
            cartNumber: cartNum,
            id: cartNum,
            title: this.state.modelName,
            matType: this.state.materials.matType,
            description: "30mm scale on 1 in. base",
            price: this.state.materials.price,
            currencyId: "USD",
            currencyFormat: "$",
            quantity: 1,
            isFreeShipping: false,
            shippingMode: this.props.shippingMode,
            timeStamp: timestamp,
            date: dateString,
            email: this.props.authEmail,
            image: imageURL
          };

        try {
        const database =  await fbDatabase.ref('users/' + this.props.userId + '/Cart/Items/' + cartNum + '/' );
        database.set(payload);
        } catch(error){
            console.log(error);
            return;
        }

        this.props.addToCart(payload);
     }


    

    clearItem = (item) => {

    }

    shareHero = () => {
        alert("Share hero");
    }

    saveModels = () => {
        let func = this.saveHero;
        if(!this.props.userId){
            this.authLogin(func);
            return;
        }
        const timestamp = new Date().getTime();

        let payload = this.sceneManager.getCompleteSaveState();
        payload = {
            ...payload,
            name: this.state.modelName
        }
        try {
            const database = fbDatabase.ref('users/' + this.props.userId + '/SavedModels/' + timestamp);
            database.set(payload);
            var largeImage = this.sceneManager.takeScreenshot(350, 350);
            this.exportScreenshotToSaved(timestamp, "lg", largeImage);
        } catch( error ){
            console.log(error);
            this.props.saveComplete();
        }

    }

    exportModelGLTF = async (cartNumber) => {

        let objects = this.sceneManager.getExportObjects();

        await this.sceneManager.cycleAllRaceModels();
        await this.sceneManager.cycleAllSkinnedMeshes();
        var DEFAULT_OPTIONS = {
            binary: true,
            trs: false,
            onlyVisible: true,
            truncateDrawRange: false,
            embedImages: false,
            forceIndices: true,
            forcePowerOfTwoTextures: false
        };
        //animations: this.sceneManager.animationScene.animations[0],
        this.sceneManager.exporter.parse(  objects, (object)=> {
  
            return new Promise( ( resolve, reject ) => {
                fbStorage.ref( '/Carts/' + this.props.userId + '/CartItem' + cartNumber + '/model.glb' ).put(object).then(() => {
                    this.props.finishedAdd();
                    resolve();
                }).catch( error => {
                    reject(error);
                });
            });
        }, DEFAULT_OPTIONS);
    }

    loadSavedHeroData = () => {
        if(!this.props.userId){
            return;
        }

        //query the RTDB to get the list of timestamps for the saved characters
        let timestamps = [];
        let payload = {};

        const database = fbDatabase.ref('users/' + this.props.userId + '/SavedModels' );
        database.once("value").then( async (snapshot) => {
            payload = snapshot.val();
            let promises = [];

            for(var timestamp in payload){
                timestamps.push(timestamp);
                promises.push(this.getSavedModelImage(payload, timestamp));
            }

            await Promise.all(promises);

            this.props.addSavedModels(payload, timestamps);
        })

    }

    getSavedModelImage = (payload, timestamp) => {
        const storage = fbStorage.ref();
        return new Promise( ( resolve, reject ) => {
            storage.child('/Saved/' + this.props.userId + '/' + timestamp  + '/screenshot-lg.png').getDownloadURL()
            .then( async (url) => {
                payload[timestamp].url = url;
                resolve();
            }).catch( error => {
                reject( error );
            });
    })}

    openSavedHeroModal = () => {
        let func = this.openSavedHeroModal;
        if(!this.props.userId){
            this.authLogin(func);
            return;
        }
        this.loadSavedHeroData();
        this.props.openSavedModal();
    }

    loadSavedModel = async (timestamp) => {
        this.props.loadInProgress();
        const savedState = this.props.byTimestamp[timestamp];
        //add in the name here to set the name
        let name = savedState.name;
        this.setState({
            ...this.state,

            modelName: name
        })
        await this.sceneManager.loadSavedModels(savedState);

        this.props.closeSavedModal();
        this.props.loadComplete();
    }

    renameSavedModel = (timestamp, newName) => {

        const database = fbDatabase.ref('users/' + this.props.userId + '/SavedModels/' + timestamp + '/name');

        database.set(newName).then(this.props.renameModel(timestamp, newName)).then(this.props.closeNameModal);
    }

    deleteSavedModel = (timestamp) => {
        const database = fbDatabase.ref('users/' + this.props.userId + '/SavedModels/' + timestamp);
        database.set(null).then(this.props.deleteSavedModel(timestamp)).then(this.props.closeDeleteModal);
    }

    nameChangeHandler = name => event => {
        this.setState({
          ...this.state,
          [name]: event.target.value,
        });
    };

    setMaterialHandler = (material) => {
        this.updateMaterialSelectionOnModels(material);
        const modelPrice = this.state.materials.prices[material];
        if(modelPrice && !this.state.materials.matType !== material){
            this.setState({
                ...this.state,
                selected: {
                    ...this.state.selected,
                    Material: material
                },
                materials: {
                    ...this.state.materials,
                    matType: material,
                    price: modelPrice
                }
            }, () => {
            });
        }
      }
    
      updateMaterialSelectionOnModels = (material) => {
          if( material === 'Standard'){
    
          } else if ( material === 'Premium') {
    
          } else if ( material === 'Steel' ){
    
          } else if (material === 'Bronze' ){
    
          } else if (material === 'Digital') {
    
          } 
      }

    onMouseDown = ( event ) => {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        if(this.state.coloringEnabled){

        }
    }

    loadingComplete = () => {
        this.setState({
            ...this.state,
            RESOURCES_LOADED: true
        })
    }


   render() {
    let screen = null;
    if(!this.state.RESOURCES_LOADED){
        screen = (
            <LoadingScreen/>
        );
    }

    let savedModal = (
        <Modal 
            show={this.props.savedModalOpen}
            modalClosed={this.props.closeSavedModal}>
            <SavedModelsEditor
                renameModel={(timestamp, newName) => this.renameSavedModel(timestamp, newName)}
                deleteModel={timestamp => this.deleteSavedModel(timestamp)}
                loadSavedModel={timestamp => this.loadSavedModel(timestamp)}/>
        </Modal>);

        let orderModal;
        if(this.props.checkoutOpen){
            orderModal = (
                <ModalOrder 

                    show={this.props.checkoutOpen}
                    modalClosed={this.props.closeOrderModal}>
                    <BackdropOrder show={this.props.orderState === "Pending"}/>
                    <CheckoutForm/>
                </ModalOrder>);
        }
    
     return (
        <Aux className={classes.ModelBuilder}>
            {savedModal}
            {orderModal}
            {screen}
            <div className={classes.CharSelect}>
                <CharSelectButton
                    setChar={(charNum) => this.sceneManager.setCurrentChar(charNum)}/>
            </div>

            <div
                style={{ width: '100vw', height: '100vh', position: 'absolute', top: '3rem'}}
                ref={(mount) => { this.mount = mount }}/>
            <Editor
                material={this.state.materials.matType}
                state={this.sceneManager.getCurrentCharState()}
                updateObject={(category, selection) => this.sceneManager.getCurrentChar().updateObjectHandler(category, selection, false)}
                setFeetLink={(index) => this.sceneManager.getCurrentChar().setFeetLinkHandler(index)}
                updateFeet={(category, selection) => this.sceneManager.getCurrentChar().setFeetHandler(category, selection)}
                setGloveLink={(index) => this.sceneManager.getCurrentChar().setGloveLinkHandler(index)}
                updateGlove={(category, selection) => this.sceneManager.getCurrentChar().setGloveHandler(category, selection)}
                updatePose={(pose) => this.sceneManager.setAllPoses(pose)} 
                updateExpression={(trait, newPercent) => this.sceneManager.getCurrentChar().updateExpressionPercent(trait, newPercent)}
                updateBodyTarget={(trait, newPercent) => this.sceneManager.getCurrentChar().updateBodyPercent(trait, newPercent)}
                updateMaterial={(material) => this.setMaterialHandler(material)}
                morphPercents={this.sceneManager.getCurrentCharState().morphTargets}/>

            <BottomBar 
                addToCart={this.addModelToCart}
                materialPrice={this.state.materials.price} />  
            <BottomDrawer
                name={this.state.modelName}
                resetModels={this.sceneManager.resetAllModels}
                saveModels={this.saveModels}
                shareHero={this.shareHero}
                openSavedHeroModal={this.openSavedHeroModal}
                changeName={(name) => this.nameChangeHandler(name)}/>  
        </Aux>

     )
   }
}


const mapStateToProps = state => {
    return {
        currentCart: state.shoppingCart.cartProducts.items,
        userId: state.auth.userId,
        addInProgress: state.shoppingCart.cartProducts.addInProgress,
        savedModalOpen: state.savedModal.modalOpen,
        byTimestamp: state.savedModal.modelByTimestamp,
        authEmail: state.auth.email,
        checkoutOpen: state.order.inCheckoutScreen,
        shippingMode: state.shoppingCart.cartTotals.mode,
        orderState: state.order.orderState
    };
};

const mapDispatchToProps = dispatch => {
    return {
        finishedLoading: () => dispatch(actions.modelFinishedLoading()),
        addToCart: (payload) => dispatch(actions.addProduct(payload)),
        finishedAdd: () => dispatch(actions.completedAddToCart()),
        addInProgress: () => dispatch(actions.addInProgress()),
        openSavedModal: () => dispatch(actions.openSavedModal()),
        closeSavedModal: () => dispatch(actions.closeSavedModal()),
        addSavedModels: (payload, timestamps) => dispatch(actions.addSavedModels(payload, timestamps)),
        saveComplete: ()=>dispatch(actions.saveComplete()),
        loadInProgress: ()=>dispatch(actions.loadInProgress()),
        loadComplete: ()=>dispatch(actions.loadComplete()),
        renameModel: (timestamp, newName)=>dispatch(actions.renameSavedModel(timestamp, newName)),
        closeNameModal: () => dispatch(actions.closeNameModal()),
        closeDeleteModal: () => dispatch(actions.closeDeleteModal()),
        deleteSavedModel: (timestamp) => dispatch(actions.removeSavedModel(timestamp)),
        openOrderModal: () => dispatch(actions.openOrderModal()),
        closeOrderModal: () => dispatch(actions.closeOrderModal())
    };
};

ModelBuilder.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(ModelBuilder);
