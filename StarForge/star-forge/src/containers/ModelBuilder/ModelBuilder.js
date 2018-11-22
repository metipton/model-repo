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
        loading: true
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
        let expCounter = 0;
        let sum = 0;
        let expressions = this.morphTargets.expression;
        expressions[trait].percent = newPercent;

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

        // for( let part in bodyTargets){
        //     sum += expressions[exp].percent;
        //     expCounter++;
        // }
        this.updateBodyMorphs(trait, newPercent);
    }

    updateBodyMorphs = (trait, percent) => {
        var convPercent = percent / 100;
        var objList = this.morphables.body[trait];
        for(var obj in objList){
            objList[obj].morphTargetInfluences[0] = convPercent;
        }
    }

    addObjectToMorphables = (category, object) => {
       switch(category) {
            case 'Base':
                return;
            break;
            case 'Beard':

                return;
            case 'Chest':
                this.morphables = {
                    ...this.morphables.expression,
                    body: {
                        Height: {
                            ...this.morphables.body.Height,
                            Race: object
                        },
                        Weight: {
                            ...this.morphables.body.Weight,
                            Race: object
                        },
                        Build: {
                            ...this.morphables.body.Build,
                            Race: object
                        },
                        Muscularity: {
                            ...this.morphables.body.Muscularity,
                            Race: object
                        },
                        Bust: {
                            ...this.morphables.body.Bust,
                            Race: object
                        },
                        Waist: {                            
                            ...this.morphables.body.Waist,
                            Race: object
                        },
                        Curves: {                            
                            ...this.morphables.body.Curves,
                            Race: object
                        },
                        Booty: {                            
                            ...this.morphables.body.Booty,
                            Race: object} 
                    }
                }
                return;
            case 'FootLeft':

                return ;
            case 'FootRight':

                return;
            case 'GloveLeft':

                return;
            case 'GloveRight':

                return;
            case 'HandLeft':

                return;
            case 'HandRight':

                return;
            case 'Headwear':

                return;
            case 'LegsWearable':

                return;
            case 'Race':
                console.log(object);
                this.morphables = {
                    ...this.morphables.expression,
                    body: {
                        Height: {
                            ...this.morphables.body.Height,
                            Race: object
                        },
                        Weight: {
                            ...this.morphables.body.Weight,
                            Race: object
                        },
                        Build: {
                            ...this.morphables.body.Build,
                            Race: object
                        },
                        Muscularity: {
                            ...this.morphables.body.Muscularity,
                            Race: object
                        },
                        Bust: {
                            ...this.morphables.body.Bust,
                            Race: object
                        },
                        Waist: {                            
                            ...this.morphables.body.Waist,
                            Race: object
                        },
                        Curves: {                            
                            ...this.morphables.body.Curves,
                            Race: object
                        },
                        Booty: {                            
                            ...this.morphables.body.Booty,
                            Race: object} 
                    }
                }
                console.log(this.morphables);
                return;
            default:
                return;
            }
    }

    init = () => {
        this.THREE = THREE;
        this.gltfLoader = new GLTFLoader();
        this.mixer;
        this.subclips = {};
        this.actions = {};
        this.clock = new THREE.Clock();
        this.bones = [];
        this.currentMesh;
        this.skeleton;
        this.activeObjects = [];
        this.armatureLoaded = false;
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


        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        const scene = new THREE.Scene();
        const objectHolder = new THREE.Object3D();
        this.scene = scene;
        this.objectHolder = objectHolder;
        this.objectHolder.name = "Object Holder";
        this.scene.add(this.objectHolder);

        const camera = new THREE.PerspectiveCamera(
          50,
          width / height,
          0.1,
          1000
        )
        //offset view so model shifts to left side of the screen
        camera.setViewOffset(width * 1.3, height * 1.3, width * .3, height * .1, width, height );
        camera.frustrumCulled = false;
        camera.position.z = 5;
        camera.position.y = 2;


        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.gammaOutput = true;

        //enable orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
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
        window.addEventListener('resize', function()
            {
                var width = window.innerWidth;
                var height = window.innerHeight;
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            });

        // //add the lighting to the scene
        // var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        // light.position.set( 0, 200, 0 );
        // scene.add( light );
        // var light = new THREE.PointLight( 0xffffff );
        // light.position.set( 0, 20, 20 );
        // light.intensity = 1;
        // light.castShadow = true;
        // light.shadow.camera.top = 200;
        // light.shadow.camera.bottom = -100;
        // light.shadow.camera.left = -100;
        // light.shadow.camera.right = 100;
        //
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
        //var d = 50;
        dirLight.shadow.camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 0.1, 1000 );
        // dirLight.shadow.camera.left = - d;
        // dirLight.shadow.camera.right = d;
        // dirLight.shadow.camera.top = d;
        // dirLight.shadow.camera.bottom = - d;
        // dirLight.shadow.camera.far = 3500;
        // dirLight.shadow.bias = - 0.0001;

        // var camhelper = THREE.CameraHelper(shadowLight.shadow.camera);
        // scene.add(camhelper);


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
       var cube = new THREE.Mesh(geometry, cubeMaterial);

       cube.receiveShadow = true;
       scene.add(cube);

       //make the ground
       var groundGeo = new THREE.PlaneBufferGeometry( 20, 20 );
       var groundMat = new THREE.MeshPhongMaterial( { color: 0xcecdd6, side: THREE.DoubleSide } );
       groundMat.transparent = true;
       groundMat.opacity = 0.1;
       var ground = new THREE.Mesh( groundGeo, groundMat );
       ground.receiveShadow = true;
       ground.rotation.x = Math.PI / 2;
       ground.renderOrder = 1;
       ground.name = "ground";
       scene.add(ground);
       ground.position.y = -.1;

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
       const results = Object.keys(this.state.currentName).map(async( i ) => {
           if(this.state.currentName[i] !== "''" && i !== 'Pose') {
              await this.updateObjectHandler(i, this.state.currentName[i], true, this.setObjectStateHandler);
          }
       });
       //this makes sure all the above async calls are complete before applying the pose.
       //Promise.all(results).then(() => this.applyPose());
   }

 

   async updateObjectHandler(category, selection, fromInit) {

       const alreadyInCache = this.isObjectInCache(category, selection);

       if(!alreadyInCache){
           try {

               const downloadedFile = await this.downloadObjectFromStorage(category, selection);
               //await this.downloadBinFromStorage(category, selection);
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
                                [category] : "\'\'"
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

                       //object.position.y = -1;
                       if(category === 'Race' && !this.armatureLoaded){
                            this.scene.add( object );
                            let model = object.children[0].children[0];
                            model.name = category;
                            THREE.SceneUtils.attach(model, model.parent, this.objectHolder);
                            this.addObjectToMorphables(category, model);
                            this.armatureLoaded = true;
                       } else {
                        this.setupObjectImport(category, selection, object)
                       }
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


    loadModelFromCache = (category, url) => {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url,
                async (object) => {
     				// var helper = new THREE.SkeletonHelper(object.scene.children[0]);
     				// this.scene.add(helper);
                    if( category === 'Race' && !this.armatureLoaded ){

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
                         console.log(object.scene);
                         this.skeleton = object.scene.children[0].children[0].skeleton;
                         this.bones = this.skeleton.bones;

                         for( let clip in this.subclips ) {
                            this.mixer.clipAction( this.subclips[clip]);
         					this.actions[clip] = this.mixer.clipAction( this.subclips[clip]);
         				}

                        
                        //set the pose to current selected pose if not select, else set to pose 1
                        this.setPoseByName(this.state.currentName['Pose']);
                        this.animate();
                        
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
             var finished = false;
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
       console.log(this.activeObjects);
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
            child.skeleton = this.skeleton;
            child.bind(child.skeleton, bone.matrixWorld);
        } catch (error){
        }
        

       THREE.SceneUtils.attach(child, child.parent, this.objectHolder);
       child.name = category;
       console.log(category);
       this.addObjectToMorphables(category, child);
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

   render() {
     let morphTargetsProp = this.morphTargets;
     return (
        <Aux className={classes.ModelBuilder}>
           <div
             style={{ width: '100vw', height: '100vh', position: 'absolute', top: '32'}}
             ref={(mount) => { this.mount = mount }}/>
         <Editor
             state={this.state}
             updateObject={(category, selection, setObjectStateHandler, fromInit) => this.updateObjectHandler(category, selection, false)}
             setFeetLink={(index) => this.setFeetLinkHandler(index)}
             updateFeet={(category, selection) => this.setFeetHandler(category, selection)}
             setGloveLink={(index) => this.setGloveLinkHandler(index)}
             updateGlove={(category, selection) => this.setGloveHandler(category, selection)}
             updatePose={(pose) => this.setPoseHandler(pose)} 
             updateExpression={(trait, newPercent) => this.updateExpressionPercent(trait, newPercent)}
             updateBodyTarget={(trait, newPercent) => this.updateBodyPercent(trait, newPercent)}
             morphPercents={morphTargetsProp}/>
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
