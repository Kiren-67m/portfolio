import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three-stdlib";
import { portfolioUrl } from "../../data/portfolioRoutes";
import { avatarModelUrl, disposeCharacter } from "./utils/character";
import "./AvatarPreview.css";

type View = "front" | "three-quarter" | "side" | "back" | "face";

export default function AvatarPreview() {
  const stage = useRef<HTMLDivElement>(null);
  const setView = useRef<(view: View) => void>(() => {});
  const setMotion = useRef<(play: boolean) => void>(() => {});
  const setClay = useRef<(show: boolean) => void>(() => {});
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [motion, setMotionEnabled] = useState(false);
  const [clay, setClayEnabled] = useState(false);

  useEffect(() => {
    document.title = "Kiren | 3D Avatar";
    const container = stage.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setStatus("failed");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 30);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 0.75;
    controls.maxDistance = 5.5;
    controls.maxPolarAngle = Math.PI * 0.58;
    controls.target.set(0, 0.9, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    renderer.domElement.setAttribute("aria-label", "Interactive 3D model of Kiren");
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff6ec, 0xd5d8ee, 2.1));
    const key = new THREE.DirectionalLight(0xfff1e6, 1.45);
    key.position.set(2.5, 4, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7bade2, 1.7);
    rim.position.set(-3, 3, -2);
    scene.add(rim);

    const clayMaterial = new THREE.MeshStandardMaterial({ color: 0xb9c4ce, roughness: 0.82 });
    setClay.current = (show) => { scene.overrideMaterial = show ? clayMaterial : null; };

    const show = (view: View) => {
      const distance = camera.aspect < 0.75 ? 3.75 : 3.35;
      if (view === "face") {
        controls.target.set(0, 1.6, 0);
        camera.position.set(0, 1.6, 0.8);
      } else {
        controls.target.set(0, 0.9, 0);
        if (view === "side") camera.position.set(distance, 1.04, 0);
        else if (view === "three-quarter") camera.position.set(distance / Math.SQRT2, 1.04, distance / Math.SQRT2);
        else camera.position.set(0, 1.04, view === "back" ? -distance : distance);
      }
      controls.update();
    };
    setView.current = show;
    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / Math.max(1, clientHeight);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    show("front");

    let disposed = false;
    let avatar: THREE.Object3D | undefined;
    let mixer: THREE.AnimationMixer | undefined;
    let idle: THREE.AnimationAction | undefined;
    setMotion.current = (play) => {
      if (idle) idle.paused = !play;
    };

    new GLTFLoader().load(avatarModelUrl, (gltf) => {
      if (disposed) {
        disposeCharacter(gltf.scene);
        return;
      }
      avatar = gltf.scene;
      scene.add(avatar);
      const clip = gltf.animations.find(({ name }) => name === "Idle");
      if (clip) {
        mixer = new THREE.AnimationMixer(avatar);
        idle = mixer.clipAction(clip);
        idle.play();
        idle.paused = true;
      }
      setStatus("ready");
    }, undefined, () => {
      if (!disposed) setStatus("failed");
    });

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      mixer?.update(Math.min(clock.getDelta(), 0.05));
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      observer.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      mixer?.stopAllAction();
      if (avatar) disposeCharacter(avatar);
      clayMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <main className="avatar-preview">
      <header className="avatar-preview-header">
        <a href={portfolioUrl("Profile")}>← Portfolio</a>
        <a href={avatarModelUrl} download="kiren-avatar.glb">Download GLB ↗</a>
      </header>
      <section className="avatar-preview-content" aria-label="Kiren avatar preview">
        <div className="avatar-preview-copy">
          <h1>Kiren</h1>
          <p>Drag to rotate. Scroll or pinch to zoom.</p>
        </div>
        <div className="avatar-preview-stage" ref={stage}>
          {status !== "ready" && <p role="status">
            {status === "loading" ? "Loading 3D model…" : "The 3D preview couldn’t load. Open the GLB in a 3D viewer."}
          </p>}
        </div>
        <div className="avatar-preview-controls" aria-label="Model controls">
          <button type="button" disabled={status !== "ready"} onClick={() => setView.current("front")}>Front</button>
          <button type="button" disabled={status !== "ready"} onClick={() => setView.current("three-quarter")}>45°</button>
          <button type="button" disabled={status !== "ready"} onClick={() => setView.current("side")}>Side</button>
          <button type="button" disabled={status !== "ready"} onClick={() => setView.current("back")}>Back</button>
          <button type="button" disabled={status !== "ready"} onClick={() => setView.current("face")}>Close-up</button>
          <button type="button" disabled={status !== "ready"} aria-pressed={clay} onClick={() => {
            setClay.current(!clay);
            setClayEnabled(!clay);
          }}>Clay</button>
          <button type="button" disabled={status !== "ready"} aria-pressed={motion} onClick={() => {
            setMotion.current(!motion);
            setMotionEnabled(!motion);
          }}>{motion ? "Pause motion" : "Play motion"}</button>
        </div>
      </section>
    </main>
  );
}
