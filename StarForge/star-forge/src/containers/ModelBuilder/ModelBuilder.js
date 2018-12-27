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
import OrbitControls from 'orbit-controls-es6';
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
import GPUPickHelper from './GPUPicker/GPUPicker';




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
     this.loadModelFromCache = this.loadModelFromCache.bind(this);
    }

    componentDidMount() {
       this.init();
       this.loadInitialModelAndObjects();
    }

    componentWillUnmount() {
     this.stop()
     this.mount.removeChild(this.renderer.domElement)
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
        var objects = this.scene.getObjectByName("Object Holder");
        for(let i = 0; i < objects.children.length; i++) {
            let dictionary = null;
            let influences = null;
            if(objects.children[i].morphTargetDictionary 
                && objects.children[i].morphTargetInfluences){
                dictionary = objects.children[i].morphTargetDictionary;
                influences = objects.children[i].morphTargetInfluences;
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

    updateBodyMorphs = (trait, percent) => {
        var convPercent = percent / 100;
        var objList = this.morphables.body[trait];
        for(var obj in objList){
            objList[obj].morphTargetInfluences[0] = convPercent;
        }
    }

    //object picking functions
    setPickPosition = (event) => {
        this.pickPosition.x = event.clientX;
        this.pickPosition.y = event.clientY;
      }

      
    
    clearPickPosition = () => {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        this.pickPosition.x = -100000;
        this.pickPosition.y = -100000;
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
        this.activeObjects = [];
        this.armatureLoaded = false;
        this.poseTime = new Date().getTime();
        this.updateAABBTrue = false;
        this.aabbDelay = 50;

        this.morphTargets = {
            body: {
               Height: {
                   percent: 20
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
                Smile: {percent: 20},
                Cocky: {percent: 0},
                Snarl: {percent: 0},
                Confused: {percent: 0},
                Embarrassed: {percent: 0}
            }
        }

        this.morphables = {
            body: {
               Height: {
                   
                },
               Weight: {},
               Build: {},
               Muscularity: {},
               Bust: {},
               Waist: {},
               Curves: {},
               Booty: {} 
            },
            expression: {
                Smile: {},
                Cocky: {},
                Snarl: {},
                Confused: {},
                Embarrassed: {}
            }
        }
        //all scene managing objects
        this.numObjects = 0;
        this.allScenes = [];
        this.allObjectHolders = [];

        //Create all the picking scene holders
        const pickingScene = new THREE.Scene();
        this.pickingScene = pickingScene;
        this.pickingScene.background = new THREE.Color(0);
        const idToObject = {};
        this.idToObject = idToObject;
        this.pickingSceneObjHolder = new THREE.Object3D();
        this.pickingScene.add(this.pickingSceneObjHolder);
        const pickPosition = {x: 0, y: 0};
        const pickHelper = new GPUPickHelper();
        this.pickPosition = pickPosition;
        this.pickHelper = pickHelper;
        this.clearPickPosition();

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
        const objectHolder = new THREE.Object3D();
        this.scene = scene;
        this.objectHolder = objectHolder;
        this.objectHolder.name = "Object Holder";
        this.scene.add(this.objectHolder);


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
        this.camera.position.z = 5;
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
        controls.target = new THREE.Vector3(0, 1, 0);
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
              await this.updateObjectHandler(i, this.state.currentName[i], true, this.setObjectStateHandler);
          }
       });

       //this makes sure all the above async calls are complete before applying the pose.
       Promise.all(results).then(() => {    
            this.setState({
                ...this.state,
                RESOURCES_LOADED: true
            })});
   }

 

   async updateObjectHandler(category, selection, fromInit) {

       const alreadyInCache = this.isObjectInCache(category, selection);

       if(!alreadyInCache){
           try {

               const downloadedFile = await this.downloadObjectFromStorage(category, selection);
               await this.setObjectStateHandler(category, selection, downloadedFile, true, fromInit);

           } catch (error) {
               console.log(error);
           }
        } else {
            try {

                await this.setObjectStateHandler(category, selection, this.state.cache[category][selection], false, fromInit);

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
                    if(category !== 'Race') {
                        this.removeObjectFromScene(category);
                        this.setState({
                            ...this.state,
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
                reject(error);
            }
        })
    }

    async updateSceneObject ( category, selection, prevName ) {
        return new Promise( async (resolve, reject ) => {
            try{

               if( selection && this.state.currentObject[category] !== null ){
                   try {
                       const object = await this.loadModelFromCache(category,  this.state.currentObject[ category ] );
                       if( prevName !== "''" ){
                           this.removeObjectFromScene( prevName );
                       }

                       object.name = category;

                       if(category === 'Race' && !this.armatureLoaded){
                            this.scene.add( object );
                            let model = object.children[0].children[0];
                            const clone = this.createPickingClone(model);
                            let parent = object.children[0];
                            model.name = category;
                            THREE.SceneUtils.attach(model, parent, this.objectHolder);
                            this.armatureLoaded = true;
                            
                       } else {
                        this.setupObjectImport(category, selection, object)
                       }
                   } catch ( error ) {
                       console.log( error );
                   }
               };
               resolve();
       } catch ( error ) {
           reject( error );
       }})
   }


    loadModelFromCache = (category, url) => {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url,
                async (object) => {
                    if( category === 'Race' && !this.armatureLoaded ){
                        this.animationScene = object;
                        console.log(this.animationScene);

                        this.mixer = new THREE.AnimationMixer(object.scene);
         				var allAction = this.mixer.clipAction( object.animations[ 0 ] );

                         for( let i = 0; i < object.animations[0].tracks[0].times.length; i++) {
                             let poseNum = "Pose" + ( i + 1 );
                             this.subclips = {
                                 ...this.subclips,
                                 [poseNum]: THREE.AnimationUtils.subclip( allAction._clip, poseNum, i, i + 1  )
                             };

                         }
                         object.scene.children[0].children[0].castShadow = true;
                         this.skeleton = object.scene.children[0].children[0].skeleton;
                         this.bones = this.skeleton.bones;

                         for( let clip in this.subclips ) {
                            this.mixer.clipAction( this.subclips[clip]);
         					this.actions[clip] = this.mixer.clipAction( this.subclips[clip]);
         				}

                        
                        //set the pose to current selected pose if not select, else set to pose 1
                        this.setPoseByName(this.state.currentName['Pose']);
                        //this.createNewAABB( object.scene.children[0].children[0]);
                        
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


     setPoseByName = (pose) => {
         if (this.actions[pose]) {
             this.mixer.stopAllAction();
             //var finished = false;
             // this.mixer.addEventListener('finished', (e) => {
             //     if(this.bones[0] !== null && this.bones[0] !== undefined){
             //
             //        this.setBoneCurrentPosit(this.bones[0]);
             //        console.log(this.bonesPositCurrent);
             //    }
             // });
             this.actions[pose].clampWhenFinished = true;
             this.actions[pose].setLoop(this.THREE.LoopOnce);
             //this.actions[pose].loop(THREE.LoopOnce);
             this.actions[pose].play();
             this.updateAABBTrue = true;
             this.poseTime = new Date().getTime();
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
                 ...this.state,
                 links: {
                     ...this.state.links,
                     gloves: {
                         ...this.state.links.gloves,
                         linked: !prevState.links.gloves.linked
                     }
                 }
             }), () => {
             })
         } else {
             this.setState(prevState => ({
                 ...this.state,
                 links: {
                     ...this.state.links,
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

   removeObjectFromScene = (category) => {
       var selectedObject = this.objectHolder.getObjectByName(category);
       this.objectHolder.remove(selectedObject);
       for(let i = this.activeObjects.length - 1; i >= 0; i--){
        if(this.activeObjects[i].category === category){
            this.activeObjects.splice(i, 1);
        }
       }
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

   transferObjectsToNewModel( ) {
        for(let i = this.activeObjects.length - 1; i >= 0; i--){
            let obj = this.scene.getObjectByName(this.activeObjects[i]);
            if( obj.category !== 'Race'){
                let bone = this.getBoneByCategory(obj.category);
                obj.skeleton = this.skeleton;
                obj.bind(obj.skeleton, bone.matrixWorld);
            }
        }
   }



   setupObjectImport(category, selection, object) {
        let child = object.children[0].children[0];
        let bone = this.getBoneByCategory(category);
        child.name = category;
        child.frustumCulled = false;
        child.castShadow = true;
        child.category = category;
        child.selection = selection;
        this.activeObjects.push(child.name);
       //imported heirachy scene->object3D->skinnedmesh
        try {
            child.material.skinning = true;
            child.skeleton = this.skeleton;
            child.bind(child.skeleton, bone.matrixWorld);
        } catch (error){

        }
        THREE.SceneUtils.attach(child, child.parent, this.objectHolder);

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

    createPosedClone = (skinnedMesh) => {
            
        let clone = skinnedMesh.clone();
        var boneMatrices = this.skeleton.boneMatrices;
        var geometry = skinnedMesh.geometry;
        
        var position = geometry.attributes.position;
        var skinIndex = geometry.attributes.skinIndex;
        var skinWeigth = geometry.attributes.skinWeight;
        
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
            skinWeights.fromBufferAttribute( skinWeigth, i );
            
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
                for ( var t = 0; t < morphTargetArray.length; t ++ ) {
            
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

    takeScreenshot = () => {
        var height = 140;
        var width = 140;
        //remove the skybox and ground
        this.scene.remove(this.skyBox);
        this.scene.remove(this.ground);
        // set camera and renderer to desired screenshot dimension
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(  width, height );
        var color = new THREE.Color(0xCBCFD2);
        this.renderer.setClearColor( color, .5 );
        //put the camera to null position and copy current posit/rotation
        let currentCamPosit = this.camera.getWorldPosition();
        let currentCamRotation = this.camera.getWorldQuaternion();
        this.camera.position.set(this.initCameraPosit.x, this.initCameraPosit.y, 4.1);
        this.camera.setRotationFromQuaternion(this.initCameraRotation);
        this.camera.clearViewOffset();
        this.camera.setViewOffset(width, height, 0, height * .28, width, height );
        this.renderer.render( this.scene, this.camera, null, false );
    
        const dataURL = this.renderer.domElement.toDataURL( 'image/png' );

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
       this.renderer.setSize( window.innerWidth, window.innerHeight );

       // put the camera back to position when screenshot taken
       this.camera.position.set(currentCamPosit.x, currentCamPosit.y, currentCamPosit.z);
       this.camera.setRotationFromQuaternion(currentCamRotation);
       this.camera.setViewOffset(window.innerWidth * 1.3, window.innerHeight * 1.3, window.innerWidth * .25, window.innerHeight * .15, window.innerWidth, window.innerHeight );


       //put the skybox and ground back in
       this.scene.add(this.skyBox);
       this.scene.add(this.ground);

       return file;
     }

     exportModel = (cartNumber) => {
        let objects = [];

        //morph geometry of all objects to match the pose
        for(let i = 0; i < this.objectHolder.children.length; i++) {
            let child = this.objectHolder.children[i];
            if(child.name !== "rigcurrent"){
                let clone;
                if(child.isSkinnedMesh){
                    clone = this.createPosedClone(this.objectHolder.children[i]);
                    console.log(clone);
                } else {
                    clone = this.objectHolder.children[i].clone();
                }
                console.log(objects);
                objects.push(clone);
            }
        }

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
                    console.log("Model upload complete");
                    this.props.finishedAdd();
                    resolve();
                }).catch( error => {
                    reject(error);
                });
            });
        }, DEFAULT_OPTIONS);
    }

    exportScreenshot = (cartNumber, url) => {
        return new Promise( ( resolve, reject ) => {
            firebase.storage().ref( '/Carts/' + this.props.userId + '/CartItem' + cartNumber + '/screenshot.png' ).put(url).then(() => {
                console.log("Screenshot upload complete");
                resolve();
            }).catch( error => {
                reject(error);
            });
        });
    }

    getCartNumber = () => {
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
        return cartNum;
    }

   addModelToCart = async () => {
        this.props.addInProgress();
        var cartNum = this.getCartNumber();
        var dataURL = this.takeScreenshot();

        this.exportModel(cartNum);
        await this.exportScreenshot(cartNum, dataURL);
        const timeStamp = new Date().getTime();
        let payload = {
            cartNumber: cartNum,
            id: cartNum,
            title: "Standard Model",
            description: "30mm scale on 1 in. base",
            price: 19.99,
            currencyId: "USD",
            currencyFormat: "$",
            quantity: 1,
            isFreeShipping: false,
            timeStamp: timeStamp
          };

        //push payload to firebase database
        const database = firebase.database().ref('Carts/' + this.props.userId + '/Cart' + cartNum + '/');
        database.set(payload);

        this.props.addToCart(payload);
     }

    createPickingClone = (skinnedMesh) => {
        this.numObjects++;
        const id = this.numObjects;

        this.idToObject[id] = skinnedMesh;

        const pickingMaterial = new THREE.MeshPhongMaterial({
            emissive: new THREE.Color(id),
            color: new THREE.Color(0, 0, 0),
            specular: new THREE.Color(0, 0, 0),
            transparent: true,
            side: THREE.DoubleSide,
            alphaTest: 0.5,
            blending: THREE.NoBlending,
        });
  
        const clone = THREE.AnimationUtils.clone(skinnedMesh);
        clone.skinning = true;
        clone.material = pickingMaterial;

        return clone;
    }

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

    
     return (
        <Aux className={classes.ModelBuilder}>
            {screen}
            <div
                style={{ width: '100vw', height: '100vh', position: 'absolute', top: '32'}}
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
                morphPercents={morphTargetsProp}/>
            <SideDrawerColor 
                toggleColor={this.toggleColorHandler} 
                setColor={(color) => this.setHexColor(color)} />
            <BottomBar 
                addToCart={this.addModelToCart} />       
        </Aux>

     )
   }
}
const mapStateToProps = state => {
    return {
        currentCart: state.shoppingCart.cartProducts.items,
        userId: state.auth.userId,
        addInProgress: state.shoppingCart.cartProducts.addInProgress
    };
};

const mapDispatchToProps = dispatch => {
    return {
        finishedLoading: () => dispatch(actions.modelFinishedLoading()),
        addToCart: (payload) => dispatch(actions.addProduct(payload)),
        finishedAdd: () => dispatch(actions.completedAddToCart()),
        addInProgress: () => dispatch(actions.addInProgress())
    };
};

ModelBuilder.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(ModelBuilder);
