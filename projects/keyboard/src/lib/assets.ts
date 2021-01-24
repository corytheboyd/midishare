import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { BufferGeometry } from "three";

let keyboardGeometryPromise: Promise<BufferGeometry>;
let keyboardGeometry: BufferGeometry;

/**
 * Preloads assets needed to render the Keyboard.
 * */
export async function preloadAssets(): Promise<void> {
  if (keyboardGeometryPromise) {
    return;
  }

  const loader = new DRACOLoader();
  loader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.4.1/"
  );

  keyboardGeometryPromise = new Promise((resolve, reject) => {
    const assetUrl = new URL(process.env.CDN_URL);
    assetUrl.pathname = "keyboard.drc";
    loader.load(assetUrl.toString(), resolve, null, reject);
  });

  loader.preload();

  try {
    keyboardGeometry = await keyboardGeometryPromise;
    console.debug("WE HAVE LOADED", keyboardGeometry);
  } finally {
    loader.dispose();
  }
}

export function getKeyboardGeometry(): BufferGeometry {
  if (!keyboardGeometryPromise) {
    throw new Error("preloadAssets must first be called!");
  }

  // TODO perhaps errors look different, i.e. it resolves to an object with
  //  no data or something.
  if (!keyboardGeometry) {
    // console.warn("Keyboard geometry not yet loaded, this should not happen!");
  }

  return keyboardGeometry;
}

export function isKeyboardGeometryLoaded(): boolean {
  return !!keyboardGeometry;
}
