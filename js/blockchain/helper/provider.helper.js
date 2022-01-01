const { RPC_URL } = require("../constants");
const { ethers } = require("ethers");
let web3Provider, rpcProvider;
let etherProvider;
let signer;

function getReadOnlyProvider(rpcUrl = RPC_URL[56]) {
  if (rpcProvider) {
    return rpcProvider;
  }
  rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL[56]);
  return rpcProvider;
}
async function getWeb3Provider(connection) {
  if (!connection){
    return web3Provider || null;
  }
  web3Provider = new ethers.providers.Web3Provider(connection);
  signer = await web3Provider.getSigner();
  return web3Provider;
}
async function getSigner() {
  if (signer) {
    return signer;
  }
  if (!web3Provider){
    return null;
  }
  // etherProvider = getProvider();
  signer = await web3Provider.getSigner();
  return signer;
}
function getProvider() {
  return web3Provider || getReadOnlyProvider();
}
module.exports = {
  getProvider,
  getSigner,
  getReadOnlyProvider,
  getWeb3Provider,
};
