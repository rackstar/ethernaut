pragma solidity ^0.8.21;

interface IMagicNum {
    function setSolver(address _solver) external;
}

/**
 * 39 CODECOPY
 * 60 PUSH1
 * 52 MSTORE
 * F3 RETURN
 * https://www.ethervm.io/
 *
 * Initialisation opcodes
 *
 * CodeCopy the runtime opcodes
 * 60 0a // push 10 bytes
 * 60 0c // offset (because initialisation opcodes are 12 bytes)
 * 60 00 // push position 00 (set runtime opcode position to 00)
 * 39    // codecopy(destOffset,offset,	length)
 *
 * Return in memory runtime opcodes to EVM
 * 60 0a // push length 10 bytes
 * 60 00 // push offset 0
 * F3    // return(offset, length)
 *
 * Runtime opcodes (return 42)
 *
 * Store 42 first in memory
 * 60 2A // push value 2A (i.e. 42)
 * 60 70 // push offset 70
 * 52    // MSTORE(offset, value)
 *
 * Grab 42 from memory and return
 * 60 20 // push length 20 (i.e. 32 bytes)
 * 60 70 // push offset 70
 * F3    // return(offset, length)
 */
contract MagicNumAttacker {
  IMagicNum challenge;

  constructor(IMagicNum _challenge) {
    challenge = _challenge;
  }

  function attack() public {
    bytes memory bytecode = hex"600a600c600039600a6000f3602a60705260206070f3602a607052602060";
    bytes32 salt = 0;
    address solver;
    
    assembly {
       solver := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
    }
    
    challenge.setSolver(solver);
  }
}
