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
            LeftGlove: '',
            RightGlove: '',
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
            LeftGlove: {},
            RightGlove: {},
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
            LeftGlove: null,
            RightGlove: null,
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
                    LeftGlove: false,
                    RightGlove: false
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

    init = () => {
        this.THREE = THREE;
        this.loader = new FBXLoader();
        this.gltfLoader = new GLTFLoader();
        this.mixer;
        this.subclips = {};
        this.actions = {};
        this.clock = new THREE.Clock();
        this.bones = [];
        this.bonesPositInit = {};
        this.bonesPositCurrent = {};
        this.bonesQuatInit = {};
        this.bonesQuatCurrent = {};
        this.currentMesh;
        this.skeleton;



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

        camera.position.z = 9;


        const renderer = new THREE.WebGLRenderer({ antialias: true })

        //enable orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enabled = true;
        controls.enablePan = false;
        controls.minDistance = 3.0;
        controls.maxDistance = 5;
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
                       //object.scale.set( .013, .013, .013 );


                       if( prevName !== '\'\'' ){
                           this.removeObjectFromScene( prevName );
                       }

                       object.name = category;

                       //object.position.y = -1;
                       if(category !== 'Race'){
                          this.parentObjectToBone(category, selection, object)
                       } else{
                         this.scene.add( object );
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
                (object) => {

     				// var helper = new THREE.SkeletonHelper(object.scene.children[0]);
     				// this.scene.add(helper);
                    console.log(this.scene);
                    if( category === 'Race' ){

         				this.mixer = new THREE.AnimationMixer(object.scene);
         				var allAction = this.mixer.clipAction( object.animations[ 0 ] );

                         for( let i = 0; i < object.animations[0].tracks[0].times.length; i++) {
                             let poseNum = "Pose" + ( i + 1 );
                             this.subclips = {
                                 ...this.subclips,
                                 [poseNum]: THREE.AnimationUtils.subclip( allAction._clip, poseNum, i, i + 1  )
                             };

                         }
                         this.skeleton = object.scene.children[0].children[0].skeleton;
                         this.bones = this.skeleton.bones;
                         this.bonesQuatInit = {};
                         this.bonesPositInit = {};
                         //this.flattenBones(object.scene.children[0].children[1], this.bones);
                         console.log(this.bones);
                         this.setBoneInitialPositandRot(object.scene.children[0].children[1]);
                         this.setBoneCurrentPositandRot(object.scene.children[0].children[1]);


                         for( let clip in this.subclips ) {
                            this.mixer.clipAction( this.subclips[clip]);
         					this.actions[clip] = this.mixer.clipAction( this.subclips[clip]);
         				}


                        console.log(this.skeleton);
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
                            LeftGlove: !prevState.links.gloves.gloves.LeftGlove,
                            RightGlove: !prevState.links.gloves.gloves.RightGlove
                        }
                    }
                }
             }), () => {
                 this.updateObjectHandler("LeftGlove", selection, false );
                 this.updateObjectHandler("RightGlove", selection, false);
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
                 console.log(this.state);
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
                 console.log(this.state);
                 let num = index + 1;
                 let selection = "Foot" + num.toString();
                 console.log(selection);
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
       var selectedObject = this.scene.getObjectByName(category);
       this.scene.remove(selectedObject);
       console.log("removed: " + category);
       console.log(this.state);
   }



   flattenBones = ( rootBone, bones) => {
       if( rootBone === null || rootBone === undefined) {
           return;
       }
       this.bones.push(rootBone);
       let count = rootBone.children.length;
       for(let i = 0; i < count; i++ ) {
           this.flattenBones(rootBone.children[i], this.bones);
       }
   }

   // transAndRotObjectOnImport = (category, object) => {
   //      let bone = this.getBoneByCategory(category);
   //      let parent = bone.parent;
   //      object.name = category;
   //      bone.add(object);
   //  }


   setBoneInitialPositandRot = ( rootBone) => {
       if( rootBone === null || rootBone === undefined) {
           return;
       }
       var name = rootBone.name;
       this.bonesPositInit = {
           ...this.bonesPositInit,
           [name]: rootBone.getWorldPosition(new THREE.Vector3())
       }
       this.bonesQuatInit = {
           ...this.bonesQuatInit,
           [name]: rootBone.getWorldQuaternion(new THREE.Quaternion()).clone()
       }
       let count = rootBone.children.length;
       for(let i = 0; i < count; i++ ) {
           this.setBoneInitialPositandRot(rootBone.children[i]);
       }
   }

   setBoneCurrentPositandRot = ( rootBone) => {
       if( rootBone === null || rootBone === undefined) {
           return;
       }
       var name = rootBone.name;
       this.bonesPositCurrent = {
           ...this.bonesPositCurrent,
           [name]: rootBone.getWorldPosition(new THREE.Vector3())
       }
       this.bonesQuatCurrent = {
           ...this.bonesQuatCurrent,
           [name]: rootBone.getWorldQuaternion(new THREE.Quaternion()).clone()
       }

       let count = rootBone.children.length;
       for(let i = 0; i < count; i++ ) {
           this.setBoneCurrentPositandRot(rootBone.children[i]);
       }
   }

   getBoneByCategory = (category) => {
       var bone;
       switch(category) {
            case 'Beard':
                bone = this.getBoneByName("rigcurrent_jaw_master");
                return bone;
                break;
            case 'Chest':
                bone = this.getBoneByName("rigcurrent_chest");
                return bone;
                break;
            case 'FootLeft':
                bone = this.getBoneByName("rigcurrent_foot_ikL");
                return bone;
                break;
            case 'FootRight':
                bone = this.getBoneByName("rigcurrent_foot_ikR");
                return bone;
                break;
            case 'Gloves':
                bone = this.getBoneByName("rigcurrent_MCH-hand_ik_rootR");
                return bone;
                break;
            case 'Headwear':
                bone = this.getBoneByName("rigcurrent_head");
                return bone;
                break;
            case 'LegsWearable':
                bone = this.getBoneByName("rigcurrent_torso");
                return bone;
                break;
            default:
                return;
            }
   }

   parentObjectToBone(category, selection, object) {

       console.log(category);
       let bone = this.getBoneByCategory(category);
       console.log(bone)
       //imported heirachy scene->object3D->skinnedmesh
       let child = object.children[0].children[0];
       child.skeleton = this.skeleton;

       child.bind(child.skeleton, bone.matrixWorld);
       THREE.SceneUtils.attach(child, child.parent, this.scene);
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

   getRotQuat = (bone) => {

       //rotation quat = q2 * q1^-1
       let initQuat = this.bonesQuatInit[bone.name].clone();
       initQuat.inverse().normalize();
       let currentQuat = this.bonesQuatCurrent[bone.name].clone();
       currentQuat.normalize();
       let rotationQuat = currentQuat.multiply(initQuat).normalize();
       return rotationQuat;
   }


   render() {
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
