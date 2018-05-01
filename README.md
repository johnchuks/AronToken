# AronToken
AronToken is an ERC20 standard token that can be sold on the blockchain. [Solidity](https://solidity.readthedocs.io/en/develop/introduction-to-smart-contracts.html) was utilized in building the smart contract, [Truffle framework](http://truffleframework.com/docs/getting_started/installation) was also utilized for testing and deployment of the smart contract.

## Installation Guide
- Install the truffle framework globally like so - `npm install truffle -g`
- Clone this github repository - `git clone https://github.com/johnchuks/AronToken.git`
- cd into `AronToken`
- To compile run `truffle compile`.
- To migrate and deploy the smart contract run `truffle migrate --reset`
- Install [Ganache](http://truffleframework.com/ganache/). It provides 10 test account addresses that can used to test the smart contract.

## Testing
- To test the smart contracts, run `truffle test`.
