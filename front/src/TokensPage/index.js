import React, { useContext, useEffect } from "react";
import generateName from "sillyname";
import WithLoader from "../components/WithLoader";
import TokensList from "./TokensList";
import ContractContext from "../Store";

import "./TokensPage.css";

const ELEMENTS = ["Fire", "Water", "Electricity", "Air", "Earth"];
/**
 *
 * @param {int} max , inclusive
 * @param {int} min , inclusive
 * @param {int} multiplier, base of 100, etc. NOTE adjust max and min accordingly
 */
function getRandomInt(max, min = 0, multiplier = 1) {
  return Math.floor(Math.random() * Math.floor(max + 1) + min) * multiplier;
}
const generateColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

const TokensPage = () => {
  // get from context
  const [state, dispatch] = useContext(ContractContext);

  let mintToken, fetchTokens, isLoading;

  useEffect(() => {
    if (state) {
      mintToken = state.mintToken;
      fetchTokens = state.fetchTokens;
      // track state
      isLoading = state.isLoading;
    }
  }, [state]);

  const handleMint = async () => {
    const stats = {
      Weight: getRandomInt(100, 1, 10) + "lb",
      Height: getRandomInt(100, 1, 10) + "cm",
    };
    const abilities = {
      Power: getRandomInt(100, 1, 10),
      Defense: getRandomInt(100, 1, 10),
      Attack: getRandomInt(100, 1, 10),
      Healing: getRandomInt(100, 1, 10),
    };

    const name = generateName();

    const element = ELEMENTS[getRandomInt(5, 0)];

    const features = [
      generateColor(),
      generateColor(),
      element,
      name,
      JSON.stringify(stats),
      JSON.stringify(abilities),
    ];

    await mintToken(features);
    // update states;
    const payload = await fetchTokens();
    dispatch({ type: "UPDATE_TOKENS", payload });
  };
  return (
    <div className="TokensPage">
      <h1>Epic Pets</h1>
      <button
        className="button button--winona button--border-thin button--round-s"
        onClick={handleMint}
      >
        Breed Epic
      </button>
      <div className="TokensPage-tokens">
        <WithLoader isLoading={isLoading}>
          <TokensList />
        </WithLoader>
      </div>
    </div>
  );
};

export default TokensPage;
