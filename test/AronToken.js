var AronToken = artifacts.require('./AronToken.sol');

contract('AronToken', function(accounts){
  var tokenInstance;

  it ('initializes the contract with the correct values', function(){
    return AronToken.deployed().then((instance) => {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then((name) => {
      assert.equal(name, 'AronToken', 'has the correct name');
      return tokenInstance.symbol();
    }).then((symbol) => {
      assert.equal(symbol, 'ARN', 'has the correct symbol');
      return tokenInstance.standard();
    }).then((standard) => {
      assert.equal(standard, 'AronToken v1.0', 'has the correct symbol');
    })
  })
  it ('sets the total supply upon deployment', function () {
    return AronToken.deployed().then((instance) => {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
    }).then((totalSupply) => {
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
      return tokenInstance.balanceOf(accounts[0]);
    }).then((adminBalance) => {
      assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the intial supply to the admin');
    })
  })
  it('should transfer token ownership', function() {
    return AronToken.deployed().then((instance) => {
      tokenInstance = instance;
      return tokenInstance.transfer.call(accounts[1], 100000);
    }).then(assert.fail).catch((error) => {
      assert(error.message.indexOf('revert'), 'Error must contain require');
      return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0]});
    }).then((success) => {
      assert.equal(success, true, 'Transfer should return true');
      return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0]});
    }).then((receipt) => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should trigger a "Transfer" event');
      assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the transfering token account');
      assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the token receiving account');
      assert.equal(receipt.logs[0].args._value, 250000, 'logs the token amount transferred');
      return tokenInstance.balanceOf(accounts[1]);
    }).then((balance) => {
      assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
      return tokenInstance.balanceOf(accounts[0]);
    }).then((balance) => {
      assert.equal(balance.toNumber(), 750000, 'removes the amount from the to funding account');
    })
  })
  it ('should return the balance of an ethereum account', function (){
    return AronToken.deployed().then((instance) => {
      tokenInstance = instance;
      return tokenInstance.balanceOf.call(accounts[1]);
    }).then((balance) => {
      assert.equal(balance.toNumber(), 250000, 'it returns the balance of another account');
    })
  })
})
