import * as React from "react";
import { forwardRef, useMemo } from "react";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BufferGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { KeyName } from "../types";
import { useLoader } from "react-three-fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export type KeyMesh = Mesh<BufferGeometry, MeshStandardMaterial> & {
  name: KeyName;
};

const assetUrl = new URL(process.env.CDN_URL);
assetUrl.pathname = "keyboard.glb";

export const Model = forwardRef<Group>((props, ref) => {
  // const gltfResult = useGLTF(assetUrl.toString()) as GLTFResult;
  const result = useLoader(
    GLTFLoader,
    assetUrl.toString(),
    (loader: GLTFLoader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
      loader.setDRACOLoader(dracoLoader);
    }
  ) as GLTF & {
    nodes: Record<KeyName | "Scene", KeyMesh>;
    materials: Record<"Natural" | "Accidental", MeshStandardMaterial>;
  };

  const group = useMemo<Group>(() => {
    const group = new Group();

    result.nodes.A0.geometry.computeBoundingBox();
    const zOffset = result.nodes.A0.geometry.boundingBox.max.y;

    group.add(
      ...result.scene.children.map((child) => {
        const keyMesh = child.clone() as KeyMesh;
        keyMesh.material = keyMesh.material.clone();
        keyMesh.geometry = keyMesh.geometry.clone();

        keyMesh.geometry.translate(0, 0, zOffset);

        if (keyMesh.name.length === 2) {
          keyMesh.material.color.set("#FFFFFF");
        } else {
          keyMesh.material.color.set("#101010");
        }

        return keyMesh;
      })
    );

    return group;
  }, []);

  return <primitive dispose={null} object={group} ref={ref} />;
});

Model.displayName = "Model";
