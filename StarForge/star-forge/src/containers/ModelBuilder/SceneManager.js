import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import GLTFExporter from 'three-gltf-exporter';
import OrbitControls from 'three-orbitcontrols';
import Character from './Character.js';

import px from '../../assets/skybox/scifi-px.jpg'
import nx from '../../assets/skybox/scifi-nx.jpg';
import py from '../../assets/skybox/scifi-py.jpg';
import ny from '../../assets/skybox/scifi-ny.jpg';
import pz from '../../assets/skybox/scifi-pz.jpg';
import nz from '../../assets/skybox/scifi-nz.jpg';

class SceneManager{

  constructor(builder, numChars) {
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
    this.builder = builder;
    this.loading = true;
    this.numCharacters = numChars;
    this.currentCharNum = 1;
    this.characters = [];
    this.scenes  = [];
    this.init();
  }

  init(){
    this.skyBox = null;
    this.THREE = THREE;
    this.gltfLoader = new GLTFLoader();
    this.exporter = new GLTFExporter();
    this.clock = new THREE.Clock();

    //main scene objects

    this.scene = new THREE.Scene();

    for(let i = 0; i < this.numCharacters; i++){
      let char = new Character(i + 1, 'male', 'Human', this.scene, this, this.builder);
      this.characters.push(char);
    }
  }

  postMountInit = (mount) => {
    this.mount = mount;
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.setupRenderer(width, height);
    this.setupCamera(width, height);
    this.setupLighting();
    this.setupControls();
    this.setupEnvironment();

    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }

  setupRenderer(width, height) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.gammaOutput = true
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
  }

  setupCamera(width, height) {
    this.camera = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      1000
    )

    this.camera.setViewOffset(width * 1.3, height * 1.3, width * .25, height * .15, width, height );
    this.camera.frustrumCulled = false;
    this.camera.position.z = 5.5;
    this.camera.position.y = 2;
    this.scene.add(this.camera);

    this.initCameraPosit = new THREE.Vector3(0,0,0);
    this.camera.getWorldPosition(this.initCameraPosit);
    this.initCameraRotation = new THREE.Quaternion();
    this.camera.getWorldQuaternion(this.initCameraRotation);
  }

  setupLighting() {
    var hemiLight = new THREE.HemisphereLight( 0x111111, 0x111111, 0.7 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );

    var dirLight = new THREE.DirectionalLight( 0x111111, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -.25, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 8192;
    dirLight.shadow.mapSize.height = 8192;
    dirLight.shadow.camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 0.1, 1000 );

    this.scene.add( hemiLight );
    this.scene.add( dirLight );
  }

  setupControls() {
    //enable orbit controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
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
    this.controls = controls;
  }

  setupEnvironment() {
    //make skybox
    var geometry = new THREE.CubeGeometry(70, 70, 70);
    var cubeMaterials = [
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(px), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(nx), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(py), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(ny), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(pz), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(nz), side: THREE.DoubleSide}),
    ];
    this.skyBox = new THREE.Mesh(geometry, cubeMaterials);
    this.skyBox.name = 'skybox';
    this.skyBox.receiveShadow = true;

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
    this.ground.position.y = -.1;

    this.scene.add(this.ground);
    this.scene.add(this.skyBox);
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
    this.frameId = requestAnimationFrame( this.animate );
    var delta = this.clock.getDelta();

    for(let i = 0; i < this.characters.length; i++)
    {
      if (this.characters[i].mixer !== null && this.characters[i].mixer !== undefined) {
        this.characters[i].mixer.update(delta);
      };
    }

    this.renderScene();
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
    if(this.loading){
        //need to find a way to update redux in the component instead of here.
        //this.props.finishedLoading();
        this.loading = false;
    }
      // update the picking ray with the camera and mouse position

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

  onWindowResize = () => {
    var width = window.innerWidth;
    var height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  cloneScene = () => {
      console.log(this.scene);
      let gltf = this.scene;
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

  getExportObjects = () => {
    console.log(this.scene);
    console.log(this.getCurrentCharState());
    let objects = [];
    for(let i = 1; i <= this.characters.length; i++){
      let holder = this.scene.getObjectByName("Object Holder " + i);
      for(let j = 0; j < holder.children.length; j++){
        let child = holder.children[j];
        if(child.name !== "rigcurrent"){
            let clone;
            if(child.isSkinnedMesh){
                clone = this.createPosedClone(child);
            } else {
                clone = child.clone();
            }
            objects.push(clone);
        }
      }
    }
    return objects;
  }

  createPosedClone = (skinnedMesh) => {
      
    let clone = skinnedMesh.clone();
    var boneMatrices = skinnedMesh.skeleton.boneMatrices;
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



  cycleAllRaceModels = async () => {
    for(let i = 0; i < this.characters.length; i++){
      await this.characters[i].cycleRaceModel();
    }
  }

  cycleAllSkinnedMeshes = async () => {
    for(let i = 0; i < this.characters.length; i++){
      await this.characters[i].cycleSkinnedMeshes();
    }
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
      let currentCamPosit = new THREE.Vector3(0,0,0)
      this.camera.getWorldPosition(currentCamPosit);
      let currentCamRotation = new THREE.Quaternion();
      this.camera.getWorldQuaternion(currentCamRotation);
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

  resetAllModels = () => {
    for( let i = 0; i < this.characters.length; i++){
      this.characters[i].resetModel();
    }
  }

  loadSavedModels = async (savedState) => {
    const loads = [];
    for( let i = 0; i < this.characters.length; i++ ){
        loads.push(this.characters[i].loadSavedModel(savedState[i]));
    }

    //this makes sure all the above async calls are complete before applying the pose.
    Promise.all(loads).then(() => {    
      return;
    });
  }

  setAllPoses = (pose) => {
    for(let i = 0; i < this.characters.length; i++ ){
      this.characters[i].setPoseHandler(pose);
    }
  }

  
  setCurrentChar = (charNum) => {
    this.currentCharNum = charNum;
    console.log("character " + this.currentCharNum + " is selected.");
    this.builder.forceUpdate();
  }

  getCompleteSaveState = () => {
    let payload = {};
    for(let i = 0; i < this.characters.length; i++){
      let state = this.characters[i].getSaveState();
      payload = {
        ...payload,
        [i]: state
      }
    }
    console.log(payload);
    return payload;

  }

  getCurrentChar = () => {
    let num = this.currentCharNum - 1;
    return this.characters[num];
  }

  getCurrentCharState = () => {
    let num = this.currentCharNum - 1;
    return this.characters[num].getState();
  }

  
  checkResourcesLoaded = () => {
    let loaded = true;
    for(let i = 0; i < this.characters.length; i++) {
      loaded = loaded && this.characters[i].getLoadingState();
      if (!loaded){ break;}
    }
    this.builder.loadingComplete();
  }
}

export default SceneManager