import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  showIntro: boolean;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children, showIntro }: PropsWithChildren<{ showIntro: boolean }>) => {
  const [isLoading, setIsLoading] = useState(showIntro);
  const [loading, setLoading] = useState(0);

  const value = {
    showIntro,
    isLoading,
    setIsLoading,
    setLoading,
  };
  const mainClass = isLoading ? "main-body main-loading" : showIntro ? "main-body main-active" : "main-body";

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className={mainClass}>{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
