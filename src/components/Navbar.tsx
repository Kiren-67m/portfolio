import { useEffect, type MouseEvent } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioUrl, sitePath } from "../data/portfolioRoutes";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useLoading } from "../context/LoadingProvider";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const { isLoading } = useLoading();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1025px)");
    const options = {
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: desktop.matches ? 2.05 : 1.7,
      speed: desktop.matches ? 1.22 : 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    };
    const currentSmoother = ScrollSmoother.create(options);

    smoother = currentSmoother;
    currentSmoother.scrollTop(0);
    const refreshOnResize = () => ScrollSmoother.refresh(true);
    const updateScrollPace = () => {
      options.speed = desktop.matches ? 1.22 : 1.7;
      if (ScrollTrigger.isTouch !== 1) currentSmoother.smooth(desktop.matches ? 2.05 : 1.7);
      refreshOnResize();
    };
    desktop.addEventListener("change", updateScrollPace);
    window.addEventListener("resize", refreshOnResize);
    return () => {
      desktop.removeEventListener("change", updateScrollPace);
      window.removeEventListener("resize", refreshOnResize);
      currentSmoother.kill();
    };
  }, []);

  useEffect(() => {
    smoother.paused(isLoading);
  }, [isLoading]);

  const goToSection = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth <= 1024 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    smoother.scrollTo(event.currentTarget.hash, true, "top top");
  };

  return (
    <>
      <header className="header">
        <a href={sitePath("#")} className="navbar-title" data-cursor="disable">
          Kiren
        </a>
        <a
          href="mailto:liuqm110@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          liuqm110@gmail.com
        </a>
        <nav aria-label="3D home sections"><ul>
          <li>
            <a href="#about" onClick={goToSection}>
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a href="#work" onClick={goToSection}>
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a href="#contact" onClick={goToSection}>
              <HoverLinks text="CONTACT" />
            </a>
          </li>
          <li>
            <a href={portfolioUrl("Profile")}>
              <HoverLinks text="PROFILE" />
            </a>
          </li>
        </ul></nav>
      </header>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
