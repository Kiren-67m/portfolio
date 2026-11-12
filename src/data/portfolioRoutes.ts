export const portfolioPages = ["Profile", "Projects", "Experience", "Leadership", "Achievements", "Chat"] as const;

export type PortfolioPage = (typeof portfolioPages)[number];

export const getPortfolioView = (search = window.location.search) => {
  const view = new URLSearchParams(search).get("view");
  if (view === "guide") return "Chat";
  return portfolioPages.find((page) => page.toLowerCase() === view);
};

export const sitePath = (path = "") =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const portfolioUrl = (page: PortfolioPage) =>
  sitePath(`?view=${page.toLowerCase()}`);

export const projectId = (title: string) => title.toLowerCase().replace(/\s+/g, "-");
