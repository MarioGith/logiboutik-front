import {
  useEffect,
  useReducer,
  useState,
  createContext,
  useContext,
  useMemo,
} from "react";
import { CompanyReducer, initialState } from "./CompanyReducer";

const STORAGE_KEY = "state";
const CompanyContext = createContext();

function readStoredState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function CompanyWrapper({ children }) {
  const [state, dispatch] = useReducer(CompanyReducer, initialState);
  const [loaded, setLoaded] = useState(false);
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  // Load what was saved in this browser, once.
  useEffect(() => {
    const stored = readStoredState();
    if (stored) dispatch({ type: "init_stored", value: stored });
    setLoaded(true);
  }, []);

  // Save every change (only after loading, not to overwrite saved data).
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanyContext() {
  return useContext(CompanyContext);
}
