import * as THREE from 'three';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import firebase from '../../Firebase';
import 'firebase/storage';
import axios from '../../axios-orders.js';
import GLTFLoader from 'three-gltf-loader';

import * as actions from '../../store/actions/index';
import classes from './ModelBuilder.css';
import Aux from '../../hoc/_Aux/_Aux';
import OrbitControls from 'orbit-controls-es6';
import Editor from '../../components/UI/Editor/Editor';
import BottomBar from '../../components/UI/BottomBar/BottomBar';
import px from './skybox/scifi-px.jpg';
import nx from './skybox/scifi-nx.jpg';
import py from './skybox/scifi-py.jpg';
import ny from './skybox/scifi-ny.jpg';
import pz from './skybox/scifi-pz.jpg';
import nz from './skybox/scifi-nz.jpg';

var FBXLoader = require('three-fbx-loader');


class ModelBuilder extends Component {

    state = {
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
            Gloves: '',
            Feet: '',
            LegsWearable: '',
            RightHand: '',
            LeftHand: '',
            Back: '',
            Mask: '',
            UpperFace: '',
            LowerFace: '',
            Base: '',
            BaseItem: '',
            Pet: '',
            Pose: '',
            Material: ''
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
            Gloves: {},
            Feet: {},
            LegsWearable: {},
            RightHand: {},
            LeftHand: {},
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
            Gloves: null,
            Feet: null,
            LegsWearable: null,
            RightHand: null,
            LeftHand: null,
            Back: null,
            Mask: null,
            UpperFace: null,
            LowerFace: null,
            Base: null,
            BaseItem: null,
            Pet: null,
            Pose: null,
        },
        loading: true
    }


    constructor(props) {
     super(props)

     this.start = this.start.bind(this)
     this.stop = this.stop.bind(this)
     this.animate = this.animate.bind(this)
     this.setObjectStateHandler = this.setObjectStateHandler.bind(this)
     this.loadObjectFromCache = this.loadObjectFromCache.bind(this);
    }

    componentDidMount() {
       this.init();
       this.loadInitialModelAndObjects();
    }

    componentWillUnmount() {
     this.stop()
     this.mount.removeChild(this.renderer.domElement)
    }

    init = () => {
        this.THREE = THREE;
        this.loader = new FBXLoader();
        this.gltfLoader = new GLTFLoader();
        this.mixer;
        this.subclips = {};
        this.actions = {};
        this.clock = new THREE.Clock();


        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        const scene = new THREE.Scene();
        this.scene = scene;
        const camera = new THREE.PerspectiveCamera(
          75,
          width / height,
          0.1,
          1000
        )
        //offset view so model shifts to left side of the screen
        camera.setViewOffset(width * 1.3, height * 1.3, width * .3, height * .1, width, height );

        camera.position.z = 5


        const renderer = new THREE.WebGLRenderer({ antialias: true })

        //enable orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enabled = true;
        controls.enablePan = false;
        controls.minDistance = 3.0;
        controls.maxDistance = 5;
        // How far you can orbit vertically, upper and lower limits.
        // Range is 0 to Math.PI radians.
        controls.minPolarAngle = 0; // radians
        controls.maxPolarAngle = Math.PI / 2; // radians

        //changes the size of screen when browser resized
        window.addEventListener('resize', function()
            {
                var width = window.innerWidth;
                var height = window.innerHeight;
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            });

        //add the lighting to the scene
        var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        light.position.set( 0, 200, 0 );
        scene.add( light );
        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 200, 100 );
        light.castShadow = true;
        light.shadow.camera.top = 180;
        light.shadow.camera.bottom = -100;
        light.shadow.camera.left = -120;
        light.shadow.camera.right = 120;
        scene.add( light );


       //add the skybox
       var geometry = new THREE.CubeGeometry(100, 100, 100);
       var cubeMaterials = [
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(px), side: THREE.DoubleSide}),
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(nx), side: THREE.DoubleSide}),
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(py), side: THREE.DoubleSide}),
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(ny), side: THREE.DoubleSide}),
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(pz), side: THREE.DoubleSide}),
           new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(nz), side: THREE.DoubleSide}),
       ];
       var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
       var cube = new THREE.Mesh(geometry, cubeMaterial);
       cube.receiveShadow = true;
       scene.add(cube);

       renderer.setClearColor('#000000')
       renderer.setSize(width, height)

       this.scene = scene
       this.camera = camera
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
       if (this.mixer != null && this.mixer !== undefined) {
           this.mixer.update(delta);
       };

     this.renderScene()
     //this.frameId = window.requestAnimationFrame(this.animate)
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
   }

   async loadInitialModelAndObjects () {
       await this.setInitialStateFromDatabase();
       const results = Object.keys(this.state.currentName).map(async( i ) => {
           if(this.state.currentName[i] !== "''" && i !== 'Pose') {
              await this.updateObjectHandler(i, this.state.currentName[i], true, this.setObjectStateHandler);
          }
       });
       //this makes sure all the above async calls are complete before applying the pose.
       //Promise.all(results).then(() => this.applyPose());
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

   async updateObjectHandler(category, selection, fromInit, setObjectStateHandler) {

       const alreadyInCache = this.isObjectInCache(category, selection);

       if(!alreadyInCache){
           try {

               const downloadedFile = await this.downloadObjectFromStorage(category, selection);
               //await this.downloadBinFromStorage(category, selection);
               await setObjectStateHandler(category, selection, downloadedFile, true, fromInit);

           } catch (error) {
               console.log(error);
           }
        } else {
            try {

                await setObjectStateHandler(category, selection, this.state.cache[category][selection], false, fromInit);

            } catch (error) {
                console.log(error);
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
                   reject(error);
               })
       });
   }

   downloadBinFromStorage = ( category, selection ) => {
       return new Promise( ( resolve, reject ) => {

           firebase.storage().ref( '/Models/' + category + '/' + selection + '.bin' )
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
                   reject(error);
               })
       });
   }

    async setObjectStateHandler (category, selection, downloadedFile, fromDownload, fromInit) {
        return new Promise(async (resolve, reject) => {
            try{
                var prevName = this.state.currentName[category];
                //if clicking already selected object
                if(this.state.currentName[category] !== selection || fromInit) {
                    if(fromDownload){
                        const url = window.URL.createObjectURL(downloadedFile);
                        this.setState({
                            ...this.state,
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
                            await this.updateSceneObject(category, selection, prevName);
                            resolve();
                        })
                    } else {
                        this.setState({
                            ...this.state,
                            currentName: {
                                ...this.state.currentName,
                                [category] : selection
                            },
                            currentObject: {
                                ...this.state.currentObject,
                                [category]: this.state.cache[category][selection]
                            }
                        }, async update => {
                            await this.updateSceneObject(category,selection, prevName);
                            resolve();
                        })
                    }
                } else {
                    this.removeObjectFromScene(selection);
                    this.setState({
                        ...this.state,
                        currentName: {
                            ...this.state.currentName,
                            [category] : ''
                        },
                        currentObject: {
                            ...this.state.currentObject,
                            [category]: null
                        }
                    }, update => {
                        resolve();
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    async updateSceneObject ( category, selection, prevName ) {
        return new Promise( async (resolve, reject ) => {
            try{

               if( selection && this.state.currentObject[category] !== null ){
                   try {
                       const object = await this.loadModelFromCache(  this.state.currentObject[ category ] );
                       //object.scale.set( .013, .013, .013 );

                       if( prevName !== '' ){
                           this.removeObjectFromScene( prevName );
                       }

                       object.name = selection;

                       object.position.y = -1;
                       this.scene.add( object );
                   } catch ( error ) {
                       console.log( error );
                   }
               };
               this.renderScene();
               resolve();
       } catch ( error ) {
           reject( error );
       }})
   }

   loadObjectFromCache = (url) => {
       return new Promise((resolve, reject) => {
           this.loader.load(
               url,
               (object) => {
                   //object.mixer = new THREE.AnimationMixer( object );
                   // mixers.push( object.mixer );
                   //var action = object.mixer.clipAction( object.animations[ 0 ] );
                   //action.play();
                   this.convertMeshToSkinnedMesh(object);
                   object.castShadow = true;
                   resolve(object);
               },
                null,
               (error) => {
                   reject(error);
               }
           )
       });
    }

    loadModelFromCache = (url) => {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url,
                (object) => {
                    object.scene.name = "modelScene";

     				var helper = new THREE.SkeletonHelper(object.scene);
     				this.scene.add(helper);

     				this.mixer = new THREE.AnimationMixer(object.scene);
     				var allAction = this.mixer.clipAction( object.animations[ 0 ] );

                     for( let i = 0; i < object.animations[0].tracks[0].times.length; i++) {
                         let poseNum = "pose" + ( i + 1 );
                         this.subclips = {
                             ...this.subclips,
                             [poseNum]: THREE.AnimationUtils.subclip( allAction._clip, poseNum, i, i + 1  )
                         };

                     }

                     console.log(this.subclips);

                     for( let clip in this.subclips ) {
                        this.mixer.clipAction( this.subclips[clip]);
     					this.actions[clip] = this.mixer.clipAction( this.subclips[clip]);
     				}


                    //set the pose to current selected pose if not select, else set to pose 1
                    this.setPoseByName(this.state.currentName['Pose']);
                    console.log(this.state);
                    this.animate();
                    resolve(object.scene);
                },
                 null,
                (error) => {
                    reject(error);
                }
            )
        });
     }


     setPoseByName = (pose) => {
         console.log(this.actions[pose]);
         if (this.actions[pose]) {
             this.mixer.stopAllAction();
             this.actions[pose].clampWhenFinished = true;
             this.actions[pose].play();
         }
     }

     setPoseHandler = (pose) => {
         if(this.actions[pose]) {
             this.setPoseByName(pose);
         }
         this.setState({
             ...this.state,
             currentName: {
                 ...this.state.currentName,
                 Pose : pose
             }
         }, update => {
             console.log(this.state);
         });
     }

    isObjectInCache = (category, selection) => {
        const cacheCategory = this.state.cache[category];
        let inCache = false;

        for (var object in cacheCategory) {
            if(object === selection) {
                inCache = true;
                break;
            }
        }
        return inCache;
    }

   removeObjectFromScene = (objectName) => {
       var selectedObject = this.scene.getObjectByName(objectName);
       this.scene.remove(selectedObject);
   }


   convertMeshToSkinnedMesh = (object) => {
       if( object === null || object === undefined) {
           return;
       }
       let counter = 0;
       object.traverse( function ( child ) {
           if( child.material ) {
               child.material = new THREE.MeshStandardMaterial( { color: 0xC0C0C0 } );

           }
           if ( child.isMesh ) {
               object[counter] = new THREE.SkinnedMesh(child, new THREE.MeshStandardMaterial( { color: 0xC0C0C0 } ));
               child.castShadow = true;
               child.receiveShadow = true;
           }
           counter++;
       });

       for(let i = 0, count = object.children.length; i < count; i++) {
           this.convertMeshToSkinnedMesh(object.children[i]);
       }
   }

   render() {
     return (
        <Aux className={classes.ModelBuilder}>
           <div
             style={{ width: '100vw', height: '100vh', position: 'absolute', top: '32'}}
             ref={(mount) => { this.mount = mount }}/>
         <Editor
             state={this.state}
             updateObject={(category, selection, setObjectStateHandler, fromInit) => this.updateObjectHandler(category, selection, false, this.setObjectStateHandler)}
             updatePose={(pose) => this.setPoseHandler(pose)} />
         <BottomBar />
       </Aux>
     )
   }
}

const mapDispatchToProps = dispatch => {
    return {
        finishedLoading: () => dispatch(actions.modelFinishedLoading())
    };
};

ModelBuilder.propTypes = {};

export default connect(null, mapDispatchToProps)(ModelBuilder);
