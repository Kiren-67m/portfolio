import data from "../data/portfolio.json";
import { portfolioUrl } from "../data/portfolioRoutes";
import { FiArrowUpRight } from "react-icons/fi";
import "./styles/Career.css";

const timeline = [
  {
    role: data.roles[1],
    title: "Front Office Operations Intern",
    year: "2025",
    highlights: [
      "Tracked lobby traffic and proposed a queue redesign that reduced average peak-hour wait times by 15%.",
      "Triaged 50+ customer requests per day and used request patterns to inform staffing during busy periods.",
      "Reviewed customer documentation and transaction records for processing accuracy.",
    ],
  },
  {
    role: data.roles[0],
    title: "AI Engineering Intern",
    year: "NOW",
    highlights: [
      "Built an automated mortgage pricing pipeline spanning six lenders and five portal architectures.",
      "Reconstructed undocumented pricing rules, improving accuracy from 44.6% to 100% across 12,000 tested rate points.",
      "Added automated regression checks for all six lenders and hardened the pricing API with rate limits, input validation, and CloudWatch monitoring.",
    ],
  },
];

const Career = () => (
  <div className="career-section section-container" id="career">
    <div className="career-container">
      <h2>My career <span>&</span><br /> experience</h2>
      <div className="career-info">
        <div className="career-timeline" aria-hidden="true"><div className="career-dot" /></div>
        {timeline.map(({ role, title, year, highlights }) => (
          <article className="career-info-box" key={role.company}>
            <div className="career-info-in">
              <div className="career-role">
                <h4>{title}</h4>
                <h5>{role.company}</h5>
                <p className="career-dates">{role.date}</p>
              </div>
              <span className="career-year" aria-hidden="true">{year}</span>
            </div>
            <ul>{highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
          </article>
        ))}
      </div>
      <a className="career-experience-link" href={`${portfolioUrl("Experience")}#portfolio-roles`}>
        Full experience <FiArrowUpRight aria-hidden="true" />
      </a>
    </div>
  </div>
);

export default Career;
