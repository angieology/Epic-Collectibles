import React, { useReducer, useEffect } from "react";
import TokensPage from "./TokensPage";
import setupContracts from "./stores";
import ContractContext, { initialState } from './Store';
import Reducer from "./reducers";
import "./App.css";



function App() {
  const [state, dispatch] = useReducer(Reducer, initialState);

  useEffect(() => {
    async function initializeContracts() { 
      const { gradientTokenStore } = await setupContracts();
      dispatch({type: 'UPDATE_STORE', payload: gradientTokenStore})
    }
    initializeContracts();
  }, []);

    return (
      <ContractContext.Provider value={[state, dispatch]}>
        <div className="App">
          <TokensPage />
        </div>
      </ContractContext.Provider>
    );
}

export default App;