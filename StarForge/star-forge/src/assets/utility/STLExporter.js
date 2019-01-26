import * as THREE from 'three';

class STLExporter {

  
    constructor() {
      this.parse = this.parse.bind(this);
      this.vector = new THREE.Vector3();
      this.normalMatrixWorld = new THREE.Matrix3();
    }
  
    parse = (objects, callback) => {
        var output = '';

        output += 'solid exported\n';

        for(let i = 0; i < objects.length; i++) {
            let object = objects[i];
            if (object instanceof THREE.Mesh) {

                var geometry = object.geometry;
                var matrixWorld = object.matrixWorld;
                var mesh = object;

                if (geometry instanceof THREE.BufferGeometry) {

                    var vertices = geometry.vertices;
                    var faces = geometry.faces;

                    this.normalMatrixWorld.getNormalMatrix(matrixWorld);

                    for (var i = 0, l = faces.length; i < l; i++) {
                        var face = faces[i];

                        this.vector.copy(face.normal).applyMatrix3(this.normalMatrixWorld).normalize();

                        output += '\tfacet normal ' + this.vector.x + ' ' + this.vector.y + ' ' + this.vector.z + '\n';
                        output += '\t\touter loop\n';

                        var indices = [face.a, face.b, face.c];

                        for (var j = 0; j < 3; j++) {
                            var vertexIndex = indices[j];
                            if (mesh.geometry.skinIndices.length == 0) {
                                this.vector.copy(vertices[vertexIndex]).applyMatrix4(matrixWorld);
                                output += '\t\t\tvertex ' + this.vector.x + ' ' + this.vector.y + ' ' + this.vector.z + '\n';
                            } else {
                                this.vector.copy(vertices[vertexIndex]); //.applyMatrix4( matrixWorld );

                                // see https://github.com/mrdoob/three.js/issues/3187
                                let boneIndices = [];
                                boneIndices[0] = mesh.geometry.skinIndices[vertexIndex].x;
                                boneIndices[1] = mesh.geometry.skinIndices[vertexIndex].y;
                                boneIndices[2] = mesh.geometry.skinIndices[vertexIndex].z;
                                boneIndices[3] = mesh.geometry.skinIndices[vertexIndex].w;

                                let weights = [];
                                weights[0] = mesh.geometry.skinWeights[vertexIndex].x;
                                weights[1] = mesh.geometry.skinWeights[vertexIndex].y;
                                weights[2] = mesh.geometry.skinWeights[vertexIndex].z;
                                weights[3] = mesh.geometry.skinWeights[vertexIndex].w;

                                let inverses = [];
                                inverses[0] = mesh.skeleton.boneInverses[boneIndices[0]];
                                inverses[1] = mesh.skeleton.boneInverses[boneIndices[1]];
                                inverses[2] = mesh.skeleton.boneInverses[boneIndices[2]];
                                inverses[3] = mesh.skeleton.boneInverses[boneIndices[3]];

                                let skinMatrices = [];
                                skinMatrices[0] = mesh.skeleton.bones[boneIndices[0]].matrixWorld;
                                skinMatrices[1] = mesh.skeleton.bones[boneIndices[1]].matrixWorld;
                                skinMatrices[2] = mesh.skeleton.bones[boneIndices[2]].matrixWorld;
                                skinMatrices[3] = mesh.skeleton.bones[boneIndices[3]].matrixWorld;
                                
                                let morphMatricesX = [];
                                let morphMatricesY = [];
                                let morphMatricesZ = [];
                                let morphMatricesInfluence = [];

                                //this checks to see if the mesh has any morphTargets - jc
                                if (mesh.geometry.morphTargets !== 'undefined') {

                                


                                    for (var mt = 0; mt < mesh.geometry.morphTargets.length; mt++) {
                                        //collect the needed vertex info - jc
                                        morphMatricesX[mt] = mesh.geometry.morphTargets[mt].vertices[vertexIndex].x;
                                        morphMatricesY[mt] = mesh.geometry.morphTargets[mt].vertices[vertexIndex].y;
                                        morphMatricesZ[mt] = mesh.geometry.morphTargets[mt].vertices[vertexIndex].z;
                                        morphMatricesInfluence[mt] = mesh.morphTargetInfluences[mt];
                                    }

                                }
                                var finalVector = new THREE.Vector4();

                                if (mesh.geometry.morphTargets !== 'undefined') {

                                    var morphVector = new THREE.Vector4(this.vector.x, this.vector.y, this.vector.z);

                                    for (var mt = 0; mt < mesh.geometry.morphTargets.length; mt++) {
                                        //not pretty, but it gets the job done - jc
                                        morphVector.lerp(new THREE.Vector4(morphMatricesX[mt], morphMatricesY[mt], morphMatricesZ[mt], 1), morphMatricesInfluence[mt]);
                                    }

                                }

                                for (var k = 0; k < 4; k++) {
                                    if (mesh.geometry.morphTargets !== 'undefined') {
                                        var tempVector = new THREE.Vector4(morphVector.x, morphVector.y, morphVector.z);
                                    } else {
                                        var tempVector = new THREE.Vector4(this.vector.x, this.vector.y, this.vector.z);
                                    }
                                    tempVector.multiplyScalar(weights[k]);
                                    //the inverse takes the vector into local bone space
                                    //which is then transformed to the appropriate world space
                                    tempVector.applyMatrix4(inverses[k])
                                    .applyMatrix4(skinMatrices[k]);
                                    finalVector.add(tempVector);

                                }

                                output += '\t\t\tvertex ' + finalVector.x + ' ' + finalVector.y + ' ' + finalVector.z + '\n';
                            }
                        }
                        output += '\t\tendloop\n';
                        output += '\tendfacet\n';
                    }
                }
            }

        };

        output += 'endsolid exported\n';
        var blob = new Blob([output], {
            type : 'text/plain'
        });
        callback(blob);
    }

  }

  export default STLExporter;