import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiArrowUp, FiArrowUpRight, FiAward, FiBarChart2, FiBriefcase, FiCamera, FiFileText, FiFolder, FiGithub, FiHome, FiInstagram, FiLinkedin, FiMail, FiMapPin, FiMaximize2, FiMessageSquare, FiMusic, FiPhone, FiUser, FiUsers, FiZap } from "react-icons/fi";
import type { IconType } from "react-icons";
import data from "../data/portfolio.json";
import { portfolioPages as pages, portfolioUrl as url, projectId, sitePath, type PortfolioPage } from "../data/portfolioRoutes";
import PortfolioChat, { type ChatState } from "./PortfolioChat";
import { instagramUrl } from "../data/socialLinks";
import "./styles/Navbar.css";
import "./styles/PortfolioPages.css";

const resume = "https://kiren-67m.github.io/portfolio/Liu%20Qiming_Resume.pdf?v=2026-11-04";
type Media = { src: string; alt: string; category?: string };

const pageIcons = {
  Profile: FiUser, Projects: FiFolder, Experience: FiBriefcase, Leadership: FiUsers,
  Achievements: FiAward, Chat: FiMessageSquare,
};
const photoIcons = [FiUser, FiCamera, FiMusic];
const projectIcons: Record<string, IconType> = {
  "GitHub repository": FiGithub,
  "View Tableau dashboards": FiBarChart2,
  "View Power BI screenshots": FiBarChart2,
  "View n8n demo": FiZap,
  Dashboard: FiBarChart2,
  "English Report": FiFileText,
};

function IconLink({ href, label, icon: Icon, external = false }: {
  href: string; label: string; icon: IconType; external?: boolean;
}) {
  return <a className="portfolio-icon-button" href={href} aria-label={label} title={label}
    target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
    <Icon aria-hidden="true" />
  </a>;
}

function Tags({ items }: { items: string[] }) {
  return <ul className="portfolio-tags" aria-label="Related skills">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function Bullets({ items }: { items: string[] }) {
  return <ul className="portfolio-bullets">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function ImageStrip({ images }: { images: Media[] }) {
  return <div className="portfolio-media">{images.map(({ src, alt }) =>
    <a href={sitePath(src)} key={src} target="_blank" rel="noreferrer" aria-label={`Open image: ${alt}`}>
      <img src={sitePath(src)} alt={alt} loading="lazy" decoding="async" />
    </a>
  )}</div>;
}

function Gallery({ images, label }: { images: Media[]; label: string }) {
  const [index, setIndex] = useState(0);
  const image = images[index];
  const next = (offset: number) => setIndex((current) => (current + images.length + offset) % images.length);
  return <figure className="portfolio-gallery" aria-label={label}>
    <div className="portfolio-photo">
      <a href={sitePath(image.src)} target="_blank" rel="noreferrer" aria-label={`Open photo: ${image.alt}`}>
        <img key={image.src} src={sitePath(image.src)} alt={image.alt} decoding="async" />
        <span className="portfolio-icon-button" aria-hidden="true"><FiMaximize2 /></span>
      </a>
    </div>
    {image.category ? <figcaption className="portfolio-photo-categories" aria-label="Photo categories">
      {images.map(({ src, category }, i) => {
        const Icon = photoIcons[i];
        return <button className="portfolio-action" type="button" key={src} aria-pressed={i === index} onClick={() => setIndex(i)}>
          <Icon aria-hidden="true" />{category}
        </button>;
      })}
    </figcaption> : <figcaption>
      <button className="portfolio-icon-button" type="button" onClick={() => next(-1)} aria-label="Previous photo"><FiArrowLeft aria-hidden="true" /></button>
      <span aria-live="polite">{index + 1} / {images.length} · {image.alt}</span>
      <button className="portfolio-icon-button" type="button" onClick={() => next(1)} aria-label="Next photo"><FiArrowRight aria-hidden="true" /></button>
    </figcaption>}
  </figure>;
}

function ContactLinks() {
  return <div className="portfolio-contact" id="portfolio-contact">
    <p className="portfolio-location"><FiMapPin aria-hidden="true" /> Springfield, MO</p>
    <div className="portfolio-links" aria-label="Contact and social links">
      <IconLink href="mailto:liuqm110@gmail.com" label="Email Qiming Liu" icon={FiMail} />
      <IconLink href="tel:+14172348164" label="Call Qiming Liu" icon={FiPhone} />
      <IconLink href="https://github.com/Kiren-67m" label="GitHub" icon={FiGithub} external />
      <IconLink href="https://www.linkedin.com/in/qiming-liu-845ba92a0/" label="LinkedIn" icon={FiLinkedin} external />
      <IconLink href={instagramUrl} label="Instagram" icon={FiInstagram} external />
      <IconLink href={resume} label="View résumé (PDF)" icon={FiFileText} external />
    </div>
  </div>;
}

function Profile() {
  return <>
    <section className="portfolio-record portfolio-profile">
      <div>
        <h2>Who I Am</h2>
        {data.intro.map((p) => <p key={p}>{p}</p>)}
        <ContactLinks />
      </div>
      <Gallery images={data.photos} label="Photos of Qiming Liu" />
    </section>
    <section className="portfolio-section" aria-labelledby="portfolio-featured">
      <h2 id="portfolio-featured">Featured Work</h2>
      <div className="portfolio-grid">
        {data.projects.filter((project) => project.highlight).map((project) => (
          <article className="portfolio-record" key={project.title}>
            <h3>{project.title}</h3>
            <p>{project.highlight}</p>
            <ImageStrip images={project.images} />
            <IconLink href={`${url("Projects")}#${projectId(project.title)}`} label={`View project: ${project.title}`} icon={FiArrowUpRight} />
          </article>
        ))}
      </div>
    </section>
    <section className="portfolio-section" aria-labelledby="portfolio-explore">
      <h2 id="portfolio-explore">More about my work</h2>
      <div className="portfolio-links">{pages.slice(1).map((page) => {
        const Icon = pageIcons[page];
        return <a className="portfolio-action" href={url(page)} key={page}><Icon aria-hidden="true" /> {page === "Chat" ? "Ask a question" : page}</a>;
      })}</div>
    </section>
  </>;
}

function Projects() {
  return <div className="portfolio-grid">{data.projects.map((project) =>
    <article className="portfolio-record" id={projectId(project.title)} key={project.title}>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <Tags items={project.tags} />
      <ImageStrip images={project.images} />
      <div className="portfolio-links">{project.links.map(({ href, label }) =>
        <IconLink href={href} key={href} label={label} icon={projectIcons[label] ?? FiArrowUpRight} external />
      )}</div>
    </article>
  )}</div>;
}

function Experience() {
  return <>
    <section className="portfolio-section" aria-labelledby="portfolio-roles">
      <h2 id="portfolio-roles">Work Experience</h2>
      {data.roles.map((role) => <article className="portfolio-record" key={role.title}>
        <h3>{role.title}</h3>
        <p className="portfolio-meta">{role.url
          ? <a className="portfolio-inline-link" href={role.url} target="_blank" rel="noreferrer">{role.company} <FiArrowUpRight aria-hidden="true" /></a>
          : role.company} · {role.date}</p>
        <Bullets items={role.bullets} />
        <Tags items={role.tags} />
      </article>)}
    </section>
    <section className="portfolio-section" aria-labelledby="portfolio-skills">
      <h2 id="portfolio-skills">Technical Expertise</h2>
      <div className="portfolio-grid">{data.skills.map(({ title, items }) => <article className="portfolio-record" key={title}>
        <h3>{title}</h3>
        <dl className="portfolio-skills">{items.map(({ name, level }) => <div key={name}><dt>{name}</dt><dd>{level}</dd></div>)}</dl>
      </article>)}</div>
    </section>
    <section className="portfolio-section" aria-labelledby="portfolio-certificates">
      <h2 id="portfolio-certificates">Professional Certificates</h2>
      <article className="portfolio-record">
        <h3>IBM Data Analyst Professional Certificate</h3>
        <p className="portfolio-meta"><time dateTime="2025-12-30">Dec 2025</time></p>
        <ImageStrip images={[data.certificate]} />
      </article>
    </section>
  </>;
}

function Leadership() {
  return <div className="portfolio-grid">{data.activities.map((activity) => <article className="portfolio-record" key={activity.title}>
    <h2>{activity.title}</h2>
    <p className="portfolio-meta">{activity.meta}</p>
    <Bullets items={activity.bullets} />
  </article>)}</div>;
}

function Achievements() {
  const { competition } = data;
  return <>
    <section className="portfolio-section" aria-labelledby="portfolio-academic">
      <h2 id="portfolio-academic">Academic Honors</h2>
      <div className="portfolio-grid">{data.honors.map(({ title, meta, description }, i) => <article className="portfolio-record" key={title}>
        <h3>{title}</h3>
        <p className="portfolio-meta">{meta}</p>
        <p>{description}</p>
        {i === 0 && <div className="portfolio-links">{data.deanCertificates.map(({ src, alt }) => <IconLink href={sitePath(src)} key={src} label={alt} icon={FiFileText} external />)}</div>}
      </article>)}</div>
    </section>
    <section className="portfolio-section" aria-labelledby="portfolio-competition">
      <h2 id="portfolio-competition">Competition Awards</h2>
      <article className="portfolio-record">
        <h3>{competition.title}</h3>
        <p className="portfolio-meta">{competition.meta}</p>
        <Bullets items={competition.bullets} />
        <Tags items={competition.tags} />
        <Gallery images={competition.images} label="AITCC award photos" />
      </article>
    </section>
  </>;
}

const content = { Profile, Projects, Experience, Leadership, Achievements };
const subtitles = {
  Profile: "AI & data, built for real work. Thinking in systems. Building around people.",
  Projects: "Dashboards, analysis, and automation across finance, retail, operations, and music.",
  Experience: "Work history, technical skills, and professional certificates.",
  Leadership: "Coordinating campus performances and leading team rehearsals.",
  Achievements: "Academic honors and competition results.",
  Chat: "Explore my experience, project demos, and contact details.",
};

export default function PortfolioPages({ page, chat }: { page: PortfolioPage; chat: ChatState }) {
  const Page = page === "Chat" ? null : content[page];
  useEffect(() => {
    document.title = `${page} | Qiming Liu`;
  }, [page]);
  return <div className="portfolio-pages" data-page={page}>
    <header className="header portfolio-nav">
      <a href={sitePath()} className="navbar-title" aria-label="Kiren, 3D Home">Kiren</a>
      <nav aria-label="Portfolio sections"><ul>
        <li><a className="portfolio-action" href={sitePath()} aria-label="3D Home" title="3D Home"><FiHome aria-hidden="true" /><span>3D Home</span></a></li>
        {pages.map((item) => {
          const Icon = pageIcons[item];
          return <li key={item}><a className="portfolio-action" href={url(item)} aria-label={item} title={item} aria-current={page === item ? "page" : undefined}>
            <Icon aria-hidden="true" /><span>{item}</span>
          </a></li>;
        })}
      </ul></nav>
    </header>
    <main className="portfolio-content">
      <header className="portfolio-heading">
        <h1 tabIndex={-1}>{page === "Profile" ? "Qiming Liu / Kiren" : page === "Chat" ? "Ask about my work" : page}</h1>
        <p>{subtitles[page]}</p>
      </header>
      {Page ? <Page /> : <PortfolioChat chat={chat} />}
    </main>
    <footer className="portfolio-footer">© 2026 Qiming Liu <IconLink href={sitePath()} label="Back to 3D Home" icon={FiArrowUp} /></footer>
  </div>;
}
