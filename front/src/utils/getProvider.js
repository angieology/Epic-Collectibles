import Web3 from "web3";

const getProvider = async () => {
    let web3Provider;
     // Modern dapp browsers...
     if (window.ethereum) {
       web3Provider = window.ethereum;
       
        try {
          // Request account access
          await window.ethereum.enable();
          console.log('get user metamask access permission')
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
  return web3Provider;
};

export default getProvider;