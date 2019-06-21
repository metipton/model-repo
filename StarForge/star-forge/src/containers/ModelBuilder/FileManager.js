import {fbStorage} from '../../Firebase';
import GLTFLoader from 'three-gltf-loader';


class FileManager {

    constructor (builder) {
        this.builder = builder;
        this.gltfLoader = new GLTFLoader();
    }

    isObjectInCache = (category, selection, cache) => {
        let inCache = false;
        for (var object in cache[category]) {
            if(object === selection) {
                inCache = true;
                break;
            }
        }
        return inCache;
    }

    removeObjectFromHolder = (category, holder) => {
        var selectedObject = holder.getObjectByName(category);
        holder.remove(selectedObject);
    }

    downloadObjectFromStorage = ( category, selection, state ) => {
        return new Promise( ( resolve, reject ) => {
            fbStorage.ref( '/Models/' + category + '/' + selection + '.glb' )
                .getDownloadURL()
                .then( url => {
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function( ) {
                        resolve( xhr.response );
                    };
                    xhr.open( 'GET', url );
                    xhr.send();
                })
                .catch(error => {
                    console.log(error);
                    state.selected = state.currentName;
                    this.builder.forceUpdate();
                    reject();
                })
        });
    }

    loadModelToMemory = (category, selection, file, state, objectPool) => {
        return new Promise((resolve, reject) => {
            const url = (file !== null ? window.URL.createObjectURL(file) : state.cache[category][selection]);
            this.gltfLoader.load(
                url,
                (object) => {
                    let newFile = {
                        ...objectPool[category],
                        [selection]: object
                    };
                    objectPool[category] = newFile;
                    resolve();
                },
                 null,
                (error) => {
                    console.log(error);
                    state = {
                        ...state,
                        selected: state.currentName
                    };
                    reject(error);
                }
            )
        });
    }
}

export default FileManager