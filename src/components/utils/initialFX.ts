import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX(showIntro: boolean) {
  const hash = window.location.hash.slice(1);
  const section = document.getElementById(hash === "projects" ? "work" : hash);
  if (section) smoother.scrollTo(section, false, "top top");

  const splitOptions = { type: "chars,lines", linesClass: "split-h2" };
  const firstTitle = new SplitText(".landing-h2-info", splitOptions);
  const nextTitle = new SplitText(".landing-h2-info-1", splitOptions);
  const firstAccent = new SplitText(".landing-h2-1", splitOptions);
  const nextAccent = new SplitText(".landing-h2-2", splitOptions);
  const splits = [firstTitle, nextTitle, firstAccent, nextAccent];
  const animations = gsap.context(() => {
    gsap.set([...nextTitle.chars, ...nextAccent.chars], { y: 80, opacity: 0 });
    LoopText(firstTitle, nextTitle);
    LoopText(firstAccent, nextAccent);

    if (showIntro) {
      const introText = new SplitText(
        [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
        { type: "chars,lines", linesClass: "split-line" }
      );
      splits.push(introText);
      gsap.fromTo(
        [...introText.chars, ...firstTitle.chars],
        { opacity: 0, y: 80, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.inOut",
          stagger: 0.025,
          delay: 0.3,
        }
      );
      gsap.fromTo(".landing-info-h2",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power1.inOut", delay: 0.8 }
      );
      gsap.fromTo([".header", ".icons-section", ".nav-fade"],
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power1.inOut", delay: 0.1 }
      );
    } else {
      gsap.set(".nav-fade", { opacity: 1 });
    }
  });
  return () => {
    animations.revert();
    splits.forEach((split) => split.revert());
  };
}

function LoopText(Text1: SplitText, Text2: SplitText) {
  var tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}
