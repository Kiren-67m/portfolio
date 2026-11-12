import { useEffect, useRef, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { FiArrowUpRight, FiMessageSquare, FiSend } from "react-icons/fi";
import data from "../data/portfolio.json";
import { portfolioUrl, projectId, type PortfolioPage } from "../data/portfolioRoutes";

type Answer = { text: string; page?: PortfolioPage; anchor?: string };
type Topic = Answer & { keywords: string[] };
export type ChatExchange = { question: string; answer: Answer };
export type ChatState = [ChatExchange[], Dispatch<SetStateAction<ChatExchange[]>>];

const suggestions = [
  "What did you build at OriLoan?",
  "Which dashboards can I explore?",
  "How does your n8n workflow work?",
  "How can I contact you?",
];

const projectKeywords: Record<string, string[]> = {
  "Loan Portfolio Risk Monitor": ["loan risk", "risk monitor", "loan portfolio", "tableau", "贷款"],
  "Walmart Retail Sales Analysis": ["walmart", "retail", "power bi", "沃尔玛"],
  "Ops Monitoring Pipeline": ["n8n", "ops monitoring", "automation pipeline", "incident", "自动化"],
  "BLACKPINK Release Performance": ["blackpink", "spotify", "music", "concert", "jump", "音乐", "演唱会"],
};

const projects: Topic[] = data.projects.map((project) => ({
  keywords: projectKeywords[project.title] ?? [project.title.toLowerCase()],
  text: `${project.title}. ${project.highlight || project.description}`,
  page: "Projects",
  anchor: projectId(project.title),
}));

const topics: Topic[] = [
  {
    keywords: ["oriloan", "mortgage", "pricing", "lender"],
    text: "At OriLoan Financial Inc., I built a mortgage pricing pipeline across six lenders and five portal architectures. I reconstructed undocumented pricing rules, raising accuracy from 44.6% to 100% across 12,000 tested rate points, and added automated regression checks for all six lenders.",
    page: "Experience", anchor: "portfolio-roles",
  },
  {
    keywords: ["bank of chaoyang", "chaoyang", "front office", "bank internship", "银行"],
    text: "At Bank of Chaoyang, I triaged more than 50 customer requests per day, tracked demand to inform staffing, and proposed a queue redesign that reduced average peak-hour wait times by 15%.",
    page: "Experience", anchor: "portfolio-roles",
  },
  ...projects,
  {
    keywords: ["projects", "project", "dashboard", "dashboards", "case studies", "项目", "看板"],
    text: "Start with the Tableau loan risk dashboards, the Walmart SQL and Power BI case study, the n8n operations monitoring demo, or the BLACKPINK streaming dashboard and English report. Each project card links to its available demos and source materials.",
    page: "Projects",
  },
  {
    keywords: ["experience", "career", "work history", "internship", "经历", "工作"],
    text: "I’m an AI Engineering Intern at OriLoan Financial Inc. I previously interned in front office operations at Bank of Chaoyang.",
    page: "Experience", anchor: "portfolio-roles",
  },
  {
    keywords: ["skill", "skills", "python", "sql", "tools", "技术", "技能"],
    text: "My work uses Python and SQL for data preparation, analysis, and automation. I’ve also built dashboards in Power BI and Tableau and automated operational workflows with n8n.",
    page: "Experience", anchor: "portfolio-skills",
  },
  {
    keywords: ["contact", "email", "phone", "linkedin", "github", "instagram", "resume", "联系", "简历", "邮箱"],
    text: "My email is liuqm110@gmail.com. You can also find my LinkedIn, GitHub, Instagram, and résumé on the Profile page.",
    page: "Profile", anchor: "portfolio-contact",
  },
  {
    keywords: ["education", "school", "missouri state", "degree", "studying", "教育", "学校"],
    text: "I study Data Analytics at Missouri State University.", page: "Profile",
  },
  {
    keywords: ["award", "awards", "aitcc", "honors", "scholarship", "比赛", "奖学金"],
    text: "I placed second in the AITCC Analyze IT Challenge for loan default prediction. My academic honors include the Dean’s List and the College of Business Scholarship.",
    page: "Achievements",
  },
  {
    keywords: ["certificate", "certificates", "certification", "ibm", "证书"],
    text: "I earned the IBM Data Analyst Professional Certificate in December 2025.",
    page: "Experience", anchor: "portfolio-certificates",
  },
  {
    keywords: ["leadership", "dance", "performances", "领导力", "舞蹈"],
    text: "I coordinated campus performances as a committee member and led six weeks of rehearsals for a team of more than 20 dancers.",
    page: "Leadership",
  },
];

function findAnswer(question: string): Answer {
  const query = ` ${question.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim()} `;
  const topic = topics.find(({ keywords }) => keywords.some((keyword) => (
    /\p{Script=Han}/u.test(keyword) ? query.includes(keyword) : query.includes(` ${keyword} `)
  )));
  return topic ?? {
    text: "I don’t have an answer for that in the portfolio. Try asking about a specific project, my experience, or how to get in touch.",
  };
}

export default function PortfolioChat({ chat }: { chat: ChatState }) {
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = chat;
  const messages = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const log = messages.current;
    if (log && exchanges.length) log.scrollTop = log.scrollHeight;
  }, [exchanges]);

  function ask(prompt: string) {
    const text = prompt.trim();
    if (!text) return;
    setExchanges((previous) => [...previous, { question: text, answer: findAnswer(text) }]);
    setQuestion("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(question);
  }

  return <section className="portfolio-record portfolio-chat" aria-label="Portfolio chat">
    <div className="portfolio-chat-header">
      <span className="portfolio-icon-button" aria-hidden="true"><FiMessageSquare /></span>
      <div><h2>Portfolio Assistant</h2><p>Answers from my portfolio</p></div>
    </div>
    <div className="portfolio-chat-log" role="log" aria-label="Conversation" ref={messages} tabIndex={0}>
      <p className="portfolio-chat-bubble"><span className="portfolio-sr-only">Assistant: </span>Hi! Ask me about Kiren’s work, projects, or how to get in touch.</p>
      {exchanges.map(({ question, answer }, index) => <div className="portfolio-chat-exchange" key={index}>
        <p className="portfolio-chat-bubble portfolio-chat-question"><span className="portfolio-sr-only">You: </span>{question}</p>
        <div className="portfolio-chat-bubble">
          <p><span className="portfolio-sr-only">Assistant: </span>{answer.text}</p>
          {answer.page && <a className="portfolio-action" href={portfolioUrl(answer.page) + (answer.anchor ? `#${answer.anchor}` : "")}>
            <FiArrowUpRight aria-hidden="true" /> {answer.anchor === "portfolio-contact" ? "Contact & links" : `See ${answer.page.toLowerCase()}`}
          </a>}
        </div>
      </div>)}
    </div>
    {exchanges.length === 0 && <div className="portfolio-chat-suggestions" aria-label="Suggested questions">
      {suggestions.map((prompt) => <button className="portfolio-action" type="button" key={prompt} onClick={() => {
        ask(prompt);
        input.current?.focus();
      }}>{prompt}</button>)}
    </div>}
    <form className="portfolio-chat-form" onSubmit={submit}>
      <label className="portfolio-sr-only" htmlFor="portfolio-question">Ask a question</label>
      <input id="portfolio-question" ref={input} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a project or role…" maxLength={240} autoComplete="off" />
      <button className="portfolio-icon-button" type="submit" title="Send question" aria-label="Send question" disabled={!question.trim()}><FiSend aria-hidden="true" /></button>
    </form>
  </section>;
}
