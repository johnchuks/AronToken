var AronToken = artifacts.require("./AronToken.sol");

module.exports = function(deployer) {
  deployer.deploy(AronToken);
};
