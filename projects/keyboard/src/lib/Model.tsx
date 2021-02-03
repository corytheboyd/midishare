import React, { forwardRef, useMemo } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BufferGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { useLoader } from "react-three-fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { KeyName } from "./types";
import { Runtime } from "./Runtime";

export type KeyMesh = Mesh<BufferGeometry, MeshStandardMaterial> & {
  name: KeyName;
};

type ModelProps = {
  runtime: Runtime;
};

export const Model = forwardRef<Group, ModelProps>((props, ref) => {
  const assetPath = props.runtime.assetPath + "/keyboard.glb";

  const result = useLoader(GLTFLoader, assetPath, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    (loader as GLTFLoader).setDRACOLoader(dracoLoader);
  }) as GLTF & {
    nodes: Record<KeyName | "Scene", KeyMesh>;
    materials: Record<"Natural" | "Accidental", MeshStandardMaterial>;
  };

  const group = useMemo<Group>(() => {
    const group = new Group();

    result.nodes.A0.geometry.computeBoundingBox();
    const zOffset = result.nodes.A0.geometry.boundingBox!.max.y;

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
