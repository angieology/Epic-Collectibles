import React, { useContext, useEffect } from "react";
import generateName from "sillyname";
import Button from "../components/Button";
import WithLoader from "../components/WithLoader";
import TokensList from "./TokensList";
import ContractContext from "../Store";
import "./TokensPage.css";

const ELEMENTS = ["fire", "water", "electricity", "air", "earth"];
const generateStat = (num = 10, multiplier = 100, min = 1) =>
  Math.floor(Math.random() * num + min) * multiplier;

/**
 *
 * @param {int} max , inclusive
 * @param {int} min , inclusive
 * @param {int} multiplier, base of 100, etc. NOTE adjust max and min accordingly
 */
function getRandomInt(max, min = 0, multiplier = 1) {
  return Math.floor(Math.random() * Math.floor(max) + min) * multiplier;
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
      weight: getRandomInt(100, 1, 10),
      height: getRandomInt(100, 1, 10),
    };
    const abilities = {
      power: getRandomInt(100, 1, 10),
      defense: getRandomInt(100, 1, 10),
      attack: getRandomInt(100, 1, 10),
      healing: getRandomInt(100, 1, 10),
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

    console.log({features})
    await mintToken(features);
    // update states;
    const payload = await fetchTokens();
    dispatch({ type: "UPDATE_TOKENS", payload });
  };
  return (
    <div className="TokensPage">
      <h1>Epic Pets</h1>
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
