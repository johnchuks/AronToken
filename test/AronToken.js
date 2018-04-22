var AronToken = artifacts.require('./AronToken.sol');

contract('AronToken', function(accounts){
  it ('sets the total supply upon deployment', function () {
    return AronToken.deployed().then((instance) => {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
    }).then((totalSupply) => {
      assert.equal(totalSupply.toNumber(), 8000000, 'sets the total supply to 1,000,000');
    })
  })
})
