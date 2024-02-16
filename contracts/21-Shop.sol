pragma solidity ^0.6.0;

interface Buyer {
  function price() external view returns (uint);
}

/**
 * NOTE:
 * the gas price is bumped to 5000 as the gas prices has changed since this contract was written
 * https://github.com/OpenZeppelin/ethernaut/issues/156
 */
contract Shop {
  uint public price = 100;
  bool public isSold;

  function buy() public {
    Buyer _buyer = Buyer(msg.sender);

    if (_buyer.price.gas(5000)() >= price && !isSold) {
      isSold = true;
      price = _buyer.price.gas(5000)();
    }
  }
}