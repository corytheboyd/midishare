import React, { forwardRef, useMemo } from "react";

import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BufferGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { useLoader } from "react-three-fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { KeyboardRuntimeProps, KeyName } from "./types";

export type KeyMesh = Mesh<BufferGeometry, MeshStandardMaterial> & {
  name: KeyName;
};

export const Model = forwardRef<Group, KeyboardRuntimeProps>((props, ref) => {
  const runtime = props.runtimeRef.current;

  const assetUrl = useMemo(() => {
    const url = new URL(runtime.assetPath);
    url.pathname = "keyboard.glb";
    return url.toString();
  }, [runtime.assetPath]);

  const result = useLoader(GLTFLoader, assetUrl, (loader) => {
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
