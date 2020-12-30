import React, { useContext, useEffect } from "react";
import Button from "../components/Button";
import WithLoader from "../components/WithLoader";
import TokensList from "./TokensList";
import ContractContext from '../Store';
import "./TokensPage.css";

const TokensPage = () => {


  // get from context
  const [state, dispatch] = useContext(ContractContext);
  
  let mintToken, fetchTokens, isLoading;

  useEffect(()=> {
    if (state) { 
      mintToken = state.mintToken;
      fetchTokens = state.fetchTokens;
      // track state
      isLoading = state.isLoading;
    }
  },[state])

  const handleMint = async () => {
    const randomColor1 = '#'+ Math.floor(Math.random()*16777215).toString(16);
    const randomColor2 = '#'+ Math.floor(Math.random()*16777215).toString(16);


    const features=[
      randomColor1,
      randomColor2
    ]
    await mintToken(features);
    // update states;
     const payload = await fetchTokens();
    dispatch({type: 'UPDATE_TOKENS', payload })
  }
  return (
    <div className="TokensPage">
      <h1>Epic Tokens</h1>
      <Button onClick={handleMint} label="Breed Epic: cost 5 EPCOIN" />
      <div className="TokensPage-tokens">
        <WithLoader isLoading={isLoading}>
          <TokensList />
        </WithLoader>
      </div>
    </div>
  );
};


export default TokensPage;
