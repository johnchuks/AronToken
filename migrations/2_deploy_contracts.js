var AronToken = artifacts.require("./AronToken.sol");
var AronTokenSale = artifacts.require("./AronTokenSale.sol");
var tokenPrice = 1000000000000; // Token price is 0.001 ether
module.exports = function(deployer) {
  deployer.deploy(AronToken, 1000000).then(() => {
    return deployer.deploy(AronTokenSale, AronToken.address, tokenPrice);
  })
  
};
