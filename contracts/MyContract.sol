// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyContract {
    string public message;
    
    constructor() {
        message = "Hello 0G Chain!";
    }
    
    function setMessage(string memory _message) public {
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
} 