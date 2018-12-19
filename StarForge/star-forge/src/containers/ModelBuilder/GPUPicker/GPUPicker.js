class GPUPickHelper {
    constructor() {
      // create a 1x1 pixel render target
      this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
      this.pixelBuffer = new Uint8Array(4);
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
    pick(cssPosition, scene, camera, time) {
      const {pickingTexture, pixelBuffer} = this;

      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // set the view offset to represent just a single pixel under the mouse
      const pixelRatio = renderer.getPixelRatio();
      camera.setViewOffset(
          renderer.context.drawingBufferWidth,   // full width
          renderer.context.drawingBufferHeight,  // full top
          cssPosition.x * pixelRatio | 0,        // rect x
          cssPosition.y * pixelRatio | 0,        // rect y
          1,                                     // rect width
          1,                                     // rect height
      );
      // render the scene
      renderer.render(scene, camera, pickingTexture);
      // clear the view offset so rendering returns to normal
      camera.clearViewOffset();
      //read the pixel
      renderer.readRenderTargetPixels(
          pickingTexture,
          0,   // x
          0,   // y
          1,   // width
          1,   // height
          pixelBuffer);

      //const id = this.idBuffer[0];
      const id =
          (pixelBuffer[0] << 16) |
          (pixelBuffer[1] <<  8) |
          (pixelBuffer[2]      );

      const intersectedObject = idToObject[id];
      if (intersectedObject) {
        // pick the first object. It's the closest one
        this.pickedObject = intersectedObject;
        // save its color
        this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
        // set its emissive color to flashing red/yellow
        this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
      }
    }
  }

  export default GPUPickHelper;