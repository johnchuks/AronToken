pragma solidity ^0.4.17;

import "./AronToken.sol";

contract AronTokenSale {
    address admin;
    AronToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    function AronTokenSale(AronToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint256 a, uint256 b) internal pure returns (uint256 c) {
        if (a == 0) {
            return 0;
        }
        c = a * b;
        assert(c / a == b);
        return c;
    }
    function buyTokens(uint256 _numberOfTokens) public payable {
        require(tokenContract.balanceOf(this) >= _numberOfTokens);
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

}
