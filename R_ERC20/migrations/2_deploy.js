const {toWei} = web3.utils;

const R_ERC20 = artifacts.require("R_ERC20");


module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];

  const contractName = "R_ERC20";
  const contractSymbol = "R_ERC20";
  const contractTotalSupply = toWei("1", 'tether');

  await deployer.deploy(R_ERC20, contractName, contractSymbol, contractTotalSupply, owner);
};
