const { nftContract } = require("./constants");
const abi = require("./abi/nft");
const { getBnbBalance } = require("./bnbBalance");
const {userReferralLink, userReferralCommissions, userTotalReferral}= require("../referralLink");
const {getPunkConstants, getUserPunkData, punkSaleStatus} = require("../blockchain/contracts/punk");
const { providerHelper } = require("./helper");
const {getProvider, getSigner, getWeb3Provider} = providerHelper;
const ethers = require("ethers");

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;

let status;
let web3Modal;
let isConnected;
let connection;
let provider;
let signer;
let mainContract = undefined;
let bscScan = "https://bscscan.com/address/" + nftContract;
let user = {
  address: undefined,
};

async function init() {
  // connectWallet.initWeb3Modal();
  initWeb3Modal();
  const connectionStatus = localStorage.getItem("connectStatus");
  if (connectionStatus == "connected") {
    // await connectWallet.userLoginAttempt();
   await userLoginAttempt();
  }
  // functions from punk.js file
  await getPunkConstants();
  await punkSaleStatus();
  // functions from referralLink.js file
  await userReferralLink();
  await userReferralCommissions();
  await userTotalReferral();
  // function from helper for get current year
}

function initWeb3Modal() {
  if (location.protocol !== "https:") {
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled");
    return;
  }
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
      },
    },
  };
  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });
}

// trriger when connectWallet btn is clicked
async function connectAccount() {
  try {
    connection = await web3Modal.connect();
    provider = await getWeb3Provider(connection);
    signer = await provider.getSigner();
    console.log("connectAccount signer:", signer);
    console.log("connectAccount provider:", provider);

    localStorage.setItem("connectStatus", "connected");
    user.address = await signer.getAddress();
    console.log("connectAccount: ", user.address);
    // initContract();
    if (user.address){
      console.log("a");
      // function for get bnb Balance
      await getBnbBalance(user.address);
      console.log("b");
      // function from punk contract
      await getUserPunkData(user.address);
    }
    // functions from punk.js file
    await getPunkConstants();
    await punkSaleStatus();
    // functions from referralLink.js file
    await userReferralLink();
    await userReferralCommissions();
    await userTotalReferral();
  } catch (error) {
    console.log("Could not connect to wallet", error);
  }
}

// checks if user is already connected
async function userLoginAttempt() {
  isConnected = false;
  await window.addEventListener("load", async function () {
    status = localStorage.getItem("connectStatus");
    console.log("status info:", status);
    try {
      console.log(12);
      if (status !== "connected") {
        console.log(11);
        connection = await web3Modal.connect();
        console.log("userLoginAttempt connection:", connection)
        provider = await getWeb3Provider(connection);
        console.log("userLoginAttempt provider:", provider)
        signer = await provider.getSigner();
        console.log("userLoginAttempt signer:", signer)
        localStorage.setItem("connectStatus", "connected");
      } else {
        console.log(10);
        await getShortAddressCheckNetworkErrorCopyLink();
      }
      console.log(13);
      signer = await providerHelper.getSigner();
      console.log("signer 2:", signer);
      user.address = await signer.getAddress(); //found
      console.log("userLoginAttempt userAddress: ", user.address);
      // await initContract();
      // function for get bnb Balance
      if (user.address){
        console.log(9);
        await getBnbBalance(user.address);
        console.log(7);
        // function from punk contract
        await getUserPunkData(user.address);
        console.log(8);
      }
      // functions from punk.js file
      await getPunkConstants();
      console.log(1);
      await punkSaleStatus();
      console.log(2);
      // functions from referralLink.js file
      await userReferralLink();
      console.log(3);
      await userReferralCommissions();
      console.log(4);
      await userTotalReferral();
      console.log(5);
      await punkSaleStatus();
      console.log(6);
    } catch (error) {
      console.error("userLoginAttempt:", error);
    }
  });
}
// initialize contract
// async function initContract() {
//   try {
//     await (mainContract = new web3.eth.Contract(abi, nftContract));
//     if (mainContract != undefined) {
//       await getShortAddressCheckNetworkErrorCopyLink();
//     } else {
//       setTimeout(() => {
//         initContract();
//       }, 2000);
//     }
//   } catch (e) {
//     setTimeout(() => {
//       initContract();
//     }, 2000);
//   }
//   setInterval(function () {
//     getShortAddressCheckNetworkErrorCopyLink(); // todo figure out async setTimeout implementation
//   }, 5000);
// }

async function getShortAddressCheckNetworkErrorCopyLink() {
  if (user.address){
    let p2 = user.address.slice(42 - 5);
    const shortAddressElement =
        document.getElementsByClassName("shortAddress")[0];
    const mediumAddress = document.getElementById("mediumAddress");
    const fullAddress = document.getElementById("fullAddress");
    if (shortAddressElement) {
      shortAddressElement.innerText = `${user.address.slice(0, 4)}...${p2}`;
    }
    if (mediumAddress) {
      mediumAddress.value = `${user.address.slice(0, 19)}...`;
    }
    if (fullAddress) {
      fullAddress.value = user.address;
    }
    document.querySelector("#prepare").style.display = "none";
    document.querySelector("#connected").style.display = "block";
  }
  else {
    document.querySelector("#prepare").style.display = "block";
    document.querySelector("#connected").style.display = "none";
  }
}

// trigger when disconnect btn pressed
function disconnect() {
  localStorage.clear();
  isConnected = false;
  user.address = undefined;
  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}

//metamask check
if (
  typeof window.ethereum == "undefined" ||
  typeof window.web3 == "undefined"
) {
  window.connectAccount = redirect;
} else {
  window.connectAccount = connectAccount;
}

function redirect() {
  window.open("https://metamask.io/", "_blank");
}

window.disconnect = disconnect;

module.exports = {
  init,
  connectAccount,
  userLoginAttempt,
  getShortAddressCheckNetworkErrorCopyLink,
  disconnect,
  initWeb3Modal,
};
