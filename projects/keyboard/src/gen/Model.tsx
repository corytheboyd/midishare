/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import * as React from "react";
import { forwardRef, MutableRefObject, useMemo } from "react";
import { useGLTF } from "@react-three/drei/useGLTF";

import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { BufferGeometry, Group, MeshStandardMaterial } from "three";
import { KeyName } from "../types";
import { GroupProps } from "react-three-fiber";

export type KeyMesh = THREE.Mesh<BufferGeometry, MeshStandardMaterial> & {
  name: KeyName;
};

export type KeyMeshMap = Record<KeyName, KeyMesh>;

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

export const Model = forwardRef<Group, GroupProps>((props, ref) => {
  const gltfResult = useGLTF(assetUrl.toString()) as GLTFResult;

  const keyMeshMap = useMemo<KeyMeshMap>(() => {
    gltfResult.materials.Natural.color.set("#ffffff");
    gltfResult.materials.Accidental.color.set("#101010");

    const map = {} as Record<KeyName, KeyMesh>;
    let keyName: KeyName | "Scene";
    for (keyName in gltfResult.nodes) {
      if (keyName === "Scene") {
        continue;
      }
      const keyMesh = gltfResult.nodes[keyName];
      map[keyName] = keyMesh;

      // Create a copy of the material for individual highlights. Maybe there
      // is a better way of doing it, but this is simple and it works.
      keyMesh.material = keyMesh.material.clone();
    }

    return map;
  }, []);

  // useEffect(() => {
  //   console.debug("nodes", keyMeshMap);
  //
  //   for (const node of Object.values(keyMeshMap)) {
  //     if (node.name === "C4") {
  //       node.material.emissive.lerp(new Color("purple"), 0.75);
  //     }
  //     if (node.name === "CsDb4") {
  //       node.material.emissive.lerp(new Color("purple"), 0.75);
  //     }
  //   }
  // }, []);

  // TODO get back to this, it's a bit wonky for some reason as is. works fine
  //  looking at the model head on, but not if it's rotated.
  // const hoverColor = useMemo(() => new Color("white"), []);
  // const meshProps = (keyMesh: KeyMesh) => ({
  //   onPointerOver: () => {
  //     console.debug("MOUSE OVER", keyMesh);
  //     keyMesh.material.emissive.add(hoverColor);
  //     invalidate();
  //   },
  //   onPointerOut: () => {
  //     console.debug("MOUSE OUT", keyMesh);
  //     keyMesh.material.emissive.sub(hoverColor);
  //     invalidate();
  //   },
  // });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const meshProps = (_keyMesh: KeyMesh) => ({});

  return (
    <group ref={ref} dispose={null} {...props}>
      <pointLight position={[0, 10, 5]} power={2.5 * (4 * Math.PI)} />
      <mesh
        name="A0"
        material={keyMeshMap.A0.material}
        geometry={keyMeshMap.A0.geometry}
        position={[-2.1494, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.A0)}
      />
      <mesh
        name="A1"
        material={keyMeshMap.A1.material}
        geometry={keyMeshMap.A1.geometry}
        position={[-1.5596, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.A1)}
      />
      <mesh
        name="A2"
        material={keyMeshMap.A2.material}
        geometry={keyMeshMap.A2.geometry}
        position={[-0.9695, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.A2)}
      />
      <mesh
        name="A3"
        material={keyMeshMap.A3.material}
        geometry={keyMeshMap.A3.geometry}
        position={[-0.3799, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.A3)}
      />
      <mesh
        name="A4"
        material={keyMeshMap.A4.material}
        geometry={keyMeshMap.A4.geometry}
        position={[0.2102, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.A4)}
      />
      <mesh
        name="A5"
        material={keyMeshMap.A5.material}
        geometry={keyMeshMap.A5.geometry}
        position={[0.8004, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.A5)}
      />
      <mesh
        name="A6"
        material={keyMeshMap.A6.material}
        geometry={keyMeshMap.A6.geometry}
        position={[1.3899, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.A6)}
      />
      <mesh
        name="A7"
        material={keyMeshMap.A7.material}
        geometry={keyMeshMap.A7.geometry}
        position={[1.98, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.A7)}
      />
      <mesh
        name="B0"
        material={keyMeshMap.B0.material}
        geometry={keyMeshMap.B0.geometry}
        position={[-2.0651, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.B0)}
      />
      <mesh
        name="B1"
        material={keyMeshMap.B1.material}
        geometry={keyMeshMap.B1.geometry}
        position={[-1.4751, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.B1)}
      />
      <mesh
        name="B2"
        material={keyMeshMap.B2.material}
        geometry={keyMeshMap.B2.geometry}
        position={[-0.885, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.B2)}
      />
      <mesh
        name="B3"
        material={keyMeshMap.B3.material}
        geometry={keyMeshMap.B3.geometry}
        position={[-0.2955, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.B3)}
      />
      <mesh
        name="B4"
        material={keyMeshMap.B4.material}
        geometry={keyMeshMap.B4.geometry}
        position={[0.2946, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.B4)}
      />
      <mesh
        name="B5"
        material={keyMeshMap.B5.material}
        geometry={keyMeshMap.B5.geometry}
        position={[0.8848, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.B5)}
      />
      <mesh
        name="B6"
        material={keyMeshMap.B6.material}
        geometry={keyMeshMap.B6.geometry}
        position={[1.4744, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.B6)}
      />
      <mesh
        name="B7"
        material={keyMeshMap.B7.material}
        geometry={keyMeshMap.B7.geometry}
        position={[2.0645, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.B7)}
      />
      <mesh
        name="C1"
        material={keyMeshMap.C1.material}
        geometry={keyMeshMap.C1.geometry}
        position={[-1.9804, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.C1)}
      />
      <mesh
        name="C2"
        material={keyMeshMap.C2.material}
        geometry={keyMeshMap.C2.geometry}
        position={[-1.3904, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.C2)}
      />
      <mesh
        name="C3"
        material={keyMeshMap.C3.material}
        geometry={keyMeshMap.C3.geometry}
        position={[-0.8007, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.C3)}
      />
      <mesh
        name="C4"
        material={keyMeshMap.C4.material}
        geometry={keyMeshMap.C4.geometry}
        position={[-0.2107, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.C4)}
      />
      <mesh
        name="C5"
        material={keyMeshMap.C5.material}
        geometry={keyMeshMap.C5.geometry}
        position={[0.3795, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.C5)}
      />
      <mesh
        name="C6"
        material={keyMeshMap.C6.material}
        geometry={keyMeshMap.C6.geometry}
        position={[0.9691, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.C6)}
      />
      <mesh
        name="C7"
        material={keyMeshMap.C7.material}
        geometry={keyMeshMap.C7.geometry}
        position={[1.5591, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.C7)}
      />
      <mesh
        name="C8"
        material={keyMeshMap.C8.material}
        geometry={keyMeshMap.C8.geometry}
        position={[2.1481, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.C8)}
      />
      <mesh
        name="D1"
        material={keyMeshMap.D1.material}
        geometry={keyMeshMap.D1.geometry}
        position={[-1.8966, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.D1)}
      />
      <mesh
        name="D2"
        material={keyMeshMap.D2.material}
        geometry={keyMeshMap.D2.geometry}
        position={[-1.3066, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.D2)}
      />
      <mesh
        name="D3"
        material={keyMeshMap.D3.material}
        geometry={keyMeshMap.D3.geometry}
        position={[-0.7169, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.D3)}
      />
      <mesh
        name="D4"
        material={keyMeshMap.D4.material}
        geometry={keyMeshMap.D4.geometry}
        position={[-0.1269, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.D4)}
      />
      <mesh
        name="D5"
        material={keyMeshMap.D5.material}
        geometry={keyMeshMap.D5.geometry}
        position={[0.4633, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.D5)}
      />
      <mesh
        name="D6"
        material={keyMeshMap.D6.material}
        geometry={keyMeshMap.D6.geometry}
        position={[1.0529, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.D6)}
      />
      <mesh
        name="D7"
        material={keyMeshMap.D7.material}
        geometry={keyMeshMap.D7.geometry}
        position={[1.6429, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.D7)}
      />
      <mesh
        name="E1"
        material={keyMeshMap.E1.material}
        geometry={keyMeshMap.E1.geometry}
        position={[-1.8121, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.E1)}
      />
      <mesh
        name="E2"
        material={keyMeshMap.E2.material}
        geometry={keyMeshMap.E2.geometry}
        position={[-1.2221, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.E2)}
      />
      <mesh
        name="E3"
        material={keyMeshMap.E3.material}
        geometry={keyMeshMap.E3.geometry}
        position={[-0.6325, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.E3)}
      />
      <mesh
        name="E4"
        material={keyMeshMap.E4.material}
        geometry={keyMeshMap.E4.geometry}
        position={[-0.0425, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.E4)}
      />
      <mesh
        name="E5"
        material={keyMeshMap.E5.material}
        geometry={keyMeshMap.E5.geometry}
        position={[0.5477, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.E5)}
      />
      <mesh
        name="E6"
        material={keyMeshMap.E6.material}
        geometry={keyMeshMap.E6.geometry}
        position={[1.1374, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.E6)}
      />
      <mesh
        name="E7"
        material={keyMeshMap.E7.material}
        geometry={keyMeshMap.E7.geometry}
        position={[1.7274, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.E7)}
      />
      <mesh
        name="F1"
        material={keyMeshMap.F1.material}
        geometry={keyMeshMap.F1.geometry}
        position={[-1.7277, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.F1)}
      />
      <mesh
        name="F2"
        material={keyMeshMap.F2.material}
        geometry={keyMeshMap.F2.geometry}
        position={[-1.1376, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.F2)}
      />
      <mesh
        name="F3"
        material={keyMeshMap.F3.material}
        geometry={keyMeshMap.F3.geometry}
        position={[-0.5481, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.F3)}
      />
      <mesh
        name="F4"
        material={keyMeshMap.F4.material}
        geometry={keyMeshMap.F4.geometry}
        position={[0.042, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.F4)}
      />
      <mesh
        name="F5"
        material={keyMeshMap.F5.material}
        geometry={keyMeshMap.F5.geometry}
        position={[0.6322, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.F5)}
      />
      <mesh
        name="F6"
        material={keyMeshMap.F6.material}
        geometry={keyMeshMap.F6.geometry}
        position={[1.2218, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.F6)}
      />
      <mesh
        name="F7"
        material={keyMeshMap.F7.material}
        geometry={keyMeshMap.F7.geometry}
        position={[1.8118, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.F7)}
      />
      <mesh
        name="G1"
        material={keyMeshMap.G1.material}
        geometry={keyMeshMap.G1.geometry}
        position={[-1.6439, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.G1)}
      />
      <mesh
        name="G2"
        material={keyMeshMap.G2.material}
        geometry={keyMeshMap.G2.geometry}
        position={[-1.0538, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.G2)}
      />
      <mesh
        name="G3"
        material={keyMeshMap.G3.material}
        geometry={keyMeshMap.G3.geometry}
        position={[-0.4643, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.G3)}
      />
      <mesh
        name="G4"
        material={keyMeshMap.G4.material}
        geometry={keyMeshMap.G4.geometry}
        position={[0.1258, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.G4)}
      />
      <mesh
        name="G5"
        material={keyMeshMap.G5.material}
        geometry={keyMeshMap.G5.geometry}
        position={[0.716, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.G5)}
      />
      <mesh
        name="G6"
        material={keyMeshMap.G6.material}
        geometry={keyMeshMap.G6.geometry}
        position={[1.3055, 0.0127, -0.0024]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.G6)}
      />
      <mesh
        name="G7"
        material={keyMeshMap.G7.material}
        geometry={keyMeshMap.G7.geometry}
        position={[1.8956, 0.0303, -0.0019]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.G7)}
      />
      <mesh
        name="AsBb0"
        material={keyMeshMap.AsBb0.material}
        geometry={keyMeshMap.AsBb0.geometry}
        position={[-2.1059, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.AsBb0)}
      />
      <mesh
        name="AsBb1"
        material={keyMeshMap.AsBb1.material}
        geometry={keyMeshMap.AsBb1.geometry}
        position={[-1.5169, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.AsBb1)}
      />
      <mesh
        name="AsBb2"
        material={keyMeshMap.AsBb2.material}
        geometry={keyMeshMap.AsBb2.geometry}
        position={[-0.9266, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.AsBb2)}
      />
      <mesh
        name="AsBb3"
        material={keyMeshMap.AsBb3.material}
        geometry={keyMeshMap.AsBb3.geometry}
        position={[-0.3368, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.AsBb3)}
      />
      <mesh
        name="AsBb4"
        material={keyMeshMap.AsBb4.material}
        geometry={keyMeshMap.AsBb4.geometry}
        position={[0.2534, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.AsBb4)}
      />
      <mesh
        name="AsBb5"
        material={keyMeshMap.AsBb5.material}
        geometry={keyMeshMap.AsBb5.geometry}
        position={[0.844, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.AsBb5)}
      />
      <mesh
        name="AsBb6"
        material={keyMeshMap.AsBb6.material}
        geometry={keyMeshMap.AsBb6.geometry}
        position={[1.4332, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.AsBb6)}
      />
      <mesh
        name="AsBb7"
        material={keyMeshMap.AsBb7.material}
        geometry={keyMeshMap.AsBb7.geometry}
        position={[2.0233, 0.0443, -0.1003]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.AsBb7)}
      />
      <mesh
        name="CsDb1"
        material={keyMeshMap.CsDb1.material}
        geometry={keyMeshMap.CsDb1.geometry}
        position={[-1.9373, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.CsDb1)}
      />
      <mesh
        name="CsDb2"
        material={keyMeshMap.CsDb2.material}
        geometry={keyMeshMap.CsDb2.geometry}
        position={[-1.3473, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.CsDb2)}
      />
      <mesh
        name="CsDb3"
        material={keyMeshMap.CsDb3.material}
        geometry={keyMeshMap.CsDb3.geometry}
        position={[-0.7576, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.CsDb3)}
      />
      <mesh
        name="CsDb4"
        material={keyMeshMap.CsDb4.material}
        geometry={keyMeshMap.CsDb4.geometry}
        position={[-0.1674, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.CsDb4)}
      />
      <mesh
        name="CsDb5"
        material={keyMeshMap.CsDb5.material}
        geometry={keyMeshMap.CsDb5.geometry}
        position={[0.4228, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.CsDb5)}
      />
      <mesh
        name="CsDb6"
        material={keyMeshMap.CsDb6.material}
        geometry={keyMeshMap.CsDb6.geometry}
        position={[1.0123, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.CsDb6)}
      />
      <mesh
        name="CsDb7"
        material={keyMeshMap.CsDb7.material}
        geometry={keyMeshMap.CsDb7.geometry}
        position={[1.6023, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.CsDb7)}
      />
      <mesh
        name="DsEb1"
        material={keyMeshMap.DsEb1.material}
        geometry={keyMeshMap.DsEb1.geometry}
        position={[-1.8539, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.DsEb1)}
      />
      <mesh
        name="DsEb2"
        material={keyMeshMap.DsEb2.material}
        geometry={keyMeshMap.DsEb2.geometry}
        position={[-1.2636, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.DsEb2)}
      />
      <mesh
        name="DsEb3"
        material={keyMeshMap.DsEb3.material}
        geometry={keyMeshMap.DsEb3.geometry}
        position={[-0.6737, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.DsEb3)}
      />
      <mesh
        name="DsEb4"
        material={keyMeshMap.DsEb4.material}
        geometry={keyMeshMap.DsEb4.geometry}
        position={[-0.0839, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.DsEb4)}
      />
      <mesh
        name="DsEb5"
        material={keyMeshMap.DsEb5.material}
        geometry={keyMeshMap.DsEb5.geometry}
        position={[0.5063, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.DsEb5)}
      />
      <mesh
        name="DsEb6"
        material={keyMeshMap.DsEb6.material}
        geometry={keyMeshMap.DsEb6.geometry}
        position={[1.0959, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.DsEb6)}
      />
      <mesh
        name="DsEb7"
        material={keyMeshMap.DsEb7.material}
        geometry={keyMeshMap.DsEb7.geometry}
        position={[1.6862, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.DsEb7)}
      />
      <mesh
        name="FsGb1"
        material={keyMeshMap.FsGb1.material}
        geometry={keyMeshMap.FsGb1.geometry}
        position={[-1.6842, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.FsGb1)}
      />
      <mesh
        name="FsGb2"
        material={keyMeshMap.FsGb2.material}
        geometry={keyMeshMap.FsGb2.geometry}
        position={[-1.0947, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.FsGb2)}
      />
      <mesh
        name="FsGb3"
        material={keyMeshMap.FsGb3.material}
        geometry={keyMeshMap.FsGb3.geometry}
        position={[-0.5048, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.FsGb3)}
      />
      <mesh
        name="FsGb4"
        material={keyMeshMap.FsGb4.material}
        geometry={keyMeshMap.FsGb4.geometry}
        position={[0.0853, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.FsGb4)}
      />
      <mesh
        name="FsGb5"
        material={keyMeshMap.FsGb5.material}
        geometry={keyMeshMap.FsGb5.geometry}
        position={[0.6753, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.FsGb5)}
      />
      <mesh
        name="FsGb6"
        material={keyMeshMap.FsGb6.material}
        geometry={keyMeshMap.FsGb6.geometry}
        position={[1.265, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.FsGb6)}
      />
      <mesh
        name="FsGb7"
        material={keyMeshMap.FsGb7.material}
        geometry={keyMeshMap.FsGb7.geometry}
        position={[1.855, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.FsGb7)}
      />
      <mesh
        name="GsAb1"
        material={keyMeshMap.GsAb1.material}
        geometry={keyMeshMap.GsAb1.geometry}
        position={[-1.6013, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.GsAb1)}
      />
      <mesh
        name="GsAb2"
        material={keyMeshMap.GsAb2.material}
        geometry={keyMeshMap.GsAb2.geometry}
        position={[-1.0107, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.GsAb2)}
      />
      <mesh
        name="GsAb3"
        material={keyMeshMap.GsAb3.material}
        geometry={keyMeshMap.GsAb3.geometry}
        position={[-0.421, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.GsAb3)}
      />
      <mesh
        name="GsAb4"
        material={keyMeshMap.GsAb4.material}
        geometry={keyMeshMap.GsAb4.geometry}
        position={[0.1684, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.GsAb4)}
      />
      <mesh
        name="GsAb5"
        material={keyMeshMap.GsAb5.material}
        geometry={keyMeshMap.GsAb5.geometry}
        position={[0.7591, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.GsAb5)}
      />
      <mesh
        name="GsAb6"
        material={keyMeshMap.GsAb6.material}
        geometry={keyMeshMap.GsAb6.geometry}
        position={[1.3484, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.GsAb6)}
      />
      <mesh
        name="GsAb7"
        material={keyMeshMap.GsAb7.material}
        geometry={keyMeshMap.GsAb7.geometry}
        position={[1.939, 0.0318, -0.1022]}
        scale={[0.0502, 0.028, 0.1675]}
        {...meshProps(keyMeshMap.GsAb7)}
      />
    </group>
  );
});

Model.displayName = "Model";
useGLTF.preload(assetUrl.toString());
