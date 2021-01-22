import * as React from "react";
import { useThree } from "react-three-fiber";
import { useEffect } from "react";
import { onlyRenderOnceLogger } from "./lib/debug";

// TODO remove when not needed elsewhere. just until I get the math right or
//  fix the model rigging
export const KEY_ROTATION_OFFSET_CONSTANT = 0.35;

const FallbackComponent: React.FC = () => <></>;

export const KeyboardScene: React.FC = (props) => {
  onlyRenderOnceLogger(KeyboardScene);

  const { camera, scene, viewport, invalidate } = useThree();

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
    camera.zoom = viewport.width * 0.225;
    scene.position.z = -0.8 * KEY_ROTATION_OFFSET_CONSTANT;
    camera.updateProjectionMatrix();
  }, []);

  return (
    <>
      <pointLight
        color={"#FFFAD6"}
        position={[30, 100, 10]}
        power={10}
        intensity={1}
      />
      <React.Suspense fallback={<FallbackComponent />}>
        {props.children}
      </React.Suspense>
    </>
  );
};
