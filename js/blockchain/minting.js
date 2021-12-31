const {checkWhiteListing, getMaxPresaleOrPunkPurchase}= require("./contracts/punk")
// function for get maximum number of Fuzion Punks
async function maxMintPunks() {
    document.getElementsByClassName("minting-input")[0].value = await getMaxPresaleOrPunkPurchase();
}

window.maxMintPunks = maxMintPunks;

module.exports = {
  maxMintPunks,
};
