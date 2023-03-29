import {
  useEffect,
  useReducer,
  createContext,
  useContext,
  useMemo,
} from "react";
import { CompanyReducer, initialState } from "./CompanyReducer";

const CompanyContext = createContext();

export function CompanyWrapper({ children }) {
  const [state, dispatch] = useReducer(CompanyReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("state"))) {
      //checking if there already is a state in localstorage
      //if yes, update the current state with the stored one
      dispatch({
        type: "init_stored",
        value: JSON.parse(localStorage.getItem("state")),
      });
    }
  }, [dispatch]);
  useEffect(() => {
    if (state !== initialState) {
      localStorage.setItem("state", JSON.stringify(state));

      //create and/or set a new localstorage variable called "state"
    }
  }, [state]);

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
}
export function useCompanyContext() {
  return useContext(CompanyContext);
}
