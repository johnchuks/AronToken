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
    });
  });
  it ('should approve tokens for delegated transfers', function() {
    return AronToken.deployed().then((instance) => {
      tokenInstance = instance;
      return tokenInstance.approve.call(accounts[1], 100);
    }).then((approved) => {
      assert.equal(approved, true, 'Approved to be true');
      return tokenInstance.approve(accounts[1], 100);
    }).then((receipt) => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Approval', 'should trigger a "Transfer" event');
      assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the transfering token account');
      assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the token receiving account');
      assert.equal(receipt.logs[0].args._value, 100, 'logs the token amount transferred');
      return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then((allowance) => {
      assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
    });
  });

  it ('should handle delegate transfers', function(){
    return AronToken.deployed().then((instance) => {
      tokenInstance = instance;
      fromAccount = accounts[2];
      toAccount = accounts[3];
      spendingAccount = accounts[4];
      //Transfer some tokens to the fromAccount
      return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
    }).then((receipt) => {
      // Approve spendingAccount to spend 10 tokens from fromAccount
        return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
    }).then((receipt) => {
      // Delegated transfer from spending account to toAccount
        return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
    }).then(assert.fail).catch((error) => {
        assert(error.message.indexOf('revert') >= 0, 'Cannot transfer value larger than balance');
    }).then((receipt) => {
        return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
    }).then(assert.fail).catch((error) => {
      assert(error.message.indexOf("revert") >= 0, 'Cannot transfer token larger than the approved amount');
      return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then((success) => {
      assert.equal(success, true);
      return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then((receipt) => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should trigger a "Transfer" event');
      assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the transfering token account');
      assert.equal(receipt.logs[0].args._to, toAccount, 'logs the token receiving account');
      assert.equal(receipt.logs[0].args._value, 10, 'logs the token amount transferred');
      return tokenInstance.balanceOf(fromAccount);
    }).then((balance) => {
      assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
      return tokenInstance.balanceOf(toAccount);
    }).then((balance) => {
      assert.equal(balance.toNumber(), 10, 'adds the amount to the receiving account');
      return tokenInstance.allowance(fromAccount, spendingAccount);
    }).then((allowance) => {
      assert.equal(allowance, 0, 'deduct the amount from the allowance');
    })
  })
});
