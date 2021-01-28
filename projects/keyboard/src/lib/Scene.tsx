import * as React from "react";
import { KeyboardRuntimeProps, KeyName } from "../types";
import { RectReadOnly } from "react-use-measure";
import { useCallback, useEffect, useRef } from "react";
import { invalidate, useFrame } from "react-three-fiber";
import { Color, Group } from "three";
import { KeyMesh, Model } from "./Model";
import { getIndexFromKeyName } from "./convert/getIndexFromKeyName";
import { lerp } from "./lerp";
import { SCALE_RATIO } from "./Keyboard";

const voidColor = new Color(0, 0, 0);

export const Scene: React.FC<
  KeyboardRuntimeProps & { bounds: RectReadOnly }
> = (props) => {
  const runtime = props.runtimeRef.current;
  useEffect(() => runtime.onNeedRender(invalidate), []);

  const modelRef = useRef<Group>();
  const keyMeshArrayRef = useRef<KeyMesh[]>();

  const setModelRef = useCallback((group: Group | null) => {
    modelRef.current = group;

    if (modelRef.current === null) {
      console.debug("Model component was unmounted, clearing ref value");
      return;
    }

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

    runtime.setIsReady();
  }, []);

  useEffect(() => {
    if (modelRef.current) {
      handleResize();
    }
  }, [props.bounds]);

  const handleResize = () => {
    if (!modelRef.current) {
      return;
    }

    // Adjust the scale of the model to fill the newly resized viewport.
    const newScale = props.bounds.width * SCALE_RATIO;
    modelRef.current.scale.set(newScale, newScale, newScale);

    // This magic formula is what aligns the keyboard with the top of
    // the scene: https://imgur.com/a/VqGVaj7
    // position={[0, 0, (props.bounds.width * SCALE_RATIO) / -3.64]}
    modelRef.current.position.z = (props.bounds.width * SCALE_RATIO) / -4.3;
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
        keyMesh.rotation.x = lerp(keyMesh.rotation.x, 0, 0.5);

        if (runtime.keyPressedColor) {
          keyMesh.material.emissive.lerp(voidColor, 0.15);
        }
      } else {
        keyMesh.rotation.x = lerp(keyMesh.rotation.x, 0.09, 0.25);

        if (runtime.keyPressedColor) {
          keyMesh.material.emissive.lerp(runtime.keyPressedColor, 1);
        }
      }
    }
  });

  return (
    <>
      <pointLight position={[0, 1000, 250]} power={15 * Math.PI} />
      <React.Suspense fallback={null}>
        <Model ref={setModelRef} />
      </React.Suspense>
    </>
  );
};
