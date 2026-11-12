import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";
import { sitePath } from "../../../data/portfolioRoutes";

const setLighting = (scene: THREE.Scene) => {
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accentColor").trim();
  const rim = new THREE.DirectionalLight(accentColor, 0);
  rim.position.set(-0.47, -0.32, -1);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xfff0e5, 0);
  fill.position.set(3, 16, 20);
  scene.add(fill);

  let disposed = false;
  let environment: THREE.Texture | undefined;
  scene.environmentIntensity = 0;
  new RGBELoader()
    .setDataType(THREE.FloatType)
    .setPath(sitePath("models/"))
    .load("char_enviorment.hdr", (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      environment = texture;
      // Preserve the HDR lighting while removing its original magenta color cast.
      const pixels = texture.image.data;
      for (let index = 0; index < pixels.length; index += 4) {
        const luminance = pixels[index] * 0.2126
          + pixels[index + 1] * 0.7152
          + pixels[index + 2] * 0.0722;
        pixels[index] = luminance * 0.94;
        pixels[index + 1] = luminance;
        pixels[index + 2] = luminance * 1.08;
      }
      texture.needsUpdate = true;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function turnOnLights(duration: number) {
    const timing = { duration, ease: "power2.inOut" };
    gsap.to(scene, { environmentIntensity: 0.64, ...timing });
    gsap.to(rim, { intensity: 1, ...timing });
    gsap.to(fill, { intensity: 1.65, ...timing });
    gsap.to(".character-rim", { y: "55%", opacity: 1, delay: duration ? 0.2 : 0, duration });
  }

  function dispose() {
    disposed = true;
    environment?.dispose();
  }

  return { turnOnLights, dispose };
};

export default setLighting;
