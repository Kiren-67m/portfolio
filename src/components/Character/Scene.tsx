import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { loadCharacter, disposeCharacter } from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";
import { setProgress } from "../Loading";
import { smoother } from "../Navbar";

const Scene = ({ onFirstFrame }: { onFirstFrame?: () => void }) => {
  const canvasDiv = useRef<HTMLDivElement>(null);
  const { setLoading, showIntro } = useLoading();

  useEffect(() => {
    const container = canvasDiv.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const timeline = gsap.context(() => {});
    const revealSections = () => timeline.add(() => {
      gsap.set(".what-box-in", { display: "flex" });
      setAllTimeline();
    });
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      revealSections();
      setLoading(100);
      onFirstFrame?.();
      return () => timeline.revert();
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, 1, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      const portraitZoom = THREE.MathUtils.clamp((width - 360) / 200, 0, 1);
      camera.zoom = THREE.MathUtils.lerp(0.84, 1.1, portraitZoom);
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const light = setLighting(scene);
    const progress = showIntro ? setProgress(setLoading) : undefined;
    let avatar: Awaited<ReturnType<typeof loadCharacter>> | undefined;
    let restHead: THREE.Quaternion | undefined;
    let revealTimer: number | undefined;
    let disposed = false;

    loadCharacter().then((loaded) => {
      if (disposed) {
        disposeCharacter(loaded.character);
        return;
      }
      avatar = loaded;
      restHead = loaded.head?.quaternion.clone();
      scene.add(loaded.character);
      timeline.add(() => {
        setCharTimeline(loaded.character, camera, loaded.neck);
        setAllTimeline();
      });
      ScrollTrigger.refresh();
      const reveal = (duration: number) => {
        timeline.add(() => light.turnOnLights(duration));
        loaded.idleAction?.play();
      };
      if (!progress) {
        reveal(onFirstFrame ? 0 : 0.45);
        if (onFirstFrame) {
          renderer.render(scene, camera);
          onFirstFrame();
        }
        return;
      }
      progress.loaded().then(() => {
        if (disposed) return;
        revealTimer = window.setTimeout(() => reveal(2), 2500);
      });
    }).catch((error: unknown) => {
      if (disposed) return;
      console.error("Unable to load the portfolio avatar:", error);
      revealSections();
      progress?.clear();
      onFirstFrame?.();
    });

    const mouse = new THREE.Vector2();
    const setPointer = (x: number, y: number) => {
      mouse.set(x / window.innerWidth * 2 - 1, 1 - y / window.innerHeight * 2);
    };
    const onPointerMove = (event: MouseEvent) => setPointer(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) setPointer(touch.clientX, touch.clientY);
    };
    const resetPointer = () => mouse.set(0, 0);
    document.addEventListener("mousemove", onPointerMove);
    document.documentElement.addEventListener("mouseleave", resetPointer);
    window.addEventListener("blur", resetPointer);
    const landing = document.getElementById("landingDiv");
    landing?.addEventListener("touchmove", onTouchMove, { passive: true });
    landing?.addEventListener("touchend", resetPointer);
    landing?.addEventListener("touchcancel", resetPointer);

    const clock = new THREE.Clock();
    const look = new THREE.Euler(0, 0, 0, "YXZ");
    const lookRotation = new THREE.Quaternion();
    renderer.setAnimationLoop(() => {
      const delta = Math.min(clock.getDelta(), 0.05);
      avatar?.mixer.update(delta);
      if (avatar?.head && restHead) {
        const nearTop = (smoother?.scrollTop() ?? window.scrollY) < 200;
        look.y = THREE.MathUtils.damp(look.y, nearTop ? mouse.x * 0.46 : 0, 9, delta);
        look.x = THREE.MathUtils.damp(look.x, nearTop ? -mouse.y * 0.2 : 0, 9, delta);
        avatar.head.quaternion.copy(restHead).multiply(lookRotation.setFromEuler(look));
      }
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      window.clearTimeout(revealTimer);
      progress?.stop();
      observer.disconnect();
      document.removeEventListener("mousemove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
      window.removeEventListener("blur", resetPointer);
      landing?.removeEventListener("touchmove", onTouchMove);
      landing?.removeEventListener("touchend", resetPointer);
      landing?.removeEventListener("touchcancel", resetPointer);
      renderer.setAnimationLoop(null);
      timeline.revert();
      avatar?.mixer.stopAllAction();
      if (avatar) disposeCharacter(avatar.character);
      light.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [setLoading, showIntro, onFirstFrame]);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover"></div>
      </div>
    </div>
  );
};

export default Scene;
