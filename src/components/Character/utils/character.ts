import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { sitePath } from "../../../data/portfolioRoutes";

export const avatarModelUrl = sitePath("models/kiren-avatar-rodin.glb");

export async function loadCharacter() {
  const gltf = await new GLTFLoader().loadAsync(avatarModelUrl);
  const model = gltf.scene;
  const character = new THREE.Group();

  // Fit the standing avatar into the existing portrait camera and scroll path.
  model.scale.setScalar(4.15);
  model.position.y = 6.66;
  character.add(model);
  model.traverse((object) => {
    if (object instanceof THREE.SkinnedMesh) {
      object.frustumCulled = false;
    }
  });

  const head = model.getObjectByName("Head");
  const neck = model.getObjectByName("Neck");
  const idle = gltf.animations.find((clip) => clip.name === "Idle");
  const mixer = new THREE.AnimationMixer(model);
  const idleAction = idle && mixer.clipAction(new THREE.AnimationClip(
    idle.name,
    idle.duration,
    idle.tracks.filter((track) =>
      track.name !== "Head.quaternion" && track.name !== "Neck.quaternion"
    )
  ));
  idleAction?.setEffectiveWeight(0.28);

  return { character, head, neck, mixer, idleAction };
}

export function disposeCharacter(character: THREE.Object3D) {
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  character.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    if (object instanceof THREE.SkinnedMesh) object.skeleton.dispose();
    const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of meshMaterials) materials.add(material);
  });
  for (const material of materials) {
    for (const value of Object.values(material)) {
      if (value instanceof THREE.Texture) textures.add(value);
    }
    material.dispose();
  }
  for (const texture of textures) texture.dispose();
}
