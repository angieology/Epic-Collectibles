import React, { useReducer, useEffect } from "react";
import { ModalProvider } from "react-simple-hook-modal";
import TokensPage from "./TokensPage";
import setupContracts from "./stores";
import ContractContext, { initialState } from "./Store";
import Reducer from "./reducers";
import "./App.css";

function App() {
  const [state, dispatch] = useReducer(Reducer, initialState);

  useEffect(() => {
    async function initializeContracts() {
      const { epicTokenStore, auctionStore } = await setupContracts();
      dispatch({ type: "UPDATE_STORE", epicTokenStore, auctionStore });
    }
    initializeContracts();
  }, []);

  return (
    <ModalProvider>
      <ContractContext.Provider value={[state, dispatch]}>
        <div className="App">
          <TokensPage />
        </div>
      </ContractContext.Provider>
    </ModalProvider>
  );
}

export default App;
