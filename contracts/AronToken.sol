pragma solidity ^0.4.17;


contract AronToken {
    //Constructor
    // Set the total number of tokens
    // Read the total number of tokens

    uint256 public totalSupply;

    function AronToken() public {
        totalSupply = 1000000;
    }
}
