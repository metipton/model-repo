import * as THREE from 'three';
import {fbStorage} from '../../Firebase';

import GLTFLoader from 'three-gltf-loader';
import axios from '../../axios-orders.js';
import FileManager from './FileManager.js';

class Character {

    state = {
        gender: null,
        race: null,
        selected: {
            Race: '',
            Face: '',
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
            Genre: '',
            Race: '',
            Face: '',
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
            },
            handheld: {
                linked: true,
                hand: {
                    HandHeldLeft: false,
                    HandHeldRight: false
                }
            }
        },
        morphTargets: {
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
        },
        RESOURCES_LOADED: false
    }

    constructor(charNum, gender, race, scene, manager, builder) {
        this.scene = scene;
        this.charNum = charNum;
        this.state.gender = gender;
        this.state.race = race;
        this.sManager = manager;
        this.fManager = new FileManager(builder);
        this.builder = builder;
        this.resetState = {};
        this.THREE = THREE;
        this.mixer = null;
        this.animationScene = null;
        this.subclips = {};
        this.actions = {};
        this.bones = [];
        this.currentMesh = null;
        this.skeleton = null;
        this.gltfLoader = new GLTFLoader();
        this.objectHolder = new THREE.Object3D();
        this.objectHolder.name = "Object Holder " + charNum;
        this.scene.add(this.objectHolder);
        this.armatureHolder = new THREE.Object3D();
        this.armatureHolder.name = "Armature Holder" + charNum;
        this.scene.add(this.armatureHolder);
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
          this.loadInitialModelAndObjects();
    }

    setInitialStateFromDatabase = () => {
        return new Promise( ( resolve, reject ) => {
            axios.get( '/Initial.json' )
            .then( response => {
                let items = response.data['Characters'][this.charNum]
                this.state = {
                    ...this.state,
                    currentName : items
                }
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
            this.state = {
                ...this.state,
                RESOURCES_LOADED: true
            }
            this.builder.forceUpdate();
            this.sManager.checkResourcesLoaded();
        });
        this.resetState = this.state;
    }

    async updateObjectHandler(category, selection, fromInit) {
        this.state = {
            ...this.state,
            selected: {
                ...this.state.selected,
                [category] : selection
        }};
        this.builder.forceUpdate();
        const alreadyInCache = this.fManager.isObjectInCache(category, selection, this.objectPool);  
        if(!alreadyInCache){
            try {
                let downloadedFile;
                if(category === 'Race'){
                    downloadedFile = await this.downloadRaceFromStorage();
                } else {
                    downloadedFile = await this.downloadObjectFromStorage(category, selection);
                }
                
                await this.loadModelToMemory(category, selection, downloadedFile);
                await this.setObjectStateHandler(category, selection, downloadedFile, true, fromInit);

            } catch (error) {
                this.state = {
                   ...this.state,
                   selected: this.state.currentName
                };
                this.builder.forceUpdate();
            }
        } else {
            try {

                await this.setObjectStateHandler(category, selection, this.state.cache[category][selection], false, fromInit);

            } catch (error) {
                this.state = {
                    ...this.state,
                    selected: this.state.currentName
                };
                this.builder.forceUpdate();
            }
       }
    }

    downloadRaceFromStorage = ( ) => {
        return new Promise( ( resolve, reject ) => {
            let filepath = '/Models/Race/';
            for(let i = 0; i < this.sManager.characters.length; i++){
                filepath = filepath + this.sManager.characters[i].getGender() + '/'
            }
            filepath = filepath + this.state.race + '-Char' + this.charNum + '.glb'
            fbStorage.ref( filepath )
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
                    this.state = {
                        ...this.state,
                        selected: this.state.currentName
                    };
                    this.builder.forceUpdate();
                })
        });
    } 
 
    downloadObjectFromStorage = ( category, selection ) => {
        return new Promise( ( resolve, reject ) => {
            fbStorage.ref( '/Models/' + category + '/' + selection + '.glb' )
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
                    this.state = {
                        ...this.state,
                        selected: this.state.currentName
                    };
                    this.builder.forceUpdate();
                })
        });
    }

    loadMultipleModelsToMemory = async (categoryArr, selectionArr) => {
        //set the selected at the beginning of the load
        let prevState = this.state;
        let newSelect = prevState.selected;
        for(let i = 0; i < categoryArr.length; i++){
            newSelect = {
                ...newSelect,
                [categoryArr[i]]: selectionArr[i]
            } 
        }
        this.state = {
                 ...prevState,
                 selected: newSelect
        };
        this.builder.forceUpdate();

         //download all files at the same time, load them to the cache
        const results = categoryArr.map(async (category, index) => {
            if(category !== 'Pose' && !this.fManager.isObjectInCache( category, selectionArr[index], this.objectPool)){
                return (category !== 'Race' ? this.downloadObjectFromStorage( category, selectionArr[index]) : this.downloadRaceFromStorage())
                .then(async (file) => {
                    const url = window.URL.createObjectURL(file);
                     //make sure to set the state in the cache when downloading multiples.  This allows for reloading all models to reset on export
                    this.state = {
                        ...this.state,
                        cache: {
                            ...this.state.cache,
                            [category] : {
                                ...this.state.cache[category],
                                [selectionArr[index]]: url
                            }
                        },
                    };
                    this.builder.forceUpdate();
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
                    this.state = {
                        ...this.state,
                        selected: this.state.currentName
                    };
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
                        this.state = {
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
                        }
                        this.builder.forceUpdate();
                        await this.updateSceneObject(category, selection, fromDownload, prevName);
                        resolve();
                    } else {
                        this.state = {
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
                        }
                        this.builder.forceUpdate();
                        await this.updateSceneObject(category,selection, fromDownload, prevName);
                        resolve();
                    }
                } else {
                    if(category !== 'Race') {
                        this.fManager.removeObjectFromHolder(category, this.objectHolder);
                        this.state = {
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
                        }
                        this.builder.forceUpdate();
                        resolve();
                    }
                }
            } catch (error) {
                console.log(error);
                this.state = {
                    ...this.state,
                    selected: this.state.currentName
                };
                this.builder.forceUpdate();
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
                            this.fManager.removeObjectFromHolder( prevName , this.objectHolder );
                        }

                        object.name = category;

                        if(category === 'Race' && !this.armatureLoaded){
                            this.scene.add(object);
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
                        this.state = {
                            ...this.state,
                            selected: this.state.currentName
                        };
                    }
                };
                resolve();
        } catch ( error ) {
            console.log(error);
            this.state = {
                ...this.state,
                selected: this.state.currentName
            };
            this.builder.forceUpdate();
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
        this.state = {
            ...this.state,
            selected: {
                ...this.state.selected,
                Pose : pose
            },
            currentName: {
                ...this.state.currentName,
                Pose : pose
            }
        }
        this.builder.forceUpdate();
    }

    setFeetHandler = async (category, selection) => {
        if(this.state.links.feet.linked){
            const prevState = this.state;
            this.state = {
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
            }
            this.builder.forceUpdate();
            await this.updateObjectHandler("FootLeft", selection, false );
            await this.updateObjectHandler("FootRight", selection, false);
        } else {
            const prevState = this.state;
            this.state = {
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
            }
            this.builder.forceUpdate();
            this.updateObjectHandler(category, selection, false);
        }
    }

    setGloveHandler = async (category, selection) => {
        if(this.state.links.gloves.linked){
            const prevState = this.state;
            this.state = {
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
            }
            this.builder.forceUpdate();
            await this.updateObjectHandler("GloveLeft", selection, false );
            await this.updateObjectHandler("GloveRight", selection, false);
        } else {
            const prevState = this.state;
            this.state = {
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
            }
            this.builder.forceUpdate();
            this.updateObjectHandler(category, selection, false);
        }
    }

    setGloveLinkHandler = (index) => {
        if(this.state.links.gloves.linked ||
            (!this.state.links.gloves.linked && (this.state.links.gloves.gloves.GloveLeft === this.state.links.gloves.gloves.GloveRight))) {
            const prevState = this.state;   
            this.state = {
                ...prevState,
                links: {
                    ...prevState.links,
                    gloves: {
                        ...prevState.links.gloves,
                        linked: !prevState.links.gloves.linked
                    }
                }
            }
            this.builder.forceUpdate();
        } else {
            const prevState = this.state;
            this.state = {
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
            }
            this.builder.forceUpdate();
            let num = index + 1;
            let selection = "Glove" + num.toString();
            if( this.state.currentName.GloveLeft === selection) {
                this.updateObjectHandler("GloveRight", selection, false)
            } else {
                this.updateObjectHandler("GloveLeft", selection, false)
            }
        }
    }

    setFeetLinkHandler = (index) => {
        if(this.state.links.feet.linked ||
            (!this.state.links.feet.linked && (this.state.links.feet.shoes.FootLeft === this.state.links.feet.shoes.FootRight))) {
            const prevState = this.state;    
            this.state = {
                ...this.state,
                links: {
                    ...this.state.links,
                    feet: {
                        ...this.state.links.feet,
                        linked: !prevState.links.feet.linked
                    }
                }
            }
            this.builder.forceUpdate();
        } else {
            const prevState = this.state;
            this.state = {
                ...prevState,
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
            }
            this.builder.forceUpdate();
            let num = index + 1;
            let selection = "Foot" + num.toString();
            if( this.state.currentName.FootLeft === selection) {
                this.updateObjectHandler("FootRight", selection, false)
            } else {
                this.updateObjectHandler("FootLeft", selection, false)
            }
        }
    }

    getBoneByCategory = (category) => {
        var bone;
        switch(category) {
             case 'Base':
                 bone = this.getBoneByName("_base");
                 return bone;
             case 'Beard':
                 bone = this.getBoneByName("_MCH-hand_ik_rootL");
                 return bone;
             case 'Chest':
                 bone = this.getBoneByName("_MCH-hand_ik_rootL");
                 return bone;
             case 'FootLeft':
                 bone = this.getBoneByName("_MCH-foot_ik_rootL");
                 return bone;
             case 'FootRight':
                 bone = this.getBoneByName("_MCH-foot_ik_rootR");
                 return bone;
             case 'GloveLeft':
                 bone = this.getBoneByName("_MCH-hand_ik_rootL");
                 return bone;
             case 'GloveRight':
                 bone = this.getBoneByName("_MCH-hand_ik_rootR");
                 return bone;
             case 'HandLeft':
                 bone = this.getBoneByName("_MCH-hand_ik_rootL");
                 return bone;
             case 'HandRight':
                 bone = this.getBoneByName("_MCH-hand_ik_rootR");
                 return bone;
             case 'Headwear':
                 bone = this.getBoneByName("_MCH-hand_ik_rootL");
                 return bone;
             case 'LegsWearable':
                 bone = this.getBoneByName("_MCH-foot_ik_rootL");
                 return bone;
             default:
                 console.log("bone not found");
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

    getBoneByName = (name) => {
        for(let i = 0; i < this.bones.length; i++){
            if( this.bones[i].name.endsWith(name)){
                return this.bones[i];
            }
        }
        return null;
    }

    cycleRaceModel = async () => {
        //get new armature
        let newArmature = await this.getNewArmature(this.state.currentName['Race']);
        this.armatureHolder.remove(this.armatureHolder.children[0]);
        this.armatureHolder.add(newArmature);
        //remove old race from object holder
        this.fManager.removeObjectFromHolder('Race', this.objectHolder);
        //add new race to object holder
        let child = null;
        for(let i = 0; i < newArmature.children.length; i++){
            if(newArmature.children[i].isSkinnedMesh){
                child = newArmature.children[i];
                child.name = 'Race';
                this.objectPool['Race']['Race1'] = child;
                THREE.SceneUtils.attach(child, newArmature, this.objectHolder);
                break;
            }
        }

    }

    getNewArmature = async ( race) => {
        const url = this.state.cache['Race'][race];
        let raceModel = await this.loadNewArmatureFromMemory(url);
        return raceModel;

    }


    cycleSkinnedMeshes = async () => {
        let current = this.state.currentName;

        let child;
        for(var category in current){
            let selection = current[category];
            if(current[category] !== "''" && category !== 'Race' && category !== 'Pose' ){
                await this.loadModelToMemory(category, selection, null);
                let smesh = this.loadModelFromMemory(category, selection, true);

                //remove the old object
                this.fManager.removeObjectFromHolder(category, this.objectHolder);

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

    // All the bottom bar functions are below
    resetModel = async () => {

        const resetItems = this.resetState.currentName;
        for(let i = this.objectHolder.children.length - 1; i >= 0; i--){
            let name = this.objectHolder.children[i].name;
            if(name !== 'Race' && name !== 'Base' && name !== 'Chest' && name !== 'LegsWearable'){
                this.fManager.removeObjectFromHolder(name, this.objectHolder);
            } else {
                let selection = resetItems[name];

                if(selection !== this.state.currentName[name]){
                    await this.updateObjectHandler(name, selection, false );
                }
            }
        }
        //add missing items 
        let items = ['Base', 'Chest', 'LegsWearable'];
        for(let i = 0; i < items.length; i++){
            let selection = items[i];
            if(this.state.currentName[selection] !== resetItems[selection]){
                await this.updateObjectHandler(selection, resetItems[selection], false );
            }
        }

        this.setPoseHandler('Pose1');

        //set the correct state
        this.resetMorphTargets();
        //correct morph targets
        this.state = {
            ...this.state,
            selected: this.resetState.selected,
            currentName: this.resetState.currentName,
            currentObject: this.resetState.currentObject,
            links: this.resetState.links,
            materials: this.resetState.materials
        }
    }

    resetMorphTargets = () => {
        this.state.morphTargets = {
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

        for(var part in this.state.morphTargets.body){
            this.updateBodyPercent(part, 0);
        }
        for(var expression in this.state.morphTargets.expression){
            this.updateExpressionPercent(expression, 0);
        }

    }

    //need to use setState here 
    updateExpressionPercent (trait, newPercent) {
        let expressions = this.state.morphTargets.expression;
        expressions[trait].percent = newPercent;
        this.updateMorphTargets( trait, newPercent);
        this.builder.forceUpdate();
    }

    //need to use setState here 
    updateBodyPercent (trait, newPercent) {
        let bodyTargets = this.state.morphTargets.body; 
        bodyTargets[trait].percent = newPercent;
        this.updateMorphTargets(trait, newPercent);
        this.builder.forceUpdate();
    }

    //need to get from State
    updateMorphTargets (trait, newPercent) {
        var objects = this.objectHolder.children;
        for(let i = 0; i < objects.length; i++) {
            let dictionary = null;
            let influences = null;
            if(objects[i].morphTargetDictionary && objects[i].morphTargetInfluences){
                dictionary = objects[i].morphTargetDictionary;
                influences = objects[i].morphTargetInfluences;
            }
            else {
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
            if(this.state.morphTargets.body[morph]){
                influences[dictionary[morph]] = (this.state.morphTargets.body[morph].percent / 100 );
            } else {
                influences[dictionary[morph]] = (this.state.morphTargets.expression[morph].percent / 100 );
            }
        }
    }


    loadSavedModel =  async (savedState) => {

        let links = savedState.links;
        let morphTargets = savedState.morphTargets;
        let objects = savedState.objects;
        this.state = {
            ...this.state,
            links: links,
            morphTargets: morphTargets
        }
        let categoryArr = [];
        let selectionArr = [];
        //load all items not already in memory into memory
        for(var category in objects){
            if( objects[category] !== "''" && !this.fManager.isObjectInCache(category, objects[category], this.objectPool) && category !== 'Pose' ){
                categoryArr.push(category);
                selectionArr.push(objects[category]);
            }
        }

        await this.loadMultipleModelsToMemory(categoryArr, selectionArr);
        this.processMultipleModels(categoryArr, selectionArr);

        //iterate through all items and switch to saved items
        for(var nextCat in objects){
            if(nextCat !== 'Pose'){
                if(objects[nextCat] === "''" && this.state.currentName[nextCat] === "''"){
                    continue;
                } else if (objects[nextCat] ===  this.state.currentName[nextCat]) {
                    continue;
                } else if(objects[nextCat] === "''" && this.state.currentName[nextCat] !== "''") {
                    this.updateObjectHandler(nextCat, this.state.currentName[nextCat], false)
                } else {
                    this.updateObjectHandler(nextCat, objects[nextCat], false)
                } 
            }
        }

        //pose the model
        if(objects['Pose'] !== this.state.currentName['Pose']){
            this.setPoseHandler(objects['Pose']);
        }


        for(var part in this.state.morphTargets.body){
            this.updateBodyPercent(part, this.state.morphTargets.body[part]['percent']);
        }
        for(var expression in this.state.morphTargets.expression){
            this.updateExpressionPercent(expression, this.state.morphTargets.expression[expression]['percent']);
        }
    }

    getState = () => {
        return this.state;
    }

    getGender = () => {
        return this.state.gender;
    }

    getSaveState = () => {
        let payload = {
            objects: {
                ...this.state.currentName,  
            },
            links: {
                ...this.state.links
            },
            morphTargets: this.state.morphTargets
          };
        return payload;
    }

    getLoadingState = () => {
        return this.state.RESOURCES_LOADED;
    }

}

export default Character