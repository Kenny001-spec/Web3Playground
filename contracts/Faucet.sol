// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

contract Faucet {
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);
  }
  
  function withdraw(uint _amount) payable public {
    // users can only withdraw .1 ETH at a time, feel free to change this!
    require(_amount <= 0.1 ether, "Amount exceed limit");
    (bool sent, ) = payable(msg.sender).call{value: _amount}("");
    require(sent, "Failed to send Ether");
  }

  function destroyFaucet() onlyOwner public {
    selfdestruct(owner);
  }

  function withdrawAll() onlyOwner public {
    (bool sent, ) = owner.call{value: address(this).balance}("");
    require(sent, "Failed to send Ether");
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can execute this");
    _;
  }
}