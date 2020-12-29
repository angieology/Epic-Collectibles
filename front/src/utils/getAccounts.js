import { web3 } from "@openzeppelin/test-helpers/src/setup"

const getAccounts = async () => {
   return await web3.eth.getAccounts();
}

export default getAccounts;