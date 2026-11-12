import "./styles/Work.css";
import { useRef } from "react";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects } from "../data/projects";
import { portfolioUrl, projectId, sitePath } from "../data/portfolioRoutes";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const lastCard = track?.lastElementChild;
    if (!section || !track || !(lastCard instanceof HTMLElement)) return;

    const scrollDistance = () => {
      const rightPadding = Number.parseFloat(getComputedStyle(track).paddingRight);
      return Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth - track.clientWidth + rightPadding);
    };

    const responsive = gsap.matchMedia();
    responsive.add("(min-width: 768px)", () => {
      gsap.to(track, {
        x: () => -scrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          scrub: true,
          pin: true,
          id: "work",
          invalidateOnRefresh: true,
        },
      });
    });
    return () => responsive.revert();
  }, []);

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex" ref={trackRef}>
          {projects.map((project, index) => (
            <div className="work-box" key={project.title}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Project overview</h4>
                <p>{project.description}</p>
                <a href={`${portfolioUrl("Projects")}#${projectId(project.title)}`} className="work-details-link">
                  Project details ↗
                </a>
              </div>
              <WorkImage image={sitePath(project.image)} alt={project.title} link={project.url} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
