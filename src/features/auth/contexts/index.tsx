import React, { createContext, useContext, useReducer } from "react";
import { _typeReducer } from "@/features/auth/constants";

const AuthContext: any = createContext([{}, () => {}]);

const initialState = {
  store: null,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case _typeReducer.SET_STORE:
      return {
        ...state,
        store: action.payload,
      };
    default:
      return state;
  }
};

type Props = {
  children: React.ReactNode;
  store?: any;
};

export const AuthProvider = ({ children, store }: Props) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState, store });
  return (
    <AuthContext.Provider value={[state, dispatch]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
