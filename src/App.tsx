import { lazy, Suspense, useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import "./App.css";
import { getPortfolioView, portfolioPages, sitePath } from "./data/portfolioRoutes";
import MainContainer from "./components/MainContainer";
import PortfolioPages from "./components/PortfolioPages";
import type { ChatExchange } from "./components/PortfolioChat";
import { LoadingProvider } from "./context/LoadingProvider";

const AvatarPreview = lazy(() => import("./components/Character/AvatarPreview"));
const CharacterModel = lazy(() => import("./components/Character"));

function isHome(search: string) {
  return !getPortfolioView(search) && new URLSearchParams(search).get("view") !== "avatar";
}

function revealRoute(hash: string, focusHeading = false) {
  let destination: HTMLElement | null = null;
  if (hash) {
    try {
      destination = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      // Invalid percent encoding can appear in manually edited URLs.
    }
  }
  if (destination) destination.scrollIntoView({ behavior: "instant" });
  else window.scrollTo({ top: 0, behavior: "instant" });
  if (focusHeading) {
    const target = destination ?? document.querySelector<HTMLElement>(".portfolio-heading h1");
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }
}

type Route = {
  search: string;
  initial: boolean;
  fallbackMotion?: boolean;
  onHomeReady?: () => void;
};

const App = () => {
  const [route, setRoute] = useState<Route>(() => ({ search: window.location.search, initial: true }));
  const chat = useState<ChatExchange[]>([]);
  const activeTransition = useRef<ViewTransition | null>(null);
  const outgoingAnimation = useRef<Animation | null>(null);
  const navigation = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const page = getPortfolioView(route.search);
  const isAvatar = new URLSearchParams(route.search).get("view") === "avatar";

  const changeRoute = useCallback((search: string, hash: string, focusHeading = false) => {
    const sequence = ++navigation.current;
    activeTransition.current?.skipTransition();
    activeTransition.current = null;
    outgoingAnimation.current?.cancel();
    outgoingAnimation.current = null;
    const root = document.documentElement;
    delete root.dataset.portfolioTransition;
    delete root.dataset.portfolioShared;
    if (search === route.search) {
      if (hash || focusHeading) revealRoute(hash, focusHeading);
      return;
    }

    const fromPage = getPortfolioView(route.search);
    const nextPage = getPortfolioView(search);
    const fromHome = isHome(route.search);
    const toHome = Boolean(fromPage) && isHome(search);
    const animate = (fromHome && nextPage) || (fromPage && nextPage) || toHome;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function commit(fallbackMotion = false, onHomeReady?: () => void) {
      if (sequence !== navigation.current) return;
      flushSync(() => setRoute({ search, initial: false, fallbackMotion, onHomeReady }));
      revealRoute(hash, focusHeading);
    }

    if (!animate || reduceMotion) {
      commit();
      return;
    }

    if (!document.startViewTransition) {
      const outgoing = contentRef.current?.animate?.(
        [{ opacity: 1 }, { opacity: 0.62 }],
        { duration: 170, easing: "ease-in", fill: "forwards" }
      );
      if (outgoing) {
        outgoingAnimation.current = outgoing;
        const finish = () => {
          if (outgoingAnimation.current !== outgoing) return;
          outgoingAnimation.current = null;
          outgoing.cancel();
          commit(true);
        };
        void outgoing.finished.then(finish, finish);
      } else {
        commit(true);
      }
      return;
    }

    const backwards = toHome || (fromPage && nextPage && portfolioPages.indexOf(nextPage) < portfolioPages.indexOf(fromPage));
    root.dataset.portfolioTransition = backwards ? "back" : "forward";
    root.dataset.portfolioShared = window.scrollY < 120 && !hash && (
      (fromHome && nextPage === "Profile") || (toHome && fromPage === "Profile")
    ) ? "title" : "header";
    if (fromPage && nextPage) root.dataset.portfolioShared = "section";
    const transition = document.startViewTransition(() => {
      if (sequence !== navigation.current) return;
      if (!toHome) {
        commit();
        return;
      }
      // Keep the old snapshot until the canvas has rendered or the short wait expires.
      return new Promise<void>((resolve) => {
        const deadline = window.setTimeout(resolve, 850);
        commit(false, () => {
          window.clearTimeout(deadline);
          resolve();
        });
      });
    });
    activeTransition.current = transition;
    const clearTransition = () => {
      if (sequence !== navigation.current) return;
      activeTransition.current = null;
      delete root.dataset.portfolioTransition;
      delete root.dataset.portfolioShared;
    };
    void transition.ready.catch(() => {});
    void transition.finished.then(clearTransition, clearTransition);
  }, [route.search]);

  useEffect(() => {
    const onPopState = () => changeRoute(window.location.search, window.location.hash);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [changeRoute]);

  useEffect(() => {
    if (!page && !isAvatar) document.title = "Qiming Liu | AI Engineering & Data Analytics";
  }, [page, isAvatar]);

  useEffect(() => {
    if (getPortfolioView() && window.location.hash) revealRoute(window.location.hash);
  }, []);

  function navigate(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!(anchor instanceof HTMLAnchorElement) ||
        anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
    const url = new URL(anchor.href);
    if (url.origin !== window.location.origin || url.pathname !== sitePath()) return;
    const nextPage = getPortfolioView(url.search);
    const betweenSections = nextPage && (page || isHome(route.search));
    const toHome = page && !url.search && !url.hash;
    if (!betweenSections && !toHome) return;

    event.preventDefault();
    if (url.href === window.location.href) return;
    window.history.pushState(null, "", url);
    const focusHeading = event.detail === 0;
    if (url.search === route.search && !activeTransition.current && !outgoingAnimation.current) {
      revealRoute(url.hash, focusHeading);
    } else {
      changeRoute(url.search, url.hash, focusHeading);
    }
  }

  return (
    <div onClick={navigate}>
      <Suspense>
        <div key={route.search} ref={contentRef} className={route.fallbackMotion ? "portfolio-route-enter" : undefined}>
          {isAvatar ? <AvatarPreview /> : page ? <PortfolioPages page={page} chat={chat} /> : (
            <LoadingProvider showIntro={route.initial}>
              <MainContainer>
                <Suspense>
                  <CharacterModel onFirstFrame={route.onHomeReady} />
                </Suspense>
              </MainContainer>
            </LoadingProvider>
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default App;
