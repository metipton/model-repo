import * as THREE from 'three';


window.THREE = THREE; // THREE.OrbitControls expects THREE to be a global object
require('three/examples/js/controls/OrbitControls.js')
require('three/examples/js/utils/SceneUtils.js')
require('three/examples/js/exporters/GLTFExporter.js')
require('three/examples/js/loaders/GLTFLoader')

export default window.THREE;