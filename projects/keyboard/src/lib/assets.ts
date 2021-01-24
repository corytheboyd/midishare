import { BufferGeometry } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let keyboardGeometryPromise: Promise<BufferGeometry>;
let keyboardGeometry: BufferGeometry;

/**
 * Preloads assets needed to render the Keyboard.
 * */
export async function preloadAssets(): Promise<void> {
  if (keyboardGeometryPromise) {
    return;
  }

  const loader = new GLTFLoader();

  keyboardGeometryPromise = new Promise((resolve, reject) => {
    const assetUrl = new URL(process.env.CDN_URL);
    assetUrl.pathname = "keyboard.gltf";

    loader.load(
      assetUrl.toString(),
      (result) => {
        console.debug("result GLTF", result);
      },
      null,
      reject
    );
  });

  keyboardGeometry = await keyboardGeometryPromise;
  console.debug("WE HAVE LOADED", keyboardGeometry);
}

export function getKeyboardGeometry(): BufferGeometry {
  if (!keyboardGeometryPromise) {
    throw new Error("preloadAssets must first be called!");
  }

  // TODO perhaps errors look different, i.e. it resolves to an object with
  //  no data or something.
  if (!keyboardGeometry) {
    throw new Error(
      "Keyboard geometry not yet loaded, this should not happen!"
    );
  }

  return keyboardGeometry;
}

export function isKeyboardGeometryLoaded(): boolean {
  return !!keyboardGeometry;
}
