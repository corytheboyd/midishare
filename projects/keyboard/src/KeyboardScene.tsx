import * as React from "react";
import { invalidate, useFrame, useThree } from "react-three-fiber";
import { useEffect, useRef } from "react";
import { onlyRenderOnceLogger } from "./lib/debug";
import { KeyboardRuntimeProps } from "./types";
import { messageStreamLogger } from "../../inspector/src/lib/debug";
import { Color, Mesh } from "three";

// TODO remove when not needed elsewhere. just until I get the math right or
//  fix the model rigging
export const KEY_ROTATION_OFFSET_CONSTANT = 0.35;

const FallbackComponent: React.FC<{ color: Color }> = ({ color }) => {
  const mesh = useRef<Mesh>();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color || "blue"} />
    </mesh>
  );
};

export const KeyboardScene: React.FC<KeyboardRuntimeProps> = (props) => {
  onlyRenderOnceLogger(KeyboardScene);

  const { camera, scene, viewport, invalidate, forceResize } = useThree();

  // Initial invalidation to kick start the drawing process. It's mentioned
  // literally nowhere in the documentation which is suspect, but this
  // doesn't seem to happen out of the box. Maybe consider creating a GH issue
  // for this or something.
  useEffect(() => invalidate());

  // Maintain constant dimensions of objects as viewport size changes. This
  // is the magic sauce to make it render on any sized display the same way,
  // and take advantage of all that space.
  //
  // TODO we should do this on viewport change too, being lazy for now
  useEffect(() => {
    console.debug(
      `${props.runtimeRef.current.id}: RECALCULATE CAMERA POSITION ON VIEWPORT CHANGE`,
      [viewport.width, viewport.height, viewport.factor, viewport.distance]
    );

    // camera.zoom = viewport.width * 0.225;
    // scene.position.z = -0.8 * KEY_ROTATION_OFFSET_CONSTANT;

    camera.zoom = 100;
    // camera.updateProjectionMatrix();
  }, [viewport.width]);

  return (
    <>
      <pointLight
        color={"#FFFAD6"}
        // position={[30, 100, 10]}
        position={[0, 0, 100]}
        power={10}
        intensity={1}
      />
      <React.Suspense
        fallback={
          <FallbackComponent color={props.runtimeRef.current.keyPressedColor} />
        }
      >
        {props.children}
      </React.Suspense>
    </>
  );
};
