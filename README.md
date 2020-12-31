# Epic-Collectibles
Epic characters as non-fungible tokens, can trade and create new Epics


### Setup
- install Ganache local testnet
- install Metamask with following updates below
- (optional) VsCode extension for solidity files
- install truffle following instructions

start with command 
```
truffle test
truffle migrate
cd front
yarn install
yarn start
``

Refer to this truffle pet shop tutorial for setup https://www.trufflesuite.com/tutorials/pet-shop


Setup is the same, however when you install MetaMask, there is an update with 'Network ID' that doesn't exist in Ganache.
Go to settings in Ganache and change the network ID to 1337 to match Metamask.
When creating a metamask account, use the seed phrase from your Ganache.


Project is roughly based on this CryptoKitties clone, package versions are outdated, but you can refer to the explanations. 
https://maksimivanov.com/posts/gradient-coin-tutorial/

