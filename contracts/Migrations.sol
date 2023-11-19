// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract Migrations {
    address public owner = msg.sender;
    uint public last_completed_migration;

    modifier restricted() {
        require(msg.sender == owner);
        _;
    }

    // 使用 "constructor" 代替合约名
    constructor()  {
        owner = msg.sender;
        
    }

    function setCompleted(uint completed) public restricted {
        require(completed <= 100, "Invalid value for completed"); // 示例条件，根据你的需求更改
        last_completed_migration = completed;
    }

    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}