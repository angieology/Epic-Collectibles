import React, { Fragment, useState, useContext, useEffect } from "react";

import ContractContext from '../../Store';

import TokenItem from "./TokenItem";
import "./TokensList.css";

const TokensList = () => {
  const [state, dispatch] = useContext(ContractContext);

const [tokens, setTokens] = useState([])

  useEffect(()=> {
    if (state) { 
      setTokens(state.tokens)
    }
  },[state])



  return (
    <Fragment>
      {tokens && tokens.length ? (
        <div className="TokensList">
          {tokens.map(token => (
            <TokenItem
              key={token.index}
              token={token.gradient}
              // onClick={() => showModal(<TokenView token={token.gradient} />)}
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
