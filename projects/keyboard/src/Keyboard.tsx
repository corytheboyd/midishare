import * as React from "react";
import { Runtime } from "./lib/Runtime";
import { memo, useCallback, useEffect, useRef } from "react";
import { Canvas, invalidate, useFrame, useThree } from "react-three-fiber";
import useMeasure, { RectReadOnly } from "react-use-measure";
import { KeyMesh, KeyMeshMap, Model } from "./gen/Model";
import { Group, OrthographicCamera } from "three";
import { OrbitControls, Stats } from "@react-three/drei";
import { KeyboardRuntimeProps, KeyName } from "./types";
import { getIndexFromKeyName } from "./lib/convert/getIndexFromKeyName";
import { lerp } from "./lib/lerp";

interface KeyboardProps {
  /**
   * The runtime to use for this Keyboard instance.
   * */
  runtime: Runtime;
}

// Used to calculate new scale of the model as viewport size changes the
// orthographic camera box. It was derived from lazy trial/error to find a
// single scale value (S) that fills the full width of a known container
// width (W), giving us the formula: R = S/W, where R is this constant. The
// values used were W=1205(px), S=275, and then +/- 0.0001 units at a time
// until it fit the width exactly. Dumb? Sure. Works perfectly? Yes.
const SCALE_RATIO = 0.2282;

const Scene: React.FC<KeyboardRuntimeProps & { bounds: RectReadOnly }> = (
  props
) => {
  const runtime = props.runtimeRef.current;
  useEffect(() => runtime.onNeedRender(invalidate), []);

  const modelRef = useRef<Group>();
  const keyMeshArrayRef = useRef<KeyMesh[]>();

  const setModelRef = useCallback((group: Group) => {
    modelRef.current = group;
    handleResize();

    keyMeshArrayRef.current = group.children
      .filter((object) => object.type === "Mesh")
      .sort((object1, object2) => {
        const keyName1 = object1.name as KeyName;
        const keyName2 = object2.name as KeyName;
        const value1 = getIndexFromKeyName(keyName1);
        const value2 = getIndexFromKeyName(keyName2);
        return value1 > value2 ? 1 : -1;
      }) as KeyMesh[];

    console.debug("keyMeshArrayRef.current", keyMeshArrayRef.current);

    runtime.setIsReady();
  }, []);

  useEffect(() => {
    if (modelRef.current) {
      handleResize();
    }
  }, [props.bounds]);

  const three = useThree();
  const camera = three.camera as OrthographicCamera;
  const handleResize = () => {
    // Adjust the camera to the bounds of the viewport to maintain aspect
    // ratio of projection.
    camera.right = props.bounds.width / 2;
    camera.left = props.bounds.width / -2;
    camera.top = props.bounds.height / 2;
    camera.bottom = props.bounds.height / -2;
    camera.updateProjectionMatrix();

    // Adjust the scale of the model to fill the newly resized viewport.
    const model = modelRef.current;
    const newScale = props.bounds.width * SCALE_RATIO;
    model.scale.set(newScale, newScale, newScale);
  };

  useFrame(() => {
    if (!keyMeshArrayRef.current) {
      return;
    }

    if (runtime.needRender) {
      invalidate();
    }

    for (let i = 0; i < 88; i++) {
      const keyMesh = keyMeshArrayRef.current[i];
      const velocity = runtime.keys[i];

      if (!velocity) {
        keyMesh.rotation.x = lerp(keyMesh.rotation.x, 0, 0.25);
      } else {
        keyMesh.rotation.x = lerp(keyMesh.rotation.x, 0.06, 0.25);
      }
    }
  });

  return (
    <>
      <React.Suspense fallback={null}>
        <Model ref={setModelRef} />
      </React.Suspense>
    </>
  );
};

export const Keyboard: React.FC<KeyboardProps> = memo((props) => {
  if (!props.runtime) {
    throw new Error(
      "Must instantiate runtime and provide through the Keyboard props API"
    );
  }
  // TODO will get to you, my friend
  const runtimeRef = useRef(props.runtime);

  const [resizeRef, bounds] = useMeasure({ scroll: false });

  return (
    <section className="h-full" ref={resizeRef}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          physicallyCorrectLights: true,
        }}
        camera={{
          position: [0, 1, 0.75],
          near: -1000,
          far: 1000,
        }}
        pixelRatio={2}
        orthographic={true}
        invalidateFrameloop={true}
      >
        <Stats />
        <OrbitControls />
        <Scene bounds={bounds} runtimeRef={runtimeRef} />
      </Canvas>
    </section>
  );
});

Keyboard.displayName = "Keyboard";
