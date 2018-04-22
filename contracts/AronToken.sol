pragma solidity ^0.4.17;


contract AronToken {

    string public name = "AronToken";
    string public symbol = "ARN";
    string public standard = "AronToken v1.0";
    uint256 public totalSupply;

    mapping(address => uint) public balanceOf;
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    function AronToken(uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        address owner = msg.sender;
        balanceOf[owner] = _initialSupply;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return balanceOf[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
