import {
  FaGithub,
  FaLinkedinIn,
  FaEnvelope,
  FaGlobe,
  FaInstagram,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import { instagramUrl } from "../data/socialLinks";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social");
    if (!social || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cleanups = Array.from(social.querySelectorAll("span"), (elem) => {
      const link = elem.querySelector("a")!;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;
      let frame: number;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        frame = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        cancelAnimationFrame(frame);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com/Kiren-67m" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://www.linkedin.com/in/qiming-liu-845ba92a0/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram, lllkiren_">
            <FaInstagram />
          </a>
        </span>
        <span>
          <a href="mailto:liuqm110@gmail.com" aria-label="Email">
            <FaEnvelope />
          </a>
        </span>
        <span>
          <a href="https://kiren-67m.github.io/portfolio/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio">
            <FaGlobe />
          </a>
        </span>
      </div>
      <a className="resume-button" href="https://kiren-67m.github.io/portfolio/Liu%20Qiming_Resume.pdf" target="_blank" rel="noopener noreferrer">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
