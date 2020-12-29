import React, { Fragment, useState, useContext, useEffect } from "react";

import ContractContext from '../../Store';

import TokenItem from "./TokenItem";
import "./TokensList.css";

const TokensList = () => {
  const [state] = useContext(ContractContext);

const [tokens, setTokens] = useState([])
// const [ownerTokens, setOwnerTokens] = useState([])

  useEffect(()=> {
    if (state) { 
      setTokens(state.tokens)
      // setOwnerTokens(state.ownerTokens)
    }
  },[state])



  return (
    <Fragment>
      {tokens && tokens.length ? (
        <div className="TokensList">
          {tokens.map(token => (
            <TokenItem
              key={token.index}
              token={token}
              // isOwned={ownerTokens.includes(token.index)}
            />
        ))}
        </div>
      ) : (
        <div className="TokensList-label_empty">You don't have tokens yet.</div>
      )}
    </Fragment>
  );
};

export default TokensList;
