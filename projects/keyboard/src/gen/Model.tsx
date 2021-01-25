/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import * as React from "react";
import { useMemo } from "react";
import { useGLTF } from "@react-three/drei/useGLTF";

import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { BufferGeometry, MeshPhongMaterial } from "three";
import { KeyName } from "../types";

type KeyMesh = THREE.Mesh<BufferGeometry, MeshPhongMaterial>;

type GLTFResult = GLTF & {
  nodes: {
    [T in KeyName]: KeyMesh;
  };
  materials: {
    Natural: THREE.MeshStandardMaterial;
    Accidental: THREE.MeshStandardMaterial;
  };
};

const assetUrl = new URL(process.env.CDN_URL);
assetUrl.pathname = "keyboard.glb";

export const Model: React.FC = () => {
  const gltfResult = useGLTF(assetUrl.toString()) as GLTFResult;
  const nodes = useMemo<{ [T in KeyName]: KeyMesh }>(() => {
    gltfResult.materials.Natural.color.set("#ffffff");
    gltfResult.materials.Accidental.color.set("#101010");

    const nodes = {};
    for (const nodeName in gltfResult.nodes) {
      if (nodeName === "Scene") {
        continue;
      }
      nodes[nodeName] = gltfResult.nodes[nodeName];

      nodes[nodeName].name = nodeName;

      // Create a copy of the material for individual highlights. Maybe there
      // is a better way of doing it, but this is simple and it works.
      nodes[nodeName].material = nodes[nodeName].material.clone();
    }

    return nodes as { [T in KeyName]: KeyMesh };
  }, []);

  return (
    <group dispose={null} rotation={[-0.75, 0, 0]} position={[0, 0, 0.03]}>
      <mesh
        material={nodes.A0.material}
        geometry={nodes.A0.geometry}
        position={[-2.1494, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.A1.material}
        geometry={nodes.A1.geometry}
        position={[-1.5596, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.A2.material}
        geometry={nodes.A2.geometry}
        position={[-0.9695, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.A3.material}
        geometry={nodes.A3.geometry}
        position={[-0.3799, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.A4.material}
        geometry={nodes.A4.geometry}
        position={[0.2102, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.A5.material}
        geometry={nodes.A5.geometry}
        position={[0.8004, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.A6.material}
        geometry={nodes.A6.geometry}
        position={[1.3899, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.A7.material}
        geometry={nodes.A7.geometry}
        position={[1.98, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.B0.material}
        geometry={nodes.B0.geometry}
        position={[-2.0651, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.B1.material}
        geometry={nodes.B1.geometry}
        position={[-1.4751, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.B2.material}
        geometry={nodes.B2.geometry}
        position={[-0.885, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.B3.material}
        geometry={nodes.B3.geometry}
        position={[-0.2955, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.B4.material}
        geometry={nodes.B4.geometry}
        position={[0.2946, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.B5.material}
        geometry={nodes.B5.geometry}
        position={[0.8848, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.B6.material}
        geometry={nodes.B6.geometry}
        position={[1.4744, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.B7.material}
        geometry={nodes.B7.geometry}
        position={[2.0645, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.C1.material}
        geometry={nodes.C1.geometry}
        position={[-1.9804, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.C2.material}
        geometry={nodes.C2.geometry}
        position={[-1.3904, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.C3.material}
        geometry={nodes.C3.geometry}
        position={[-0.8007, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.C4.material}
        geometry={nodes.C4.geometry}
        position={[-0.2107, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.C5.material}
        geometry={nodes.C5.geometry}
        position={[0.3795, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.C6.material}
        geometry={nodes.C6.geometry}
        position={[0.9691, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.C7.material}
        geometry={nodes.C7.geometry}
        position={[1.5591, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.C8.material}
        geometry={nodes.C8.geometry}
        position={[2.1481, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.D1.material}
        geometry={nodes.D1.geometry}
        position={[-1.8966, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.D2.material}
        geometry={nodes.D2.geometry}
        position={[-1.3066, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.D3.material}
        geometry={nodes.D3.geometry}
        position={[-0.7169, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.D4.material}
        geometry={nodes.D4.geometry}
        position={[-0.1269, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.D5.material}
        geometry={nodes.D5.geometry}
        position={[0.4633, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.D6.material}
        geometry={nodes.D6.geometry}
        position={[1.0529, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.D7.material}
        geometry={nodes.D7.geometry}
        position={[1.6429, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.E1.material}
        geometry={nodes.E1.geometry}
        position={[-1.8121, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.E2.material}
        geometry={nodes.E2.geometry}
        position={[-1.2221, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.E3.material}
        geometry={nodes.E3.geometry}
        position={[-0.6325, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.E4.material}
        geometry={nodes.E4.geometry}
        position={[-0.0425, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.E5.material}
        geometry={nodes.E5.geometry}
        position={[0.5477, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.E6.material}
        geometry={nodes.E6.geometry}
        position={[1.1374, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.E7.material}
        geometry={nodes.E7.geometry}
        position={[1.7274, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.F1.material}
        geometry={nodes.F1.geometry}
        position={[-1.7277, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.F2.material}
        geometry={nodes.F2.geometry}
        position={[-1.1376, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.F3.material}
        geometry={nodes.F3.geometry}
        position={[-0.5481, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.F4.material}
        geometry={nodes.F4.geometry}
        position={[0.042, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.F5.material}
        geometry={nodes.F5.geometry}
        position={[0.6322, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.F6.material}
        geometry={nodes.F6.geometry}
        position={[1.2218, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.F7.material}
        geometry={nodes.F7.geometry}
        position={[1.8118, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.G1.material}
        geometry={nodes.G1.geometry}
        position={[-1.6439, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.G2.material}
        geometry={nodes.G2.geometry}
        position={[-1.0538, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.G3.material}
        geometry={nodes.G3.geometry}
        position={[-0.4643, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.G4.material}
        geometry={nodes.G4.geometry}
        position={[0.1258, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.G5.material}
        geometry={nodes.G5.geometry}
        position={[0.716, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.G6.material}
        geometry={nodes.G6.geometry}
        position={[1.3055, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.G7.material}
        geometry={nodes.G7.geometry}
        position={[1.8956, 0.0303, -0.0019]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.AsBb0.material}
        geometry={nodes.AsBb0.geometry}
        position={[-2.1059, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.AsBb1.material}
        geometry={nodes.AsBb1.geometry}
        position={[-1.5169, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.AsBb2.material}
        geometry={nodes.AsBb2.geometry}
        position={[-0.9266, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.AsBb3.material}
        geometry={nodes.AsBb3.geometry}
        position={[-0.3368, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.AsBb4.material}
        geometry={nodes.AsBb4.geometry}
        position={[0.2534, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.AsBb5.material}
        geometry={nodes.AsBb5.geometry}
        position={[0.844, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.AsBb6.material}
        geometry={nodes.AsBb6.geometry}
        position={[1.4332, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.AsBb7.material}
        geometry={nodes.AsBb7.geometry}
        position={[2.0233, 0.0443, -0.1003]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.CsDb1.material}
        geometry={nodes.CsDb1.geometry}
        position={[-1.9373, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.CsDb2.material}
        geometry={nodes.CsDb2.geometry}
        position={[-1.3473, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.CsDb3.material}
        geometry={nodes.CsDb3.geometry}
        position={[-0.7576, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.CsDb4.material}
        geometry={nodes.CsDb4.geometry}
        position={[-0.1674, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.CsDb5.material}
        geometry={nodes.CsDb5.geometry}
        position={[0.4228, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.CsDb6.material}
        geometry={nodes.CsDb6.geometry}
        position={[1.0123, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.CsDb7.material}
        geometry={nodes.CsDb7.geometry}
        position={[1.6023, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.DsEb1.material}
        geometry={nodes.DsEb1.geometry}
        position={[-1.8539, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.DsEb2.material}
        geometry={nodes.DsEb2.geometry}
        position={[-1.2636, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.DsEb3.material}
        geometry={nodes.DsEb3.geometry}
        position={[-0.6737, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.DsEb4.material}
        geometry={nodes.DsEb4.geometry}
        position={[-0.0839, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.DsEb5.material}
        geometry={nodes.DsEb5.geometry}
        position={[0.5063, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.DsEb6.material}
        geometry={nodes.DsEb6.geometry}
        position={[1.0959, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.DsEb7.material}
        geometry={nodes.DsEb7.geometry}
        position={[1.6862, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.FsGb1.material}
        geometry={nodes.FsGb1.geometry}
        position={[-1.6842, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.FsGb2.material}
        geometry={nodes.FsGb2.geometry}
        position={[-1.0947, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.FsGb3.material}
        geometry={nodes.FsGb3.geometry}
        position={[-0.5048, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.FsGb4.material}
        geometry={nodes.FsGb4.geometry}
        position={[0.0853, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.FsGb5.material}
        geometry={nodes.FsGb5.geometry}
        position={[0.6753, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.FsGb6.material}
        geometry={nodes.FsGb6.geometry}
        position={[1.265, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.FsGb7.material}
        geometry={nodes.FsGb7.geometry}
        position={[1.855, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.GsAb1.material}
        geometry={nodes.GsAb1.geometry}
        position={[-1.6013, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.GsAb2.material}
        geometry={nodes.GsAb2.geometry}
        position={[-1.0107, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.GsAb3.material}
        geometry={nodes.GsAb3.geometry}
        position={[-0.421, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.GsAb4.material}
        geometry={nodes.GsAb4.geometry}
        position={[0.1684, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.GsAb5.material}
        geometry={nodes.GsAb5.geometry}
        position={[0.7591, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.GsAb6.material}
        geometry={nodes.GsAb6.geometry}
        position={[1.3484, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
      <mesh
        material={nodes.GsAb7.material}
        geometry={nodes.GsAb7.geometry}
        position={[1.939, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
      />
    </group>
  );
};

useGLTF.preload(assetUrl.toString());
