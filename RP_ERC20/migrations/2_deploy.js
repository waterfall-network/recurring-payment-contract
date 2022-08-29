const {toWei} = web3.utils;

const RP_ERC20 = artifacts.require("RP_ERC20");


module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];

  const contractName = "RP_ERC20";
  const contractSymbol = "RP_ERC20";
  const contractTotalSupply = toWei("1", 'tether');

  await deployer.deploy(RP_ERC20, contractName, contractSymbol, contractTotalSupply, owner);
};
