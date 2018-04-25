var AronTokenSale = artifacts.require("./AronTokenSale.sol");
var AronToken = artifacts.require("./AronToken.sol");


contract ('AronTokenSale', function(accounts){
  var tokenSaleInstance;
  var tokenInstance;
  var buyer = accounts[1];
  var admin = accounts[0];
  var tokensAvailable = 750000;
  var tokenPrice = 1000000000000; // in wei
  var numberOfTokens = 10;

  it ('initializes the contract with the correct values', function(){
    return AronTokenSale.deployed().then((instance) => {
      tokenSaleInstance = instance;
      return tokenSaleInstance.address
    }).then(function(address){
      assert.notEqual(address, 0x0, 'has a contract address');
      return tokenSaleInstance.tokenContract();
    }).then((address) => {
      assert.notEqual(address, 0x0, 'has a contract address');
      return tokenSaleInstance.tokenPrice();
    }).then((price) => {
      assert.equal(price, tokenPrice, 'token price is correct');
    })
  })

  it ('facilitates token buying', function (){
    return AronToken.deployed().then((instance) => {
        tokenInstance = instance;
        return AronTokenSale.deployed();
    }).then((instance) => {
      tokenSaleInstance = instance;
      // provision 75% of the token total supply
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin });
    }).then((receipt) => {
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value:  numberOfTokens * tokenPrice });
  }).then((receipt) => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should trigger a "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the buyer of the token');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the token amount sold');
      return tokenSaleInstance.tokensSold();
  }).then((amount) => {
    assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
    return tokenInstance.balanceOf(buyer);
  }).then((balance) => {
    assert.equal(balance.toNumber(), numberOfTokens, 'balance of the buyer');
    return tokenInstance.balanceOf(tokenSaleInstance.address);
  }).then((balance) =>  {
    assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens, 'remaining token balance of the contract after sale')
    return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
  }).then((assert.fail)).catch((error) => {
    assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
    return tokenSaleInstance.buyTokens(1000000000, { from: buyer, value: numberOfTokens * tokenPrice })
  }).then((assert.fail)).catch((error) => {
    assert(error.message.indexOf('revert') >=0, 'number of tokens must not be higher than tokens available in the contract')
  })
})
})
