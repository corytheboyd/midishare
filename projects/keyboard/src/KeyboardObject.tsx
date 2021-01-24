import * as React from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { invalidate, useFrame, useGraph, useLoader } from "react-three-fiber";
import { useEffect, useMemo } from "react";
import { BufferGeometry, Color, Mesh, MeshPhongMaterial } from "three";
import { KeyboardRuntimeProps, KeyName } from "./types";
import { KEY_ROTATION_OFFSET_CONSTANT } from "./KeyboardScene";
import { lerp } from "./lib/lerp";
import { getIndexFromKeyName } from "./lib/convert/getIndexFromKeyName";
import { onlyRenderOnceLogger, rafLogger } from "./lib/debug";
import { getKeyboardGeometry } from "./lib/assets";

type KeyMesh = Mesh<BufferGeometry, MeshPhongMaterial>;

const voidColor = new Color(0, 0, 0);

export const KeyboardObject: React.FC<KeyboardRuntimeProps> = (props) => {
  onlyRenderOnceLogger(KeyboardObject);

  const runtime = props.runtimeRef.current;

  // Restart the animation loop when the runtime requests animation
  runtime.onNeedRender(() => invalidate());

  const geometry = getKeyboardGeometry();
  console.debug("geometry", geometry);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial />
    </mesh>
  );

  // TODO make this hashed. I think parcel has a way of doing it
  const url = new URL(process.env.CDN_URL);
  url.pathname = "/keyboard.obj";
  url.searchParams.append("lol", runtime.id);
  const object = useLoader(OBJLoader, url.toString());
  const { nodes, materials } = useGraph(object);

  // TODO cover fallback to error graphic (object.children.length === 0)
  if (object.children.length === 0) {
    throw new Error("Failed to load model!");
  }
  runtime.setIsReady();

  // Resort the meshes imported from the model in order of appearance on the
  // keyboard
  const indexedKeyMeshList = useMemo<KeyMesh[]>(() => {
    return object.children.sort((object1, object2) => {
      const keyName1 = object1.name as KeyName;
      const keyName2 = object2.name as KeyName;
      const value1 = getIndexFromKeyName(keyName1);
      const value2 = getIndexFromKeyName(keyName2);
      return value1 > value2 ? 1 : -1;
    }) as KeyMesh[];
  }, [object]);

  useFrame(() => {
    rafLogger(`${runtime.id}: run - needRender: ${runtime.needRender}`);

    if (runtime.needRender) {
      invalidate();
    }

    for (let i = 0; i < runtime.keys.length; i++) {
      const mesh = indexedKeyMeshList[i];
      const velocity = runtime.keys[i];

      if (!velocity) {
        mesh.rotation.x = lerp(mesh.rotation.x, -0.06, 0.5);
        if (runtime.keyPressedColor) {
          mesh.material.emissive.lerp(voidColor, 0.15);
        }
      } else {
        mesh.rotation.x = lerp(mesh.rotation.x, 0.0, 0.25);

        if (runtime.keyPressedColor) {
          mesh.material.emissive.lerp(runtime.keyPressedColor, 1);
        }
      }
    }
  });

  // Trigger modifications to imported meshes in a useEffect callback to
  // prevent reapplication after the initial load. If making modifications to
  // this component, be sure that this effect is not evaluated again.
  useEffect(() => {
    console.debug(`${runtime.id}: MODIFY MESHES`);

    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0;

    const natualKeyMaterial = materials["white_key"] as MeshPhongMaterial;
    const accidentalKeyMaterial = materials["BLACK_KEY"] as MeshPhongMaterial;

    natualKeyMaterial.color.set("#ffffff");
    accidentalKeyMaterial.color.set("#101010");

    // natualKeyMaterial.
    for (const keyName in nodes) {
      const keyMesh = nodes[keyName] as Mesh;

      if (keyName.length === 2) {
        keyMesh.material = natualKeyMaterial.clone();
      } else {
        keyMesh.material = accidentalKeyMaterial.clone();
      }

      // Hack to make keys rotate around the back
      keyMesh.geometry.translate(0, 0, KEY_ROTATION_OFFSET_CONSTANT);
    }
  }, [nodes, materials]);

  return <primitive object={object} />;
};
