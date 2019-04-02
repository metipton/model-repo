import * as THREE from 'three';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import firebase from '../../Firebase';
import 'firebase/storage';
import axios from '../../axios-orders.js';
import GLTFLoader from 'three-gltf-loader';
import GLTFExporter from 'three-gltf-exporter';


import * as actions from '../../store/actions/index';
import classes from './ModelBuilder.css';
import Aux from '../../hoc/_Aux/_Aux';
import OrbitControls from 'three-orbitcontrols';
import Editor from '../../components/UI/Editor/Editor';
import BottomBar from '../../components/UI/BottomBar/BottomBar';
import px from './skybox/scifi-px.jpg';
import nx from './skybox/scifi-nx.jpg';
import py from './skybox/scifi-py.jpg';
import ny from './skybox/scifi-ny.jpg';
import pz from './skybox/scifi-pz.jpg';
import nz from './skybox/scifi-nz.jpg';
import SideDrawerColor from '../../components/UI/SideDrawerColor/SideDrawerColor';
import LoadingScreen from './LoadingScreen/LoadingScreen';
import BottomDrawer from '../../components/UI/BottomDrawer/BottomDrawer';
import Auth from '../../containers/auth0/Auth';
import Modal from '../../components/UI/Modal/Modal';
import ModalOrder from '../../components/UI/ModalOrder/ModalOrder'
import SavedModelsEditor from '../../components/UI/SavedModelsEditor/SavedModelsEditor';
import CheckoutForm from '../Checkout/CheckoutForm/CheckoutForm';


class ModelBuilder extends Component {

    state = {
        selected: {
            Genre: 'Sci-fi',
            Race: '',
            Face: '',
            Expression: '',
            Ears: '',
            Hair: '',
            Beard: '',
            Eyebrows: '',
            Eyes: '',
            Teeth: '',
            Horns: '',
            Forehead: '',
            Torso: '',
            Legs: '',
            Headwear: '',
            Shoulders: '',
            Chest: '',
            GloveLeft: '',
            GloveRight: '',
            Gloves: '',
            FootLeft: '',
            FootRight: '',
            LegsWearable: '',
            HandRight: '',
            HandLeft: '',
            Back: '',
            Mask: '',
            UpperFace: '',
            LowerFace: '',
            Base: '',
            BaseItem: '',
            Pet: '',
            Pose: '',
        },
        currentName: {
            Genre: 'Sci-fi',
            Race: '',
            Face: '',
            Expression: '',
            Ears: '',
            Hair: '',
            Beard: '',
            Eyebrows: '',
            Eyes: '',
            Teeth: '',
            Horns: '',
            Forehead: '',
            Torso: '',
            Legs: '',
            Headwear: '',
            Shoulders: '',
            Chest: '',
            GloveLeft: '',
            GloveRight: '',
            Gloves: '',
            FootLeft: '',
            FootRight: '',
            LegsWearable: '',
            HandRight: '',
            HandLeft: '',
            Back: '',
            Mask: '',
            UpperFace: '',
            LowerFace: '',
            Base: '',
            BaseItem: '',
            Pet: '',
            Pose: '',
        },
        cache: {
            Race: {},
            Face: {},
            Expression: {},
            Ears: {},
            Hair: {},
            Beard: {},
            Eyebrows: {},
            Eyes: {},
            Teeth: {},
            Horns: {},
            Forehead: {},
            Torso: {},
            Legs: {},
            Headwear: {},
            Shoulders: {},
            Chest: {},
            GloveLeft: {},
            GloveRight: {},
            Gloves: {},
            Feet: {},
            FootLeft: {},
            FootRight: {},
            LegsWearable: {},
            HandRight: {},
            HandLeft: {},
            Back: {},
            Mask: {},
            UpperFace: {},
            LowerFace: {},
            Base: {},
            BaseItem: {},
            Pet: {},
            Pose: {},
        },
        currentObject: {
            Race: null,
            Face: null,
            Expression: null,
            Ears: null,
            Hair: null,
            Beard: null,
            Eyebrows: null,
            Eyes: null,
            Teeth: null,
            Horns: null,
            Forehead: null,
            Torso: null,
            Legs: null,
            Headwear: null,
            Shoulders: null,
            Chest: null,
            GloveLeft: null,
            GloveRight: null,
            Gloves: null,
            Feet: null,
            FootLeft: null,
            FootRight: null,
            LegsWearable: null,
            HandRight: null,
            HandLeft: null,
            Back: null,
            Mask: null,
            UpperFace: null,
            LowerFace: null,
            Base: null,
            BaseItem: null,
            Pet: null,
            Pose: null,
        },
        links: {
            feet: {
                linked: true,
                shoes: {
                    FootLeft: false,
                    FootRight: false
                }
            },
            gloves: {
                linked: true,
                gloves: {
                    GloveLeft: false,
                    GloveRight: false
                }
            }
        },
        materials: {
            matType: 'Standard',
            price: 0,
            prices: null
        },
        modelName: 'Nameless',
        loading: true,
        coloringEnabled: false,
        RESOURCES_LOADED: false
    }


    constructor(props) {
     super(props)

     this.start = this.start.bind(this)
     this.stop = this.stop.bind(this)
     this.animate = this.animate.bind(this)
     this.setObjectStateHandler = this.setObjectStateHandler.bind(this)
     this.loadModelFromMemory = this.loadModelFromMemory.bind(this);
    }


    componentDidMount() {
       this.init();
       this.getPriceFromServer();
       this.loadInitialModelAndObjects();
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
        const database = firebase.database().ref('Prices' );
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




    
    updateExpressionPercent = (trait, newPercent) => {
        // let expCounter = 0;
        // let sum = 0;
        let expressions = this.morphTargets.expression;
        expressions[trait].percent = newPercent;
        this.updateMorphTargets( trait, newPercent);
        // for( let exp in expressions){
        //     sum += expressions[exp].percent;
        //     expCounter++;
        // }
        // console.log(sum);
        // if( sum > 150 ) {
        //     let diffSpread = (sum - 150) / (expCounter - 1);
        //     for( let exp in expressions){
        //         if( exp !== trait) {
        //             if(expressions[exp].percent - diffSpread > 0){
        //                 expressions[exp].percent -= diffSpread;
        //             } else {
        //                 expressions[exp].percent = 0;
        //             }
        //         }
        //     }
        // }
    }

    updateBodyPercent = (trait, newPercent) => {
        let bodyTargets = this.morphTargets.body; 
        bodyTargets[trait].percent = newPercent;
        this.updateMorphTargets(trait, newPercent);
    }

    updateMorphTargets = (trait, newPercent) => {
        var objects = this.objectHolder.children;
        for(let i = 0; i < objects.length; i++) {
            let dictionary = null;
            let influences = null;
            if(objects[i].morphTargetDictionary 
                && objects[i].morphTargetInfluences){
                dictionary = objects[i].morphTargetDictionary;
                influences = objects[i].morphTargetInfluences;
            } else {
                continue;
            }
            for(var morph in dictionary){
                if( morph === trait){
                    influences[dictionary[morph]] = (newPercent / 100);
                }
            }
        }
    }

    applyMorphTargetsOnImport = (object) => {
        if(!object.isSkinnedMesh || !object.morphTargetDictionary 
            || !object.morphTargetInfluences) {
            return;
        }
        let dictionary = object.morphTargetDictionary;
        let influences = object.morphTargetInfluences;
        for(var morph in dictionary){
            if(this.morphTargets.body[morph]){
                influences[dictionary[morph]] = (this.morphTargets.body[morph].percent / 100 );
            } else {
                influences[dictionary[morph]] = (this.morphTargets.expression[morph].percent / 100 );
            }
        }

    }


    resizeRendererToDisplaySize = (renderer) => {
        const canvas = renderer.domElement;
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }

    init = () => {

        this.resetState = {};
        this.skyBox = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hexColor = 0xFFFFFF;
        this.THREE = THREE;
        this.gltfLoader = new GLTFLoader();
        this.exporter = new GLTFExporter();
        this.mixer = null;
        this.animationScene = null;
        this.subclips = {};
        this.actions = {};
        this.clock = new THREE.Clock();
        this.bones = [];
        this.currentMesh = null;
        this.skeleton = null;
        this.armatureLoaded = false;



        this.objectPool = {
            Race: {},
            Face: {},
            Expression: {},
            Ears: {},
            Hair: {},
            Beard: {},
            Eyebrows: {},
            Eyes: {},
            Teeth: {},
            Horns: {},
            Forehead: {},
            Torso: {},
            Legs: {},
            Headwear: {},
            Shoulders: {},
            Chest: {},
            GloveLeft: {},
            GloveRight: {},
            Gloves: {},
            Feet: {},
            FootLeft: {},
            FootRight: {},
            LegsWearable: {},
            HandRight: {},
            HandLeft: {},
            Back: {},
            Mask: {},
            UpperFace: {},
            LowerFace: {},
            Base: {},
            BaseItem: {},
            Pet: {},
            Pose: {},
        }

        this.morphTargets = {
            body: {
               Height: {percent: 0},
               Weight: {percent: 0},
               Build: {percent: 0},
               Muscularity: {percent: 0},
               Bust: {percent: 0},
               Waist: {percent: 0},
               Curves: {percent: 0},
               Booty: {percent: 0} 
            },
            expression: {
                Smile: {percent: 0},
                Cocky: {percent: 0},
                Snarl: {percent: 0},
                Confused: {percent: 0},
                Embarrassed: {percent: 0}
            }
        }


        //create materials for different printing mats
        const metalMat = new THREE.MeshStandardMaterial( {

            color: 0xffffff,
        
            roughness: .1,
            metalness: 1,
        
        } );

        //all scene managing objects
        this.numObjects = 0;
        this.allScenes = [];
        this.allObjectHolders = [];


        //add picking event listeners
        window.addEventListener('mousemove', this.setPickPosition);
        window.addEventListener('mouseout', this.clearPickPosition);
        window.addEventListener('mouseleave', this.clearPickPosition);
      
        window.addEventListener('touchstart', (event) => {
          // prevent the window from scrolling
          event.preventDefault();
          this.setPickPosition(event.touches[0]);
        }, {passive: false});
      
        window.addEventListener('touchmove', (event) => {
          this.setPickPosition(event.touches[0]);
        });
      
        window.addEventListener('touchend', this.clearPickPosition);

        //main scene objects
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        const scene = new THREE.Scene();
        this.scene = scene;
        const objectHolder = new THREE.Object3D();
        this.objectHolder = objectHolder;
        this.objectHolder.name = "Object Holder";
        this.scene.add(this.objectHolder);
        this.armatureHolder = new THREE.Object3D();
        this.armatureHolder.name = "Armature Holder";
        this.scene.add(this.armatureHolder);


        let camera = new THREE.PerspectiveCamera(
          50,
          width / height,
          0.1,
          1000
        )
        //offset view so model shifts to left side of the screen
        this.camera = camera;
        this.camera.setViewOffset(width * 1.3, height * 1.3, width * .25, height * .15, width, height );
        this.camera.frustrumCulled = false;
        this.camera.position.z = 5.5;
        this.camera.position.y = 2;
        this.scene.add(this.camera);
        this.initCameraPosit = this.camera.getWorldPosition();
        this.initCameraRotation = this.camera.getWorldQuaternion();




        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.gammaOutput = true;


        //enable orbit controls
        const controls = new OrbitControls(this.camera, renderer.domElement);
        controls.enabled = true;
        controls.enablePan = false;
        controls.minDistance = 4;
        controls.maxDistance = 6.5;
        controls.target = new THREE.Vector3(0, 1.25, 0);
        controls.update();
        // How far you can orbit vertically, upper and lower limits.
        // Range is 0 to Math.PI radians.
        controls.minPolarAngle = 0; // radians
        controls.maxPolarAngle = Math.PI / 2; // radians

        //changes the size of screen when browser resized
        window.addEventListener('resize', this.onWindowResize, false);

        //add event listener for mouse actions
        window.addEventListener( 'mousedown', this.onMouseDown, false );
        window.addEventListener( 'mouseup', this.onMouseUp, false);



        var hemiLight = new THREE.HemisphereLight( 0x111111, 0x111111, 0.7 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 50, 0 );
        scene.add( hemiLight );

        //
        var dirLight = new THREE.DirectionalLight( 0x111111, 1 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( -.25, 1.75, 1 );
        dirLight.position.multiplyScalar( 30 );
        scene.add( dirLight );
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 8192;
        dirLight.shadow.mapSize.height = 8192;
        dirLight.shadow.camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 0.1, 1000 );


       //add the skybox
       var geometry = new THREE.CubeGeometry(70, 70, 70);
       var cubeMaterials = [
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(px), side: THREE.DoubleSide}),
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(nx), side: THREE.DoubleSide}),
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(py), side: THREE.DoubleSide}),
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(ny), side: THREE.DoubleSide}),
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(pz), side: THREE.DoubleSide}),
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(nz), side: THREE.DoubleSide}),
       ];
       var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
       this.skyBox = new THREE.Mesh(geometry, cubeMaterial);
       this.skyBox.name = 'skybox';
       this.skyBox.receiveShadow = true;
       scene.add(this.skyBox);

       //make the ground
       var groundGeo = new THREE.PlaneBufferGeometry( 20, 20 );
       var groundMat = new THREE.MeshPhongMaterial( { color: 0xcecdd6, side: THREE.DoubleSide } );
       groundMat.transparent = true;
       groundMat.opacity = 0.1;
       this.ground = new THREE.Mesh( groundGeo, groundMat );
       this.ground.receiveShadow = true;
       this.ground.rotation.x = Math.PI / 2;
       this.ground.renderOrder = 1;
       this.ground.name = "ground";
       this.scene.add(this.ground);
       this.ground.position.y = -.1;

       renderer.setClearColor('#000000')
       renderer.setSize(width, height)

       this.scene = scene
       this.renderer = renderer

       this.mount.appendChild(this.renderer.domElement)
       this.start()

       return scene;
    }

   start = () => {
     if (!this.frameId) {
       this.frameId = requestAnimationFrame(this.animate)
     }
   }

   stop = () => {
     cancelAnimationFrame(this.frameId)
   }

   animate = () => {
        requestAnimationFrame( this.animate );
        var delta = this.clock.getDelta();
        if (this.mixer !== null && this.mixer !== undefined) {
            this.mixer.update(delta);
        };
        this.renderScene();
   }

   renderScene = () => {
     this.renderer.render(this.scene, this.camera)
     if(this.state.loading){
         this.props.finishedLoading();
         this.setState({
             ...this.state,
             loading: false
         })
     }
     	// update the picking ray with the camera and mouse position

   }

   setInitialStateFromDatabase = () => {
    return new Promise( ( resolve, reject ) => {

        axios.get( '/Initial.json' )
        .then( response => {
            this.setState( {
                ...this.state,
                currentName : response.data
            })
        }).then ( () => {
            resolve();
        })
        .catch( error => {
            reject( error );
        });
    });
}

   async loadInitialModelAndObjects () {
       await this.setInitialStateFromDatabase();
       await this.updateObjectHandler('Race', this.state.currentName['Race'], true, this.setObjectStateHandler);
       const results = Object.keys(this.state.currentName).map(async( i ) => {
           if(this.state.currentName[i] !== "''" && i !== 'Pose' && i !== 'Race') {
              return this.updateObjectHandler(i, this.state.currentName[i], true, this.setObjectStateHandler);
          }
       });

       //this makes sure all the above async calls are complete before applying the pose.
       Promise.all(results).then(() => {    
            this.setState({
                ...this.state,
                RESOURCES_LOADED: true
            })});
            this.resetState = this.state;
   }


   async updateObjectHandler(category, selection, fromInit) {
        this.setState({
            ...this.state,
            selected: {
                ...this.state.selected,
                [category] : selection
            }});

       const alreadyInCache = this.isObjectInCache(category, selection);

       if(!alreadyInCache){
           try {

               const downloadedFile = await this.downloadObjectFromStorage(category, selection);
               await this.loadModelToMemory(category, selection, downloadedFile);
               await this.setObjectStateHandler(category, selection, downloadedFile, true, fromInit);

           } catch (error) {
               this.setState({
                   ...this.state,
                   selected: this.state.currentName
               });
           }
        } else {
            try {

                await this.setObjectStateHandler(category, selection, this.state.cache[category][selection], false, fromInit);

            } catch (error) {
                this.setState({
                    ...this.state,
                    selected: this.state.currentName
                });
            }
       }
   }

   downloadObjectFromStorage = ( category, selection ) => {
       return new Promise( ( resolve, reject ) => {

           firebase.storage().ref( '/Models/' + category + '/' + selection + '.glb' )
               .getDownloadURL()
               .then( url => {
                   var xhr = new XMLHttpRequest();
                   xhr.responseType = 'blob';
                   xhr.onload = function( event ) {
                       resolve( xhr.response );
                   };
                   xhr.open( 'GET', url );
                   xhr.send();
               })
               .catch(error => {
                    console.log(error);
                    this.setState({
                        ...this.state,
                        selected: this.state.currentName
                    });
               })
       });
   }

   loadMultipleModelsToMemory = async (categoryArr, selectionArr) => {
       //set the selected at the beginning of the load
       this.setState(prevState => {
           let newSelect = prevState.selected;
           for(let i = 0; i < categoryArr.length; i++){
                newSelect = {
                    ...newSelect,
                    [categoryArr[i]]: selectionArr[i]
                } 
            }
           return {
                ...prevState.state,
                selected: newSelect
            }
        });

        //download all files at the same time, load them to the cache
        const results = categoryArr.map(async (category, index) => {
            if(category !== 'Pose' && !this.isObjectInCache( category, selectionArr[index])){
                return this.downloadObjectFromStorage( category, selectionArr[index])
                .then(async (file) => {
                    return this.loadModelToMemory(category, selectionArr[index], file);
                })
            }
        }) 

        //this makes sure all the above async calls are complete before editing scene
        return Promise.all(results);
    }

    processMultipleModels = (categoryArr, selectionArr) => {
        for(let i = 0; i < categoryArr.length; i++){
            let category = categoryArr[i];
            let selection = selectionArr[i];
            let object = this.objectPool[categoryArr[i]][selectionArr[i]].scene;
            let child;
            child = object.children[0].getObjectByProperty('type', 'SkinnedMesh');
            if(child === undefined || child == null) {
                child = object.children[0].getObjectByProperty('type', 'Mesh'); 
            }
            child.frustumCulled = false;
            child.castShadow = true;
            child.category = category;
            child.name = category;
            child.selection = selection;
            this.objectPool= {
                ...this.objectPool,
                [category] : {
                    ...this.objectPool[category],
                    [selection]: child
                }
            }
        }
    }

   loadModelToMemory = (category, selection, file) => {
    return new Promise((resolve, reject) => {
        const url = (file !== null ? window.URL.createObjectURL(file) : this.state.cache[category][selection]);
        this.gltfLoader.load(
            url,
            async (object) => {
                this.objectPool= {
                    ...this.objectPool,
                    [category] : {
                        ...this.objectPool[category],
                        [selection]: object
                    }
                }
                resolve();
            },
             null,
            (error) => {
                console.log(error);
                this.setState({
                    ...this.state,
                    selected: this.state.currentName
                });
                reject(error);
            }
        )
    });
   }


    async setObjectStateHandler (category, selection, downloadedFile, fromDownload, fromInit) {
        return new Promise(async (resolve, reject) => {
            try{
                var prevName = category;
                //if clicking already selected object
                if(this.state.currentName[category] !== selection || fromInit) {
                    if(fromDownload){
                        const url = window.URL.createObjectURL(downloadedFile);
                        this.setState({
                            ...this.state,
                            selected: {
                                ...this.state.selected,
                                [category] : selection
                            },
                            currentName: {
                                ...this.state.currentName,
                                [category] : selection
                            },
                            cache: {
                                ...this.state.cache,
                                [category] : {
                                    ...this.state.cache[category],
                                    [selection]: url
                                }
                            },
                            currentObject: {
                                ...this.state.currentObject,
                                [category]: url
                            },
                        }, async update => {
                            await this.updateSceneObject(category, selection, fromDownload, prevName);
                            resolve();
                        })
                    } else {
                        this.setState({
                            ...this.state,
                            selected: {
                                ...this.state.selected,
                                [category] : selection
                            },
                            currentName: {
                                ...this.state.currentName,
                                [category] : selection
                            },
                            currentObject: {
                                ...this.state.currentObject,
                                [category]: this.state.cache[category][selection]
                            }
                        }, async update => {
                            await this.updateSceneObject(category,selection, fromDownload, prevName);
                            resolve();
                        })
                    }
                } else {
                    if(category !== 'Race') {
                        this.removeObjectFromScene(category);
                        this.setState({
                            ...this.state,
                            selected: {
                                ...this.state.currentName,
                                [category] : "''"
                            },
                            currentName: {
                                ...this.state.currentName,
                                [category] : "''"
                            },
                            currentObject: {
                                ...this.state.currentObject,
                                [category]: null
                            }
                        }, update => {
                            resolve();
                        })
                    }
                }
            } catch (error) {
                console.log(error);
                this.setState({
                    ...this.state,
                    selected: this.state.currentName
                });
            }
        })
    }

    async updateSceneObject ( category, selection, fromDownload, prevName ) {
        return new Promise( async (resolve, reject ) => {
            try{

               if( selection && this.state.currentObject[category] !== null ){
                   try {
                       //const object = await this.loadModelFromCache(category,  this.state.currentObject[ category ] );
                       const object = this.loadModelFromMemory(category, selection, fromDownload);
                       if( prevName !== "''" ){
                           this.removeObjectFromScene( prevName );
                       }

                       object.name = category;

                       if(category === 'Race' && !this.armatureLoaded){
                            this.scene.add( object);
                            object.children[0].name = 'skeleton';
                            
                            let model = object.children[0].getObjectByProperty('type', 'SkinnedMesh');

                            let parent = object.children[0];
                            model.name = category;
                            THREE.SceneUtils.attach(model, parent, this.objectHolder);
                            THREE.SceneUtils.attach(parent, parent.parent, this.armatureHolder);
                            this.scene.remove(object);
                            this.armatureLoaded = true;
                            
                       } else {
                        this.setupObjectImport(category, selection, fromDownload, object)
                       }
                   } catch ( error ) {
                    console.log(error);
                    this.setState({
                        ...this.state,
                        selected: this.state.currentName
                    });
                   }
               };
               resolve();
       } catch ( error ) {
            console.log(error);
            this.setState({
                ...this.state,
                selected: this.state.currentName
            });
           reject( error );
       }})
   }



   loadModelFromMemory = (category, selection, fromDownload) => {
       let object = this.objectPool[category][selection];
       if( category === 'Race' && !this.armatureLoaded ){
            object.scene.name = 'skeleton';
            this.animationScene = object;
            this.mixer = new THREE.AnimationMixer(object.scene);
            var allAction = this.mixer.clipAction( object.animations[ 0 ] );

            for( let i = 0; i < object.animations[0].tracks[0].times.length; i++) {
                let poseNum = "Pose" + ( i + 1 );
                this.subclips = {
                    ...this.subclips,
                    [poseNum]: THREE.AnimationUtils.subclip( allAction._clip, poseNum, i, i + 1  )
                };

            }
            let modelObj = object.scene.children[0].getObjectByProperty('type', 'SkinnedMesh');
            modelObj.castShadow = true;
            this.objectPool[category][selection] = modelObj;
            this.skeleton = modelObj.skeleton;
            this.bones = this.skeleton.bones;

            for( let clip in this.subclips ) {
                this.mixer.clipAction( this.subclips[clip]);
                this.actions[clip] = this.mixer.clipAction( this.subclips[clip]);
            }

            
            //set the pose to current selected pose if not select, else set to pose 1
            this.setPoseByName(this.state.currentName['Pose']);
        }
        if(fromDownload){
            return object.scene;
        } else {
            return object;
        }
    
   }

   loadModelForExport = (category, url) => {
    return new Promise((resolve, reject) => {
        this.gltfLoader.load(
            url,
            async (object) => {
                var actions = {};
                if( category === 'Race'){

                    var mixer = new THREE.AnimationMixer(object.scene);
                     var allAction = this.mixer.clipAction( object.animations[ 0 ] );

                     for( let i = 0; i < object.animations[0].tracks[0].times.length; i++) {
                         let poseNum = "Pose" + ( i + 1 );
                         var subclips = {
                             ...this.subclips,
                             [poseNum]: THREE.AnimationUtils.subclip( allAction._clip, poseNum, i, i + 1  )
                         };

                     }
                     object.scene.children[0].getObjectByName('Race').castShadow = true;

                     for( let clip in subclips ) {
                        mixer.clipAction( subclips[clip]);
                         actions[clip] = mixer.clipAction( subclips[clip]);
                     }
                    var pose = this.state.currentName['Pose'];

                    if (actions[pose]) {
                        mixer.stopAllAction();
                        actions[pose].clampWhenFinished = true;
                        actions[pose].setLoop(this.THREE.LoopOnce);
                        actions[pose].play();
                    }
                }
                resolve(object.scene);
            },
             null,
            (error) => {
                reject(error);
            }
        )
    });
   }

    loadNewArmatureFromMemory = ( url) => {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url,
                async (object) => {

                this.animationScene = object;

                this.mixer = new THREE.AnimationMixer(object.scene);
                var allAction = this.mixer.clipAction( object.animations[ 0 ] );

                    for( let i = 0; i < object.animations[0].tracks[0].times.length; i++) {
                        let poseNum = "Pose" + ( i + 1 );
                        this.subclips = {
                            ...this.subclips,
                            [poseNum]: THREE.AnimationUtils.subclip( allAction._clip, poseNum, i, i + 1  )
                        };

                    }
                    let model = object.scene.children[0].getObjectByProperty('type', 'SkinnedMesh');

                    model.castShadow = true;
                    this.skeleton = model.skeleton;
                    this.bones = this.skeleton.bones;

                    for( let clip in this.subclips ) {
                    this.mixer.clipAction( this.subclips[clip]);
                    this.actions[clip] = this.mixer.clipAction( this.subclips[clip]);
                }

                
                //set the pose to current selected pose if not select, else set to pose 1
                this.setPoseByName(this.state.currentName['Pose']);

                    
                resolve(object.scene.children[0]);
                },
                 null,
                (error) => {
                    console.log(error);
                    reject(error);
                }
            )
        });
     }


     setPoseByName = (pose) => {
         if (this.actions[pose]) {
             this.mixer.stopAllAction();
             this.actions[pose].clampWhenFinished = true;
             this.actions[pose].setLoop(this.THREE.LoopOnce);
             this.actions[pose].play();
         }
     }

     setPoseHandler = (pose) => {
         if(this.actions[pose]) {
             this.setPoseByName(pose);
         }
         this.setState({
             ...this.state,
             selected: {
                ...this.state.selected,
                Pose : pose
            },
             currentName: {
                 ...this.state.currentName,
                 Pose : pose
             }
         }, () => {
         });
     }

     setFeetHandler = (category, selection) => {
         if(this.state.links.feet.linked){
             this.setState(prevState => ({
                 ...this.state,
                 links: {
                    ...this.state.links,
                    feet: {
                        linked: true,
                        shoes: {
                            FootLeft: !prevState.links.feet.shoes.FootLeft,
                            FootRight: !prevState.links.feet.shoes.FootRight
                        }
                    }
                }
            }), async () => {
                await this.updateObjectHandler("FootLeft", selection, false );
                 this.updateObjectHandler("FootRight", selection, false);
             })
         } else {
             this.setState(prevState => ({
                 ...this.state,
                 links: {
                     ...this.state.links,
                     feet: {
                         linked: false,
                         shoes: {
                             ...this.state.links.feet.shoes,
                             [category]: !prevState.links.feet.shoes[category]
                         }
                     }
                 }
             }), () => {
                this.updateObjectHandler(category, selection, false);
             })
         }
     }

     setGloveHandler = (category, selection) => {
         if(this.state.links.gloves.linked){
             this.setState(prevState => ({
                 ...this.state,
                 links: {
                    ...this.state.links,
                    gloves: {
                        linked: true,
                        gloves: {
                            GloveLeft: !prevState.links.gloves.gloves.GloveLeft,
                            GloveRight: !prevState.links.gloves.gloves.GloveRight
                        }
                    }
                }
            }), async () => {
                 await this.updateObjectHandler("GloveLeft", selection, false );
                 this.updateObjectHandler("GloveRight", selection, false);
             })
         } else {
             this.setState(prevState => ({
                 ...this.state,
                 links: {
                     ...this.state.links,
                     gloves: {
                         linked: false,
                         gloves: {
                             ...this.state.links.gloves.gloves,
                             [category]: !prevState.links.gloves.gloves[category]
                         }
                     }
                 }
             }), () => {
                this.updateObjectHandler(category, selection, false);
             })
         }
     }

     setGloveLinkHandler = (index) => {
         if(this.state.links.gloves.linked ||
             (!this.state.links.gloves.linked && (this.state.links.gloves.gloves.GloveLeft === this.state.links.gloves.gloves.GloveRight))) {
             this.setState(prevState => ({
                 ...prevState,
                 links: {
                     ...prevState.links,
                     gloves: {
                         ...prevState.links.gloves,
                         linked: !prevState.links.gloves.linked
                     }
                 }
             }), () => {
             })
         } else {
             this.setState(prevState => ({
                 ...prevState,
                 links: {
                     ...prevState.links,
                     gloves: {
                         linked: true,
                         gloves: {
                             GloveLeft: true,
                             GloveRight: true
                         }
                     }
                 }
             }), () => {
                 let num = index + 1;
                 let selection = "Glove" + num.toString();
                 if( this.state.currentName.GloveLeft === selection) {
                     this.updateObjectHandler("GloveRight", selection, false)
                 } else {
                     this.updateObjectHandler("GloveLeft", selection, false)
                 }
             })
         }
     }

     setFeetLinkHandler = (index) => {
         if(this.state.links.feet.linked ||
             (!this.state.links.feet.linked && (this.state.links.feet.shoes.FootLeft === this.state.links.feet.shoes.FootRight))) {
             this.setState(prevState => ({
                 ...this.state,
                 links: {
                     ...this.state.links,
                     feet: {
                         ...this.state.links.feet,
                         linked: !prevState.links.feet.linked
                     }
                 }
             }), () => {
             })
         } else {
             this.setState(prevState => ({
                 ...this.state,
                 links: {
                     ...this.state.links,
                     feet: {
                         linked: true,
                         shoes: {
                             FootLeft: true,
                             FootRight: true
                         }
                     }
                 }
             }), () => {
                 let num = index + 1;
                 let selection = "Foot" + num.toString();
                 if( this.state.currentName.FootLeft === selection) {
                     this.updateObjectHandler("FootRight", selection, false)
                 } else {
                     this.updateObjectHandler("FootLeft", selection, false)
                 }
             })
         }
     }

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



    isObjectInCache = (category, selection) => {
        let inCache = false;
        for (var object in this.objectPool[category]) {
            if(object === selection) {
                inCache = true;
                break;
            }
        }
        return inCache;
    }

   removeObjectFromScene = (category) => {
       var selectedObject = this.objectHolder.getObjectByName(category);
       this.objectHolder.remove(selectedObject);
   }

   getBoneByCategory = (category) => {
       var bone;
       switch(category) {
            case 'Base':
                bone = this.getBoneByName("rigcurrent_base");
                return bone;
            case 'Beard':
                bone = this.getBoneByName("rigcurrent_MCH-hand_ik_rootL");
                return bone;
            case 'Chest':
                bone = this.getBoneByName("rigcurrent_MCH-hand_ik_rootL");
                return bone;
            case 'FootLeft':
                bone = this.getBoneByName("rigcurrent_MCH-foot_ik_rootL");
                return bone;
            case 'FootRight':
                bone = this.getBoneByName("rigcurrent_MCH-foot_ik_rootR");
                return bone;
            case 'GloveLeft':
                bone = this.getBoneByName("rigcurrent_MCH-hand_ik_rootL");
                return bone;
            case 'GloveRight':
                bone = this.getBoneByName("rigcurrent_MCH-hand_ik_rootR");
                return bone;
            case 'HandLeft':
                bone = this.getBoneByName("rigcurrent_MCH-hand_ik_rootL");
                return bone;
            case 'HandRight':
                bone = this.getBoneByName("rigcurrent_MCH-hand_ik_rootR");
                return bone;
            case 'Headwear':
                bone = this.getBoneByName("rigcurrent_MCH-hand_ik_rootL");
                return bone;
            case 'LegsWearable':
                bone = this.getBoneByName("rigcurrent_MCH-foot_ik_rootL");
                return bone;
            default:
                return;
            }
   }

   setupObjectImport(category, selection, fromDownload, object) {
       let child;
       if(fromDownload){

            child = object.children[0].getObjectByProperty('type', 'SkinnedMesh');
            if(child === null || child === undefined){
                child = object.children[0].getObjectByProperty('type', 'Mesh'); 
            }
            child.frustumCulled = false;
            child.castShadow = true;
            child.category = category;
            child.selection = selection;
            this.objectPool= {
                ...this.objectPool,
                [category] : {
                    ...this.objectPool[category],
                    [selection]: child
                }
            }

       } else {
            child = object;
       }

        let bone = this.getBoneByCategory(category);
       //imported heirachy scene->object3D->skinnedmesh
        try {
            child.material.skinning = true;
            child.skeleton = this.skeleton;
            child.bind(child.skeleton, bone.matrixWorld);
        } catch (error){
            //console.log(error);
        }
        if(fromDownload){
            THREE.SceneUtils.attach(child, child.parent, this.objectHolder);
        } else {
            this.objectHolder.add(child);
        }

        this.applyMorphTargetsOnImport(child);
        child.name = category;
   }

   getBoneByName = (name) =>
   {
       for(let i = 0; i < this.bones.length; i++){
           if( this.bones[i].name === name){
               return this.bones[i];
           }
       }
       return null;
   }

   
   setHexColor = (color) => {
       this.hexColor = color;
   }


    cloneGltf = (gltf) => {

        let newScene = new THREE.Scene();
        newScene.add(gltf);
        const clone = {
        animations: gltf.animations,
        scene: gltf.children[0].clone(true)
        };
    
        const skinnedMeshes = {};
    
        gltf.children[0].traverse(node => {
            if (node.isSkinnedMesh) {
                skinnedMeshes[node.name] = node;
            }
        });
    
        const cloneBones = {};
        const cloneSkinnedMeshes = {};
    
        clone.scene.traverse(node => {
            if (node.isBone) {
                cloneBones[node.name] = node;
            }
    
            if (node.isSkinnedMesh) {
                cloneSkinnedMeshes[node.name] = node;
            }
        });
    
        for (let name in skinnedMeshes) {
            const skinnedMesh = skinnedMeshes[name];
            const skeleton = skinnedMesh.skeleton;
            const cloneSkinnedMesh = cloneSkinnedMeshes[name];
        
            const orderedCloneBones = [];
    
        for (let i = 0; i < skeleton.bones.length; ++i) {
            const cloneBone = cloneBones[skeleton.bones[i].name];
            orderedCloneBones.push(cloneBone);
        }
    
        cloneSkinnedMesh.bind(
            new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
            cloneSkinnedMesh.matrixWorld);
        }
    
        return clone;
    }

    createPosedClone = (skinnedMesh) => {
         
        let clone = skinnedMesh.clone();
        var boneMatrices = this.skeleton.boneMatrices;
        var geometry = skinnedMesh.geometry;


        var position = geometry.attributes.position;
        var skinIndex = geometry.attributes.skinIndex;
        var skinWeight = geometry.attributes.skinWeight;
        
        var bindMatrix = skinnedMesh.bindMatrix;
        var bindMatrixInverse = skinnedMesh.bindMatrixInverse;
        
        var i, j, si, sw;
    

        var vertex = new THREE.Vector3();
        var temp = new THREE.Vector3();
        var skinned = new THREE.Vector3();
        var skinIndices = new THREE.Vector4();
        var skinWeights = new THREE.Vector4();
        var boneMatrix = new THREE.Matrix4();
        // non-indexed geometry
    
        for ( i = 0; i < position.count; i++ ) {
        
            vertex.fromBufferAttribute( position, i );
            skinIndices.fromBufferAttribute( skinIndex, i );
            skinWeights.fromBufferAttribute( skinWeight, i );
            
            // the following code section is normally implemented in the vertex shader

            vertex.applyMatrix4( bindMatrix ); // transform to bind space
            skinned.set( 0, 0, 0 );

            for ( j = 0; j < 4; j ++ ) {

                si = skinIndices.getComponent( j );
                sw = skinWeights.getComponent( j );
                boneMatrix.fromArray( boneMatrices, si * 16 );

                // weighted vertex transformation

                temp.copy( vertex ).applyMatrix4( boneMatrix ).multiplyScalar( sw );
                skinned.add( temp );

            }

            skinned.applyMatrix4( bindMatrixInverse ); // back to local space

            // change the position of the object

            var morphTargetArray = clone.geometry.morphAttributes.position;
            var morphInfluences = clone.morphTargetInfluences;
            var meshVertices = clone.geometry.attributes.position;

            var vA = new THREE.Vector3();
            var tempA = new THREE.Vector3();
            var target = new THREE.Vector3();
            var vertices = new THREE.Vector3();

            vertices.fromBufferAttribute(meshVertices, i); // the vertex to transform
            if(morphTargetArray){
                for ( var t = 0; t < morphTargetArray.length; t++ ) {
            
                    var influence = morphInfluences[ t ];
            
                    if ( influence === 0 ) continue;
            
                    target.fromBufferAttribute( morphTargetArray[t], i);
            
                    vA.addScaledVector( tempA.subVectors( target, vertices ), influence );
            
                }
            }
            skinned.add( vA ); // the transformed value

            clone.geometry.attributes.position.setXYZ(i, skinned.x, skinned.y, skinned.z);  
        }
        //now iterate over all
        return clone;
    }

    takeScreenshot = (height, width) => {

        //remove the skybox and ground
        this.scene.remove(this.skyBox);
        this.scene.remove(this.ground);
        // set camera and renderer to desired screenshot dimension
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        var color = new THREE.Color(0x000000);
        var imageRenderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } ); // init like this
        imageRenderer.shadowMap.enabled = true;
        imageRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
        imageRenderer.gammaOutput = true;
        imageRenderer.setClearColor( color, 0 );
        imageRenderer.setSize(width, height);
        //put the camera to null position and copy current posit/rotation
        let currentCamPosit = this.camera.getWorldPosition();
        let currentCamRotation = this.camera.getWorldQuaternion();
        this.camera.position.set(this.initCameraPosit.x, this.initCameraPosit.y, 4.1);
        this.camera.setRotationFromQuaternion(this.initCameraRotation);
        this.camera.clearViewOffset();
        this.camera.setViewOffset(width, height, 0, height * .28, width, height );
        imageRenderer.render( this.scene, this.camera, null, false );
    
        const dataURL = imageRenderer.domElement.toDataURL( 'image/png' );

        //convert datastring to file
        var arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'screenshot.png', {type:mime});
    
        // reset to old dimensions 

       this.camera.aspect = window.innerWidth / window.innerHeight;
       this.camera.updateProjectionMatrix();

       // put the camera back to position when screenshot taken
       this.camera.position.set(currentCamPosit.x, currentCamPosit.y, currentCamPosit.z);
       this.camera.setRotationFromQuaternion(currentCamRotation);
       this.camera.setViewOffset(window.innerWidth * 1.3, window.innerHeight * 1.3, window.innerWidth * .25, window.innerHeight * .15, window.innerWidth, window.innerHeight );


       //put the skybox and ground back in
       this.scene.add(this.skyBox);
       this.scene.add(this.ground);

       return file;
     }


     exportModelGLTF = async (cartNumber) => {
        let objects = [];


        let newScene = this.cloneGltf(this.scene)['scene'];

        //morph geometry of all objects to match the pose
        for(let i = 0; i < newScene.children.length; i++) {
            let child = newScene.children[i];
            if(child.name !== "rigcurrent"){
                let clone;
                if(child.isSkinnedMesh){
                    clone = this.createPosedClone(newScene.children[i]);
                } else {
                    clone = newScene.children[i].clone();
                }
                objects.push(clone);
            }
        }
        await this.cycleRaceModel();
        await this.cycleAllSkinnedMeshes();
        var DEFAULT_OPTIONS = {
            binary: true,
            trs: false,
            onlyVisible: true,
            truncateDrawRange: false,
            embedImages: false,
            animations: this.animationScene.animations[0],
            forceIndices: true,
            forcePowerOfTwoTextures: false
        };
    
        this.exporter.parse(  objects, (object)=> {

            return new Promise( ( resolve, reject ) => {
                firebase.storage().ref( '/Carts/' + this.props.userId + '/CartItem' + cartNumber + '/model.glb' ).put(object).then(() => {
                    this.props.finishedAdd();
                    resolve();
                }).catch( error => {
                    reject(error);
                });
            });
        }, DEFAULT_OPTIONS);
    }

    cycleRaceModel = async() => {

        //get new armature
        let newArmature = await this.getNewArmature(this.state.currentName['Race']);
        this.armatureHolder.remove(this.skeleton);
        this.armatureHolder.add(newArmature);

        //remove old race from object holder
        this.removeObjectFromScene('Race');

        //add new race to object holder
        newArmature.children[0].name = 'Race';
        this.objectPool['Race']['Race1'] = newArmature.children[0];
        THREE.SceneUtils.attach(newArmature.children[0], newArmature, this.objectHolder);

    }

    getNewArmature = async ( race, modelNum) => {
        const url = this.state.cache['Race'][race];
        let raceModel = await this.loadNewArmatureFromMemory(url);
        return raceModel;

    }

    cycleAllSkinnedMeshes = async () => {
        let current = this.state.currentName;

        let child;
        for(var category in current){
            let selection = current[category];
            if(current[category] !== "''" && category !== 'Race' && category !== 'Pose' ){
                await this.loadModelToMemory(category, selection, null);
                let smesh = this.loadModelFromMemory(category, selection, true);

                //remove the old object
                this.removeObjectFromScene(category);

                //make sure all miscellaneous attributes are assigned
                child = smesh.children[0].getObjectByProperty('type', 'SkinnedMesh');

                if(child === undefined || child === null){
                    child = smesh.children[0].getObjectByProperty('type', 'Mesh');
                }
                child.frustumCulled = false;
                child.castShadow = true;
                child.category = category;
                child.selection = selection;
                child.name = category;
                this.objectPool= {
                    ...this.objectPool,
                    [category] : {
                        ...this.objectPool[category],
                        [selection]: child
                    }
                }

                let bone = this.getBoneByCategory(category);

                //bind to armature
                try {
                    child.material.skinning = true;
                    child.skeleton = this.skeleton;
                    child.bind(child.skeleton, bone.matrixWorld);
                } catch (error){
                    //console.log(error);
                }
                this.applyMorphTargetsOnImport(child);
                //Need to apply facial expressions to the raceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
                //detach from parent and put in object holder
                THREE.SceneUtils.attach(child, child.parent, this.objectHolder);            
            }
        }

    }



    exportScreenshotToCart = (cartNumber, size, image) => {
        return new Promise( ( resolve, reject ) => {
            firebase.storage().ref( '/Carts/' + this.props.userId + '/CartItem' + cartNumber + '/screenshot-' + size + '.png' ).put(image).then((snapshot) => {
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
            firebase.storage().ref( '/Saved/' + this.props.userId + '/' + identifier + '/screenshot-' + size + '.png' ).put(image).then(() => {
                this.props.saveComplete();
                resolve();
            }).catch( error => {
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

        var smallImage = this.takeScreenshot(140, 140);
        var largeImage = this.takeScreenshot(350, 350);
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
            timeStamp: timestamp,
            date: dateString,
            email: this.props.authEmail,
            image: imageURL
          };

        try {
        //push payload to firebase database
        //const database = firebase.database().ref('Carts/' + this.props.userId + '/Cart' + cartNum + '/');
        const database =  await firebase.database().ref('users/' + this.props.userId + '/Cart/Items/' + cartNum + '/' );
        database.set(payload);
        } catch(error){
            console.log(error);
            return;
        }

        this.props.addToCart(payload);
     }


    // All the bottom bar functions are below
    resetHero = async () => {
        for(let i = this.objectHolder.children.length - 1; i >= 0; i--){
            let name = this.objectHolder.children[i].name;
            if(name !== 'Race' && name !== 'Base' && name !== 'Chest' && name !== 'LegsWearable'){
                this.removeObjectFromScene(name);
            } else {
                let selection = name + '1';
                if(selection !== this.state.currentName[name]){
                    await this.updateObjectHandler(name, selection, false );
                }
            }
        }
        this.setPoseHandler('Pose1');

        //set the correct state
        this.resetMorphTargets();
        //correct morph targets
        this.setState({
            ...this.state,
            selected: this.resetState.selected,
            currentName: this.resetState.currentName,
            currentObject: this.resetState.currentObject,
            links: this.resetState.links,
            materials: this.resetState.materials
        })
    }


    resetMorphTargets = () => {
        this.morphTargets = {
            body: {
               Height: {
                   percent: 0
                },
               Weight: {percent: 0},
               Build: {percent: 0},
               Muscularity: {percent: 0},
               Bust: {percent: 0},
               Waist: {percent: 0},
               Curves: {percent: 0},
               Booty: {percent: 0} 
            },
            expression: {
                Smile: {percent: 0},
                Cocky: {percent: 0},
                Snarl: {percent: 0},
                Confused: {percent: 0},
                Embarrassed: {percent: 0}
            }
        }

        for(var part in this.morphTargets.body){
            this.updateBodyPercent(part, 0);
        }
        for(var expression in this.morphTargets.expression){
            this.updateExpressionPercent(expression, 0);
        }

    }

    clearItem = (item) => {

    }

    shareHero = () => {
        alert("Share hero");
    }

    saveHero = () => {
        let func = this.saveHero;
        if(!this.props.userId){
            this.authLogin(func);
            return;
        }
        const timestamp = new Date().getTime();
        let payload = {
            objects: {
                ...this.state.currentName,

            },
            links: {
                ...this.state.links
            },
            name: this.state.modelName,
            morphTargets: this.morphTargets
          };

        const database = firebase.database().ref('users/' + this.props.userId + '/SavedModels/' + timestamp);
        database.set(payload);
        var largeImage = this.takeScreenshot(350, 350);
        this.exportScreenshotToSaved(timestamp, "lg", largeImage);
    }

    loadSavedHeroData = () => {
        if(!this.props.userId){
            return;
        }

        //query the RTDB to get the list of timestamps for the saved characters
        let timestamps = [];
        let payload = {};

        const database = firebase.database().ref('users/' + this.props.userId + '/SavedModels' );
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
        const storage = firebase.storage().ref();
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
        let name = savedState.name;
        let links = savedState.links;
        let morphTarget = savedState.morphTargets;
        let objects = savedState.objects;
        this.setState({
            ...this.state,
            links: links,
            modelName: name
        })

        let categoryArr = [];
        let selectionArr = [];
        //load all items not already in memory into memory
        for(var category in objects){
            if( objects[category] !== "''" && !this.isObjectInCache(category, objects[category]) && category !== 'Pose' ){
                categoryArr.push(category);
                selectionArr.push(objects[category]);
            }
        }

        await this.loadMultipleModelsToMemory(categoryArr, selectionArr);
        this.processMultipleModels(categoryArr, selectionArr);

        //iterate through all items and switch to saved items
        for(var category in objects){
            if(category !== 'Pose'){
                if(objects[category] === "''" && this.state.currentName[category] === "''"){
                    continue;
                } else if (objects[category] ===  this.state.currentName[category]) {
                    continue;
                } else if(objects[category] === "''" && this.state.currentName[category] !== "''") {
                    this.updateObjectHandler(category, this.state.currentName[category], false)
                } else {
                    this.updateObjectHandler(category, objects[category], false)
                } 
            }
        }

        //pose the model
        if(objects['Pose'] !== this.state.currentName['Pose']){
            this.setPoseHandler(objects['Pose']);
        }

        //apply morph targets
        this.morphTargets = morphTarget;

        for(var part in this.morphTargets.body){
            this.updateBodyPercent(part, this.morphTargets.body[part]['percent']);
        }
        for(var expression in this.morphTargets.expression){
            this.updateExpressionPercent(expression, this.morphTargets.expression[expression]['percent']);
        }

        this.props.closeSavedModal();
        this.props.loadComplete();

    }

    renameSavedModel = (timestamp, newName) => {

        const database = firebase.database().ref('users/' + this.props.userId + '/SavedModels/' + timestamp + '/name');

        database.set(newName).then(this.props.renameModel(timestamp, newName)).then(this.props.closeNameModal);

    }

    deleteSavedModel = (timestamp) => {
        const database = firebase.database().ref('users/' + this.props.userId + '/SavedModels/' + timestamp);
        database.set(null).then(this.props.deleteSavedModel(timestamp)).then(this.props.closeDeleteModal);
    }

    nameChangeHandler = name => event => {
        this.setState({
          ...this.state,
          [name]: event.target.value,
        });
      };

    onMouseDown = ( event ) => {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        if(this.state.coloringEnabled){

        }
    }


    onWindowResize = () => {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    toggleColorHandler = () => {
        this.setState(prevState => ({
            ...this.state,
            coloringEnabled: !prevState.coloringEnabled
        }));
    }

   render() {
    let morphTargetsProp = this.morphTargets;
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
                    modalClosed={this.props.closeCheckoutModal}>
                    <CheckoutForm/>
                </ModalOrder>);
        }
    
     return (
        <Aux className={classes.ModelBuilder}>
            {savedModal}
            {orderModal}
            {screen}
            <div
                style={{ width: '100vw', height: '100vh', position: 'absolute', top: '3rem'}}
                ref={(mount) => { this.mount = mount }}/>
            <Editor
                state={this.state}
                updateObject={(category, selection) => this.updateObjectHandler(category, selection, false)}
                setFeetLink={(index) => this.setFeetLinkHandler(index)}
                updateFeet={(category, selection) => this.setFeetHandler(category, selection)}
                setGloveLink={(index) => this.setGloveLinkHandler(index)}
                updateGlove={(category, selection) => this.setGloveHandler(category, selection)}
                updatePose={(pose) => this.setPoseHandler(pose)} 
                updateExpression={(trait, newPercent) => this.updateExpressionPercent(trait, newPercent)}
                updateBodyTarget={(trait, newPercent) => this.updateBodyPercent(trait, newPercent)}
                updateMaterial={(material) => this.setMaterialHandler(material)}
                morphPercents={morphTargetsProp}/>

            <BottomBar 
                addToCart={this.addModelToCart}
                materialPrice={this.state.materials.price} />  
            <BottomDrawer
                name={this.state.modelName}
                resetHero={this.resetHero}
                saveHero={this.saveHero}
                shareHero={this.shareHero}
                openSavedHeroModal={this.openSavedHeroModal}
                changeName={(name) => this.nameChangeHandler(name)}/>  
        </Aux>

     )
   }
}

{/* <SideDrawerColor 
toggleColor={this.toggleColorHandler} 
setColor={(color) => this.setHexColor(color)} /> */}
const mapStateToProps = state => {
    return {
        currentCart: state.shoppingCart.cartProducts.items,
        userId: state.auth.userId,
        addInProgress: state.shoppingCart.cartProducts.addInProgress,
        savedModalOpen: state.savedModal.modalOpen,
        byTimestamp: state.savedModal.modelByTimestamp,
        authEmail: state.auth.email,
        checkoutOpen: state.order.inCheckoutScreen
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
        saveInProgress: ()=>dispatch(actions.saveInProgress()),
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
